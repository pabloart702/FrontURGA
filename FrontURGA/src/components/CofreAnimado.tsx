import './CofreAnimado.css';

export function CofreAnimado() {
  return (
    <div className="cofre-container">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 680 470" width="100%" height="100%">

        {/* Opacidade aumentada de 0.15 para 0.45 */}
        <g stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1.5" fill="none" strokeLinejoin="round">

          {/* CUBE (Outer safe body) */}
          <polygon points="100,110 340,60 540,140 300,190" />
          <polygon points="100,110 300,190 300,405 100,330" />
          <polygon points="300,190 540,140 540,360 300,405" />

          {/* DOOR (inset) */}
          <polygon points="312,198 528,153 528,347 312,392" stroke="rgba(255, 255, 255, 0.6)" />

          {/* Recessed inner panel */}
          <polygon points="329,210 511,172 511,335 329,373" stroke="rgba(255, 255, 255, 0.4)" />

          {/* HINGES */}
          <rect x="296" y="220" width="16" height="26" rx="2" stroke="rgba(255, 255, 255, 0.5)" />
          <rect x="296" y="331" width="16" height="26" rx="2" stroke="rgba(255, 255, 255, 0.5)" />

          {/* KEYPAD */}
          <polygon points="442,200 496,189 496,257 442,269" />
          <g stroke="rgba(255, 255, 255, 0.5)" fill="rgba(255,255,255,0.35)">
            <circle cx="451.7" cy="218.6" r="3.4" />
            <circle cx="469" cy="215.1" r="3.4" />
            <circle cx="486.3" cy="211.6" r="3.4" />
            <circle cx="451.7" cy="237.5" r="3.4" />
            <circle cx="469" cy="234" r="3.4" />
            <circle cx="486.3" cy="230.5" r="3.4" />
            <circle cx="451.7" cy="256.4" r="3.4" />
            <circle cx="469" cy="252.9" r="3.4" />
            <circle cx="486.3" cy="249.4" r="3.4" />
          </g>

          {/* HANDLE WHEEL + CROSSBAR (Movida para baixo e rotativo anti-horário) */}

          <g className="gear-reverse" style={{ transformOrigin: '381px 333px' }}>
            <circle cx="381" cy="333" r="20" stroke="rgba(212, 175, 55, 0.6)" />
            <circle cx="381" cy="333" r="2" fill="rgba(212, 175, 55, 0.8)" />
            <circle cx="381" cy="313" r="2" fill="rgba(212, 175, 55, 0.8)" />
            <line x1="381" y1="313" x2="381" y2="353" stroke="rgba(212, 175, 55, 0.5)" />
          </g>

          {/* MAIN DIAL (ROTATIONAL UNLOCKING SYSTEM) */}
          <circle cx="381" cy="271" r="42" stroke="rgba(212, 175, 55, 0.6)" strokeWidth="2" />

          <g className="lock-gear" style={{ transformOrigin: '381px 271px' }}>
            <circle cx="381" cy="271" r="34" strokeDasharray="50 2" stroke="rgba(212, 175, 55, 0.8)" strokeWidth="4" />
            <line x1="381" y1="271" x2="381" y2="295" stroke="rgba(212, 175, 55, 0.8)" strokeWidth="2" />
            <circle cx="381" cy="295" r="2" fill="rgba(212, 175, 55, 0.8)" />
            <line x1="381" y1="271" x2="381" y2="247" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
            <line x1="381" y1="271" x2="350" y2="271" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
            <line x1="381" y1="271" x2="411" y2="271" stroke="rgba(212, 175, 55, 0.5)" strokeWidth="2" />
          </g>



          {/* Corner lines to reinforce 3D */}
          <line x1="300" y1="190" x2="300" y2="400" stroke="rgba(255,255,255,0.35)" />
          <line x1="540" y1="140" x2="540" y2="360" stroke="rgba(255,255,255,0.35)" />
        </g>
      </svg>
    </div>
  );
}
