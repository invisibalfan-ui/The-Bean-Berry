// mobile.js - helpers for mobile nav, FAB, and KDS swipe events
document.addEventListener("DOMContentLoaded", () => {
  // Active state for mobile nav
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".mobile-nav-item").forEach(a => {
    const href = a.getAttribute("href") || "";
    if (href.endsWith(path) || (path === "" && href.endsWith("index.html"))) a.classList.add("active");
  });

  // FAB mapping
  const fab = document.getElementById("fab-add");
  if (fab) {
    fab.addEventListener("click", () => {
      const addBtn = document.getElementById("add-item-btn") || document.getElementById("place-order");
      if (addBtn) addBtn.click();
    });
  }

  // Attach swipe event delegation for dynamic KDS cards
  document.addEventListener("touchstart", e => {
    const card = e.target.closest?.(".order-card");
    if (!card) return;
    card.dataset._startX = e.touches[0].clientX;
  }, {passive:true});

  document.addEventListener("touchend", e => {
    const card = e.target.closest?.(".order-card");
    if (!card || !card.dataset._startX) return;
    const startX = Number(card.dataset._startX);
    const endX = e.changedTouches[0].clientX;
    const diff = endX - startX;
    card.dataset._startX = "";
    if (diff > 80) card.dispatchEvent(new CustomEvent("swipe-right",{bubbles:true,detail:{id:card.dataset.orderId}}));
    else if (diff < -80) card.dispatchEvent(new CustomEvent("swipe-left",{bubbles:true,detail:{id:card.dataset.orderId}}));
  }, {passive:true});
});
