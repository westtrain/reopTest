const { User } = require("../models/users");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

const {
  generateAccessToken,
  sendAccessToken,
} = require("./tokenFunction/index");

module.exports = {
  login: async (req, res) => {
    // 1. email과 password를 클라이언트에서 받아온다.
    const { email, password } = req.body;
    // 2. User table에서 유저 정보를 찾는다.
    const userInfo = User.findOne({ where: { email } });
    try {
      // 3. 유저 정보가 없거나, 비밀번호가 틀릴 경우 401 에러 메세지를 보낸다.
      if (
        !userInfo ||
        !bcrypt.compareSync(password, userInfo.dataValues.password)
      ) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      // 4. 유저 정보가 있으면 User 테이블에서 정보 가져와 res에 담아 토큰과 함께 클라로 보내준다
      const loginUserInfo = await User.findOne({
        attributes: ["id", "email", "name", "image"], //이 옵션을 통해 보내고 싶은 칼럼만 보낼 수 있음.
        where: { email },
        raw: true, //이 옵션을 통해 dataValues만 리턴할 수 있음
      });

      //토큰 언제 쿠키에 넣고 언제 리액트로 보내는지 알아보기
      const { id, email, name, image } = loginUserInfo;
      const token = generateAccessToken({
        id,
        email,
        name,
        image,
      });
      return res
        .status(200)
        .cookie("jwt", token, {
          sameSite: "None",
          secure: true, //Marks the cookie to be used with HTTPS only.
          httpOnly: true, //Flags the cookie to be accessible only by the web server.
          expires: new Date(Date.now() + 1000 * 60 * 60 * 48), //언제 만료시킬지 정하기
          domain: ".color-boration.tk",
        })
        .json({ data: loginUserInfo });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  logout: async (req, res) => {
    // 1. clearCookie
    try {
      res.clearCookie("jwt");
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
  signup: async (req, res) => {
    // 1. email, name, password, image 를 클라이언트에서 받아온다.
    const { email, name, password } = req.body;

    // 2. 패스워드를 hashing 해준 후 DB에 저장한다.
    // bcrypt 사용해서 hashing
    // 이미지 업로드하기 위해서는 multer 미들웨어 사용 필요
    // multer 미들웨어를 등록하면 요청 객체에 file 또는 files 객체가 추가됨.
    // 3. User.create 를 사용해서 유저정보를 DB에 저장한다.
    try {
      // 이미지 업로드 시
      if (req.file) {
        //const hashed = await bcrypt.hash(password, 10); // 10은 saltOrRounds로 암호화에 사용할 솔트를 10번 돌린다는 뜻. 보통 10번 돌림
        await User.create({
          email,
          name,
          //password: hashed,
          password,
          socialType: "local", // 사이트에서 직접 가입하는 걸 표현
          image: req.file.location,
        });
        return res.status(200).json({ image: req.file.location });
      }
      // 이미지 디폴트일 때, 기본값으로 넣어줄 거 정하기
      //const hashed = await bcrypt.hash(password, 10); //Store hash in your password DB.
      await User.create({
        email,
        name,
        //password: hashed,
        password,
        image: "",
      });
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  },
  validateName: async (req, res) => {
    // 1. Name 을 클라이언트에서 받아온 후, DB에 저장되어있는지 확인.
    const { name } = req.body;
    const foundNickName = await User.findOne({ where: { name } });
    try {
      // 2. 저장되어있다면 오류메시지를 보내준다.
      if (foundNickName) {
        return res.status(409).json({ message: "name already exists" });
      }
      // 3. 저장되어있지않으면 OK 메시지
      return res.status(200).json({ message: "ok" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Server Error" });
    }
  },
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
          socialType: "google", //google 인증 가입
        },
        defaults: {
          email: userInfo.data.email,
          name: userInfo.data.name,
          password: "",
          socialType: "google",
          image: userInfo.data.picture,
        },
      });

      const token = generateAccessToken({
        id: user[0].dataValues.id,
        email: user[0].dataValues.email,
        name: user[0].dataValues.nickname,
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
