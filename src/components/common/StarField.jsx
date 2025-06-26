import React, { useEffect, useState, useMemo } from 'react';

const StarField = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Generate stars with various properties
  const stars = useMemo(() => {
    const starArray = [];
    const numStars = 400; // Reduced from 800 for more gap

    for (let i = 0; i < numStars; i++) {
      const size = Math.random() * 3 + 0.5;
      const brightness = Math.random();
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      // Spread stars more by using a grid with random jitter
      const gridSize = 20;
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const left = (col + Math.random() * 0.7) * (100 / gridSize);
      const top = (row + Math.random() * 0.7) * (100 / gridSize);

      starArray.push({
        id: i,
        left,
        top,
        size,
        brightness,
        duration,
        delay,
      });
    }
    return starArray;
  }, []);

  // Generate additional dense star field ONCE
  const smallStars = useMemo(() => {
    const numSmallStars = 80; // Reduced for more gap
    const gridSize = 9;
    return Array.from({ length: numSmallStars }, (_, i) => {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const left = (col + Math.random() * 0.8) * (100 / gridSize);
      const top = (row + Math.random() * 0.8) * (100 / gridSize);
      return {
        id: i,
        left,
        top,
        opacity: Math.random() * 0.8 + 0.2,
        duration: Math.random() * 4 + 2,
        delay: Math.random() * 3,
      };
    });
  }, []);

  // Shooting stars: always animate from top-left to bottom-right
  const shootingStars = useMemo(() => {
    // Decrease shooting star count to 1
    return Array.from({ length: 1 }, (_, i) => ({
      id: i,
      duration: Math.random() * 4 + 5, // 5s to 8s
      delay: Math.random() * 10,
    }));
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
      // radial-gradient(ellipse at top, #1a1a1a 0%, #2a2a2a 25%, #0f0f0f 50%, #000000 100%),
      // radial-gradient(ellipse at bottom, #1e1e1e 0%, #151515 25%, #0a0a0a 75%, #000000 100%)
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
    //   linear-gradient(45deg, 
    //     transparent 30%,
    //     rgba(255, 255, 255, 0.01) 40%,
    //     rgba(255, 255, 255, 0.03) 50%,
    //     rgba(255, 255, 255, 0.01) 60%,
    //     transparent 70%)
    // `,
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
            left: 0px;
            width: 80px;
            height: 1px;
            background: linear-gradient(90deg, #ffffff, transparent);
            transform-origin: 0 0;
            transform: rotate(200deg);
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
        {shootingStars.map((star) => {
          // Calculate start and end points for the diagonal
          const startX = 0;
          const startY = 0;
          const endX = viewport.width;
          const endY = viewport.height;
          return (
            <div
              key={star.id}
              className="shooting-star"
              style={{
                position: 'absolute',
                width: '2px',
                height: '2px',
                background: 'linear-gradient(45deg, #ffffff, #f0f0f0, transparent)',
                borderRadius: '50%',
                left: 0,
                top: 0,
                // Animate along the diagonal using inline keyframes
                animation: `shootingStar${star.id} ${star.duration}s linear infinite`,
                animationDelay: `${star.delay}s`,
                pointerEvents: 'none',
              }}
            >
              <style>
                {`
                  @keyframes shootingStar${star.id} {
                    0% {
                      transform: translate(${startX}px, ${startY}px);
                      opacity: 0;
                    }
                    10% {
                      opacity: 1;
                    }
                    90% {
                      opacity: 1;
                    }
                    100% {
                      transform: translate(${endX}px, ${endY}px);
                      opacity: 0;
                    }
                  }
                `}
              </style>
            </div>
          );
        })}

        {/* Additional dense star field */}
        {smallStars.map((star) => (
          <div
            key={`small-star-${star.id}`}
            style={{
              position: 'absolute',
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: '1px',
              height: '1px',
              background: '#ffffff',
              borderRadius: '50%',
              opacity: star.opacity,
              animation: `twinkle ${star.duration}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}
      </div>
    </>
  );
};

export default StarField;