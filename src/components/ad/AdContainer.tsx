'use client';
import { useEffect, useRef } from 'react';
import './Ads.css';
const AdContainer = () => {
  const adRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.setAttribute('data-cfasync', 'false');
    script.src =
      '//pl26452988.profitableratecpm.com/048d117165260bbafdf7273631744c4f/invoke.js';

    if (adRef.current) {
      adRef.current.innerHTML = '';
      adRef.current.appendChild(script);
      adRef.current.classList.add('ad-loaded');
    }
  }, []);

  return (
    <div>
      <div
        ref={adRef}
        id="container-048d117165260bbafdf7273631744c4f"
        className='ad-container'
      />
    </div>
  );
};

export default AdContainer;
