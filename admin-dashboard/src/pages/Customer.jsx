import { useEffect, useState } from "react"
import { API } from "../api"

export default function Customer() {
  const [items, setItems] = useState([])
  const [cart, setCart] = useState([])

  useEffect(() => {
    API.get("/menu").then(res => setItems(res.data))
  }, [])

  const add = item => {
    setCart([...cart, item])
  }

  const order = async () => {
    const total = cart.reduce((a, b) => a + b.price, 0)

    await API.post("/orders", {
      items: cart,
      total
    })

    setCart([])
    alert("Order placed!")
  }

  return (
    <div>
      <h2>Order Food</h2>

      {items.map(i => (
        <div key={i._id}>
          {i.name} - ${i.price}
          <button onClick={() => add(i)}>Add</button>
        </div>
      ))}

      <button onClick={order}>Checkout</button>
    </div>
  )
}