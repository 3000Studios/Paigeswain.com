import { useEffect, useState } from "react"
import { motion } from "framer-motion"

const books = [
  {
    title: "Sunlit Stories",
    description: "Placeholder spotlight for Paige's first featured book.",
  },
  {
    title: "Kitchen Garden Notes",
    description: "Room for recipes, reflections, and homegrown encouragement.",
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
            These book cards are placeholders for the links Jeremy and Paige will add later.
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
              
              {/* Sunflower Head */}
              <motion.div 
                whileHover={{ scale: 1.05 }}
                style={{
                  position: 'relative',
                  width: '250px',
                  height: '250px',
                  zIndex: 2,
                  marginTop: '10px',
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

                {/* Sunflower Center (The Book) */}
                <div 
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '160px',
                    height: '160px',
                    backgroundColor: '#5c3815', // Dark brown core
                    borderRadius: '50%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1.5rem',
                    textAlign: 'center',
                    boxShadow: 'inset 0 0 20px #2a1505, 0 10px 30px rgba(0,0,0,0.6)',
                    border: '4px solid #3d220b',
                    overflow: 'hidden'
                  }}
                >
                  <span className="book-pill" style={{ marginBottom: '0.5rem', fontSize: '0.6rem', padding: '0.2rem 0.5rem' }}>Coming Soon</span>
                  <h3 style={{ color: '#fff2c3', fontSize: '1.1rem', margin: '0', fontFamily: '"Fredoka", sans-serif', textShadow: '1px 1px 3px rgba(0,0,0,0.8)' }}>
                    {book.title}
                  </h3>
                  <p style={{ color: 'rgba(252, 247, 232, 0.92)', fontSize: '0.75rem', marginTop: '0.4rem', lineHeight: 1.3, textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>
                    {book.description}
                  </p>
                </div>
              </motion.div>
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
