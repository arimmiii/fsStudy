const prisma = require("../config/prisma");

const createKeyword = async (userId, keyword) => {
  //1. 이미 등록된 키워드인지 확인
  const existingKeyword = await prisma.user_keywords.findFirst({
    where: {
      user_id: userId,
      keyword: keyword.trim(),
    },
  });

  if (existingKeyword) {
    throw new Error("이미 등록된 키워드입니다.");
  }

  //2. 키워드 등록
  const newKeyword = await prisma.user_keywords.create({
    data: {
      user_id: userId,
      keyword: keyword.trim(),
    },
  });

  return newKeyword;
};

const getKeyword = async (userId) => {
  //1. 유저의 키워드 조회
  const keywords = await prisma.user_keywords.findMany({
    where: { user_id: userId },
    orderBy: { id: "desc" }, // 최신 등록 순으로 정렬
  });
  return keywords;
};

const deleteKeyword = async (userId, keywordId) => {
  //1. 키워드 존재 여부 확인
  const existingKeyword = await prisma.user_keywords.findFirst({
    where: { id: keywordId, user_id: userId },
  });

  if (!existingKeyword) {
    throw new Error("존재하지 않는 키워드입니다.");
  }

  await prisma.user_keywords.delete({
    where: { id: Number(keywordId) },
  });

  return true;
};

module.exports = { createKeyword, getKeyword, deleteKeyword };
