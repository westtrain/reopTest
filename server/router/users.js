const express = require("express");
const usersController = require("../controller/users");
const isAuth = require("../middleware/verifyToken");
const { uploads } = require("../middleware/uploads");

const router = express.Router();

router.get("/", isAuth, usersController.getUser); // mypage 유저정보 조회
router.patch("/", isAuth, uploads.single("img"), usersController.updateUser); // 유저정보수정
router.delete("/", isAuth, usersController.deleteUser); // 회원탈퇴
// router.get("/checkToken", usersController.checkToken); // 토큰체크

module.exports = router;
