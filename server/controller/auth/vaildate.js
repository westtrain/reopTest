const { User } = require("../models");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  validateName: async (req, res) => {
    // 1. Name 을 클라이언트에서 받아온 후, DB에 저장되어있는지 확인.
    const { name } = req.body;
    const foundName = await User.findOne({ where: { name } });
    try {
      // 2. 저장되어있다면 오류메시지를 보내준다.
      if (foundName) {
        return res.status(409).json({ message: "Name already exists" });
      }
      // 3. 저장되어있지않으면 OK 메시지
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
