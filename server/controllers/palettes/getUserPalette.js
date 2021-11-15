const { Palette } = require("../models");

module.exports = {
  getUserPalette: async (req, res) => {
    // 1. params 로 userId를 받아온다.
    const userId = req.params.id;
    // 2. userId를 갖고 있는 모든 palette를 조회해서 클라이언트로 보내준다. ( findAll )
    try {
      const paletteInfo = await Palette.findAll({
        where: {
          id: userId,
        },
        raw: true,
      });
      return res.status(200).json({ data: paletteInfo });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
