import { useEffect, useState } from "react"
import { API } from "./api"
import Card from "./Card"

export default function Menu() {
  const [items, setItems] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const load = async () => {
    const res = await API.get("/menu")
    setItems(res.data)
  }

  useEffect(() => { load() }, [])

  const addItem = async () => {
    await API.post("/menu", {
      name,
      price: Number(price),
      stock: Number(stock)
    })
    setName(""); setPrice(""); setStock("")
    load()
  }

  return (
    <Card>
      <h2>Menu</h2>

      <div style={{ display: "flex", gap: 10 }}>
        <input placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
        <input placeholder="Price" value={price} onChange={e=>setPrice(e.target.value)} />
        <input placeholder="Stock" value={stock} onChange={e=>setStock(e.target.value)} />

        <button onClick={addItem}>Add</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {items.map(i => (
          <div key={i._id} style={{
            display: "flex",
            justifyContent: "space-between",
            padding: 10,
            borderBottom: "1px solid rgba(255,255,255,0.05)"
          }}>
            <span>{i.name}</span>
            <span>${i.price} • {i.stock}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}