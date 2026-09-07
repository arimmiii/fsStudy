const cron = require("node-cron");
const { crawlAllNotices } = require("../services/crawlerService");

//node-cron을 이용하여 10분마다 자동으로 크롤러 돌리는 세팅
const initScheduler = () => {
  // 매 10분마다 크롤링 실행
  cron.schedule("*/10 * * * *", async () => {
    console.log("크롤링 스케줄러 시작");
    await crawlAllNotices(); // 모든 게시판 크롤링
  });

  console.log("크롤링 스케줄러 등록 완료");
};

module.exports = { initScheduler };
