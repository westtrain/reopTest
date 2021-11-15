const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

// const { checkToken } = require("./tokenfunction/index");

module.exports = {
  getUser: async (req, res) => {
    // 1. Cookie 를 이용해서 ( req.userId ) 유저정보를 가져온다.
    const userInfo = await User.findOne({
      attributes: ["id", "email", "name", "socialType", "image"],
      where: { id: req.userId },
      raw: true,
    });
    // 2. 가져온 유저정보를 res에 담아서 클라이언트로 보내준다.
    try {
      if (userInfo) {
        return res.status(200).json({ data: userInfo });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
