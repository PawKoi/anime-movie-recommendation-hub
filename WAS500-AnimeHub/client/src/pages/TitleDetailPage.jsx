import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { fetchTitle, deleteTitle } from "../api/titlesApi";
import {
  fetchReviewsByTitle,
  createReview,
  deleteReview
} from "../api/reviewsApi";
import { useAuth } from "../context/AuthContext";

export default function TitleDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [title, setTitle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [titleLoading, setTitleLoading] = useState(true);
  const [error, setError] = useState("");

  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    async function loadTitle() {
      setTitleLoading(true);
      setError("");
      try {
        const data = await fetchTitle(id);
        setTitle(data);
      } catch (err) {
        setError("Failed to load title.");
      } finally {
        setTitleLoading(false);
      }
    }
    loadTitle();
  }, [id]);

  useEffect(() => {
    async function loadReviews() {
      setReviewsLoading(true);
      try {
        const data = await fetchReviewsByTitle(id);
        setReviews(data.data || []);
      } catch (err) {
        // keep main error
      } finally {
        setReviewsLoading(false);
      }
    }
    loadReviews();
  }, [id]);

  async function handleDeleteTitle() {
    if (!window.confirm("Delete this title?")) return;
    try {
      await deleteTitle(id);
      navigate("/titles");
    } catch (err) {
      setError("Failed to delete title.");
    }
  }

  async function handleReviewSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!rating) {
      setSubmitError("Rating is required.");
      return;
    }

    setSubmitLoading(true);
    try {
      const created = await createReview(id, { rating, text });
      setReviews((prev) => [created, ...prev]);
      setRating(5);
      setText("");
    } catch (err) {
      setSubmitError("Failed to submit review.");
    } finally {
      setSubmitLoading(false);
    }
  }

  async function handleDeleteReview(reviewId) {
    if (!window.confirm("Delete this review?")) return;
    try {
      await deleteReview(reviewId);
      setReviews((prev) => prev.filter((r) => r._id !== reviewId));
    } catch (err) {
      setSubmitError("Failed to delete review.");
    }
  }

  return (
    <section className="page page-detail">
      {titleLoading && <p>Loading title...</p>}
      {error && <p className="form-error">{error}</p>}

      {!titleLoading && !error && title && (
        <div
          className="detail-with-bg"
          style={
            title.poster
              ? {
                  backgroundImage: `url(${title.poster})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }
              : undefined
          }
        >
          <div className="detail-card">
            <header className="detail-header">
              <div>
                <h1 className="detail-title">{title.name}</h1>
                <p className="title-meta">
                  <span>{title.type}</span>
                  {title.year && <span>{title.year}</span>}
                </p>
              </div>
              <div className="detail-actions">
                {isAuthenticated && user && title.ownerId === user.id && (
                  <>
                    <Link
                      to={`/titles/${id}/edit`}
                      className="btn btn-secondary"
                    >
                      Edit
                    </Link>
                      <button
                      type="button"
                      className="btn btn-danger"
                      onClick={handleDeleteTitle}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </header>

            {title.poster && (
              <img
                src={title.poster}
                alt={title.name}
                className="detail-poster"
              />
            )}

            {title.synopsis && (
              <p className="detail-synopsis">{title.synopsis}</p>
            )}

            <section className="reviews-section">
              <h2>Reviews</h2>

              {reviewsLoading && <p>Loading reviews...</p>}

              {!reviewsLoading && reviews.length === 0 && (
                <p>No reviews yet.</p>
              )}

              {!reviewsLoading && reviews.length > 0 && (
                <ul className="review-list">
                  {reviews.map((review) => (
                    <li key={review._id} className="review-card">
                      <p className="review-rating">
                        Rating: {review.rating}/5
                      </p>
                      {review.text && (
                        <p className="review-text">{review.text}</p>
                      )}
                      <p className="review-meta">
                        By {review.userId?.email || "User"} on{" "}
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      <button
                        type="button"
                        className="btn btn-danger btn-small"
                        onClick={() => handleDeleteReview(review._id)}
                      >
                        Delete review
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {isAuthenticated && (
                <form
                  className="review-form"
                  onSubmit={handleReviewSubmit}
                >
                  <h3>Add Review</h3>
                  <label htmlFor="rating">
                    Rating
                    <select
                      id="rating"
                      value={rating}
                      onChange={(e) =>
                        setRating(Number(e.target.value))
                      }
                    >
                      <option value={5}>5</option>
                      <option value={4}>4</option>
                      <option value={3}>3</option>
                      <option value={2}>2</option>
                      <option value={1}>1</option>
                    </select>
                  </label>
                  <label htmlFor="text">
                    Comment
                    <textarea
                      id="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      rows={3}
                    />
                  </label>
                  {submitError && (
                    <p className="form-error">{submitError}</p>
                  )}
                  <button
                    type="submit"
                    className="btn"
                    disabled={submitLoading}
                  >
                    {submitLoading ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              )}

              {!isAuthenticated && (
                <p>
                  Login to add a review. <Link to="/login">Login</Link>
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </section>
  );
}
