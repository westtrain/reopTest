const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

// const { checkToken } = require("./tokenfunction/index");

module.exports = {
  deleteUser: async (req, res) => {
    // 1. Cookie 를 이용해서 유저정보를 조회한 후, User.destroy 로 해당 DB를 삭제해준다.
    try {
      await User.destroy({ where: { id: req.userId } });
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
