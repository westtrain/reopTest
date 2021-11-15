const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authToken } = require("./middleware/verifyToken");
const authRouter = require("./router/auth");
const likesRouter = require("./router/likes");
const palettesRouter = require("./router/palettes");
const usersRouter = require("./router/users");
const db = require("./db/connection");
var sequelize = require("./models").sequelize;

const app = express();
app.use(express.json());
const port = 4000;

app.use(
  cors({
    rigin: true,
    credentials: true,
    methods: ["GET", "POST", "DELETE", "PATCH", "OPTIONS"],
    Headers: { "content-type": "application/json" },
  })
);

app.use("/auth", authRouter);
app.use("/likes", likesRouter);
app.use("/palettes", palettesRouter);
app.use("/users", usersRouter);

app.get("/", (req, res) => {
  res.status(201).send("Hello World");
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});
