import { useEffect, useState } from "react"
import { API } from "./api"
import { socket } from "./socket"
import Card from "./Card"

export default function Orders() {
  const [orders, setOrders] = useState([])

  const load = async () => {
    const res = await API.get("/orders")
    setOrders(res.data)
  }

  useEffect(() => {
    load()

    socket.on("newOrder", o => setOrders(prev => [o, ...prev]))
    socket.on("updateOrder", u =>
      setOrders(prev => prev.map(o => o._id === u._id ? u : o))
    )
  }, [])

  const update = async (id, status) => {
    await API.put(`/orders/${id}`, { status })
  }

  return (
    <Card>
      <h2>Orders</h2>

      {orders.map(o => (
        <div key={o._id} style={{
          padding: 12,
          marginBottom: 10,
          borderRadius: 10,
          background: "rgba(255,255,255,0.03)"
        }}>
          <strong>#{o.orderNumber}</strong> — {o.status}

          <div style={{ marginTop: 8 }}>
            <button onClick={()=>update(o._id,"preparing")}>Prep</button>
            <button onClick={()=>update(o._id,"ready")}>Ready</button>
          </div>
        </div>
      ))}
    </Card>
  )
}