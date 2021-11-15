const { User } = require("../models");
const dotenv = require("dotenv");
const axios = require("axios");
dotenv.config();

const { generateAccessToken } = require("./tokenfunction/index");

module.exports = {
  googleLogin: async (req, res) => {
    return res.redirect(
      // 구글 로그인 화면 리다이렉트
      `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email+https://www.googleapis.com/auth/userinfo.profile&access_type=offline&response_type=code&state=state_parameter_passthrough_value&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&client_id=${process.env.GOOGLE_CLIENT_ID}`
    );
  },
  googleCallback: async (req, res) => {
    const code = req.query.code; // authorization code
    try {
      const result = await axios.post(
        // authorization code를 이용해서 access token 요청
        `https://oauth2.googleapis.com/token?code=${code}&client_id=${process.env.GOOGLE_CLIENT_ID}&client_secret=${process.env.GOOGLE_CLIENT_SECRET}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}&grant_type=authorization_code`
      );
      const userInfo = await axios.get(
        // access token으로 유저정보 요청

        `https://www.googleapis.com/oauth2/v2/userinfo?access_token=${result.data.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${result.data.access_token}`,
          },
        }
      );
      const user = await User.findOrCreate({
        where: {
          email: userInfo.data.email,
          socialType: "google",
        },
        defaults: {
          email: userInfo.data.email,
          nickname: userInfo.data.name,
          password: "",
          socialType: "google",
          isAdmin: false,
          image: userInfo.data.picture,
        },
      });

      const token = generateAccessToken({
        id: user[0].dataValues.id,
        email: user[0].dataValues.email,
        name: user[0].dataValues.name,
        socialType: user[0].dataValues.socialType,
        image: user[0].dataValues.image,
      });

      res.cookie("jwt", token, {
        sameSite: "None",
        secure: true,
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 48),
        domain: ".color-boration.tk",
      });

      res.redirect(`${process.env.CLIENT_URI}/temp`);
    } catch (error) {
      res.sendStatus(500);
    }
  },
};
