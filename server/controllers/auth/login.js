const { User } = require("../models");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const {
  generateAccessToken,
  sendAccessToken,
} = require("./tokenfunction/index");

module.exports = {
  login: async (req, res) => {
    // 1. email과 password 를 클라이언트에서 받아온다.
    const { email, password } = req.body;
    // 2. User 테이블에서 유저정보를 찾는다
    const userInfo = await User.findOne({ where: { email } });
    try {
      // 3. 유저정보가 없거나, 비밀번호가 틀릴경우 401 코드와 함께 오류 메시지를 보내준다.
      if (
        !userInfo ||
        !bcrypt.compareSync(password, userInfo.dataValues.password)
      ) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // 4. 유저정보가 있으면 유저 테이블에서 정보를가져와서 res에 담아서 토큰과함께 클라이언트로 보내준다.
      const loginUserInfo = await User.findOne({
        attributes: [
          "id",
          "email",
          "nickname",
          "socialType",
          "isAdmin",
          "image",
        ],
        where: { email },
        raw: true,
      });
      const { id, userEmail, name, socialType } = loginUserInfo;
      const token = generateAccessToken({
        id,
        userEmail,
        name,
        socialType,
        isAdmin,
        image,
      });
      return res
        .status(200)
        .cookie("jwt", token, {
          sameSite: "None",
          secure: true,
          httpOnly: true,
          expires: new Date(Date.now() + 1000 * 60 * 60 * 48),
          domain: ".color-boration.tk",
        })
        .json({ data: loginUserInfo });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
};
