const { Palette } = require("../models");

module.exports = {
  getPalette: async (req, res) => {
    try {
      // 1. params 로 paletteId를 받아온다.
      const paletteId = req.params.id;
      // 2. 선택한 팔레트를 조회한 후 클라이언트로 보내준다.
      const getPalette = await Palette.findOne({
        where: {
          id: paletteId,
        },
        raw: true,
      });
      return res.status(200).json({ data: getPalette });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
