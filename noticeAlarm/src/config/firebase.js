//initializeApp = 앱 초기화 함수, cert = 인증서 생성 함수
const { initializeApp, cert } = require("firebase-admin/app");
const { getMessaging } = require("firebase-admin/messaging");
//서비스 계정 비공개 키 파일 JSON 불러오기
const serviceAccount = require("./firebase-service-account.json");

//키 정보를 cert 함수로 패키징해 앱을 초기화
initializeApp({
  credential: cert(serviceAccount),
});

// Messaging 객체 생성 후 내보내기
const messaging = getMessaging();
module.exports = { messaging };
