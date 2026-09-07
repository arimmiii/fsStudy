const boardService = require("../services/boardService");

//관심 게시판 목록 변경/저장
const updateBoards = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 미들웨어가 넣어서 넘겨준 유저 ID
    const { boardIds } = req.body;

    if (!boardIds || !Array.isArray(boardIds)) {
      return res
        .status(400)
        .json({ message: "게시판 ID 목록을 입력해 주세요." });
    }

    const result = await boardService.updateBoards(userId, boardIds);
    return res
      .status(201)
      .json({ message: "게시판 목록 업데이트 성공", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getBoards = async (req, res) => {
  try {
    const userId = req.user.userId; // 👈 미들웨어가 넣어서 넘겨준 유저 ID
    const result = await boardService.getBoards(userId);
    return res.status(200).json({ message: "게시판 조회 성공", result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = { updateBoards, getBoards };
