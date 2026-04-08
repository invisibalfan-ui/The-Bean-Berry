import { motion } from "framer-motion"

export default function Sidebar({ setPage }) {
  const items = ["Dashboard", "Orders", "Menu", "Customer"]

  return (
    <div style={{
      width: 220,
      height: "100vh",
      padding: 20,
      background: "rgba(0,0,0,0.6)",
      backdropFilter: "blur(12px)"
    }}>
      <h2>Bean & Berry</h2>

      {items.map(i => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          onClick={() => setPage(i)}
          style={{
            padding: 10,
            marginTop: 10,
            cursor: "pointer",
            borderRadius: 8
          }}
        >
          {i}
        </motion.div>
      ))}
    </div>
  )
}