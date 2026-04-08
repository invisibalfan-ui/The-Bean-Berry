import { useState } from "react"
import Layout from "./layout/Layout"
import Dashboard from "./pages/Dashboard"
import Orders from "./pages/Orders"
import Menu from "./pages/Menu"
import Login from "./pages/Login"
import Customer from "./pages/Customer"
import { motion } from "framer-motion"

export default function App() {
  const [page, setPage] = useState("Dashboard")
  const [loggedIn, setLoggedIn] = useState(false)

  if (!loggedIn) return <Login setLoggedIn={setLoggedIn} />

  const render = () => {
    switch(page) {
      case "Dashboard": return <Dashboard />
      case "Orders": return <Orders />
      case "Menu": return <Menu />
      case "Customer": return <Customer />
    }
  }

  return (
    <Layout setPage={setPage}>
      <motion.div
        key={page}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {render()}
      </motion.div>
    </Layout>
  )
}