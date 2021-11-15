const { Palette } = require("../models");

module.exports = {
  getCreatePalette: async (req, res) => {
    // 1. color1, color2, color3, color4, tags, userId를 클라이언트에서 받아온다.
    const { color1, color2, color3, color4, tags, userId } = req.body;
    try {
      await Palette.create({
        color1: color1,
        color2: color2,
        color3: color3,
        color4: color4,
        tags: tags,
        user_id: userId,
      });
      return res.sendStatus(200);
    } catch (error) {
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
