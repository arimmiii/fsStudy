const axios = require("axios");
const cheerio = require("cheerio");
const { sendNotification } = require("./notificationService");
const prisma = require("../config/prisma");

/**
 * 동국대 공지사항 게시판 크롤링 및 저장/알림 로직
 * @param {Number} boardId - DB의 boards 테이블 내 동국대 공지사항 board_id
 */

const crawlSingleBoard = async (board) => {
  //url 보정
  let rawUrl = (board.url || "").trim();

  if (!rawUrl) return;

  // 2. http:// 또는 https:// 가 없는 경우 붙여주기
  if (!rawUrl.startsWith("http://") && !rawUrl.startsWith("https://")) {
    rawUrl = `https://${rawUrl}`;
  }

  // 3. https://dongguk.edu 형태인 경우 https://www.dongguk.edu 로 보정
  if (rawUrl.startsWith("https://dongguk.edu")) {
    rawUrl = rawUrl.replace("https://dongguk.edu", "https://www.dongguk.edu");
  }
  const listUrl = rawUrl;
  const baseUrl = listUrl.replace(/\/list\/?$/, "/detail/"); // 상세페이지 URL 생성용
  console.log(`\n🔄 [${board.name || board.code}] 크롤링 시작... (${listUrl})`);

  try {
    //1. 동국대 공지사항 게시판 HTML 가져오기
    const response = await axios.get(listUrl, {
      //크롤링 시 User-Agent를 설정하여 봇 차단을 우회
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    //2. cheerio로 HTML 파싱. $=html을 파싱한 결과 객체
    const $ = cheerio.load(response.data);
    const noticeList = [];

    //게시판 목록 탐색
    $(".board_list ul li").each((index, element) => {
      const title = $(element).find("p.tit").text().trim();
      const onclickAttr = $(element).find("a").attr("onclick");

      if (title && onclickAttr) {
        // onclick 문자열에서 숫자(게시물 ID) 추출
        const match = onclickAttr.match(/\d+/);
        if (match) {
          const articleId = match[0];
          // 동국대 일반공지 상세페이지 URL 완성
          const url = `${baseUrl}${articleId}`;
          noticeList.push({ title, url, external_id: articleId });
        }
      }
    });

    console.log(
      `📌 [${board.name || board.code}] 수집된 공지사항: ${noticeList.length}개`,
    );

    //3. 수집한 공지사항을 과거에서 최신순으로 순회하며 DB 처리
    for (const notice of noticeList.reverse()) {
      // 중복 체크: DB에 이미 존재하는 공지사항인지 확인
      const existingPost = await prisma.posts.findFirst({
        where: { url: notice.url },
      });

      if (!existingPost) {
        //DB에 새 공지사항 저장
        const newPost = await prisma.posts.create({
          data: {
            board_id: BigInt(board.id),
            title: notice.title,
            content: notice.title,
            url: notice.url,
            external_id: BigInt(notice.external_id),
          },
        });

        console.log(
          `✨ [${board.name || board.code} 신규 저장] ${newPost.title}`,
        );

        //FCM 푸시 알림 발송 트리거 실행
        await sendNotification(newPost, "CREATE");
      }
    }

    console.log("크롤링 및 알림 처리 완료");
  } catch (error) {
    console.error(
      `❌ [${board.name || board.code}] 게시판 크롤링 에러:`,
      error.message,
    );
  }
};

//DB에서 모든 게시판을 가져와 동적으로 순회하는 함수
const crawlAllNotices = async () => {
  try {
    // 1. DB에서 활성화된 게시판 목록을 동적으로 조회
    const boards = await prisma.boards.findMany();
    console.log(`🚀 총 ${boards.length}개 게시판 크롤링을 시작합니다.`);

    // 2. 각 게시판에 대해 크롤링 수행
    for (const board of boards) {
      if (!board.url || board.url.trim() === "") {
        console.warn(
          `⚠️ [${board.name || board.code}] URL이 비어있습니다. 크롤링을 건너뜁니다.`,
        );
        continue;
      }

      await crawlSingleBoard(board);
    }
    console.log("\n✅ 모든 게시판 동적 크롤링 완료!");
  } catch (error) {
    console.error("❌ 게시판 목록 조회 및 크롤링 에러:", error.message);
  }
};

module.exports = { crawlAllNotices };
