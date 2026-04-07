import React, { useEffect, useState } from "react"
import { API } from "./api"
import { socket } from "./socket"

export default function Orders() {
  const [orders, setOrders] = useState([])

  const load = async () => {
    const res = await API.get("/orders")
    setOrders(res.data)
  }

  useEffect(() => {
    load()

    socket.on("newOrder", order => {
      setOrders(prev => [order, ...prev])
    })

    socket.on("updateOrder", updated => {
      setOrders(prev =>
        prev.map(o => (o._id === updated._id ? updated : o))
      )
    })
  }, [])

  const updateStatus = async (id, status) => {
    await API.put(`/orders/${id}`, { status })
  }

  return (
    <div>
      <h2>Orders</h2>

      {orders.map(o => (
        <div key={o._id}>
          <strong>#{o.orderNumber}</strong> - {o.status}

          <button onClick={() => updateStatus(o._id, "preparing")}>
            Prep
          </button>

          <button onClick={() => updateStatus(o._id, "ready")}>
            Ready
          </button>
        </div>
      ))}
    </div>
  )
}