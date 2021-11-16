const dotenv = require("dotenv");
dotenv.config();

module.exports = {
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
};
