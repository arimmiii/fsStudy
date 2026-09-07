const keywordService = require("../services/keywordService");

//관심 키워드 등록
const addKeyword = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 미들웨어가 넣어서 넘겨준 유저 ID
    const { keyword } = req.body;

    if (!keyword) {
      return res.status(400).json({ message: "키워드를 입력해 주세요." });
    }

    const result = await keywordService.createKeyword(userId, keyword);
    return res.status(201).json({ message: "키워드 등록 성공", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getKeyword = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 미들웨어가 넣어서 넘겨준 유저 ID
    const result = await keywordService.getKeyword(userId);
    return res.status(200).json({ message: "키워드 조회 성공", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteKeyword = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 미들웨어가 넣어서 넘겨준 유저 ID
    const { keywordId } = req.params;
    await keywordService.deleteKeyword(userId, keywordId);
    return res.status(200).json({ message: "키워드 삭제 성공" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { addKeyword, getKeyword, deleteKeyword };
