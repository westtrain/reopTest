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
  updateUser: async (req, res) => {
    // 1. name, password, image를 클라이언트로부터 받아온다.
    const { name, email, password } = req.body;
    // 2. 클라이언트로 받아온 유저 정보를 Cookie를 이용해서 조회 후, User.update 로 수정한다.
    try {
      const userInfo = await User.findOne({
        attributes: ["id", "email", "name", "socialType", "image"],
        where: { id: email },
        raw: true,
      });

      if (req.file) {
        userInfo.image = req.file.location;
      }

      //google 로그인 인증 방식인 경우
      if (userInfo.socialType !== "local") {
        await User.update(
          {
            name,
            image: userInfo.image,
          },
          { where: { id: req.userId } }
        );
      } else {
        //local 가입 방식인 경우
        const hashed = await bcrypt.hash(password, 10); // 비밀번호 수정 시 Hashing 해줄 것
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
  },
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
