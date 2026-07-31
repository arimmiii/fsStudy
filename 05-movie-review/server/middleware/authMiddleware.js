const jwt = require("jsonwebtoken");

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
    console.log("secret: ", process.env.JWT_SECRET);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "유효하지 않은 토큰" });
  }
}

module.exports = authMiddleware;
