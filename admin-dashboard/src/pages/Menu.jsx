import React, { useEffect, useState } from "react";
import axios from "axios";
import DashboardLayout from "../components/DashboardLayout";

const Menu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});
  const token = localStorage.getItem("jwtToken");

  useEffect(() => {
    fetchMenu();
  }, []);

  const fetchMenu = async () => {
    const res = await axios.get(
      "https://the-bean-berry-production.up.railway.app/api/menu",
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setMenuItems(res.data);
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setFormData({ name: item.name, price: item.price, stock: item.stock, lowStockThreshold: item.lowStockThreshold });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (id) => {
    await axios.put(
      `https://the-bean-berry-production.up.railway.app/api/menu/${id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditingId(null);
    fetchMenu();
  };

  const handleDelete = async (id) => {
    await axios.delete(
      `https://the-bean-berry-production.up.railway.app/api/menu/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    fetchMenu();
  };

  return (
    <DashboardLayout user={{ username: "admin" }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menuItems.map((item) => (
          <div key={item._id} className="card bg-white shadow-md p-5 rounded-xl hover:shadow-xl transition">
            {editingId === item._id ? (
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
                <input
                  type="number"
                  name="lowStockThreshold"
                  value={formData.lowStockThreshold}
                  onChange={handleChange}
                  className="border rounded p-1"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => handleSave(item._id)} className="bg-green-500 text-white px-3 py-1 rounded">Save</button>
                  <button onClick={() => setEditingId(null)} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold">{item.name}</h2>
                <p className="text-gray-500 mt-1">Price: ${(item.price / 100).toFixed(2)}</p>
                <p className="text-gray-500">Stock: {item.stock}</p>
                <p className={`mt-1 font-medium ${item.stock < item.lowStockThreshold ? "text-red-500" : "text-green-500"}`}>
                  Low Stock: {item.lowStockThreshold}
                </p>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEditClick(item)} className="bg-blue-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(item._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default Menu;