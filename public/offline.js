// offline.js
// Handles offline order queueing and auto-sync

export async function sendOrderWithOfflineSupport(payload) {
  try {
    const res = await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    return await res.json();
  } catch (err) {
    const queue = JSON.parse(localStorage.getItem("offlineOrders") || "[]");
    queue.push(payload);
    localStorage.setItem("offlineOrders", JSON.stringify(queue));
    alert("No connection. Order saved offline.");
  }
}

export async function syncOfflineOrders() {
  const queue = JSON.parse(localStorage.getItem("offlineOrders") || "[]");
  if (!queue.length) return;

  for (const payload of queue) {
    await fetch("/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  }

  localStorage.removeItem("offlineOrders");
  alert("Offline orders synced!");
}

window.addEventListener("online", syncOfflineOrders);