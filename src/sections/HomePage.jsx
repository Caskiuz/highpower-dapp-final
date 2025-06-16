// src/sections/HomePage.jsx
import React, { useEffect, useState, useRef } from 'react';

function HomePage({ onLaunchDapp, onShowVideo }) { // Recibe onShowVideo prop
  const discordInviteLink = "https://discord.gg/YOUR_DISCORD_INVITE"; // <--- CAMBIA ESTA LÍNEA CON TU ENLACE REAL

  const [showContent, setShowContent] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const contentTimer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const getCssVar = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;

    const colors = {
      primaryPurple: getCssVar('--primary-purple', '#6B46C1'),
      secondaryBlue: getCssVar('--secondary-blue', '#4299E1'),
      accentGreen: getCssVar('--accent-green', '#6EE7B7'),
      accentYellow: getCssVar('--accent-yellow', '#FBBF24'),
      lightGrayText: getCssVar('--light-gray-text', '#CBD5E0'),
      offWhite: getCssVar('--off-white', '#F7FAFC'),
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Node {
      constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.baseRadius = radius;
        this.pulse = Math.random() * Math.PI * 2;
      }

      draw() {
        ctx.beginPath();
        this.radius = this.baseRadius + Math.sin(this.pulse) * (this.baseRadius * 0.1);
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 60; 
        ctx.shadowColor = this.color;
        ctx.globalAlpha = 0.1; 
        ctx.fill();
        ctx.shadowBlur = 0; 
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.pulse += 0.02; 

        if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) {
          this.vx *= -1;
        }
        if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) {
          this.vy *= -1;
        }
      }
    }

    class Particle {
      constructor(x, y, radius, color, speed) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vx = (Math.random() - 0.5) * speed * 3;
        this.vy = (Math.random() - 0.5) * speed * 3;
        this.alpha = 1;
        this.decayRate = Math.random() * 0.02 + 0.01;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`; 
        ctx.globalAlpha = this.alpha * 0.7; 
        ctx.fill();
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decayRate; 
      }
    }

    class DataSphere {
      constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.vy = -(0.8 + Math.random() * 1.5); 
        this.vx = (Math.random() - 0.5) * 0.8; 
        this.alpha = 0.8; 
        this.decayRate = 0.003 + Math.random() * 0.003; 
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15; 
        ctx.shadowColor = this.color;
        ctx.globalAlpha = this.alpha * 0.8; 
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decayRate;

        if (this.y + this.radius < 0 || this.alpha <= 0) {
          this.x = Math.random() * canvas.width;
          this.y = canvas.height + this.radius; 
          this.alpha = 0.8;
          this.radius = 5 + Math.random() * 10; 
          const sphereColors = [colors.primaryPurple, colors.secondaryBlue, colors.accentGreen, colors.accentYellow, colors.lightGrayText];
          this.color = sphereColors[Math.floor(Math.random() * sphereColors.length)];
          this.vy = -(0.8 + Math.random() * 1.5); 
        }
      }
    }

    const nodes = [];
    const particles = [];
    const dataSpheres = []; 
    const numNodes = 6;
    const numParticles = 100; 
    const numDataSpheres = 35; 
    const spawnParticleInterval = 30; 
    let lastSpawnTime = 0;

    const nodeColors = [colors.primaryPurple, colors.secondaryBlue, colors.accentGreen, colors.accentYellow];
    for (let i = 0; i < numNodes; i++) {
      const radius = 80 + Math.random() * 100;
      const x = Math.random() * (canvas.width - radius * 2) + radius;
      const y = (canvas.height * 0.25) + Math.random() * (canvas.height * 0.75 - radius * 2) + radius; 
      nodes.push(new Node(x, y, radius, nodeColors[i % nodeColors.length], 0.25)); 
    }

    for (let i = 0; i < numDataSpheres; i++) {
      const radius = 5 + Math.random() * 10;
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height; 
      const sphereColors = [colors.primaryPurple, colors.secondaryBlue, colors.accentGreen, colors.accentYellow, colors.lightGrayText];
      dataSpheres.push(new DataSphere(x, y, radius, sphereColors[Math.floor(Math.random() * sphereColors.length)]));
    }

    const animate = (currentTime) => {
      animationFrameId = requestAnimationFrame(animate);

      ctx.clearRect(0, 0, canvas.width, canvas.height); 

      nodes.forEach(node => {
        node.update();
        node.draw();
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const node1 = nodes[i];
          const node2 = nodes[j];
          const distance = Math.sqrt(Math.pow(node1.x - node2.x, 2) + Math.pow(node1.y - node2.y, 2));

          const maxDistance = 350; 
          if (distance < maxDistance) {
            ctx.beginPath();
            ctx.moveTo(node1.x, node1.y);
            ctx.lineTo(node2.x, node2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${((maxDistance - distance) / maxDistance) * 0.07})`; 
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
      
      if (currentTime - lastSpawnTime > spawnParticleInterval && particles.length < numParticles) {
          const randomNode = nodes[Math.floor(Math.random() * nodes.length)];
          particles.push(new Particle(randomNode.x, randomNode.y, 1.5 + Math.random(), colors.lightGrayText, 1));
          lastSpawnTime = currentTime;
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const particle = particles[i];
        particle.update();
        particle.draw();

        if (particle.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      dataSpheres.forEach(sphere => {
        sphere.update();
        sphere.draw();
      });

      ctx.globalAlpha = 1; 
    };

    window.addEventListener('resize', resizeCanvas);

    resizeCanvas();
    animate(0); 

    return () => {
      clearTimeout(contentTimer);
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []); 

  return (
    <div className="relative flex flex-col min-h-screen text-center overflow-hidden bg-[var(--dark-gray)] font-sans">
      
      <canvas ref={canvasRef} id="blockchain-background-canvas" className="absolute inset-0 w-full h-full"></canvas>

      <div className="absolute top-0 left-0 w-full p-4 lg:px-8 z-20 flex justify-between items-center bg-transparent">
        <div className="text-purple-400 text-3xl font-bold rounded-lg p-2 transition duration-300 hover:bg-gray-800 cursor-pointer animate-fade-in delay-500">
          HighPower
        </div>
        <button
          onClick={onLaunchDapp}
          className="bg-[var(--accent-green)] hover:bg-[var(--secondary-blue)] text-gray-900 font-bold py-3 px-8 rounded-full text-xl
                     transition duration-300 ease-in-out transform hover:scale-105 shadow-xl animate-fade-in delay-1000"
        >
          Iniciar aplicación
        </button>
      </div>

      <div className={`relative z-10 p-8 w-full px-8 mx-auto flex flex-col items-center justify-center flex-grow
                      ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
                      transition-all duration-1000 ease-out
                      bg-gray-900 bg-opacity-70 rounded-3xl shadow-2xl border border-purple-700`}>
        <h1 className="text-6xl font-extrabold text-[var(--off-white)] leading-tight drop-shadow-lg mb-8">
          <span className="text-[var(--accent-yellow)]">Potenciando</span> la <span className="text-[var(--accent-green)]">Economía Descentralizada</span>: <br/>
          Tu <span className="text-[var(--primary-purple)]">Ecosistema para Tokens</span>, <br/>
          <span className="text-[var(--secondary-blue)]">NFTs y Rendimientos Sostenibles</span>.
        </h1>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 justify-center">
          <a
            href={discordInviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-full text-xl
                       transition duration-300 ease-in-out transform hover:scale-105 shadow-xl animate-bounce-once flex items-center justify-center"
          >
              <i className="fab fa-discord mr-3 text-2xl"></i>
              Únete a la comunidad
          </a>
          {/* Nuevo botón para ver el video introductorio */}
          <button
            onClick={onShowVideo}
            className="bg-[var(--secondary-blue)] hover:bg-[var(--primary-purple)] text-white font-bold py-3 px-8 rounded-full text-xl
                       transition duration-300 ease-in-out transform hover:scale-105 shadow-xl flex items-center justify-center"
          >
            <i className="fas fa-video mr-3 text-2xl"></i> {/* Icono de video */}
            Ver video introductorio
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes bounceOnce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
        .animate-fade-in.delay-500 { animation-delay: 0.5s; }
        .animate-fade-in.delay-1000 { animation-delay: 1s; }
        .animate-bounce-once { animation: bounceOnce 1s ease-in-out; }

        .transition-all { transition-property: all; transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1); transition-duration: 1000ms; }
      `}</style>
    </div>
  );
}

export default HomePage;
