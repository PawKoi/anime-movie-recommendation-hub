import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { fetchTitles } from "../api/titlesApi";
import { useAuth } from "../context/AuthContext";

const ANIME_GENRES = [
  "action",
  "drama",
  "fantasy",
  "sci-fi",
  "romance",
  "psychological"
];

const MOVIE_GENRES = [
  "drama",
  "crime",
  "thriller",
  "romance",
  "mystery",
  "fantasy"
];

export default function TitlesListPage() {
  const { isAuthenticated } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [data, setData] = useState({ data: [], pagination: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const page = Number(searchParams.get("page") || 1);
  const q = searchParams.get("q") || "";
  const type = searchParams.get("type") || "";
  const genre = searchParams.get("genre") || "";

  const [openType, setOpenType] = useState(null); // "Anime" | "Movie" | null

  useEffect(() => {
    async function load() {
      setLoading(true);
      setError("");
      try {
        const result = await fetchTitles({
          page,
          q: q || undefined,
          type: type || undefined,
          genre: genre || undefined
        });
        setData(result);
      } catch (err) {
        setError("Failed to load titles.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page, q, type, genre]);

  const titles = data.data || [];

  function handleSearchSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const nextQ = formData.get("q") || "";
    const params = {};
    if (nextQ) params.q = nextQ;
    if (type) params.type = type;
    if (genre) params.genre = genre;
    params.page = 1;
    setSearchParams(params);
  }

  function goToPage(nextPage) {
    const params = {};
    if (q) params.q = q;
    if (type) params.type = type;
    if (genre) params.genre = genre;
    params.page = nextPage;
    setSearchParams(params);
  }

  function applyTypeAndGenre(nextType, nextGenre = "") {
    const params = {};
    if (q) params.q = q;
    if (nextType) params.type = nextType;
    if (nextGenre) params.genre = nextGenre;
    params.page = 1;
    setSearchParams(params);
    setOpenType(nextType);
  }

  function clearFilters() {
    const params = {};
    if (q) params.q = q;
    params.page = 1;
    setSearchParams(params);
    setOpenType(null);
  }

  return (
    <section className="page page-list">
      <header className="page-header">
        <h1>Browse Titles</h1>
        {isAuthenticated && (
          <Link to="/titles/new" className="btn">
            Add Title
          </Link>
        )}
      </header>

      <form className="filters filters-top" onSubmit={handleSearchSubmit}>
        <input
          name="q"
          type="search"
          placeholder="Search by name..."
          defaultValue={q}
        />
        <button type="submit" className="btn btn-secondary">
          Search
        </button>
      </form>

      <div className="titles-layout">
        <aside className="titles-filters" aria-label="Filter titles">
          <h2 className="filter-heading">Filter by type</h2>

          {/* Anime accordion */}
          <button
            type="button"
            className={`filter-type-btn ${
              openType === "Anime" ? "is-open" : ""
            }`}
            onClick={() =>
              setOpenType((prev) => (prev === "Anime" ? null : "Anime"))
            }
          >
            Anime
            <span className="filter-chevron">
              {openType === "Anime" ? "−" : "+"}
            </span>
          </button>
          {openType === "Anime" && (
            <div className="filter-genres">
              <button
                type="button"
                className={`genre-chip ${
                  type === "Anime" && !genre ? "is-active" : ""
                }`}
                onClick={() => applyTypeAndGenre("Anime")}
              >
                All anime
              </button>
              {ANIME_GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`genre-chip ${
                    type === "Anime" && genre === g ? "is-active" : ""
                  }`}
                  onClick={() => applyTypeAndGenre("Anime", g)}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* Movies accordion */}
          <button
            type="button"
            className={`filter-type-btn ${
              openType === "Movie" ? "is-open" : ""
            }`}
            onClick={() =>
              setOpenType((prev) => (prev === "Movie" ? null : "Movie"))
            }
          >
            Movies
            <span className="filter-chevron">
              {openType === "Movie" ? "−" : "+"}
            </span>
          </button>
          {openType === "Movie" && (
            <div className="filter-genres">
              <button
                type="button"
                className={`genre-chip ${
                  type === "Movie" && !genre ? "is-active" : ""
                }`}
                onClick={() => applyTypeAndGenre("Movie")}
              >
                All movies
              </button>
              {MOVIE_GENRES.map((g) => (
                <button
                  key={g}
                  type="button"
                  className={`genre-chip ${
                    type === "Movie" && genre === g ? "is-active" : ""
                  }`}
                  onClick={() => applyTypeAndGenre("Movie", g)}
                >
                  {g}
                </button>
              ))}
            </div>
          )}

          {(type || genre) && (
            <button
              type="button"
              className="btn btn-secondary filter-clear-btn"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </aside>

        <div className="titles-content">
          {loading && <p>Loading titles...</p>}
          {error && <p className="form-error">{error}</p>}

          {!loading && !error && (
            <>
              {titles.length === 0 && (
                <p className="empty-state">No titles found.</p>
              )}

              {titles.length > 0 && (
                <ul className="title-list">
                  {titles.map((title) => (
                    <li key={title._id} className="title-card">
                      <h2>
                        <Link
                          to={`/titles/${title._id}`}
                          className="title-name-link"
                        >
                          {title.name}
                        </Link>
                      </h2>
                      <p className="title-meta">
                        <span>{title.type}</span>
                        {title.year && <span>{title.year}</span>}
                      </p>
                      {title.synopsis && (
                        <p className="title-synopsis">{title.synopsis}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}

              {data.pagination && data.pagination.totalPages > 1 && (
                <div className="pagination">
                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() => goToPage(page - 1)}
                  >
                    Previous
                  </button>
                  <span>
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <button
                    type="button"
                    disabled={page >= data.pagination.totalPages}
                    onClick={() => goToPage(page + 1)}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}
