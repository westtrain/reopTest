const express = require("express");
const likesController = require("../controller/likes");
const isAuth = require("../middleware/verifyToken");

const router = express.Router();

router.get("/", isAuth, likesController.getUserLikes); // 사용자가 누른 좋아요 팔레트 모음 조회
router.post("/:id", isAuth, likesController.addLike); // 팔레트의 좋아요 추가
router.delete("/:id", isAuth, likesController.deleteLike); // 팔레트의 좋아요 삭제

module.exports = router;
