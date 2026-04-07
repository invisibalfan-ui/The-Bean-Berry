import React from "react"
import Menu from "./Menu"
import Orders from "./Orders"

export default function App() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Snack Stand Admin</h1>
      <Menu />
      <Orders />
    </div>
  )
}