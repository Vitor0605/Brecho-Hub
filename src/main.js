import './style.css';

const products = [
  { id: 1, title: 'Camisa polo azul', category: 'Uniformes', price: 28, condition: 'Muito bom', school: 'Colégio Horizonte', image: 'https://images.unsplash.com/photo-1564584217132-2271feaeb3c5?auto=format&fit=crop&w=700&q=80', color: 'azul' },
  { id: 2, title: 'Mochila lilás', category: 'Materiais', price: 45, condition: 'Como nova', school: 'Retirada no Centro', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=80', color: 'lilas' },
  { id: 3, title: 'Kit de livros 7º ano', category: 'Materiais', price: 65, condition: 'Bom', school: 'Sistema Anglo', image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=700&q=80', color: 'amarelo' },
  { id: 4, title: 'Tênis escolar preto', category: 'Calçados', price: 38, condition: 'Muito bom', school: 'Tam. 35', image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=700&q=80', color: 'preto' }
];

const productGrid = document.querySelector('#productGrid');
const salesGrid = document.querySelector('#salesGrid');
const salesEmpty = document.querySelector('#salesEmpty');
const toast = document.querySelector('#toast');
const money = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
let selectedFilter = 'Todos';
let favorites = JSON.parse(localStorage.getItem('reveste-favorites') || '[]');
let ownSales = JSON.parse(localStorage.getItem('reveste-sales') || '[]');

function card(item, own = false) {
  return `<article class="product-card ${own ? 'own-card' : ''}">
    <div class="product-image ${item.color || ''}"><img src="${item.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=700&q=80'}" alt="${item.title}" /><span class="condition">${item.condition}</span>${!own ? `<button class="heart ${favorites.includes(item.id) ? 'saved' : ''}" data-id="${item.id}" aria-label="Favoritar ${item.title}">♥</button>` : '<span class="published">Publicado</span>'}</div>
    <div class="product-info"><div><p class="product-category">${item.category}</p><h3>${item.title}</h3></div><strong>${money.format(item.price)}</strong></div>
    <div class="product-meta"><span>⌖ ${item.school || item.location || 'A combinar'}</span>${own ? `<span>${item.phone}</span>` : '<button class="chat-button" type="button" data-message="Olá! Tenho interesse em: ' + item.title + '">Tenho interesse</button>'}</div>
  </article>`;
}

function renderProducts() {
  const visible = selectedFilter === 'Todos' ? products : products.filter((p) => p.category === selectedFilter);
  productGrid.innerHTML = visible.map((item) => card(item)).join('');
}

function renderSales() {
  salesEmpty.hidden = ownSales.length > 0;
  salesGrid.innerHTML = ownSales.map((item) => card(item, true)).join('');
}

function setToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

document.querySelectorAll('.filter').forEach((button) => button.addEventListener('click', () => {
  selectedFilter = button.dataset.filter;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item === button));
  renderProducts();
}));

document.querySelectorAll('[data-category]').forEach((link) => link.addEventListener('click', () => {
  const wanted = link.dataset.category;
  selectedFilter = wanted;
  document.querySelectorAll('.filter').forEach((item) => item.classList.toggle('active', item.dataset.filter === wanted));
}));

productGrid.addEventListener('click', (event) => {
  const heart = event.target.closest('.heart');
  const interest = event.target.closest('.chat-button');
  if (heart) {
    const id = Number(heart.dataset.id);
    favorites = favorites.includes(id) ? favorites.filter((favorite) => favorite !== id) : [...favorites, id];
    localStorage.setItem('reveste-favorites', JSON.stringify(favorites));
    document.querySelector('#favoriteCount').textContent = favorites.length;
    renderProducts();
  }
  if (interest) setToast(`${interest.dataset.message} Em breve você poderá chamar o vendedor pelo WhatsApp.`);
});

document.querySelector('#sellForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(event.currentTarget));
  const sale = { id: Date.now(), title: data.title, category: data.category, price: Number(data.price), condition: data.condition, description: data.description, seller: data.seller, phone: data.phone, location: data.location };
  ownSales = [sale, ...ownSales];
  localStorage.setItem('reveste-sales', JSON.stringify(ownSales));
  event.currentTarget.reset();
  renderSales();
  setToast('Seu anúncio foi publicado com sucesso!');
  document.querySelector('#minhas-vendas').scrollIntoView({ behavior: 'smooth' });
});

const themeToggle = document.querySelector('#themeToggle');
const savedTheme = localStorage.getItem('reveste-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('reveste-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
});

document.querySelector('#favoriteCount').textContent = favorites.length;
renderProducts();
renderSales();
