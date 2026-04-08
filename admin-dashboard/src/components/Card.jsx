export default function Card({ children }) {
  return (
    <div style={{
      background: "rgba(17, 24, 39, 0.6)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255,255,255,0.1)",
      borderRadius: 16,
      padding: 20,
      marginBottom: 20
    }}>
      {children}
    </div>
  )
}