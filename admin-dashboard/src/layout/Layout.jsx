import Sidebar from "./Sidebar"

export default function Layout({ children, setPage }) {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar setPage={setPage} />

      <div style={{ flex: 1, padding: 20 }}>
        {children}
      </div>
    </div>
  )
}