import Navbar from "../components/Navbar"
import SunflowerScene from "../components/SunflowerScene"
import LoginModal from "../components/LoginModal"

export default function Home() {
  return (
    <div className="page home">
      <Navbar />
      <header>
        <h1>PAIGE'S CORNER</h1>
        <p>Sunflowers, stories, and a place to gather the whole family.</p>
      </header>
      <section className="sunflower-scene">
        <SunflowerScene />
      </section>
      <section className="login-section">
        <LoginModal />
      </section>
    </div>
  )
}
