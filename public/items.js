// items.js
const token = localStorage.getItem("bean-token");
if (!token) window.location.href = "login.html";
const socketItems = io();
const tableBody = document.querySelector("#items-table tbody");
let selectedItem = null;

async function loadItems() {
  try {
    const res = await fetch("/items");
    const items = await res.json();
    renderItems(items);
  } catch (e) { console.error(e); }
}

function renderItems(items) {
  tableBody.innerHTML = "";
  items.forEach(item => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${item.image?`<img src="${item.image}" class="item-thumb">`:""} ${item.name}</td>
      <td>${item.category||"-"}</td>
      <td>$${Number(item.price||0).toFixed(2)}</td>
      <td>${item.stock===-1?"∞":item.stock}</td>
      <td>${item.soldOut?`<span class="chip">Sold Out</span>`:""}</td>
      <td><button class="btn btn-ghost" data-id="${item._id}">Edit</button></td>
    `;
    tr.querySelector("button").onclick = () => selectItem(item);
    tableBody.appendChild(tr);
  });
}

function selectItem(item) {
  selectedItem = item;
  document.getElementById("item-name").value = item.name || "";
  document.getElementById("item-category").value = item.category || "";
  document.getElementById("item-price").value = item.price || 0;
  document.getElementById("item-stock").value = item.stock || 0;
  const preview = document.getElementById("item-image-preview");
  preview.src = item.image || "";
  preview.style.display = item.image ? "block" : "none";
  document.getElementById("item-image").value = "";
}

document.getElementById("add-item-btn").onclick = resetForm;
document.getElementById("fab-add").onclick = resetForm;

function resetForm() {
  selectedItem = null;
  document.getElementById("item-name").value = "";
  document.getElementById("item-category").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-stock").value = "";
  document.getElementById("item-image").value = "";
  const preview = document.getElementById("item-image-preview");
  preview.src = "";
  preview.style.display = "none";
}

document.getElementById("item-image").onchange = e => {
  const file = e.target.files[0];
  if (!file) return;
  const preview = document.getElementById("item-image-preview");
  preview.src = URL.createObjectURL(file);
  preview.style.display = "block";
};

async function uploadImage(file) {
  const form = new FormData();
  form.append("image", file);
  const res = await fetch("/upload", { method: "POST", body: form });
  const data = await res.json();
  return data.url;
}

document.getElementById("save-item").onclick = async () => {
  const body = {
    name: document.getElementById("item-name").value.trim(),
    category: document.getElementById("item-category").value.trim(),
    price: Number(document.getElementById("item-price").value || 0),
    stock: Number(document.getElementById("item-stock").value || 0)
  };

  const file = document.getElementById("item-image").files[0];
  if (file) body.image = await uploadImage(file);
  else if (selectedItem) body.image = selectedItem.image;

  if (selectedItem) {
    await fetch(`/items/${selectedItem._id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  } else {
    await fetch("/items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  }
  loadItems();
};

document.getElementById("delete-item").onclick = async () => {
  if (!selectedItem) return;
  await fetch(`/items/${selectedItem._id}`, { method: "DELETE" });
  selectedItem = null;
  loadItems();
};

socketItems.on("items-updated", loadItems);
loadItems();
