const { Palette, Like } = require("../models");
const { Op } = require("sequelize");
const moment = require("moment");

module.exports = {
  getRanking: async (req, res) => {
    // 1. 모든 palette를 램덤으로 조회해서 클라이언트로 보내준다. ( findAll )
    const period = req.query.period;
    if (period === "week") {
      try {
        const palettelist = await Like.findAll({
          where: {
            start_datetime: {
              // 현재 시점에서 7일만
              [Op.gte]: moment().subtract(7, "days").toDate(),
            },
          },
          order: [["createdAt", "DESC"]],
          raw: true,
        });
        const { paletteId } = palettelist;
        const paletteInfo = await Palette.findAll({
          where: {
            id: paletteId,
          },
          raw: true,
        });
        return res.status(200).json({ data: paletteInfo });
      } catch (error) {
        return res.status(500).json({ message: "Server Error" });
      }
    } else if (period === "months") {
      try {
        const palettelist = await Like.findAll({
          where: {
            start_datetime: {
              [Op.gte]: moment().subtract(1, "months").toDate(),
            },
          },
          order: [["createdAt", "DESC"]],
          raw: true,
        });
        const { paletteId } = palettelist;
        const paletteInfo = await Palette.findAll({
          where: {
            id: paletteId,
          },
          raw: true,
        });
        return res.status(200).json({ data: paletteInfo });
      } catch (error) {
        return res.status(500).json({ message: "Server Error" });
      }
    } else {
      try {
        const palettelist = await Like.findAll({
          order: [["createdAt", "DESC"]],
          raw: true,
        });
        const { paletteId } = palettelist; // 팔레트 날짜 별로 정렬...중복이 존재하지 않나????? 아니면 객체로 만들어지...중복될 일이 없을까?
        const paletteInfo = await Palette.findAll({
          where: {
            id: paletteId,
          },
          raw: true,
        });
        return res.status(200).json({ data: paletteInfo });
      } catch (error) {
        return res.status(500).json({ message: "Server Error" });
      }
    }
  },
};
