import { useState } from "react"
import { setTheme, setAccent } from "./theme"

export default function ThemeControls() {
  const [color, setColor] = useState("#3b82f6")

  return (
    <div style={{
      display: "flex",
      gap: 10,
      marginBottom: 20
    }}>
      <button onClick={() => setTheme("dark")}>Dark</button>
      <button onClick={() => setTheme("light")}>Light</button>

      <input
        type="color"
        value={color}
        onChange={e => {
          setColor(e.target.value)
          setAccent(e.target.value)
        }}
      />
    </div>
  )
}