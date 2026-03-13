import { useState } from "react"

export default function LoginModal() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const login = () => {
    if (email === "Paigeswain3000@gmail.com" && password === "Paige") {
      window.location = "/family-dashboard"
    }
  }

  return (
    <div className="login-modal">
      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />
      <input
        type="password"
        placeholder="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={login}>Login</button>
    </div>
  )
}
