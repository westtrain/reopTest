const { User } = require("../models");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

// const { checkToken } = require("./tokenfunction/index");

module.exports = {
  updateUser: async (req, res) => {
    // 1. name, password, image를 클라이언트로부터 받아온다.
    const { name, password, image } = req.body;
    // 2. 클라이언트로 받아온 유저 정보를 Cookie를 이용해서 조회 후, User.update 로 수정한다.
    try {
      const userInfo = await User.findOne({
        attributes: ["id", "email", "name", "socialType", "image"],
        where: { id: req.userId },
        raw: true,
      });

      if (req.file) {
        userInfo.image = req.file.location;
      }

      if (userInfo.socialType !== "local") {
        await User.update(
          {
            name,
            image: userInfo.image,
          },
          { where: { id: req.userId } }
        );
      } else {
        const hashed = await bcrypt.hash(password, 10);
        await User.update(
          {
            name,
            password: hashed,
            image: userInfo.image,
          },
          { where: { id: req.userId } }
        );
      }
      // 3. 업데이트된 유저정보를 res에 담아서 클라이언트로 보내준다.
      const updateUserInfo = await User.findOne({
        attributes: ["id", "email", "name", "socialType", "image"],
        where: { id: req.userId },
        raw: true,
      });

      if (updateUserInfo) {
        return res.status(200).json({ data: updateUserInfo });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
    // 4. 중요한점은 비밀번호 수정 시 hashing 해줄 것
  },
};
