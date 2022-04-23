const usersController = require("../controllers/user.controller");

const express = require("express");
const router = express.Router();

router.post("/register", usersController.register);
router.post("/login", usersController.login);
router.get("/user-Profile", usersController.userProfile);
router.post("/otpLogin", usersController.otpLogin);
router.post("/verifyOTP", usersController.verifyOTP);
router.post("/admin/login", usersController.adminLogin);
router.get('/totalCount', usersController.totalCount);
router.get('/', usersController.users);

module.exports = router; 