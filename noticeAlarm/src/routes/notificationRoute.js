const express = require("express");
const router = express.Router();
const { crawlAllNotices } = require("../services/crawlerService");
const { sendNotification } = require("../services/notificationService");
const authMiddleware = require("../middlewares/authMiddleware");
const prisma = require("../config/prisma");

router.post("/fcm-token", authMiddleware, async (req, res) => {
  try {
    const { fcm_token } = req.body;
    const userId = req.user.userId;

    if (!fcm_token) {
      return res
        .status(400)
        .json({ message: "FCM 토큰이 제공되지 않았습니다." });
    }

    // users 테이블의 fcm_token 컬럼 업데이트
    const updatedUser = await prisma.users.update({
      where: { id: BigInt(userId) },
      data: { fcm_token },
    });

    console.log(
      `✅ [FCM 토큰 업데이트] 사용자 ID: ${userId}, 새 토큰: ${fcm_token}`,
    );

    return res
      .status(200)
      .json({ message: "FCM 토큰이 성공적으로 업데이트되었습니다." });
  } catch (error) {
    console.error("❌ [FCM 토큰 업데이트 실패]", error);
    return res.status(500).json({
      message: "FCM 토큰 업데이트 중 오류가 발생했습니다.",
      error: error.message,
    });
  }
});

router.get("/test-crawl", async (req, res) => {
  try {
    await crawlAllNotices();

    return res.status(200).json({
      success: true,
      message: "크롤링 테스트 완료",
    });
  } catch (error) {
    console.error("크롤링 테스트 중 오류 발생:", error);
    return res.status(500).json({ error: error.message });
  }
});

//req = json 데이터가 담겨 옴 {board_id, title, content, url, type}
router.post("/test-push", async (req, res) => {
  try {
    const { board_id, title, content, url, type } = req.body;

    //임시 공지사항 객체 생성 (테스트용)
    const mockNotice = {
      id: BigInt(999),
      board_id: board_id ? BigInt(board_id) : BinInt(1), // 기본값으로 1번 게시판 사용
      title: title || "테스트 공지사항 제목",
      content: content || "테스트 공지사항 내용",
      url: url || "https://example.com",
    };

    //작성해둔 FCM 알림 발송 서비스 호출
    await sendNotification(mockNotice, type || "CREATE");

    return res.status(200).json({ message: "알림 발송 성공" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

module.exports = router;
