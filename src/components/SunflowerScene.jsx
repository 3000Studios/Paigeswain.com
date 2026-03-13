import { Canvas } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import { useRef } from "react"

function Sunflower() {
  const mesh = useRef()

  return (
    <mesh ref={mesh} position={[0, 0, 0]}>
      <circleGeometry args={[1, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  )
}

export default function SunflowerScene() {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 3, 3]} />
      <Sunflower />
      <OrbitControls />
    </Canvas>
  )
}
