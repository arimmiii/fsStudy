const express = require("express");
const router = express.Router();
const prisma = require("../prisma");
const authMiddleware = require("../middleware/authMiddleware");
//리뷰 목록 조회
router.get("/", async (req, res) => {
  //findMany: 여러 개 조회
  const reviews = await prisma.review.findMany({
    orderBy: { createdAt: "desc" }, // 최신순 정렬
  });
  res.json(reviews);
});

//리뷰 상세 조회
router.get("/:id", async (req, res) => {
  //url 속 :id는 String이므로 숫자로 변환
  const id = Number(req.params.id);
  //findUnique: 조건에 맞는 하나 조회
  const review = await prisma.review.findUnique({
    where: { id },
  });

  if (!review) return res.status(404).json({ message: "there's no review" });

  res.json(review);
});

//리뷰 작성
router.post("/", authMiddleware, async (req, res) => {
  //클라이언트가 보내야 하는 값
  const { title, content, rating, movieId, movieTitle, moviePoster } = req.body;
  const review = await prisma.review.create({
    data: {
      title,
      content,
      rating,
      movieId,
      movieTitle,
      moviePoster,
      authorId: req.userId, //토큰이 없기 때문에 일단 임시로 1로 고정
    },
  });
  res.status(201).json(review);
});

//리뷰 수정
router.put("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  //1. 해당 영화에 대한 리뷰가 있는지 확인
  const review = await prisma.review.findUnique({
    where: { id },
  });
  if (!review) {
    return res.status(404).json({ message: "리뷰를 찾을 수 없음" });
  }

  //2. 수정하려는 글이 본인 글인지 확인
  if (review.authorId !== req.userId) {
    return res.status(403).json({ message: "본인 글만 수정 가능" });
  }

  //3. 수정
  const { title, content, rating } = req.body;
  const updated = await prisma.review.update({
    where: { id },
    data: { title, content, rating },
  });
  res.json(updated);
});

//리뷰 삭제
router.delete("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  //1. 해당 영화에 대한 리뷰가 있는지 확인
  const review = await prisma.review.findUnique({
    where: { id },
  });
  if (!review) {
    return res.status(404).json({ message: "리뷰를 찾을 수 없음" });
  }

  //2. 삭제하려는 글이 본인 글인지 확인
  if (review.authorId !== req.userId) {
    return res.status(403).json({ message: "본인 글만 삭제 가능" });
  }

  // 3. 삭제
  await prisma.review.delete({
    where: { id },
  });
  res.json({ message: "deleted!" });
});

module.exports = router;
