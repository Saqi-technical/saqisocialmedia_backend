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
// Register Api

const register = asyncHandler(async (req, res) => {
  try {
    const { email, name, password, phoneNumber } = req.body;
    const existUser = await prisma.user.findUnique({ where: { email } });
    console.log(existUser)
    if (existUser) {
      return useErrorResponse(res, errorMessages.User.alreadyExist, 400);
    }
    // Validate the email format
    if (!validateEmail(email)) {
      return useErrorResponse(res, errorMessages.emailNotValid, 400);
    }
    const admin = await prisma.admin.findFirst({ where: { isActive: true } });
    if (!admin) {
      return useErrorResponse(res, `Server busy try again later`, 400);
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create a new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phoneNumber,
        admin: {
          connect: {
            id: admin.id,
          },
        },
      },
    });
    if (!user) {
      return useErrorResponse(res, errorMessages.User.createError, 400);
    }
    delete user.password;
    return useSuccessResponse(res, successMessages.User.created, user, 201);
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, `Internal Server Error`, 500);
  }
});

// Login APi
const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;
    // check if it exist already or not
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return useErrorResponse(res, errorMessages.User.loginError, 400);
    }

    // check if password is correct
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      delete user.password;
      // Generate a JWT token with a 1-hour expiration time
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      return useSuccessResponse(
        res,
        successMessages.User.login,
        { ...user, token: token },
        200
      );
    }
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, `Internal Server Error`, 500);
  }
});

// Change Password Api
const changePassword = asyncHandler((async(req,res)=>{
  try {
    const {email,password,newPassword} = req.body
    const user = await prisma.user.findUnique({where:{email}})
    if(!user){
      return useErrorResponse(res,errorMessages.User.notFound,400)
    }
    const isValidPassword = await bcrypt.compare(password,user.password)
    if(!isValidPassword){
      return useErrorResponse(res,errorMessages.invalidPassword,400)
    }
    const hashedPassword = await bcrypt.hash(newPassword,10)
    await prisma.user.update({where:{email},data:{password:hashedPassword}})
    return useSuccessResponse(res,successMessages.User.resetpassword,{},200)
  } catch (error) {
    console.log(error)
    return useErrorResponse(res,`Internal Server Error`,500)
    
  }
}))

module.exports = {
  register,
  login,
  changePassword
};
