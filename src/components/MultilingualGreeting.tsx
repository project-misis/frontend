import { useState, useEffect } from 'react';

const greetings = [
  { text: 'Hello', lang: 'English' },
  { text: 'Bonjour', lang: 'Français' },
  { text: 'Hola', lang: 'Español' },
  { text: '你好', lang: '中文' },
  { text: 'Привет', lang: 'Русский' },
  { text: 'مرحبا', lang: 'العربية' },
  { text: 'こんにちは', lang: '日本語' },
  { text: 'Olá', lang: 'Português' },
  { text: 'Namaste', lang: 'हिन्दी' },
  { text: 'Hallo', lang: 'Deutsch' },
];

export const MultilingualGreeting = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const [opacity, setOpacity] = useState(1);
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!isTyping) return;

    const currentGreeting = greetings[currentIndex].text;

    if (charIndex < currentGreeting.length) {
      const char = currentGreeting[charIndex];
      const delay = /[\u4e00-\u9fff\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u0900-\u097f]/.test(char) ? 120 : 80;

      const timeout = setTimeout(() => {
        setDisplayedText(currentGreeting.slice(0, charIndex + 1));
        setCharIndex(charIndex + 1);
      }, delay);
      return () => clearTimeout(timeout);
    } else {
      const pauseTimeout = setTimeout(() => {
        setOpacity(0);
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(pauseTimeout);
    }
  }, [charIndex, currentIndex, isTyping]);

  useEffect(() => {
    if (isTyping || opacity !== 0) return;

    const resetTimeout = setTimeout(() => {
      setCharIndex(0);
      setDisplayedText('');
      setCurrentIndex((prev) => (prev + 1) % greetings.length);
      // Fade in and start typing
      setTimeout(() => {
        setOpacity(1);
        setIsTyping(true);
      }, 50);
    }, 300);

    return () => clearTimeout(resetTimeout);
  }, [isTyping, opacity]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="text-center mb-12">
      <h1 className="text-7xl md:text-9xl font-bold mb-4 relative font-mono">
        <span
          className="inline-block text-primary drop-shadow-[0_0_30px_hsl(var(--primary)/0.5)] transition-opacity duration-300 ease-in-out"
          style={{ opacity }}
        >
          {displayedText}
        </span>
        <span
          className="inline-block ml-2 w-4 h-20 bg-primary transition-opacity duration-300 ease-in-out"
          style={{
            verticalAlign: 'middle',
            opacity: showCursor ? 1 : 0
          }}
        />
      </h1>
    </div>
  );
};
