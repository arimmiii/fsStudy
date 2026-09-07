const prisma = require("../config/prisma");

const updateBoards = async (userId, boardIds) => {
  //1. boardIds가 유효한 배열인지 확인
  if (!Array.isArray(boardIds)) {
    throw new Error("게시판 ID 목록은 배열이어야 합니다.");
  }

  //트랜잭션: 기존 관심 게시판 삭제 후 새로운 관심 게시판 등록
  return await prisma.$transaction(async (tx) => {
    //1. 기존 관심 게시판 삭제
    await tx.user_boards.deleteMany({
      where: { user_id: userId },
    });
    //2. 선택 게시판이 없다면 빈 배열 반환
    if (boardIds.length === 0) {
      return [];
    }
    //3. 새로 선택한 게시판들 일괄 등록
    const newBoards = boardIds.map((boardId) => ({
      user_id: userId,
      board_id: Number(boardId),
    }));

    await tx.user_boards.createMany({
      data: newBoards,
    });

    //4. 저장된 목록 반환
    return await tx.user_boards.findMany({
      where: { user_id: userId },
    });
  });
};

const getBoards = async (userId) => {
  //1. 유저의 관심 게시판 조회
  const boards = await prisma.user_boards.findMany({
    where: { user_id: userId },
    orderBy: { board_id: "desc" }, // 최신 등록 순으로 정렬
  });
  return boards;
};

module.exports = { updateBoards, getBoards };
