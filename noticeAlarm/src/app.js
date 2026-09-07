const express = require("express");
const cors = require("cors");
require("dotenv").config();

BigInt.prototype.toJSON = function () {
  return this.toString();
};

const app = express();
const initScheduler = require("./jobs/scheduler").initScheduler;

//서버가 시작할 때 스케줄러 작동
initScheduler();
const PORT = process.env.PORT || 3000;

var authRouter = require("./routes/authRoute");
var keywordRouter = require("./routes/keywordRoute");
var boardRouter = require("./routes/boardRoute");
var notificationRouter = require("./routes/notificationRoute");

app.use(cors()); //보안 미들웨어
app.use(express.json()); //JSON 데이터를 req.body 객체로 파싱

// API 라우터 등록
app.use("/api/auth", authRouter);
app.use("/api/keyword", keywordRouter);
app.use("/api/board", boardRouter);
app.use("/api/notification", notificationRouter);

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

//PORT를 열고 외부 요청이 들어오는지 24시간 대기 상태
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
