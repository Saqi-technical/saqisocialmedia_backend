const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");
const {
  useErrorResponse,
} = require("../responses/apiResponses/apiResponses");
const errorMessages = require("../responses/errorMessages");
const asyncHandler = require("express-async-handler")
const protectRoute = asyncHandler(async (req, res, next) => {
  let token;

  // Check if the authorization header is present and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token from the authorization header
      token = req.headers.authorization.split(" ")[1];

      // Verify the token using the JWT secret key
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      // If the token contains an organizationId, fetch the organization details
      if (decodedToken.adminId) {
        const admin = await prisma.admin.findUnique({
          where: { id: decodedToken.adminId },
        });
        if (!admin) {
          return useErrorResponse(res, errorMessages.Admin.loginError, 404);
        }
      
        return next();
      }

      // If the token contains a userId, fetch the user details
      if (decodedToken.userId) {
        const user = await prisma.user.findUnique({
          where: { id: decodedToken.userId },
        });

        // If the user is not found, return an error response
        if (!user) {
          return useErrorResponse(res, errorMessages.User.loginError, 404);
        }

        return next();
      }
      return useErrorResponse(res, errorMessages.User.notFound, 404);
    } catch (error) {
      // Handle token verification errors
      console.error(error);
      return useErrorResponse(res, errorMessages.User.tokenNotFound, 498);
    }
  } else {
    return useErrorResponse(res, errorMessages.User.tokenNotFound, 498);
  }
});

module.exports = { protectRoute };
