// .env 파일에 적은 값 읽게 해줌
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();
const prisma = require("./prisma");

var authRouter = require("./routes/auth");
var reviewsRouter = require("./routes/reviews");
var moviesRouter = require("./routes/movies");

app.use(cors());
// 요청 body의 JSON을 파싱. 이후 req.body로 활용 가능
app.use(express.json());

//auth API
app.use("/api/auth", authRouter);

//review API
app.use("/api/reviews", reviewsRouter);

//영화 검색 (TMDB 프록시)
app.use("/api/movies", moviesRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: port = ${PORT}`);
});
