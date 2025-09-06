import { useState, useRef, useEffect } from "react";
import { messages } from "../data/message";
import "../styles/main.scss";
import Confetti from "react-confetti";

export default function Box() {
  const [currentIndex, setCurrentIndex] = useState<number>(0); // track sequential index
  const [current, setCurrent] = useState<string | null>(null);
  const [finished, setFinished] = useState(false);
  const [confettiPosition, setConfettiPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const [showHearts, setShowHearts] = useState(false);

  const giftBoxRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLDivElement>(null);

  // Track window size
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset box state when current message changes
  useEffect(() => {
    if (current) {
      setIsBoxOpen(false);
      setShowHearts(true);
      const timer = setTimeout(() => setShowHearts(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setIsBoxOpen(false);
    }
  }, [current]);

  // Open the box to reveal current message
  const openBox = () => {
    setIsBoxOpen(true);

    if (!current) {
      const msg = messages[currentIndex];
      setCurrent(msg.content);

      // Confetti position at gift box
      if (giftBoxRef.current) {
        const rect = giftBoxRef.current.getBoundingClientRect();
        setConfettiPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2
        });
      } else {
        setConfettiPosition({
          x: window.innerWidth / 2,
          y: window.innerHeight - 50
        });
      }
    }
  };

  // Close message without changing index
  const closeMessage = () => {
    if (messageRef.current) {
      messageRef.current.classList.add('message-exit');
      setTimeout(() => {
        setCurrent(null);
      }, 500);
    } else {
      setCurrent(null);
    }
  };

  // Go to next message
  const nextMessage = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex >= messages.length) {
      setFinished(true);
      setCurrent(null);
    } else {
      setCurrent(messages[nextIndex].content);
      setCurrentIndex(nextIndex);
    }
  };

  // Restart everything
  const restart = () => {
    setCurrentIndex(0);
    setFinished(false);
    setCurrent(null);
    setIsBoxOpen(false);
  };

  return (
    <div className="box-container">
      {/* Floating hearts */}
      {showHearts && (
        <div className="hearts-container">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="heart" style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}>❤️</div>
          ))}
        </div>
      )}

      {/* Particles background */}
      {!finished && (
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              width: `${5 + Math.random() * 5}px`,
              height: `${5 + Math.random() * 5}px`
            }}></div>
          ))}
        </div>
      )}

      {!finished && (
        <>
          {/* Gift box */}
          {!current && (
            <div className={`gift-box ${isBoxOpen ? 'open' : ''}`} onClick={!isBoxOpen ? openBox : undefined} ref={giftBoxRef}>
              <div className="gift-lid"></div>
              <div className="gift-body">
                <div className="gift-bow"></div>
                <div className="gift-button">🎁 Open me!</div>
                <div className="sparkle sparkle-1"></div>
                <div className="sparkle sparkle-2"></div>
                <div className="sparkle sparkle-3"></div>
              </div>
            </div>
          )}

          {/* Message card */}
          {current && (
            <div className="message-container" ref={messageRef}>
              <div className="message-card">
                <p>{current}</p>
                <div className="button-group">
                  <button onClick={nextMessage} className="warm-green-button">
                    💌 Next message
                  </button>
                  <button onClick={closeMessage} className="warm-green-button">
                    ❌ Close
                  </button>
                  <button onClick={() => setFinished(true)} className="warm-green-button">
                    🎉 Show celebration
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Celebration */}
      {finished && windowSize.width > 0 && windowSize.height > 0 && (
        <div className="final-celebration">
          <Confetti
            width={windowSize.width}
            height={windowSize.height}
            numberOfPieces={200}
            colors={['#8BC34A', '#689F38', '#4CAF50', '#CDDC39', '#FFC107', '#FF9800', '#FF5722']}
            confettiSource={{
              x: confettiPosition.x - 25,
              y: confettiPosition.y,
              w: 50,
              h: 10
            }}
            recycle={false}
            gravity={0.3}
          />
          <div className="cake-animation">
            <div className="cake">
              <div className="candle"></div>
            </div>
          </div>
          <h2>HAPPY BIRTHDAY!</h2>
          <p>Thank you for being the good person you are. Keep it going!</p>
          <button onClick={restart} className="warm-green-button">
            🎂 Start again
          </button>
        </div>
      )}
    </div>
  );
}
