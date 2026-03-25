// script.js

let token = localStorage.getItem("beanToken");
let socket = io();
let currentOrders = [];

/* ===========================
   LOGIN
=========================== */
async function login() {
  const user = document.getElementById("user").value;
  const pass = document.getElementById("pass").value;

  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user, pass })
  });

  const data = await res.json();
  if (!data.success) return alert("Invalid login");

  localStorage.setItem("beanToken", data.token);
  window.location = "/bean.html";
}

/* ===========================
   CUSTOMER MENU
=========================== */
async function loadMenu() {
  const menuDiv = document.getElementById("menu");
  if (!menuDiv) return;

  const res = await fetch("/items");
  const items = await res.json();

  const grouped = {};
  items.forEach(i => {
    if (!i.visible || i.stock === 0) return;
    if (!grouped[i.category]) grouped[i.category] = [];
    grouped[i.category].push(i);
  });

  menuDiv.innerHTML = Object.keys(grouped).map(cat => `
    <h2 class="categoryTitle">${cat}</h2>
    ${grouped[cat].map(i => `
      <div class="glass neon">
        <img src="${i.image || 'images/placeholder.png'}" class="itemImg">
        <h3>${i.name} - $${i.price}</h3>
        <input type="number" id="qty-${i._id}" min="0" max="${i.stock}">
      </div>
    `).join("")}
  `).join("");
}

/* ===========================
   PLACE ORDER
=========================== */
document.getElementById("placeOrder")?.addEventListener("click", async () => {
  const res = await fetch("/items");
  const items = await res.json();

  const orderItems = items
    .filter(i => document.getElementById(`qty-${i._id}`))
    .map(i => ({
      id: i._id,
      name: i.name,
      qty: Number(document.getElementById(`qty-${i._id}`).value)
    }))
    .filter(i => i.qty > 0);

  if (!orderItems.length) return alert("Add something first");

  const payload = {
    items: orderItems,
    priority: document.getElementById("prioritySelect").value,
    notes: document.getElementById("orderNotes").value
  };

  const order = await fetch("/order", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).then(r => r.json());

  alert("Order placed! #" + order.id);

  document.getElementById("qrcode").innerHTML = "";
  new QRCode(document.getElementById("qrcode"), {
    text: `/track/${order.id}`,
    width: 160,
    height: 160
  });
});

/* ===========================
   KDS DASHBOARD
=========================== */
async function loadInitialOrders() {
  const res = await fetch("/orders");
  currentOrders = await res.json();
  renderOrders();
}

function renderOrders() {
  ["New", "Preparing", "Ready", "Completed"].forEach(status => {
    document.getElementById(`col-${status}`).innerHTML = "";
  });

  currentOrders.forEach(order => {
    const overdue = (Date.now() - new Date(order.createdAt)) > 5 * 60 * 1000;
    const card = `
      <div class="glass neon order-card ${overdue ? "overdue" : ""}"
           draggable="true"
           data-id="${order.id}"
           data-status="${order.status}">
        <h3>Order #${order.id}</h3>
        <p>${order.items.map(i => `${i.qty}× ${i.name}`).join("<br>")}</p>
        ${order.notes ? `<p><b>Notes:</b> ${order.notes}</p>` : ""}
        <p>Priority: <b>${order.priority}</b></p>
        <p>Waiting: <span id="age-${order.id}"></span></p>
      </div>
    `;
    document.getElementById(`col-${order.status}`).innerHTML += card;
  });
}

/* ===========================
   DRAG & DROP
=========================== */
document.addEventListener("dragstart", e => {
  if (e.target.classList.contains("order-card")) {
    e.target.classList.add("dragging");
    e.dataTransfer.setData("id", e.target.dataset.id);
  }
});

document.addEventListener("dragend", e => {
  e.target.classList.remove("dragging");
});

