import React from 'react'

export default function Logo({
  variant = 'horizontal',
  size = 'md',
  showTagline = true,
  className = '',
  isDarkBg = false,
  id = 'it-saathi-logo'
}) {
  // Height configurations
  const heightMap = {
    xs: 'h-8',
    sm: 'h-10',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20',
    hero: 'h-24 sm:h-28',
    invoice: 'h-14',
  }

  const selectedHeight = heightMap[size] || size

  // If variant is just the emblem/symbol
  if (variant === 'emblem') {
    return (
      <div
        id={id}
        className={`relative inline-flex items-center justify-center shrink-0 overflow-hidden rounded-2xl ${selectedHeight} aspect-square ${
          isDarkBg
            ? 'bg-slate-900 border border-slate-700/80 shadow-md'
            : 'bg-white border border-slate-200/80 shadow-sm'
        } ${className}`}
      >
        <svg
          viewBox="0 0 800 420"
          className="w-full h-full p-1.5 transition-transform duration-300 group-hover:scale-105"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="embHorseBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#0a4d8c" />
              <stop offset="50%" stop-color="#0066cc" />
              <stop offset="100%" stop-color="#38bdf8" />
            </linearGradient>
            <linearGradient id="embSilver" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="60%" stop-color="#f1f5f9" />
              <stop offset="100%" stop-color="#94a3b8" />
            </linearGradient>
            <linearGradient id="embArc" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.1" />
              <stop offset="30%" stop-color="#0066cc" />
              <stop offset="70%" stop-color="#00aaff" />
              <stop offset="100%" stop-color="#004499" />
            </linearGradient>
          </defs>

          {/* Speed Arc */}
          <path d="M 40 315 C 180 300, 380 270, 610 272 C 680 273, 730 285, 755 295 C 710 286, 640 280, 580 280 C 370 280, 190 305, 55 320 Z" fill="url(#embArc)" />

          {/* Mane */}
          <path d="M 290 85 C 205 105, 125 185, 40 235 C 105 215, 180 160, 270 120 Z" fill="url(#embSilver)" />
          <path d="M 460 48 C 370 70, 285 125, 230 195 C 285 130, 375 80, 465 58 Z" fill="url(#embSilver)" />
          <path d="M 520 40 C 435 55, 355 102, 295 170 C 355 110, 440 68, 530 46 Z" fill="#e2e8f0" />
          
          {/* Head */}
          <path d="M 648 60 C 655 48, 668 40, 678 42 C 675 55, 665 68, 655 78 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
          <path d="M 632 78 C 675 98, 715 142, 715 178 C 685 190, 652 148, 615 172 C 540 160, 600 135, 632 78 Z" fill="url(#embSilver)" />
          <circle cx="682" cy="138" r="6" fill="#0f172a" />
          <circle cx="684" cy="136" r="2" fill="#ffffff" />
          
          {/* Forelegs */}
          <path d="M 570 235 C 645 285, 755 355, 735 355 C 670 295, 595 245, 570 235 Z" fill="url(#embSilver)" />
          <path d="M 750 350 L 768 368 C 762 375, 750 375, 742 368 L 735 355 Z" fill="#0066cc" />
          <path d="M 525 245 C 580 295, 595 330, 565 335 C 535 285, 505 265, 525 245 Z" fill="#0077e6" />
          
          {/* Body */}
          <path d="M 235 230 C 310 160, 420 125, 525 145 C 465 210, 365 272, 245 275 Z" fill="url(#embHorseBody)" />
          <path d="M 245 275 C 170 300, 65 335, 115 305 C 205 265, 245 252, 245 275 Z" fill="#0066cc" />
          <path d="M 285 270 C 225 325, 125 382, 175 345 C 245 295, 275 275, 285 270 Z" fill="url(#embSilver)" />

          {/* Circuits */}
          <path d="M 280 165 L 385 165 L 405 180 L 450 180" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          <circle cx="452" cy="180" r="6" fill="#ffffff" stroke="#0099ff" stroke-width="2" />
          <path d="M 260 190 L 330 190 L 350 205 L 485 205" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          <circle cx="488" cy="205" r="6.5" fill="#ffffff" stroke="#0077e6" stroke-width="2" />
          <path d="M 245 215 L 305 215 L 325 230 L 440 230" stroke="#ffffff" stroke-width="4" stroke-linecap="round" />
          <circle cx="442" cy="230" r="6" fill="#ffffff" stroke="#0099ff" stroke-width="2" />
        </svg>
      </div>
    )
  }

  // Full stacked logo (Horse on top, IT SAATHI wordmark + tagline underneath)
  if (variant === 'full') {
    return (
      <div id={id} className={`inline-flex flex-col items-center select-none ${className}`}>
        <img
          src="/logo.svg"
          alt="IT SAATHI - Complete IT Accessories Partner"
          className={`${selectedHeight} w-auto object-contain transition-transform duration-300 hover:scale-[1.02]`}
        />
      </div>
    )
  }

  // Horizontal Header / Navbar format (Emblem on left + stylized typography & badge on right)
  return (
    <div id={id} className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Brand Horse Symbol */}
      <div className="relative shrink-0">
        <div
          className={`flex items-center justify-center rounded-2xl p-1 shadow-sm transition-all duration-300 group-hover:scale-105 ${
            isDarkBg
              ? 'bg-slate-900 border border-slate-800 ring-1 ring-white/10'
              : 'bg-white border border-slate-200/90 ring-2 ring-blue-50/80 shadow-blue-900/5'
          } ${size === 'sm' ? 'h-10 w-10' : size === 'lg' ? 'h-14 w-14' : 'h-12 w-12'}`}
        >
          <svg
            viewBox="0 0 800 420"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="navHorseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#0a4d8c" />
                <stop offset="50%" stop-color="#0066cc" />
                <stop offset="100%" stop-color="#38bdf8" />
              </linearGradient>
              <linearGradient id="navSilver" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ffffff" />
                <stop offset="60%" stop-color="#f1f5f9" />
                <stop offset="100%" stop-color="#94a3b8" />
              </linearGradient>
              <linearGradient id="navArc" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stop-color="#94a3b8" stop-opacity="0.1" />
                <stop offset="30%" stop-color="#0066cc" />
                <stop offset="70%" stop-color="#00aaff" />
                <stop offset="100%" stop-color="#004499" />
              </linearGradient>
            </defs>

            {/* Arc */}
            <path d="M 40 315 C 180 300, 380 270, 610 272 C 680 273, 730 285, 755 295 C 710 286, 640 280, 580 280 C 370 280, 190 305, 55 320 Z" fill="url(#navArc)" />
            {/* Mane & Head */}
            <path d="M 290 85 C 205 105, 125 185, 40 235 C 105 215, 180 160, 270 120 Z" fill="url(#navSilver)" />
            <path d="M 520 40 C 435 55, 355 102, 295 170 C 355 110, 440 68, 530 46 Z" fill="#e2e8f0" />
            <path d="M 648 60 C 655 48, 668 40, 678 42 C 675 55, 665 68, 655 78 Z" fill="#ffffff" stroke="#94a3b8" stroke-width="2" />
            <path d="M 632 78 C 675 98, 715 142, 715 178 C 685 190, 652 148, 615 172 C 540 160, 600 135, 632 78 Z" fill="url(#navSilver)" />
            <circle cx="682" cy="138" r="6" fill="#0f172a" />
            <circle cx="684" cy="136" r="2" fill="#ffffff" />
            {/* Forelegs */}
            <path d="M 570 235 C 645 285, 755 355, 735 355 C 670 295, 595 245, 570 235 Z" fill="url(#navSilver)" />
            <path d="M 750 350 L 768 368 C 762 375, 750 375, 742 368 L 735 355 Z" fill="#0066cc" />
            {/* Body */}
            <path d="M 235 230 C 310 160, 420 125, 525 145 C 465 210, 365 272, 245 275 Z" fill="url(#navHorseGrad)" />
            <path d="M 245 275 C 170 300, 65 335, 115 305 C 205 265, 245 252, 245 275 Z" fill="#0066cc" />
            {/* Circuits */}
            <path d="M 280 165 L 385 165 L 405 180 L 450 180" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
            <circle cx="452" cy="180" r="7" fill="#ffffff" stroke="#0099ff" stroke-width="2" />
            <path d="M 260 190 L 330 190 L 350 205 L 485 205" stroke="#ffffff" stroke-width="5" stroke-linecap="round" />
            <circle cx="488" cy="205" r="7" fill="#ffffff" stroke="#0077e6" stroke-width="2" />
          </svg>
        </div>

        {/* Live operational badge dot */}
        <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 shadow-xs ring-1 ring-emerald-300" />
      </div>

      {/* Typography Column */}
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className="text-lg sm:text-xl font-black tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #0056b3 0%, #0077e6 50%, #00aaff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            IT
          </span>
          <span
            className={`text-lg sm:text-xl font-black tracking-tight ${
              isDarkBg ? 'text-white' : 'text-slate-900'
            }`}
          >
            SAATHI
          </span>
          <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 tracking-wider">
            OFFICIAL
          </span>
        </div>

        {showTagline && (
          <div
            className={`text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.18em] mt-1 flex items-center gap-1 ${
              isDarkBg ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            <span>Complete IT Accessories Partner</span>
          </div>
        )}
      </div>
    </div>
  )
}
