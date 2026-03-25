const socket = io();

async function load() {
  const res = await fetch("/orders");
  const orders = await res.json();
  render(orders);
}

function render(orders) {
  const list = document.getElementById("live-list");
  list.innerHTML = "";

  orders
    .filter(o => o.status === "Ready" || o.status === "Preparing")
    .forEach(order => {
      const div = document.createElement("div");
      div.className = "live-card";
      div.textContent = `#${order.id} — ${order.status}`;
      list.appendChild(div);
    });
}

socket.on("orders-updated", load);

load();
