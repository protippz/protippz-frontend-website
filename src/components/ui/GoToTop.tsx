'use client';
import React, { useState } from 'react';
function GoToTop() {
  const [isShaking, setIsShaking] = useState(false);

  const GoscrollToTop = () => {
    setIsShaking(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const checkScroll = () => {
      if (window.scrollY === 0) {
        setIsShaking(false);
        window.removeEventListener('scroll', checkScroll);
      }
    };
    window.addEventListener('scroll', checkScroll);
  };

  return (
    <div
      onClick={GoscrollToTop}
      className="fixed z-[999] rounded-md overflow-hidden cursor-pointer hover:scale-105 transform transition-all bottom-4 sm:bottom-6 md:bottom-10 lg:bottom-8 right-4 sm:right-6 md:right-8 lg:right-4"
    >
      <img
        className={`w-10 sm:w-12 md:w-14 lg:w-20 xl:w-28 ${
          isShaking ? 'animate-shake' : ''
        }`}
        src="/gototop.jpg"
        alt="Go to top button"
      />
    </div>
  );
}

export default GoToTop;
