import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { useAuth } from "../hooks/useAuth";

const allowedUsers = ["Dad", "Jerica", "Jadon", "Paige"];

export default function Login() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("");

  const handleLogin = async (name) => {
    setStatus("Sending sunshine...");
    try {
      await signIn(name);
      navigate("/family");
    } catch (error) {
      setStatus(error.message || "Login failed.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky to-cream text-slate-900">
      <Nav />
      <main className="flex min-h-[80vh] flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        <div className="max-w-xl rounded-3xl border border-white/60 bg-white/80 p-8 shadow-2xl">
          <p className="text-xs uppercase tracking-[0.5em] text-slate-500">Family login</p>
          <h1 className="mt-2 text-4xl font-extrabold text-forest">Choose your name</h1>
          <p className="mt-3 text-sm text-slate-600">
            Tap your name to enter the private portal. No passwords required—just love and sunshine.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {allowedUsers.map((name) => (
              <button
                key={name}
                onClick={() => handleLogin(name)}
                className="rounded-full border border-forest px-5 py-2 text-xs uppercase tracking-[0.4em] text-forest hover:bg-sunflower/80 hover:text-white"
              >
                {name}
              </button>
            ))}
          </div>
          {status && <p className="mt-4 text-sm text-forest">{status}</p>}
        </div>
      </main>
    </div>
  );
}
