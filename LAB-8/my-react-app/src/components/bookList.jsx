import React from "react";
import BookCard from "./BookCard";
import { Link } from "react-router-dom";

export default function BookList({ books, loading }) {
  if (loading) return <div className="center">Loading books…</div>;
  if (!books || books.length === 0) return <div className="center">No books available.</div>;

  return (
    <div>
      <h2 className="section-title">Available Books</h2>
      <div className="grid">
        {books.map((b) => (
          <Link key={b.id} to={`/book/${b.id}`} className="card-link">
            <BookCard book={b} />
          </Link>
        ))}
      </div>
    </div>
  );
}
