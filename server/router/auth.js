const express = require("express");
const authController = require("../controller/auth");
const isAuth = require("../middleware/verifyToken");
const { uploads } = require("../middleware/uploads");

const router = express.Router();

router.post("/login", authController.login); // login API
router.post("/logout", isAuth, authController.logout); // logout API
router.post("/signup", authController.signup); // singup API
router.post("/name", authController.validate); // vaildate a name
router.get("/google", authController.googleOauth); // google Oauth
router.get("/googleCallback", authController.googleOauth);

module.exports = router;
