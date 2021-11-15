const db = require("../models");
const { Palette } = require("../models");

module.exports = {
  getUserLikes: async (req, res) => {
    try {
      // 1. Cookie를 이용해서 특정 유저가 좋아요 누른 키보드 아이디를 조회한다.
      const userId = req.userId;
      const likePaletteInfo = []; // like 누른 palette의 정보를 넣음.

      let likeInfo = await db.sequelize.models.Likes.findAll({
        // Likes테이블에 있는 paletteId를 전부 가져온다.
        attributes: ["palette_id"],
        where: {
          user_id: userId,
        },
        raw: true,
      });
      likeInfo = likeInfo.map((el) => el.paletteId);

      for (let i = 0; i < likeInfo.length; i++) {
        const paletteInfo = await db.Palette.findOne({
          where: {
            id: likeInfo[i],
          },
          raw: true,
        });
        likePaletteInfo.push(paletteInfo);
      }
      // 2. 조회한 palette 아이디로 palette 정보를 찾은 후 그 정보를 클라이언트에 보내준다.
      return res.status(200).json({ data: likepaletteInfo });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
