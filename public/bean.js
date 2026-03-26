// bean.js
const socketKDS = io();
const stages = ["New","Preparing","Ready","Completed"];

async function loadOrders() {
  try {
    const res = await fetch("/orders");
    const orders = await res.json();
    renderKDS(orders);
  } catch (e) { console.error(e); }
}

function renderKDS(orders) {
  const container = document.getElementById("kds-columns");
  container.innerHTML = "";
  stages.forEach(stage => {
    const col = document.createElement("div");
    col.className = "kds-column";
    col.innerHTML = `<div class="kds-column-title"><span>${stage}</span></div>`;
    orders.filter(o => o.status === stage).forEach(order => col.appendChild(renderOrder(order)));
    container.appendChild(col);
  });
}

function renderOrder(order) {
  const div = document.createElement("div");
  div.className = "order-card";
  div.dataset.orderId = order.id;
  div.innerHTML = `
    <div class="order-card-header"><span class="order-id">#${order.id}</span><span class="order-meta">${order.priority}</span></div>
    <div class="order-items">${order.items.map(i => `<div style="display:flex;align-items:center;gap:8px;">${i.image?`<img src="${i.image}" class="item-thumb">`:""}${i.qty}× ${i.name}</div>`).join("")}</div>
    <div class="order-actions">
      ${order.status !== "Preparing" ? `<button class="btn btn-ghost" data-next="Preparing">Prep</button>` : ""}
      ${order.status !== "Ready" ? `<button class="btn btn-ghost" data-next="Ready">Ready</button>` : ""}
      ${order.status !== "Completed" ? `<button class="btn btn-primary" data-next="Completed">Done</button>` : ""}
    </div>
  `;
  div.querySelectorAll("button").forEach(btn => btn.onclick = () => updateStatus(order.id, btn.dataset.next));
  // enable swipe via mobile.js events (cards already wired there)
  div.addEventListener("swipe-left", () => moveOrder(order, +1));
  div.addEventListener("swipe-right", () => moveOrder(order, -1));
  return div;
}

async function updateStatus(id, status) {
  await fetch(`/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
}

function moveOrder(order, direction) {
  const idx = stages.indexOf(order.status);
  const next = stages[idx + direction];
  if (!next) return;
  updateStatus(order.id, next);
}

socketKDS.on("orders-updated", loadOrders);
loadOrders();
