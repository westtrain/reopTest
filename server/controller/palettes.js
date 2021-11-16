const { Palette } = require("../models");

module.exports = {
  getAllPalettes: async (req, res) => {
    // 1. 업로드 되어있는 모든 팔레트를 조회해서 클라이언트로 보내준다. ( findAll )
    try {
      const paletteInfo = await Palette.findAll({
        raw: true,
      });
      if (!paletteInfo) {
        return res.status(404).json({ message: "failed" });
      }
      return res.status(200).json({ data: paletteInfo });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getFiltered: async (req, res) => {
    try {
      const tags = req.params.tag_id;
      Palette.findAll({
        include: [
          {
            model: Tags,
            where: { id: { [Op.in]: tags } },
          },
        ],
        having: sequelize.literal(`COUNT(DISTINCT tags.name) = ${tags.length}`),
        group: ["id"],
      });

      return res.status(200).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getPalette: async (req, res) => {
    try {
      // 1. params 로 paletteId를 받아온다.
      const paletteId = req.params.id;
      // 2. 받아온 아이디로 특정 팔레트를 조회한 후 클라이언트로 보내준다.
      const palette = await Palette.findOne({
        where: {
          id: paletteId,
        },
        raw: true,
      });
      if (palette) {
        return res.status(200).json({ data: palette });
      }
      return res.status(404).json({ message: "failed" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getRandom: async (req, res) => {
    // 업로드 되어있는 모든 팔레트를 조회해서 랜덤하게 클라이언트로 보내준다. ( findAll )
    try {
      const palette = await Palette.findAll({
        raw: true,
        order: sequelize.random(), // Will order randomly based on the dialect (instead of fn('RAND') or fn('RANDOM'))
      });

      if (palette) {
        return res.status(200).json({ data: palette });
      }
      return res.status(404).json({ message: "failed" });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getRanking: async (req, res) => {
    // 1. 모든 palette를 램덤으로 조회해서 클라이언트로 보내준다. ( findAll )
    try {
      // Month 선택한 경우
      if (req.date === "month") {
        await Palette.findAll({
          where: sequelize.where(
            sequelize.fn("month", sequelize.col("month")),
            fromMonth
          ),
          order: ["", "DESC"],
        });
      }
      return res.status(200).json();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  getUserPalette: async (req, res) => {
    const userId = req.params.id;
    try {
      if (userId) {
        const palette = await Palette.findAll({
          where: { user_id: userId },
        });
        if (palette) {
          return res.status(200).json({ data: palette });
        }
        return res.status(404).json({ message: "failed" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  createPalette: async (req, res) => {
    const { color1, color2, color3, color4, tag_id } = req.body; // user_id 대신 토큰으로 받아오기
    // const accessToken = req.cookies.accessToken;
    // if (!accessToken) {
    //   res.status(401).json({ message: "please log in" });
    // }
    try {
      // const userInfo = await jwt.verify(accessToken, process.env.ACCESS_SECRET);

      if (color1 && color2 && color3 && color4) {
        await Palette.create({
          color1,
          color2,
          color3,
          color4,
          user_id: userInfo.id,
          tag_id,
        });
        return res.status(200).json({ message: "" });
      }
      return res
        .status(422)
        .json({ message: "insufficient parameters supplied" });
    } catch (err) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
