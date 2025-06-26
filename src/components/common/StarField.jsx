import React, { useEffect, useState, useMemo } from 'react';

const StarField = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Generate stars with various properties
  const stars = useMemo(() => {
    const starArray = [];
    const numStars = 800;

    for (let i = 0; i < numStars; i++) {
      const size = Math.random() * 3 + 0.5;
      const brightness = Math.random();
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      
      starArray.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size,
        brightness,
        duration,
        delay,
      });
    }
    return starArray;
  }, []);

  // Generate shooting stars
  const shootingStars = useMemo(() => {
    const shootingArray = [];
    for (let i = 0; i < 3; i++) {
      shootingArray.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 50,
        duration: Math.random() * 2 + 3,
        delay: Math.random() * 10,
      });
    }
    return shootingArray;
  }, []);

  // Mouse parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const containerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: `
      radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 25%, #0f0f0f 50%, #000000 100%),
      radial-gradient(ellipse at bottom, #1e1e1e 0%, #151515 25%, #0a0a0a 75%, #000000 100%)
    `,
    overflow: 'hidden',
    zIndex: -1,
  };

  const milkyWayStyle = {
    position: 'absolute',
    top: '10%',
    left: '-10%',
    width: '120%',
    height: '80%',
    background: `
      linear-gradient(45deg, 
        transparent 30%,
        rgba(255, 255, 255, 0.01) 40%,
        rgba(255, 255, 255, 0.03) 50%,
        rgba(255, 255, 255, 0.01) 60%,
        transparent 70%)
    `,
    transform: `rotate(-15deg) translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
    borderRadius: '50%',
  };

  const nebulaStyle = {
    position: 'absolute',
    top: '20%',
    left: '60%',
    width: '300px',
    height: '200px',
    background: `
      radial-gradient(ellipse, 
        rgba(80, 60, 90, 0.08) 0%,
        rgba(40, 30, 50, 0.04) 40%,
        transparent 70%)
    `,
    borderRadius: '50%',
    animation: 'galaxyRotate 120s linear infinite',
    transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
  };

  return (
    <>
      <style>
        {`
          @keyframes twinkle {
            0%, 100% { 
              opacity: 0.3; 
              transform: scale(0.8);
            }
            50% { 
              opacity: 1; 
              transform: scale(1.2);
            }
          }

          @keyframes shootingStar {
            0% {
              transform: translateX(-100px) translateY(-300px);
              opacity: 0;
            }
            10% {
              opacity: 1;
            }
            90% {
              opacity: 1;
            }
            100% {
              transform: translateX(-300px) translateY(100px);
              opacity: 0;
            }
          }

          @keyframes galaxyRotate {
            0% { 
              transform: rotate(0deg); 
            }
            100% { 
              transform: rotate(360deg); 
            }
          }

          .shooting-star::before {
            content: "";
            position: absolute;
            top: 0;
            left: 1px;
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, #ffffff, transparent);
            transform-origin: 0 0;
            transform: rotate(316deg);
          }
        `}
      </style>
      
      <div style={containerStyle}>
        {/* Milky Way galaxy effect */}
        <div style={milkyWayStyle} />
        
        {/* Nebula effect */}
        <div style={nebulaStyle} />

        {/* Stars */}
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: 'absolute',
              background: `radial-gradient(circle, 
                rgba(255, 255, 255, ${star.brightness}) 0%, 
                rgba(200, 220, 255, ${star.brightness * 0.8}) 40%, 
                transparent 70%)`,
              borderRadius: '50%',
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
              boxShadow: star.brightness > 0.7 ? `0 0 ${star.size * 2}px rgba(255, 255, 255, 0.3)` : 'none',
              left: `${star.left}%`,
              top: `${star.top}%`,
              transform: `translate(${mousePosition.x * (star.size * 0.1)}px, ${mousePosition.y * (star.size * 0.1)}px)`,
            }}
          />
        ))}

        {/* Shooting stars */}
        {shootingStars.map((star) => (
          <div
            key={star.id}
            className="shooting-star"
            style={{
              position: 'absolute',
              width: '2px',
              height: '2px',
              background: 'linear-gradient(45deg, #ffffff, #f0f0f0, transparent)',
              borderRadius: '50%',
              animation: `shootingStar ${star.duration}s linear infinite`,
              animationDelay: `${star.delay}s`,
              left: `${star.left}%`,
              top: `${star.top}%`,
            }}
          />
        ))}

        {/* Additional dense star field */}
        {Array.from({ length: 200 }, (_, i) => (
          <div
            key={`small-star-${i}`}
            style={{
              position: 'absolute',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: '1px',
              height: '1px',
              background: '#ffffff',
              borderRadius: '50%',
              opacity: Math.random() * 0.8 + 0.2,
              animation: `twinkle ${Math.random() * 4 + 2}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default StarField;