import React, { useEffect, useRef } from 'react';

const CursorTrail: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let mounted = true;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const particles: Particle[] = [];

    class Particle {
      x: number;
      y: number;
      size: number;
      life: number;
      maxLife: number;
      angle: number;
      spin: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 4;
        this.maxLife = Math.random() * 25 + 35;
        this.life = this.maxLife;
        this.angle = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.12;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2 + 1;
        this.color = `rgba(34, 197, 94, ${Math.random() * 0.5 + 0.3})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        this.angle += this.spin;
        this.size *= 0.96;
      }

      draw(ctx: CanvasRenderingContext2D) {
        const opacity = this.life / this.maxLife;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        ctx.globalAlpha = opacity;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.moveTo(0, -this.size);
        ctx.quadraticCurveTo(this.size, 0, 0, this.size);
        ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
        ctx.fill();

        ctx.restore();
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      // 🔥 Higher emission rate
      if (Math.random() > 0.1) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
    };

    const handleResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    const animate = () => {
      if (!mounted) return;
      ctx.clearRect(0, 0, w, h);

      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw(ctx);
        if (particles[i].life <= 0 || particles[i].size < 0.4) {
          particles.splice(i, 1);
        }
      }
      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      mounted = false;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ opacity: 0.85 }}
    />
  );
};

export default CursorTrail;
