const { User } = require("../models");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  signup: async (req, res) => {
    // 1. email, name, password를 클라이언트에서 받아온다.
    const { email, name, password } = req.body;

    // 2. 패스워드를 hashing 해준 후 DB에 저장한다.
    // 3. User.create 를 사용해서 유저정보를 DB에 저장한다.
    try {
      if (req.file) {
        const hashed = await bcrypt.hash(password, 10);
        await User.create({
          email,
          name,
          password: hashed,
          socialType: "local",
          isAdmin: false,
          image: "",
        });
        return res.status(200).json({ image: req.file.location });
      }
      const hashed = await bcrypt.hash(password, 10);
      await User.create({
        email,
        name,
        password: hashed,
        socialType: "local",
        isAdmin: false,
        image: "",
      });
      return res.sendStatus(200);
    } catch (err) {
      console.log(err);
      return res.sendStatus(500);
    }
  },
};
