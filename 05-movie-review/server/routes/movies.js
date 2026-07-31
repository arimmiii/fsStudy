const express = require("express");
const router = express.Router();
const prisma = require("../prisma");

router.get("/search/:q", async (req, res) => {
  const q = req.params.q;

  try {
    //TMDB에 검색 요청
    const url = `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(q)}&language=ko-KR`;
    const tmdbRes = await fetch(url, {
      headers: {
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });
    const data = await tmdbRes.json();

    //필요한 정보만 가져오기
    const movies = data.results.map((movie) => ({
      movieId: movie.id,
      title: movie.title,
      poster: movie.poster_path,
      releaseDate: movie.release_date,
    }));

    res.json(movies);
  } catch (error) {
    console.log("에러", error);
    res.status(500).json({ message: "영화 검색 실패" });
  }
});

module.exports = router;
