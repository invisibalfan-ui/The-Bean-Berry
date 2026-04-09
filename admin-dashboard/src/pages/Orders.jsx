const handleDeleteOrder = async (id) => {
  await axios.delete(
    `https://the-bean-berry-production.up.railway.app/api/orders/${id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  fetchOrders();
};

// In table row
<td className="p-3 flex gap-2">
  <button onClick={() => handleDeleteOrder(order._id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
</td>