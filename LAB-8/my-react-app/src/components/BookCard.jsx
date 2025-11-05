import React from "react";

export default function BookCard({ book }) {
  return (
    <article className="card">
      <img className="cover" src={book.cover} alt={book.title} />
      <div className="card-body">
        <h3 className="title">{book.title}</h3>
        <p className="author">by {book.author}</p>
        <div className="meta">
          <span className="rating">⭐ {book.rating}</span>
        </div>
      </div>
    </article>
  );
}