document.querySelectorAll(".order-list").forEach(col => {
  col.addEventListener("dragover", e => {
    e.preventDefault();
    col.classList.add("drag-over");
  });

  col.addEventListener("dragleave", () => col.classList.remove("drag-over"));

  col.addEventListener("drop", async e => {
    col.classList.remove("drag-over");
    const id = e.dataTransfer.getData("id");
    const newStatus = col.parentElement.dataset.status;

    await fetch(`/orders/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token
      },
      body: JSON.stringify({ status: newStatus })
    });

    loadInitialOrders();
  });
});

/* ===========================
   WEBSOCKET UPDATES
=========================== */
socket.on("orders-updated", order => {
  const idx = currentOrders.findIndex(o => o.id === order.id);
  if (idx === -1) currentOrders.push(order);
  else currentOrders[idx] = order;
  renderOrders();
});

socket.on("items-updated", () => {
  loadMenu();
});

/* ===========================
   TRACKING PAGE
=========================== */
async function track() {
  const id = document.getElementById("trackId").value;
  const res = await fetch(`/track/${id}`);
  const box = document.getElementById("trackResult");

  if (!res.ok) {
    box.style.display = "block";
    box.innerHTML = "<p>Order not found.</p>";
    return;
  }

  const data = await res.json();
  box.style.display = "block";
  box.innerHTML = `
    <h3>Order #${data.id}</h3>
    <p>Status: <b>${data.status}</b></p>
    <p>Priority: ${data.priority}</p>
  `;

  socket.emit("track-order", id);
  socket.on("order-updated", o => {
    if (o.id == id) {
      box.innerHTML = `
        <h3>Order #${o.id}</h3>
        <p>Status: <b>${o.status}</b></p>
        <p>Priority: ${o.priority}</p>
      `;
    }
  });
}

/* ===========================
   LIVE BOARD
=========================== */
if (document.getElementById("liveList")) {
  let liveOrders = [];

  async function loadLive() {
    const res = await fetch("/orders");
    liveOrders = await res.json();
    renderLive();
  }

  function renderLive() {
    document.getElementById("liveList").innerHTML = liveOrders
      .filter(o => o.status !== "Completed")
      .map(o => `
        <div class="glass neon">
          <h3>Order #${o.id}</h3>
          <p>Status: <b>${o.status}</b></p>
        </div>
      `).join("");
  }

  socket.on("orders-updated", order => {
    const idx = liveOrders.findIndex(o => o.id === order.id);
    if (idx === -1) liveOrders.push(order);
    else liveOrders[idx] = order;
    renderLive();
  });

  loadLive();
}

/* ===========================
   WIDGET
=========================== */
if (document.getElementById("widgetBar")) {
  let wOrders = [];

  async function loadWidget() {
    const res = await fetch("/orders");
    wOrders = await res.json();
    renderWidget();
  }

  function renderWidget() {
    document.getElementById("wQueue").textContent =
      "Queue: " + wOrders.filter(o => o.status === "New").length;

    document.getElementById("wPreparing").textContent =
      "Preparing: " + wOrders.filter(o => o.status === "Preparing").length;

    document.getElementById("wReady").textContent =
      "Ready: " + wOrders.filter(o => o.status === "Ready").length;
  }

  socket.on("orders-updated", order => {
    const idx = wOrders.findIndex(o => o.id === order.id);
    if (idx === -1) wOrders.push(order);
    else wOrders[idx] = order;
    renderWidget();
  });

  loadWidget();
}

/* ===========================
   ITEM MANAGEMENT
=========================== */
async function loadItems() {
  const list = document.getElementById("itemList");
  if (!list) return;

  const res = await fetch("/items", { headers: { Authorization: token } });
  const items = await res.json();

  list.innerHTML = items.map(i => `
    <div class="glass neon">
      <h3>${i.name}</h3>
      <p>Price: $${i.price}</p>
      <p>Stock: ${i.stock}</p>
      <button onclick="updateItem('${i._id}')">Update</button>
      <button onclick="deleteItem('${i._id}')">Delete</button>
    </div>
  `).join("");
}

async function addItem() {
  const name = itemName.value;
  const price = Number(itemPrice.value);
  const stock = Number(itemStock.value);
  const category = itemCategory.value;
  const image = itemImage.value;

  await fetch("/items", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ name, price, stock, category, image })
  });

  loadItems();
}

async function updateItem(id) {
  const price = prompt("New price:");
  const stock = prompt("New stock:");

  await fetch(`/items/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", Authorization: token },
    body: JSON.stringify({ price, stock })
  });

  loadItems();
}

async function deleteItem(id) {
  await fetch(`/items/${id}`, {
    method: "DELETE",
    headers: { Authorization: token }
  });

  loadItems();
}

/* ===========================
   INIT
=========================== */
loadMenu();
loadInitialOrders();
loadItems();