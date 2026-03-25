const socket = io();

document.getElementById("track-btn").onclick = trackOrder;
document.getElementById("track-clear").onclick = () => {
  document.getElementById("track-id").value = "";
  document.getElementById("track-details").textContent = "Enter an order number to see details here.";
  document.getElementById("track-status-pill").style.display = "none";
};

async function trackOrder() {
  const id = Number(document.getElementById("track-id").value);
  if (!id) return;

  const res = await fetch(`/track/${id}`);
  const order = await res.json();

  if (order.error) {
    document.getElementById("track-error").style.display = "block";
    return;
  }

  document.getElementById("track-error").style.display = "none";

  render(order);

  socket.emit("track-order", id);
}

function render(order) {
  const pill = document.getElementById("track-status-pill");
  pill.textContent = order.status;
  pill.className = `status-pill ${order.status.toLowerCase()}`;
  pill.style.display = "inline-block";

  document.getElementById("track-details").innerHTML = `
    <div>Order #${order.id}</div>
    <div style="margin-top:6px;">
      ${order.items.map(i => `${i.qty}× ${i.name}`).join("<br>")}
    </div>
    <div style="margin-top:10px;color:var(--text-soft);font-size:12px;">
      Priority: ${order.priority}<br>
      Notes: ${order.notes || "None"}
    </div>
  `;
}

socket.on("order-updated", render);
