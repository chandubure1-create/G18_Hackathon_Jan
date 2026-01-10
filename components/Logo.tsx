
import React from 'react';

interface LogoProps {
  className?: string;
  variant?: 'bw' | 'color';
}

const Logo: React.FC<LogoProps> = ({ className = "w-32 h-32", variant = 'color' }) => {
  const leafColor1 = variant === 'bw' ? 'white' : '#22c55e';
  const leafColor2 = variant === 'bw' ? 'white' : '#15803d';
  const leafColor3 = variant === 'bw' ? 'white' : '#4ade80';
  const textColor = variant === 'bw' ? 'white' : 'black';

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Curvied Text - Start From Scratch */}
        <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full animate-[spin_60s_linear_infinite]">
          <path id="logoCurve" d="M 40,100 A 60,60 0 0,1 160,100" fill="transparent" />
          <text className={`text-[12px] font-black tracking-[0.6em] uppercase ${variant === 'bw' ? 'fill-white/40' : 'fill-zinc-400'}`}>
            <textPath xlinkHref="#logoCurve" startOffset="50%" textAnchor="middle">
              Start From Scratch
            </textPath>
          </text>
        </svg>

        {/* Replicated Leaf Design */}
        <div className="relative w-3/4 h-3/4 animate-float">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Top Leaf */}
            <path 
              d="M50,10 C65,10 80,25 80,45 C80,65 65,80 50,85 C35,80 20,65 20,45 C20,25 35,10 50,10" 
              fill={leafColor1} 
              transform="rotate(0 50 50) scale(0.6) translate(33, -20)"
            />
            {/* Right Leaf */}
            <path 
              d="M50,10 C65,10 80,25 80,45 C80,65 65,80 50,85 C35,80 20,65 20,45 C20,25 35,10 50,10" 
              fill={leafColor2} 
              transform="rotate(120 50 50) scale(0.6) translate(33, -20)"
            />
            {/* Left Leaf */}
            <path 
              d="M50,10 C65,10 80,25 80,45 C80,65 65,80 50,85 C35,80 20,65 20,45 C20,25 35,10 50,10" 
              fill={leafColor3} 
              transform="rotate(240 50 50) scale(0.6) translate(33, -20)"
            />
            {/* Inner Leaf Veins / Details */}
            <path d="M50,22 Q50,45 50,68" stroke="white" strokeWidth="1" fill="none" opacity="0.3" transform="rotate(0 50 50) scale(0.6) translate(33, -20)" />
            <path d="M50,22 Q50,45 50,68" stroke="white" strokeWidth="1" fill="none" opacity="0.3" transform="rotate(120 50 50) scale(0.6) translate(33, -20)" />
            <path d="M50,22 Q50,45 50,68" stroke="white" strokeWidth="1" fill="none" opacity="0.3" transform="rotate(240 50 50) scale(0.6) translate(33, -20)" />
          </svg>
        </div>
      </div>
      <h1 className={`font-serif text-4xl font-black uppercase tracking-[0.2em] mt-4 ${variant === 'bw' ? 'text-white' : 'text-black'}`}>
        ReStart
      </h1>
    </div>
  );
};

export default Logo;
