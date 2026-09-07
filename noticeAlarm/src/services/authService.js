const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//회원가입
const register = async (email, password, nickname) => {
  //1. 이메일 중복 체크
  const existingUser = await prisma.users.findUnique({
    where: { email },
  });
  if (existingUser) {
    throw new Error("이미 존재하는 이메일입니다.");
  }

  //2. 비밀번호 해싱
  const hashedPassword = await bcrypt.hash(password, 10);

  //3. 유저 생성
  const user = await prisma.users.create({
    data: {
      email,
      password_hash: hashedPassword,
      nickname,
    },
    //user의 모든 column을 반환하지 않고, 필요한 컬럼만 선택적으로 반환하도록 select 옵션을 사용
    select: {
      id: true,
      email: true,
      nickname: true,
      created_at: true,
    },
  });

  return user;
};

//로그인
const login = async (email, password) => {
  //1. 이메일 존재 여부 확인
  const user = await prisma.users.findUnique({
    where: { email },
  });
  if (!user) {
    throw new Error("존재하지 않는 이메일입니다.");
  }

  //2. 비밀번호 확인
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new Error("비밀번호가 일치하지 않습니다.");
  }

  //3. JWT 토큰 생성
  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  //토큰 응답
  return { token, user };
};

module.exports = {
  register,
  login,
};
