import { useState } from "react"
import { API } from "../api"

export default function Login({ setLoggedIn }) {
  const [user, setUser] = useState("")
  const [pass, setPass] = useState("")

  const login = async () => {
    const res = await API.post("/auth/login", {
      username: user,
      password: pass
    })

    localStorage.setItem("token", res.data.token)
    setLoggedIn(true)
  }

  return (
    <div>
      <input onChange={e=>setUser(e.target.value)} />
      <input type="password" onChange={e=>setPass(e.target.value)} />
      <button onClick={login}>Login</button>
    </div>
  )
}