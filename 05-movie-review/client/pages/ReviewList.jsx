import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    async function fetchReviews() {
      try {
        const res = await axios.get("http://localhost:4000/api/reviews");
        setReviews(res.data);
      } catch (error) {
        console.log("불러오기 실패: ", err);
      }
    }
    fetchReviews();
  }, []);

  return (
    <div>
      <h1>영화 리뷰</h1>
      {reviews.map((review) => (
        <Link
          key={review.id}
          to={`/reviews/${review.id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <div
            key={review.id}
            style={{ border: "1px solid #ccc", margin: "8px", padding: "8px" }}
          >
            {review.moviePoster && (
              <img
                src={`https://image.tmdb.org/t/p/w500${review.moviePoster}`}
                alt={review.movieTitle}
                style={{ width: "150px", borderRadius: "4px" }}
              />
            )}

            <h3>{review.title}</h3>
            <p>
              {review.movieTitle} ⭐ {review.rating}
            </p>
            <p>{review.content}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default ReviewList;
