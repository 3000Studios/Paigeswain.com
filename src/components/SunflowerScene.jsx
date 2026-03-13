import { Stars } from "@react-three/drei"
import { Canvas, useFrame } from "@react-three/fiber"
import { useEffect, useMemo, useRef } from "react"
import * as THREE from "three"

const lightingModes = {
  morning: {
    sky: "#8fcffd",
    fog: "#dff5ff",
    ambient: 1.15,
    directional: "#fff2ab",
    flower: "#f6c551",
    center: "#68411b",
    accent: "#ffffff",
    field: "#7fc37e",
    stars: false,
    fireflies: false,
  },
  afternoon: {
    sky: "#f7c879",
    fog: "#fff1d5",
    ambient: 1,
    directional: "#ffe0a3",
    flower: "#ffbf3c",
    center: "#70411d",
    accent: "#fff7dd",
    field: "#78af57",
    stars: false,
    fireflies: false,
  },
  sunset: {
    sky: "#ee8f55",
    fog: "#ffd8c0",
    ambient: 0.92,
    directional: "#ffad75",
    flower: "#ffcf61",
    center: "#6c3a18",
    accent: "#ffe7d3",
    field: "#5f8a48",
    stars: false,
    fireflies: false,
  },
  night: {
    sky: "#10213d",
    fog: "#142648",
    ambient: 0.45,
    directional: "#89aef8",
    flower: "#f8ce64",
    center: "#5d3618",
    accent: "#a6d7ff",
    field: "#274a32",
    stars: true,
    fireflies: true,
  },
  cloudy: {
    sky: "#bed1db",
    fog: "#edf5f8",
    ambient: 0.82,
    directional: "#f8fbff",
    flower: "#efc95e",
    center: "#63411f",
    accent: "#ffffff",
    field: "#789760",
    stars: false,
    fireflies: false,
  },
}

function Sunflower({ lighting, opacity = 0.78, phase = 0, position, scale = 1 }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const time = clock.getElapsedTime() * 0.55 + phase
    ref.current.rotation.z = Math.sin(time) * 0.08
    ref.current.rotation.x = Math.cos(time * 0.8) * 0.03
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      <mesh position={[0, -1.1, 0]}>
        <cylinderGeometry args={[0.06, 0.09, 2.4, 10]} />
        <meshStandardMaterial color="#47793d" transparent opacity={opacity} />
      </mesh>

      {Array.from({ length: 10 }).map((_, index) => {
        const angle = (index / 10) * Math.PI * 2
        return (
          <mesh
            key={index}
            position={[Math.cos(angle) * 0.52, Math.sin(angle) * 0.52 + 0.2, 0]}
            rotation={[0, 0, angle]}
          >
            <circleGeometry args={[0.26, 20]} />
            <meshStandardMaterial
              color={lighting.flower}
              emissive={lighting.accent}
              emissiveIntensity={0.06}
              transparent
              opacity={opacity}
            />
          </mesh>
        )
      })}

      <mesh position={[0, 0.2, 0.08]}>
        <circleGeometry args={[0.34, 24]} />
        <meshStandardMaterial color={lighting.center} transparent opacity={opacity + 0.08} />
      </mesh>
    </group>
  )
}

function Fireflies({ color }) {
  const points = useMemo(
    () =>
      Array.from({ length: 18 }, (_, index) => ({
        phase: index * 0.42,
        position: [
          (Math.random() - 0.5) * 18,
          Math.random() * 6 - 1,
          (Math.random() - 0.5) * 10,
        ],
      })),
    [],
  )

  return (
    <>
      {points.map((point, index) => (
        <Firefly color={color} key={index} phase={point.phase} position={point.position} />
      ))}
    </>
  )
}

function Firefly({ color, phase, position }) {
  const ref = useRef(null)

  useFrame(({ clock }) => {
    if (!ref.current) return

    const time = clock.getElapsedTime() + phase
    ref.current.position.y = position[1] + Math.sin(time * 1.6) * 0.18
    ref.current.material.emissiveIntensity = 0.55 + (Math.sin(time * 2.2) + 1) * 0.3
  })

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[0.07, 10, 10]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.85} />
    </mesh>
  )
}

