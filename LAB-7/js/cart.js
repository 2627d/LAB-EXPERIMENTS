// js/cart.js
export class Cart {
  constructor() {
    this.items = [];
  }

  addBook(book) {
    const existing = this.items.find(b => b.id === book.id);
    if (!existing) {
      this.items.push(book);
    }
  }

  removeBook(bookId) {
    this.items = this.items.filter(b => b.id !== bookId);
  }

  getTotal() {
    return this.items.reduce((sum, b) => sum + b.price, 0).toFixed(2);
  }
}
