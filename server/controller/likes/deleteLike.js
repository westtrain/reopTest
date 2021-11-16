const db = require("../models");
const { Palette } = require("../models");

module.exports = {
  deleteLike: async (req, res) => {
    // 1. params 로 키보드 아이디를 받아온다.
    try {
      const paletteId = req.params.id;
      const userId = req.userId;
      const likeInfo = await db.sequelize.models.Likes.findOne({
        // Likes테이블에 userId가 존재하는지.
        where: {
          user_id: userId,
          palette_id: paletteId,
        },
      });
      if (!likeInfo)
        return res
          .status(409)
          .json({ message: "좋아요를 누르지 않으셨습니다." });
      /* 2. Likes DB에 params로 받아온 아이디와 Cookie를 이용해 조회한 유저아이디가 존재한다면,
            Keyboard 테이블에 likeCount 컬럼을 1 감소시킨 후, Like 테이블에 키보드아이디와 유저아이디를 삭제해준다. */

      await db.sequelize.models.Likes.destroy({
        where: {
          user_id: userId,
          palette_id: paletteId,
        },
      });

      return res.status(200).json({ message: "ok" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
