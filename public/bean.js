const socket = io();
const columns = ["New", "Preparing", "Ready", "Completed"];

async function loadOrders() {
  const res = await fetch("/orders");
  const orders = await res.json();
  renderKDS(orders);
}

function renderKDS(orders) {
  const container = document.getElementById("kds-columns");
  container.innerHTML = "";

  columns.forEach(col => {
    const colDiv = document.createElement("div");
    colDiv.className = "kds-column";

    colDiv.innerHTML = `
      <div class="kds-column-title">
        <span>${col}</span>
      </div>
    `;

    orders
      .filter(o => o.status === col)
      .forEach(order => colDiv.appendChild(renderOrder(order)));

    container.appendChild(colDiv);
  });
}

function renderOrder(order) {
  const div = document.createElement("div");
  div.className = "order-card";

  div.innerHTML = `
    <div class="order-card-header">
      <span class="order-id">#${order.id}</span>
      <span class="order-meta">${order.priority}</span>
    </div>

    <div class="order-items">
      ${order.items.map(i => `${i.qty}× ${i.name || ""}`).join("<br>")}
    </div>

    <div class="order-actions">
      ${order.status !== "Preparing" ? `<button class="btn btn-ghost" data-next="Preparing">Prep</button>` : ""}
      ${order.status !== "Ready" ? `<button class="btn btn-ghost" data-next="Ready">Ready</button>` : ""}
      ${order.status !== "Completed" ? `<button class="btn btn-primary" data-next="Completed">Done</button>` : ""}
    </div>
  `;

  div.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => updateStatus(order.id, btn.dataset.next);
  });

  return div;
}

async function updateStatus(id, status) {
  await fetch(`/orders/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Authorization": localStorage.getItem("bean-token")
    },
    body: JSON.stringify({ status })
  });
}

socket.on("orders-updated", loadOrders);

loadOrders();
