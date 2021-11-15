const { Palette } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  getFiltered: async (req, res) => {
    try {
      const { color, backlight, tenkey, bluetooth, price } = req.body;
      const keys = { 저소음적축: 1, 갈축: 2, 흑축: 3, 적축: 3, 청축: 4 };
      let getSwitch = {};
      for (let key in keys) {
        // 반복문을 돌려 req.body.switch를 getKeys에 넣는다.
        if (keys[key] === req.body.sound) {
          getSwitch[key] = true;
        }
      }

      const filteredPalettesInfo = await Palette.findAll({
        where: {
          switch: {
            [Op.or]: getSwitch,
          },
          color: color !== 2 ? color : { [Op.or]: [0, 1] },
          backlight: backlight !== 2 ? backlight : { [Op.or]: [0, 1] },
          tenkey: tenkey !== 2 ? tenkey : { [Op.or]: [0, 1] },
          bluetooth: bluetooth !== 2 ? bluetooth : { [Op.or]: [0, 1] },
          price: {
            [Op.lte]: price,
          },
        },
        raw: true,
      });
      return res.status(200).json({ data: filteredPalettesInfo });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
  },
};
