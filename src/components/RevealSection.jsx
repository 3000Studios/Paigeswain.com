import { useEffect, useRef, useState } from "react"

export default function RevealSection({ children, className = "" }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const node = ref.current

    if (!node) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          return
        }

        setVisible(false)
      },
      { threshold: 0.18 },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={ref}
      className={`reveal-section ${className}`.trim()}
      data-visible={visible}
    >
      {children}
    </section>
  )
}
