import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";

function ReviewDetail() {
  const { id } = useParams();
  //배열이면 [], 단일 객체면 null
  const [review, setReview] = useState(null);

  useEffect(() => {
    async function getReview() {
      try {
        const res = await axios.get(`http://localhost:4000/api/reviews/${id}`);
        setReview(res.data);
      } catch (error) {
        console.log("리뷰 불러오기 실패: ", error);
      }
    }

    getReview();
  }, [id]); //id 바뀔 때마다 getReview

  if (!review) return <p>불러오는 중...</p>;

  return (
    <div>
      <Link to="/">목록으로 돌아가기</Link>
      {review.moviePoster && (
        <img
          src={`https://image.tmdb.org/t/p/w500${review.moviePoster}`}
          alt={review.movieTitle}
          style={{ width: "250px", display: "block", margin: "16px 0" }}
        />
      )}
      <h1>{review.title}</h1>
      <p>
        {review.movieTitle} ⭐ {review.rating}
      </p>
      <p>{review.content}</p>
    </div>
  );
}

export default ReviewDetail;
