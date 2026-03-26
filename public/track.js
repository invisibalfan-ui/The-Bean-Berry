// track.js
const socketTrack = io();
document.getElementById("track-btn").onclick = trackOrder;
document.getElementById("track-clear").onclick = () => {
  document.getElementById("track-id").value = "";
  document.getElementById("track-details").textContent = "Enter an order number to see details here.";
  document.getElementById("track-status-pill").style.display = "none";
  document.getElementById("track-error").style.display = "none";
};

async function trackOrder() {
  const id = document.getElementById("track-id").value.trim();
  if (!id) return;
  try {
    const res = await fetch(`/track/${encodeURIComponent(id)}`);
    const order = await res.json();
    if (order.error) {
      document.getElementById("track-error").style.display = "block";
      return;
    }
    document.getElementById("track-error").style.display = "none";
    render(order);
    socketTrack.emit("track-order", id);
  } catch (e) { console.error(e); document.getElementById("track-error").style.display = "block"; }
}

function render(order) {
  const pill = document.getElementById("track-status-pill");
  pill.textContent = order.status;
  pill.className = `status-pill ${order.status.toLowerCase()}`;
  pill.style.display = "inline-block";
  document.getElementById("track-details").innerHTML = `
    <div>Order #${order.id}</div>
    <div style="margin-top:6px;">
      ${order.items.map(i => `<div style="display:flex;align-items:center;gap:6px;">${i.image?`<img src="${i.image}" class="item-thumb">`:""}${i.qty}× ${i.name}</div>`).join("")}
    </div>
    <div style="margin-top:10px;color:var(--muted);font-size:12px;">Priority: ${order.priority}<br>Notes: ${order.notes||"None"}</div>
  `;
}

socketTrack.on("order-updated", render);
