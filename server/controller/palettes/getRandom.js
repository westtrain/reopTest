const { Palette } = require("../models");

module.exports = {
  getRandom: async (req, res) => {
    // 1. 모든 palette를 램덤으로 조회해서 클라이언트로 보내준다. ( findAll )
    try {
      const paletteInfo = await Palette.findAll({
        order: "random()",
        raw: true,
      });
      return res.status(200).json({ data: paletteInfo });
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
