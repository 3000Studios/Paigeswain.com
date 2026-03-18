import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const books = [
  {
    title: "Sunlit Stories",
    description: "Paige's first featured book.",
    link: "https://a.co/d/0fybDKJ3",
    cover: "/book1_cover.png"
  },
  {
    title: "Kitchen Garden Notes",
    description: "Recipes, reflections, homegrown encouragement.",
    link: "https://a.co/d/0hfuLYUK",
    cover: "/book2_cover.png"
  },
]

export default function Footer() {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleOrientation = (event) => {
      let x = event.gamma || 0; // In degree in the range [-90,90]
      let y = event.beta || 0;  // In degree in the range [-180,180]

      // Limit the tilt effect
      x = Math.max(-45, Math.min(45, x));
      y = Math.max(-45, Math.min(45, y));

      setTilt({ x: x / 2, y: y / 2 });
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  return (
    <footer className="site-footer">
      <div className="footer-shell">
        <div className="footer-copy">
          <p className="footer-kicker">Paige's Books</p>
          <h2>Stories, wisdom, and warm little windows into the family world.</h2>
          <p>
            You can grab a copy of our latest releases straight from Amazon below!
          </p>
        </div>

        <div className="footer-sunflowers-grid" style={{ display: 'flex', justifyContent: 'center', gap: '4rem', flexWrap: 'wrap', marginTop: '3rem' }}>
          {books.map((book, idx) => (
            <motion.div 
              key={book.title}
              animate={{ rotateX: tilt.y, rotateY: tilt.x, rotateZ: (tilt.x + tilt.y) * 0.1 }}
              transition={{ type: "spring", stiffness: 100, damping: 10 }}
              style={{
                position: 'relative',
                width: '300px',
                height: '400px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                perspective: '1000px'
              }}
            >
              {/* Sunflower Stem */}
              <div style={{ position: 'absolute', bottom: 0, width: '15px', height: '150px', backgroundColor: '#447849', borderRadius: '10px 10px 0 0', zIndex: 1 }} />
              {/* Stem Leaves */}
              <div style={{ position: 'absolute', bottom: '60px', left: '100px', width: '40px', height: '15px', backgroundColor: '#447849', borderRadius: '40px 0 40px 0', transform: 'rotate(20deg)', zIndex: 1 }} />
              <div style={{ position: 'absolute', bottom: '90px', right: '100px', width: '40px', height: '15px', backgroundColor: '#447849', borderRadius: '0 40px 0 40px', transform: 'rotate(-20deg)', zIndex: 1 }} />
              
              {/* Sunflower Head Link! */}
              <motion.a 
                href={book.link}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  position: 'relative',
                  width: '250px',
                  height: '250px',
                  zIndex: 2,
                  marginTop: '10px',
                  textDecoration: 'none',
                  display: 'block'
                }}
              >
                {/* Petals */}
                <div style={{ position: 'absolute', inset: 0 }}>
                  {[...Array(16)].map((_, i) => (
                    <div 
                      key={i} 
                      style={{
                        position: 'absolute',
                        top: '10px',
                        left: '110px',
                        width: '30px',
                        height: '100px',
                        backgroundColor: '#ffbe3b',
                        borderRadius: '50% 50% 10px 10px',
                        transformOrigin: '50% 115px',
                        transform: `rotate(${i * 22.5}deg)`,
                        boxShadow: '0 0 10px rgba(0,0,0,0.3) inset',
                        border: '1px solid rgba(200, 100, 0, 0.4)'
                      }} 
                    />
                  ))}
                </div>

                {/* Sunflower Center (The Book Background + Title Overlay) */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '180px',
                    height: '180px',
                    backgroundColor: '#5c3815',
                    backgroundImage: `url(${book.cover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem',
                    textAlign: 'center',
                    boxShadow: 'inset 0 0 20px rgba(0,0,0,0.8), 0 10px 30px rgba(0,0,0,0.8)',
                    border: '4px solid #3d220b',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ backgroundColor: 'rgba(50, 20, 0, 0.75)', inset: 0, position: 'absolute', backdropFilter: 'blur(3px)' }} />
                  <span className="book-pill" style={{ marginBottom: '0.5rem', fontSize: '0.6rem', padding: '0.2rem 0.5rem', zIndex: 3, position: 'relative' }}>Now Available</span>
                  <h3 style={{ color: '#fff2c3', fontSize: '1.2rem', margin: '0', fontFamily: '"Fredoka", sans-serif', textShadow: '2px 2px 4px #000', zIndex: 3, position: 'relative' }}>
                    {book.title}
                  </h3>
                  <p style={{ color: 'rgba(252, 247, 232, 0.92)', fontSize: '0.8rem', marginTop: '0.4rem', lineHeight: 1.3, textShadow: '1px 1px 2px #000', zIndex: 3, position: 'relative' }}>
                    {book.description}
                  </p>
                </div>
              </motion.a>
            </motion.div>
          ))}
        </div>

        <div className="footer-meta">
          <span>Paige's Corner</span>
          <span>Family Links</span>
          <span>Contact details can be added here later</span>
        </div>
      </div>
    </footer>
  )
}
