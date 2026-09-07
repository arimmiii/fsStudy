const prisma = require("../config/prisma");
const { messaging } = require("../config/firebase");

/**
 * 게시글 등록/수정 시 맞춤 알림을 발송하는 함수
 * @param {Object} notice - 공지사항 객체 { id, board_id, title, url }
 * @param {String} type - 알림 종류 ('CREATE': 신규 등록, 'UPDATE': 게시글 수정)
 */

const sendNotification = async (notice, type = "CREATE") => {
  try {
    const { id, board_id, title, content, url } = notice;
    const fullText = `${title || ""} ${content || ""}`;

    //1. 해당 게시판에 관심 있는 유저 조회
    const boardSubscribers = await prisma.user_boards.findMany({
      where: { board_id: Number(board_id) },
      select: { user_id: true },
    });
    const boardUserIds = boardSubscribers.map(
      (subscriber) => subscriber.user_id,
    );

    //2. 키워드에 관심 있는 유저 조회
    const allKeywords = await prisma.user_keywords.findMany({
      select: { user_id: true, keyword: true },
    });
    const keywordUserIds = allKeywords
      .filter((item) => item.keyword && fullText.includes(item.keyword))
      .map((item) => item.user_id);

    //3. 중복 유저 제거
    const targetUserIds = [...new Set([...boardUserIds, ...keywordUserIds])];
    if (targetUserIds.length === 0) {
      console.log("알림 대상 유저가 없습니다.");
      return;
    }

    //4. 대상 유저들 FCM 토큰 조회
    const tokens = await prisma.users.findMany({
      where: {
        id: { in: targetUserIds },
        fcm_token: { not: null },
      },
      select: { fcm_token: true },
    });

    //filter(Boolean)으로 null, undefined, 빈 문자열 등을 제거
    const fcmTokens = tokens.map((tokens) => tokens.fcm_token).filter(Boolean);

    if (fcmTokens.length === 0) {
      console.log("알림 대상 유저의 FCM 토큰이 없습니다.");
      return;
    }

    //5. 알림 종류(신규/수정)에 따른 문구 설정
    const notiTitle =
      type === "UPDATE"
        ? "공지사항이 수정되었습니다"
        : "새로운 공지사항이 등록되었습니다";

    //6. FCM 메시지 생성
    const message = {
      //사용자 화면에 표시될 내용
      notification: {
        title: notiTitle,
        body: title,
      },

      //앱 내부에서 클릭 시 로직 처리를 위해 전달하는 데이터 (optional)
      data: {
        url: url || "",
        noticeId: String(id),
        type: type,
      },

      //알림 대상 디바이스 토큰 배열 (max=500)
      token: fcmTokens,
    };

    const response = await messaging.send(message);
    console.log(
      `알림 발송 완료: ${response.successCount}건 성공, ${response.failureCount}건 실패`,
    );
  } catch (error) {
    console.error("알림 발송 중 오류 발생:", error);
  }
};

module.exports = { sendNotification };
