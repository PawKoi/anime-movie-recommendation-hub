import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function HomePage() {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSuggestion() {
      setLoading(true);
      setError("");
      try {
        const res = await apiClient.get("/titles/ai/recommendation");
        setSuggestion(res.data);
      } catch (err) {
        setError("Could not load recommendation.");
      } finally {
        setLoading(false);
      }
    }
    loadSuggestion();
  }, []);

  return (
    <section className="page page-home">
      <header className="home-hero">
        <h1 className="home-title">
          Anime and Movie Recommendation Hub
        </h1>
        <h3 className="home-subtitle">
          Browse titles, read reviews, and manage personal watch activity.
        </h3>
      </header>

      <div className="home-actions">
        <Link to="/titles" className="btn">
          Browse Titles
        </Link>
        <Link to="/register" className="btn btn-secondary">
          Create Account
        </Link>
      </div>

      <section className="ai-section" aria-label="Our recommendations">
        <h2>Our Recommendations, Best of the Best 😉</h2>

        {loading && <p>Loading recommendation...</p>}
        {error && <p className="form-error">{error}</p>}

        {!loading && !error && suggestion && suggestion.title && (
          <div className="title-card recommendation-card">
            <div className="rec-header">
              <h3>
                <Link
                  to={`/titles/${suggestion.title._id}`}
                  className="title-name-link"
                >
                  {suggestion.title.name}
                </Link>
              </h3>
              <p className="title-meta title-meta-inline">
                <span>{suggestion.title.type}</span>
                {suggestion.title.year && (
                  <span>{suggestion.title.year}</span>
                )}
              </p>
            </div>

            <div className="rec-body">
              {suggestion.title.synopsis && (
                <p className="rec-synopsis">
                  {suggestion.title.synopsis}
                </p>
              )}
            </div>

            {suggestion.explanation && (
              <p className="rec-explanation">
                {suggestion.explanation}
              </p>
            )}

            <div className="rec-actions">
              <Link
                to={`/titles/${suggestion.title._id}`}
                className="btn btn-secondary btn-small"
              >
                View Details
              </Link>
            </div>
          </div>
        )}

        {!loading && !error && suggestion && !suggestion.title && (
          <p>
            No titles available yet. Add a title to see a recommendation.
          </p>
        )}
      </section>
    </section>
  );
}
