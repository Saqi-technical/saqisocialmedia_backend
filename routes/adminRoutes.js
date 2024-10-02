const express = require("express");
const router = express.Router();
const { login, register } = require("../controller/admincontroller.js");
router.post("/sign-up", register);
router.post("/sign-in", login);
module.exports = router;
