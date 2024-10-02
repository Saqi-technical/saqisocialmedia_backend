const express = require("express");
const router = express.Router();
const { login, register, changePassword } = require("../controller/usercontroller.js");
router.post("/sign-up", register);
router.post("/sign-in", login);
router.put("/change-password",changePassword)
module.exports = router;
