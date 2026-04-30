import React, { useEffect, useState } from "react";
import { fetchMyReviews } from "../api/reviewsApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function ProfilePage() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const data = await fetchMyReviews();
        setReviews(data);
      } catch (err) {
        setError("Failed to load profile data.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
  <section className="page page-profile">
    <h1>Profile</h1>

    <div className="profile-layout">
      <aside className="profile-summary">
        <h2>Account</h2>
        <p>Email: {user?.email}</p>
      </aside>

      <div className="profile-reviews">
        <h2>My Reviews</h2>
        {loading && <p>Loading reviews...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && reviews.length === 0 && (
          <p>No reviews yet.</p>
        )}

        {!loading && !error && reviews.length > 0 && (
          <ul className="review-list">
            {reviews.map((review) => (
              <li key={review._id} className="review-card">
                <p className="review-rating">Rating: {review.rating}/5</p>
                {review.text && (
                  <p className="review-text">{review.text}</p>
                )}
                <p className="review-meta">
                  For{" "}
                  {review.titleId ? (
                    <Link to={`/titles/${review.titleId._id}`}>
                      {review.titleId.name}
                    </Link>
                  ) : (
                    "Unknown title"
                  )}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  </section>
);
}
