const express = require("express");
const router = express.Router();
const {getAllOrders, getOrderById, createOrder, editOrder, deleteOrder} = require("../controller/ordercontroller.js");
const {setupUploadImageMiddleware}= require("../utils/cloudinaryConfiguration.js")
const { protectRoute } = require("../middleware/authMiddleware.js");
router.get("/",protectRoute,getAllOrders)
router.get("/:id",protectRoute,getOrderById)
router.post("/",protectRoute,setupUploadImageMiddleware,createOrder)

router.put("/:id",protectRoute,editOrder)
router.delete("/:id",protectRoute,deleteOrder)


module.exports = router                       