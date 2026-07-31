const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//회원가입
router.post("/signup", async (req, res) => {
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
router.post("/login", async (req, res) => {
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

module.exports = router;
