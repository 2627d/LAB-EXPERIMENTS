// js/ui.js
export function renderCart(cart, onRemove) {
  const container = document.getElementById('cart-items');
  const totalEl = document.getElementById('total-price');
  container.innerHTML = '';

  if (cart.items.length === 0) {
    container.innerHTML = '<p>Your cart is empty.</p>';
  } else {
    cart.items.forEach(book => {
      const item = document.createElement('div');
      item.className = 'cart-item';
      item.innerHTML = `
        <span>${book.title} - $${book.price.toFixed(2)}</span>
        <button data-id="${book.id}">Remove</button>
      `;
      const removeBtn = item.querySelector('button');
      removeBtn.addEventListener('click', () => onRemove(book.id));
      container.appendChild(item);
    });
  }

  totalEl.textContent = cart.getTotal();
}
