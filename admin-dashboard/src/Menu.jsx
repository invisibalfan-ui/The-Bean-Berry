import React, { useEffect, useState } from "react"
import { API } from "./api"

export default function Menu() {
  const [items, setItems] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  const load = async () => {
    const res = await API.get("/menu")
    setItems(res.data)
  }

  useEffect(() => {
    load()
  }, [])

  const addItem = async () => {
    await API.post("/menu", {
      name,
      price: Number(price),
      stock: Number(stock)
    })
    setName("")
    setPrice("")
    setStock("")
    load()
  }

  return (
    <div>
      <h2>Menu</h2>

      <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
      <input placeholder="Price" value={price} onChange={e => setPrice(e.target.value)} />
      <input placeholder="Stock" value={stock} onChange={e => setStock(e.target.value)} />

      <button onClick={addItem}>Add Item</button>

      {items.map(i => (
        <div key={i._id}>
          {i.name} - ${i.price} | Stock: {i.stock}
        </div>
      ))}
    </div>
  )
}