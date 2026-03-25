const socket = io();

async function load() {
  const res = await fetch("/orders");
  const orders = await res.json();

  const ready = orders.filter(o => o.status === "Ready").length;
  const prep = orders.filter(o => o.status === "Preparing").length;

  document.getElementById("widget-status-pill").textContent = "Online";
  document.getElementById("widget-body").innerHTML = `
    <div>Preparing: ${prep}</div>
    <div>Ready: ${ready}</div>
  `;
}

socket.on("orders-updated", load);

load();
