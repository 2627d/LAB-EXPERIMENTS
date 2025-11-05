// js/main.js
import { loadBooks, renderBookList } from './bookDisplay.js';
import { Cart } from './cart.js';
import { renderCart } from './ui.js';

const cart = new Cart();

// Load books and display them
(async function init() {
  const books = await loadBooks();
  renderBookList(books, handleAddToCart);
  renderCart(cart, handleRemoveFromCart);
})();

function handleAddToCart(book) {
  cart.addBook(book);
  renderCart(cart, handleRemoveFromCart);
}

function handleRemoveFromCart(bookId) {
  cart.removeBook(bookId);
  renderCart(cart, handleRemoveFromCart);
}

// Checkout button behavior
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.items.length === 0) {
    alert('Your cart is empty!');
  } else {
    alert(`Proceeding to checkout. Total: $${cart.getTotal()}`);
  }
});
