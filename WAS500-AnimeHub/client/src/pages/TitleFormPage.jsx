import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createTitle, fetchTitle, updateTitle } from "../api/titlesApi";

export default function TitleFormPage({ mode }) {
  const isEdit = mode === "edit";
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [type, setType] = useState("Anime");
  const [genres, setGenres] = useState("");
  const [year, setYear] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [poster, setPoster] = useState("");

  const [loading, setLoading] = useState(isEdit);
  const [error, setError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    async function load() {
      if (!isEdit) return;
      setLoading(true);
      setError("");
      try {
        const data = await fetchTitle(id);
        setName(data.name || "");
        setType(data.type || "Anime");
        setGenres((data.genres || []).join(", "));
        setYear(data.year || "");
        setSynopsis(data.synopsis || "");
        setPoster(data.poster || "");
      } catch (err) {
        setError("Failed to load title.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [isEdit, id]);

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");

    if (!name) {
      setSubmitError("Name is required.");
      return;
    }

    const payload = {
      name,
      type,
      genres: genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean),
      year: year ? Number(year) : undefined,
      synopsis,
      poster
    };

    setSubmitLoading(true);
    try {
      if (isEdit) {
        await updateTitle(id, payload);
      } else {
        await createTitle(payload);
      }
      navigate("/titles");
    } catch (err) {
      setSubmitError("Failed to save title.");
    } finally {
      setSubmitLoading(false);
    }
  }

  if (loading) {
    return (
      <section className="page">
        <p>Loading...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <p className="form-error">{error}</p>
      </section>
    );
  }

return (
  <section className="page">
    <h1>{isEdit ? "Edit Title" : "Create Title"}</h1>

    <form className="title-form" onSubmit={handleSubmit} noValidate>
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="name">
            Name
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="type">
            Type
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="Anime">Anime</option>
              <option value="Movie">Movie</option>
            </select>
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="genres">
            Genres (comma-separated)
            <input
              id="genres"
              type="text"
              value={genres}
              onChange={(e) => setGenres(e.target.value)}
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="year">
            Year
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="synopsis">
            Synopsis
            <textarea
              id="synopsis"
              rows={4}
              value={synopsis}
              onChange={(e) => setSynopsis(e.target.value)}
            />
          </label>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="poster">
            Poster URL
            <input
              id="poster"
              type="url"
              value={poster}
              onChange={(e) => setPoster(e.target.value)}
            />
          </label>
        </div>
      </div>

      {submitError && <p className="form-error">{submitError}</p>}

      <button type="submit" className="btn" disabled={submitLoading}>
        {submitLoading ? "Saving..." : "Save"}
      </button>
    </form>
  </section>
);
}
