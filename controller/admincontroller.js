const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const {
  useSuccessResponse,
  useErrorResponse,
} = require("../responses/apiResponses/apiResponses");
const successMessages = require("../responses/successMessages");
const errorMessages = require("../responses/errorMessages");
const asyncHandler = require("express-async-handler");
const validateEmail = require("../utils/validateEmail");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// Register
const register = asyncHandler(async (req, res) => {
  try {
    const { email, password, name, isAdmin } = req.body;
    if (isAdmin) {
      // Validate the email format
      if (!validateEmail(email)) {
        return useErrorResponse(res, errorMessages.emailNotValid, 400);
      }
      // check if it exist already or not
      const existAdmin = await prisma.admin.findUnique({ where: { email } });
      if (existAdmin) {
        return useErrorResponse(res, errorMessages.Admin.alreadyExist, 400);
      }
      // hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // create a new admin
      const admin = await prisma.admin.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });
      if (admin) {
        return useSuccessResponse(
          res,
          successMessages.Admin.created,
          admin,
          201
        );
      }
    } else {
      return useErrorResponse(res, `Unauthorized access`, 404);
    }
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, `Internal Server Error`, 500);
  }
});
// LOGIN
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if it exist already or not
    const admin = await prisma.admin.findUnique({ where: { email } });
    if (!admin) {
      return useErrorResponse(res, errorMessages.Admin.loginError, 400);
    }
    const updatedAdmin = await prisma.admin.update({
      where: { id: admin.id },
      data: {
        isActive: true,
      },
    });

    // check if password is correct
    const isValidPassword = await bcrypt.compare(
      password,
      updatedAdmin.password
    );

    if (isValidPassword) {
      delete updatedAdmin.password;
      // Generate a JWT token with a 1-hour expiration time
      const token = jwt.sign(
        { adminId: updatedAdmin.id },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "1h" }
      );
      return useSuccessResponse(
        res,
        successMessages.Admin.login,
        { ...updatedAdmin, token: token },
        200
      );
    }else{
      return useErrorResponse(res,`Password Incorrect`,400)
    }
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, `Internal Server Error`, 500);
  }
});
// Private routes
// Delete User
const deleteUser = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return useErrorResponse(res, errorMessages.User.notFound, 400);
    }
    const deletedUser = await prisma.user.delete({ where: { email } });
    if (deletedUser) {
      return useSuccessResponse(res, successMessages.User.deleted, {}, 200);
    }
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, `Internal Server Error`, 500);

  }
});
module.exports = {
  register,
  login,
  deleteUser
};
