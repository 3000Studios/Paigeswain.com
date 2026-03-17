import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const jokes = [
  "What do you call a fake noodle? An impasta! 🍝",
  "Why did the scarecrow win an award? Because he was outstanding in his field! 🌾",
  "Why do bees have sticky hair? Because they use honeycombs! 🐝🍯",
  "What does a bee use to brush its hair? A honeycomb! 🐝",
  "Why don't skeletons fight each other? They don't have the guts. 💀"
];

export default function DaisyBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "Hi! I'm Daisy! I can dance, play games, or tell jokes!", sender: 'bot' }]);
  const [input, setInput] = useState('');
  const [isDancing, setIsDancing] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { text: input, sender: 'user' }]);
    
    const userText = input.toLowerCase();
    let response = "I'm just a simple daisy! But I love the sunshine! 🌼";
    
    if (userText.includes('joke')) {
      response = jokes[Math.floor(Math.random() * jokes.length)];
    } else if (userText.includes('dance')) {
      response = "*Dances enthusiastically!* 💃🌻";
      setIsDancing(true);
      setTimeout(() => setIsDancing(false), 3000);
    } else if (userText.includes('game') || userText.includes('play')) {
      response = "Let's play Rock Paper Scissors! You go first. Tell me 'rock', 'paper', or 'scissors'!";
    } else if (userText.includes('rock') || userText.includes('paper') || userText.includes('scissors')) {
       const choices = ['rock', 'paper', 'scissors'];
       const myChoice = choices[Math.floor(Math.random() * choices.length)];
       response = `I choose ${myChoice}!`;
       if (userText.includes(myChoice)) response += " It's a tie!";
       else if (
         (userText.includes('rock') && myChoice === 'scissors') ||
         (userText.includes('paper') && myChoice === 'rock') ||
         (userText.includes('scissors') && myChoice === 'paper')
       ) {
         response += " You win! Good job! 🏆";
       } else {
         response += " I win! We both win in my garden though! 🌼";
       }
    } else if (userText.includes('hello') || userText.includes('hi')) {
       response = "Hello there! How are you blooming today?";
    }
    
    setTimeout(() => {
      setMessages(prev => [...prev, { text: response, sender: 'bot' }]);
    }, 600);
    
    setInput('');
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            style={{ 
              width: '320px', 
              height: '450px', 
              backgroundColor: 'rgba(13, 26, 46, 0.95)', 
              border: '2px solid rgba(255, 255, 255, 0.3)', 
              borderRadius: '20px', 
              padding: '15px', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 0 15px 5px rgba(255, 190, 59, 0.4)' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
              <h3 style={{ margin: 0, color: '#ffbe3b', textShadow: '1px 1px 2px black', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <motion.span animate={isDancing ? { rotate: [0, 20, -20, 0], y: [0, -10, 0] } : {}} transition={isDancing ? { repeat: Infinity, duration: 0.5 } : {}}>🌼</motion.span> 
                Daisy Bot
              </h3>
              <button onClick={() => setIsOpen(false)} style={{ background: 'none', border: 'none', color: '#ffbe3b', cursor: 'pointer', fontSize: '1.5rem', lineHeight: 1 }}>×</button>
            </div>
            
            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '10px', padding: '5px', scrollbarWidth: 'thin', scrollbarColor: '#ffbe3b transparent' }}>
              {messages.map((m, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: m.sender === 'bot' ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  style={{ 
                    alignSelf: m.sender === 'bot' ? 'flex-start' : 'flex-end', 
                    backgroundColor: m.sender === 'bot' ? 'rgba(255, 190, 59, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                    border: m.sender === 'bot' ? '1px solid rgba(255, 190, 59, 0.4)' : '1px solid rgba(255, 255, 255, 0.2)',
                    padding: '8px 12px', 
                    borderRadius: m.sender === 'bot' ? '12px 12px 12px 2px' : '12px 12px 2px 12px', 
                    maxWidth: '85%', 
                    color: 'white', 
                    fontSize: '0.95rem',
                    lineHeight: '1.4'
                  }}
                >
                  {m.text}
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div style={{ display: 'flex', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
              <input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Daisy..."
                style={{ flex: 1, padding: '10px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.2)', backgroundColor: 'rgba(0,0,0,0.3)', color: 'white', outline: 'none' }}
              />
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend} 
                style={{ backgroundColor: '#ffbe3b', border: 'none', borderRadius: '12px', padding: '0 15px', color: '#111', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.2)' }}
              >
                Send
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {!isOpen && (
        <motion.button 
          onClick={() => setIsOpen(true)}
          animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          style={{ 
            width: '64px', height: '64px', borderRadius: '32px', 
            backgroundColor: '#ffbe3b', border: '3px solid white', 
            cursor: 'pointer', fontSize: '2rem', display: 'flex', 
            alignItems: 'center', justifyContent: 'center', 
            boxShadow: '0 5px 20px rgba(0,0,0,0.5)',
            position: 'absolute', bottom: 0, right: 0
          }}
        >
          🌼
        </motion.button>
      )}
    </div>
  );
}
