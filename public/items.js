const token = localStorage.getItem("bean-token");
if (!token) window.location.href = "login.html";

const socket = io();
const tableBody = document.querySelector("#items-table tbody");

let selectedItem = null;

async function loadItems() {
  const res = await fetch("/items");
  const items = await res.json();
  renderItems(items);
}

function renderItems(items) {
  tableBody.innerHTML = "";

  items.forEach(item => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${item.name}</td>
      <td>${item.category || "-"}</td>
      <td>$${item.price.toFixed(2)}</td>
      <td>${item.stock === -1 ? "∞" : item.stock}</td>
      <td>
        ${item.soldOut ? `<span class="tag">Sold Out</span>` : ""}
      </td>
      <td>
        <button class="btn btn-ghost" data-id="${item._id}">Edit</button>
      </td>
    `;

    tr.querySelector("button").onclick = () => selectItem(item);
    tableBody.appendChild(tr);
  });
}

function selectItem(item) {
  selectedItem = item;

  document.getElementById("item-name").value = item.name;
  document.getElementById("item-category").value = item.category || "";
  document.getElementById("item-price").value = item.price;
  document.getElementById("item-stock").value = item.stock;
}

document.getElementById("add-item-btn").onclick = () => {
  selectedItem = null;

  document.getElementById("item-name").value = "";
  document.getElementById("item-category").value = "";
  document.getElementById("item-price").value = "";
  document.getElementById("item-stock").value = "";
};

document.getElementById("save-item").onclick = async () => {
  const body = {
    name: document.getElementById("item-name").value.trim(),
    category: document.getElementById("item-category").value.trim(),
    price: Number(document.getElementById("item-price").value),
    stock: Number(document.getElementById("item-stock").value)
  };

  if (selectedItem) {
    await fetch(`/items/${selectedItem._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(body)
    });
  } else {
    await fetch("/items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      },
      body: JSON.stringify(body)
    });
  }

  loadItems();
};

document.getElementById("delete-item").onclick = async () => {
  if (!selectedItem) return;

  await fetch(`/items/${selectedItem._id}`, {
    method: "DELETE",
    headers: { "Authorization": token }
  });

  selectedItem = null;
  loadItems();
};

socket.on("items-updated", loadItems);

loadItems();
