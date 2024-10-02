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

// Create order
const createOrder = asyncHandler(async (req, res) => {
  try {
    const { price, userId, name, isPaid } = req.body;

    if (!userId) {
      return useErrorResponse(res, `User not authorized`, 400);
    }
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
    });
    if (!user) {
      return useErrorResponse(res, `User not found`, 404);
    }
    const url = req.file.url;
    const order = await prisma.order.create({
      data: {
        price: parseInt(price),
        url,
        user: {
          connect: {
            id: parseInt(userId),
          },
        },
        name,
        isPaid: isPaid ? Boolean(isPaid) : false,
      },
    });
    return useSuccessResponse(res, successMessages.Order.created, order, 201);
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, errorMessages.Order.createError, 500);
  }
});

// Get all orders
const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const orders = await prisma.order.findMany();
    if (orders.length <= 0) {
      return useSuccessResponse(res, `No orders found`, {}, 404);
    }
    return useSuccessResponse(res, successMessages.Order.fetched, orders, 200);
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, errorMessages.Order.fetchError, 500);
  }
});

// Get order by id
const getOrderById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return useSuccessResponse(res, `Order not found`, {}, 404);
    }
    return useSuccessResponse(res, successMessages.Order.fetched, order, 200);
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, errorMessages.Order.fetchError, 500);
  }
});

// Edit Order
const editOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const { price, name, isPaid, status } = req.body;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return useErrorResponse(res, errorMessages.Order.updateError, 404);
    }
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: {
        price: price ? price : order.price,
        name: name ? name : order.name,
        isPaid: isPaid ? isPaid : order.isPaid,
        status: status ? status : order.status,
      },
    });
    return useSuccessResponse(
      res,
      successMessages.Order.updated,
      updatedOrder,
      200
    );
  } catch (error) {
    return useErrorResponse(res, errorMessages.Order.updateError, 500);
  }
});

// Delete Order
const deleteOrder = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const order = await prisma.order.findUnique({ where: { id } });
    if (!order) {
      return useErrorResponse(res, errorMessages.Order.deleteError, 404);
    }
    await prisma.order.delete({ where: { id } });
    return useSuccessResponse(res, successMessages.Order.deleted, null, 200);
  } catch (error) {
    console.log(error);
    return useErrorResponse(res, errorMessages.Order.deleteError, 500);
  }
});

// Get order by user
const getOrderbyUser = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.params;
    const order = await prisma.order.findMany({
      where: { user: { id: parseInt(userId) } },
    });
    if(!order){
      return useErrorResponse(res,errorMessages.Order.notFound,404)
    }
    return useSuccessResponse(res,successMessages.Order.found,200)
  } catch (error) {
    console.log(error)
    return useErrorResponse(res,`Internal Server Error`,500)
  }
});
module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  editOrder,
  getOrderbyUser,
  deleteOrder,
};
