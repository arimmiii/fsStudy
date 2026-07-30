// .env 파일에 적은 값 읽게 해줌
require("dotenv").config();
const express = require("express");
const cors = require("cors");
// @prisma/client 패키지 속 PrismaClient 항목만 꺼내므로 중괄호 필요
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const app = express();
const prisma = new PrismaClient();
const jwt = require("jsonwebtoken");

app.use(cors());
// 요청 body의 JSON을 파싱. 이후 req.body로 활용 가능
app.use(express.json());

//회원가입
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, nickname } = req.body;
  // !비번 해싱! , 10은 솔트 라운드 (얼마나 복잡하게 해싱할지)
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword, //해싱된 pw로 저장
      nickname,
    },
  });
  res
    .status(201)
    .json({ id: user.id, email: user.email, nickname: user.nickname });
});

//로그인
app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  //이메일로 유저 찾기
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 틀렸습니다" });
  }

  //비번 비교. 입력된 평문(password)을 해싱해 저장된 해시(user.password)와 같은지 비교
  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 틀렸습니다" });
  }

  //토큰 발급
  const token = jwt.sign(
    { userId: user.id }, //토큰에 담을 정보
    process.env.JWT_SECRET, //비밀키로 서명
    { expiresIn: "7d" }, //만료 기간 7일
  );

  //토큰 응답
  res.json({ token });
});

//토큰 검증 미들웨어
function authMiddleware(req, res, next) {
  //1. 헤더에서 토큰 꺼내기
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: "로그인 필요" });
  }

  //2. 'Bearer 토큰' 형식에서 토큰만 분리
  const token = authHeader.split(" ")[1];

  //3. 토큰 검증
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
}

//리뷰 목록 조회
app.get("/api/reviews", async (req, res) => {
  //findMany: 여러 개 조회
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" }, // 최신순 정렬
  });
  res.json(reviews);
});

//리뷰 상세 조회
app.get("/api/reviews/:id", async (req, res) => {
  //url 속 :id는 String이므로 숫자로 변환
  const id = Number(req.params.id);
  //findUnique: 조건에 맞는 하나 조회
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) return res.status(404).json({ message: "there's no review" });

  res.json(review);
});

//리뷰 작성
app.post("/api/reviews", async (req, res) => {
  //클라이언트가 보내야 하는 값
  const { title, content, rating, movieId, movieTitle, moviePoster } = req.body;
  const review = await prisma.review.create({
    data: {
      title,
      content,
      rating,
      movieId,
      movieTitle,
      moviePoster,
      authorId: 1, //토큰이 없기 때문에 일단 임시로 1로 고정
    },
  });
  res.status(201).json(review);
});

//리뷰 수정
app.put("/api/reviews/:id", async (req, res) => {
  const id = Number(req.params.id);
  const { title, content, rating } = req.body;
  const review = await prisma.review.update({
    where: { id },
    data: { title, content, rating },
  });
  res.json(review);
});

//리뷰 삭제
app.delete("/api/reviews/:id", async (req, res) => {
  const id = Number(req.params.id);
  await prisma.review.delete({
    where: { id },
  });
  res.json({ message: "deleted!" });
});

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`서버 실행 중: port = ${PORT}`);
});
