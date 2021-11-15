const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { authToken } = require("./middleware/verifyToken");
const db = require("./db/connection");

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

app.get("/", (req, res) => {
  res.status(201).send("Hello World");
});

app.listen(port, () => {
  console.log(`서버가 ${port}번에서 작동중입니다.`);
});
