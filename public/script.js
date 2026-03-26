const socket = io();

let menu = [];
let cart = [];

async function loadMenu() {
  const res = await fetch("/items");
  menu = await res.json();
  renderMenu();
}

function renderMenu() {
  const list = document.getElementById("menu-list");
  list.innerHTML = "";

  menu.forEach(item => {
    if (item.soldOut) return;

    const div = document.createElement("div");
    div.className = "menu-item";

    div.innerHTML = `
      ${item.image ? `<img src="${item.image}" class="menu-img">` : ""}
      <div class="menu-item-name">${item.name}</div>
      <div class="menu-item-meta">
        <span>$${item.price.toFixed(2)}</span>
        <span>${item.stock === -1 ? "∞" : item.stock}</span>
      </div>
    `;

    div.onclick = () => addToCart(item);
    list.appendChild(div);
  });
}

function addToCart(item) {
  const existing = cart.find(i => i.id === item._id);

  if (existing) {
    existing.qty++;
  } else {
    cart.push({
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.image,
      qty: 1
    });
  }

  renderCart();
}

function renderCart() {
  const container = document.getElementById("order-items");
  container.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    total += item.price * item.qty;

    const row = document.createElement("div");
    row.className = "order-line";

    row.innerHTML = `
      <div class="order-line-main">
        <span class="order-line-name">${item.name}</span>
        <span class="order-line-meta">$${item.price.toFixed(2)}</span>
      </div>
      <div class="order-line-qty">${item.qty}×</div>
    `;

    container.appendChild(row);
  });

  document.getElementById("order-total-label").textContent = `$${total.toFixed(2)}`;
}

document.getElementById("place-order").onclick = async () => {
  if (cart.length === 0) return;

  const body = {
    items: cart.map(i => ({ id: i.id, qty: i.qty })),
    priority: document.getElementById("priority").value,
    notes: document.getElementById("notes").value.trim()
  };

  const res = await fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  const order = await res.json();

  generateQR(order.id);

  cart = [];
  renderCart();
};

function generateQR(id) {
  const container = document.getElementById("qr-container");
  container.innerHTML = "";

  const img = document.createElement("img");
  img.src = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${location.origin}/track.html?id=${id}`;

  container.appendChild(img);
}

socket.on("items-updated", loadMenu);

loadMenu();
