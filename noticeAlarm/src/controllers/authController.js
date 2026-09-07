const authService = require("../services/authService");

//회원가입
const register = async (req, res) => {
  try {
    const { email, password, nickname } = req.body;

    if (!email || !password || !nickname) {
      return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
    }

    // 비번 해싱은 authService에서 처리
    const user = await authService.register(email, password, nickname);
    return res.status(201).json({ message: "회원가입 성공", user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//로그인
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "모든 필드를 입력해 주세요." });
    }

    const result = await authService.login(email, password);
    return res
      .status(200)
      .json({ message: "로그인 성공", token: result.token, user: result.user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
};