function GardenField({ lighting }) {
  const group = useRef(null)
  const pointer = useRef({ x: 0, y: 0 })
  const tilt = useRef({ x: 0, y: 0 })
  const scroll = useRef(0)

  const flowers = useMemo(() => {
    const layers = [
      { count: 10, spread: 22, depth: -5.5, minScale: 1.5, maxScale: 2.3, opacity: 0.34 },
      { count: 18, spread: 16, depth: -2.5, minScale: 1.05, maxScale: 1.7, opacity: 0.52 },
      { count: 24, spread: 10, depth: 0.8, minScale: 0.65, maxScale: 1.2, opacity: 0.74 },
    ]

    return layers.flatMap((layer, layerIndex) =>
      Array.from({ length: layer.count }, (_, index) => ({
        id: `${layerIndex}-${index}`,
        opacity: layer.opacity,
        phase: index * 0.33 + layerIndex,
        position: [
          (Math.random() - 0.5) * layer.spread,
          (Math.random() - 0.5) * 3.2 - 1.4,
          layer.depth + (Math.random() - 0.5) * 2.5,
        ],
        scale:
          layer.minScale + Math.random() * (layer.maxScale - layer.minScale),
      })),
    )
  }, [])

  useEffect(() => {
    const handlePointer = (event) => {
      pointer.current = {
        x: (event.clientX / window.innerWidth - 0.5) * 2,
        y: (event.clientY / window.innerHeight - 0.5) * 2,
      }
    }

    const handleTilt = (event) => {
      tilt.current = {
        x: THREE.MathUtils.clamp((event.gamma ?? 0) / 45, -0.45, 0.45),
        y: THREE.MathUtils.clamp((event.beta ?? 0) / 90, -0.3, 0.3),
      }
    }

    const handleScroll = () => {
      scroll.current = Math.min(window.scrollY, 720)
    }

    window.addEventListener("pointermove", handlePointer)
    window.addEventListener("deviceorientation", handleTilt)
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("pointermove", handlePointer)
      window.removeEventListener("deviceorientation", handleTilt)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  useFrame(({ camera }) => {
    const depthShift = scroll.current * 0.0048

    camera.position.x = THREE.MathUtils.lerp(
      camera.position.x,
      pointer.current.x * 1.15 + tilt.current.x * 1.45,
      0.03,
    )
    camera.position.y = THREE.MathUtils.lerp(
      camera.position.y,
      0.6 + pointer.current.y * 0.5 + tilt.current.y * 1.1,
      0.03,
    )
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 9.5 - depthShift, 0.03)
    camera.lookAt(0, 0, -1.4)

    if (group.current) {
      group.current.position.z = THREE.MathUtils.lerp(group.current.position.z, depthShift, 0.05)
    }
  })

  return (
    <group ref={group}>
      <mesh position={[0, -3.1, -6]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[42, 28]} />
        <meshStandardMaterial color={lighting.field} transparent opacity={0.94} />
      </mesh>

      {flowers.map((flower) => (
        <Sunflower
          key={flower.id}
          lighting={lighting}
          opacity={flower.opacity}
          phase={flower.phase}
          position={flower.position}
          scale={flower.scale}
        />
      ))}

      {lighting.fireflies ? <Fireflies color={lighting.accent} /> : null}
    </group>
  )
}

export default function SunflowerScene({ lighting = "morning" }) {
  const mode = lightingModes[lighting] ?? lightingModes.morning

  return (
    <Canvas camera={{ position: [0, 0.6, 9.5], fov: 42 }}>
      <color args={[mode.sky]} attach="background" />
      <fog args={[mode.fog, 7, 28]} attach="fog" />
      <ambientLight intensity={mode.ambient} />
      <directionalLight color={mode.directional} intensity={1.2} position={[6, 8, 8]} />
      <directionalLight color={mode.accent} intensity={0.35} position={[-5, 3, 4]} />

      <GardenField lighting={mode} />

      <Stars
        count={mode.stars ? 1800 : 900}
        depth={48}
        factor={mode.stars ? 4.5 : 1.6}
        fade
        radius={90}
        saturation={0}
        speed={mode.stars ? 1.15 : 0.35}
      />
    </Canvas>
  )
}
