import React, { useEffect, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import BookList from "./components/BookList";
import BookDetail from "./components/BookDetail";

/**
 * App.jsx
 * - Loads book data (mock fetch from /data/books.json)
 * - Provides routes:
 *    /         -> BookList (passes books via props)
 *    /book/:id -> BookDetail (reads id via useParams and receives books as prop)
 */

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load books (simulate API)
  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch("/data/books.json");
        const data = await res.json();
        if (!cancelled) {
          setBooks(data);
        }
      } catch (err) {
        console.error("Failed to load books", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <Link to="/" className="brand">📚 Book Explorer</Link>
      </header>

      <main className="container">
        <Routes>
          <Route
            path="/"
            element={<BookList books={books} loading={loading} />}
          />
          <Route
            path="/book/:id"
            element={<BookDetail books={books} loading={loading} />}
          />
        </Routes>
      </main>

      <footer className="footer">
        <small>Book Explorer — demo</small>
      </footer>
    </div>
  );
}
