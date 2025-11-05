import React from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

export default function BookDetail({ books, loading }) {
  const { id } = useParams();
  const navigate = useNavigate();

  if (loading) return <div className="center">Loading…</div>;

  const book = (books || []).find((b) => String(b.id) === String(id));

  if (!book) {
    return (
      <div className="center">
        <p>Book not found.</p>
        <button onClick={() => navigate(-1)} className="btn">Go back</button>
        <Link to="/" className="btn-link">Home</Link>
      </div>
    );
  }

  return (
    <div className="detail">
      <button onClick={() => navigate(-1)} className="btn small">← Back</button>
      <div className="detail-grid">
        <img className="detail-cover" src={book.cover} alt={book.title} />
        <div>
          <h2>{book.title}</h2>
          <p className="author">by {book.author}</p>
          <p className="rating">⭐ {book.rating}</p>
          <h3>Description</h3>
          <p>{book.description}</p>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <Link to="/" className="link">← Back to list</Link>
      </div>
    </div>
  );
}
