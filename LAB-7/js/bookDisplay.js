// js/bookDisplay.js
export async function loadBooks() {
  const response = await fetch('../data/books.json');
  const books = await response.json();
  return books;
}

export function renderBookList(books, onAddToCart) {
  const container = document.getElementById('book-list');
  container.innerHTML = '';

  books.forEach(book => {
    const card = document.createElement('div');
    card.className = 'book-card';

    card.innerHTML = `
      <h3>${book.title}</h3>
      <p><strong>Author:</strong> ${book.author}</p>
      <p><strong>Price:</strong> $${book.price.toFixed(2)}</p>
      <p><strong>Status:</strong> ${book.available ? '✅ In Stock' : '❌ Out of Stock'}</p>
      <button ${!book.available ? 'disabled' : ''} data-id="${book.id}">
        ${book.available ? 'Add to Cart' : 'Unavailable'}
      </button>
    `;

    const button = card.querySelector('button');
    button.addEventListener('click', () => onAddToCart(book));

    container.appendChild(card);
  });
}
