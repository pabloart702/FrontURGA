import { useState, useEffect } from 'react';
import './CofreAnimado.css';

export function CofreAnimado() {
  const [angle, setAngle] = useState(0);
  const [duration, setDuration] = useState(1.5);

  useEffect(() => {
    let currentAngle = 0;
    let timeoutId: NodeJS.Timeout;

    const spinDial = () => {
      // Sorteia um número de "casas" (de 1 a 10). Cada casa representa 36 graus (360/10 números)
      // Garantindo que pare sempre exatamente nos números (0, 10, 20... 90)
      const steps = Math.floor(Math.random() * 10) + 1;
      const baseDelta = steps * 36;
      const direction = Math.random() > 0.5 ? 1 : -1;
      const delta = baseDelta * direction;

      currentAngle += delta;
      setAngle(currentAngle);

      // Velocidade constante: 30 graus por segundo (ainda mais lento)
      // Tempo de animação = distância / velocidade
      const spinDuration = Math.abs(delta) / 50;
      setDuration(spinDuration);

      // Tempo de pausa fixo de 1.5 segundos após terminar o giro
      const pauseTime = 1500;
      const nextSpinDelay = (spinDuration * 1000) + pauseTime;

      timeoutId = setTimeout(spinDial, nextSpinDelay);
    };

    timeoutId = setTimeout(spinDial, 1000);
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="cofre-container">
      <svg viewBox="0 0 520 520" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cofre mecânico animado com dial giratório e engrenagens">
        <g className="cofre-svg-root">
          {/* Corpo principal do cofre */}
          <rect className="cofre-corpo" x="50" y="40" width="420" height="440" rx="26" />

          {/* Porta do cofre */}
          <rect className="cofre-porta" x="72" y="62" width="376" height="396" rx="16" />

          {/* Parafusos/Rebites nos cantos da porta */}
          <circle className="cofre-detalhe" cx="64" cy="54" r="4" />
          <circle className="cofre-detalhe" cx="456" cy="54" r="4" />
          <circle className="cofre-detalhe" cx="64" cy="466" r="4" />
          <circle className="cofre-detalhe" cx="456" cy="466" r="4" />

          {/* Dobradiças laterais (ajustadas para ficarem na borda interna, sem saltar) */}
          <rect className="cofre-detalhe" x="50" y="132" width="20" height="52" rx="7" />
          <rect className="cofre-detalhe" x="50" y="336" width="20" height="52" rx="7" />
          <line className="cofre-detalhe" x1="60" y1="144" x2="60" y2="172" />
          <line className="cofre-detalhe" x1="60" y1="348" x2="60" y2="376" />

          {/* Fechaduras/Travas inferiores (ajustadas para dentro da borda) */}
          <path className="cofre-detalhe" d="M104,480 L94,504 L128,504 L118,480 Z" />
          <path className="cofre-detalhe" d="M392,480 L382,504 L416,504 L406,480 Z" />

          {/* Encaixes/Travas internas da porta */}
          <rect className="cofre-detalhe" x="248" y="62" width="24" height="9" />
          <rect className="cofre-detalhe" x="248" y="447" width="24" height="9" />
          <rect className="cofre-detalhe" x="72" y="255" width="9" height="24" />
          <rect className="cofre-detalhe" x="439" y="255" width="9" height="24" />

          {/* Grupo da Engrenagem Esquerda */}
          <g transform="translate(127,260)">
            <g
              className="grupo-engrenagem-esq cofre-engrenagem"
              style={{ transform: `rotate(${-angle * 2.5}deg)`, transition: `transform ${duration}s ease-in-out`, opacity: 0.25 }}
            >
              <path d="M38.00,0.00 L50.00,0.00 L46.19,19.13 L35.11,14.54 L26.87,26.87 L35.36,35.36 L19.13,46.19 L14.54,35.11 L0.00,38.00 L0.00,50.00 L-19.13,46.19 L-14.54,35.11 L-26.87,26.87 L-35.36,35.36 L-46.19,19.13 L-35.11,14.54 L-38.00,0.00 L-50.00,0.00 L-46.19,-19.13 L-35.11,-14.54 L-26.87,-26.87 L-35.36,-35.36 L-19.13,-46.19 L-14.54,-35.11 L-0.00,-38.00 L-0.00,-50.00 L19.13,-46.19 L14.54,-35.11 L26.87,-26.87 L35.36,-35.36 L46.19,-19.13 L35.11,-14.54 Z" />
              <circle r="20" />
              <circle r="7" />
              <line x1="7.39" y1="3.06" x2="31.41" y2="13.01" />
              <line x1="-3.06" y1="7.39" x2="-13.01" y2="31.41" />
              <line x1="-7.39" y1="-3.06" x2="-31.41" y2="-13.01" />
              <line x1="3.06" y1="-7.39" x2="13.01" y2="-31.41" />
            </g>
          </g>

          {/* Grupo da Engrenagem Direita */}
          <g transform="translate(393,260)">
            <g
              className="grupo-engrenagem-dir cofre-engrenagem"
              style={{ transform: `rotate(${-angle * 2.5}deg)`, transition: `transform ${duration}s ease-in-out`, opacity: 0.25 }}
            >
              <path d="M38.00,0.00 L50.00,0.00 L46.19,19.13 L35.11,14.54 L26.87,26.87 L35.36,35.36 L19.13,46.19 L14.54,35.11 L0.00,38.00 L0.00,50.00 L-19.13,46.19 L-14.54,35.11 L-26.87,26.87 L-35.36,35.36 L-46.19,19.13 L-35.11,14.54 L-38.00,0.00 L-50.00,0.00 L-46.19,-19.13 L-35.11,-14.54 L-26.87,-26.87 L-35.36,-35.36 L-19.13,-46.19 L-14.54,-35.11 L-0.00,-38.00 L-0.00,-50.00 L19.13,-46.19 L14.54,-35.11 L26.87,-26.87 L35.36,-35.36 L46.19,-19.13 L35.11,-14.54 Z" />
              <circle r="20" />
              <circle r="7" />
              <line x1="7.39" y1="3.06" x2="31.41" y2="13.01" />
              <line x1="-3.06" y1="7.39" x2="-13.01" y2="31.41" />
              <line x1="-7.39" y1="-3.06" x2="-31.41" y2="-13.01" />
              <line x1="3.06" y1="-7.39" x2="13.01" y2="-31.41" />
            </g>
          </g>

          {/* Ponteiro fixo superior que indica o número atual */}
          <g transform="translate(260,260)" className="cofre-ponteiro">
            <path d="M0,-112 L-7,-131 L7,-131 Z" />
            <circle r="120" strokeDasharray="2 6" className="cofre-dial-fino" />
          </g>

          {/* Grupo do Dial e Engrenagem Central */}
          <g transform="translate(260,260)">
            <g
              className="grupo-dial"
              style={{ transform: `rotate(${angle}deg)`, transition: `transform ${duration}s ease-in-out` }}
            >
              {/* Engrenagem principal (fundo com transparência simulando profundidade) */}
              <path className="cofre-dial-anel" opacity="0.25" d="M95.00,0.00 L109.00,0.00 L107.66,17.05 L93.83,14.86 L90.35,29.36 L103.67,33.68 L97.12,49.48 L84.65,43.13 L76.86,55.84 L88.18,64.07 L77.07,77.07 L67.18,67.18 L55.84,76.86 L64.07,88.18 L49.48,97.12 L43.13,84.65 L29.36,90.35 L33.68,103.67 L17.05,107.66 L14.86,93.83 L0.00,95.00 L0.00,109.00 L-17.05,107.66 L-14.86,93.83 L-29.36,90.35 L-33.68,103.67 L-49.48,97.12 L-43.13,84.65 L-55.84,76.86 L-64.07,88.18 L-77.07,77.07 L-67.18,67.18 L-76.86,55.84 L-88.18,64.07 L-97.12,49.48 L-84.65,43.13 L-90.35,29.36 L-103.67,33.68 L-107.66,17.05 L-93.83,14.86 L-95.00,0.00 L-109.00,0.00 L-107.66,-17.05 L-93.83,-14.86 L-90.35,-29.36 L-103.67,-33.68 L-97.12,-49.48 L-84.65,-43.13 L-76.86,-55.84 L-88.18,-64.07 L-77.07,-77.07 L-67.18,-67.18 L-55.84,-76.86 L-64.07,-88.18 L-49.48,-97.12 L-43.13,-84.65 L-29.36,-90.35 L-33.68,-103.67 L-17.05,-107.66 L-14.86,-93.83 L-0.00,-95.00 L-0.00,-109.00 L17.05,-107.66 L14.86,-93.83 L29.36,-90.35 L33.68,-103.67 L49.48,-97.12 L43.13,-84.65 L55.84,-76.86 L64.07,-88.18 L77.07,-77.07 L67.18,-67.18 L76.86,-55.84 L88.18,-64.07 L97.12,-49.48 L84.65,-43.13 L90.35,-29.36 L103.67,-33.68 L107.66,-17.05 L93.83,-14.86 Z" />
              <circle className="cofre-dial-fino" r="82" />
              <g className="cofre-dial-anel">
                <line x1="0.00" y1="-82.00" x2="0.00" y2="-95.00" /><line x1="48.20" y1="-66.34" x2="55.84" y2="-76.86" /><line x1="77.99" y1="-25.34" x2="90.35" y2="-29.36" /><line x1="77.99" y1="25.34" x2="90.35" y2="29.36" /><line x1="48.20" y1="66.34" x2="55.84" y2="76.86" /><line x1="0.00" y1="82.00" x2="0.00" y2="95.00" /><line x1="-48.20" y1="66.34" x2="-55.84" y2="76.86" /><line x1="-77.99" y1="25.34" x2="-90.35" y2="29.36" /><line x1="-77.99" y1="-25.34" x2="-90.35" y2="-29.36" /><line x1="-48.20" y1="-66.34" x2="-55.84" y2="-76.86" />
              </g>
              <g className="cofre-dial-fino">
                <line x1="27.19" y1="-83.69" x2="29.36" y2="-90.35" /><line x1="71.19" y1="-51.73" x2="76.86" y2="-55.84" /><line x1="88.00" y1="0.00" x2="95.00" y2="0.00" /><line x1="71.19" y1="51.73" x2="76.86" y2="55.84" /><line x1="27.19" y1="83.69" x2="29.36" y2="90.35" /><line x1="-27.19" y1="83.69" x2="-29.36" y2="90.35" /><line x1="-71.19" y1="51.73" x2="-76.86" y2="55.84" /><line x1="-88.00" y1="0.00" x2="-95.00" y2="0.00" /><line x1="-71.19" y1="-51.73" x2="-76.86" y2="-55.84" /><line x1="-27.19" y1="-83.69" x2="-29.36" y2="-90.35" />
              </g>
              <g style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                <text x="0.00" y="-72.00" fontSize="15" textAnchor="middle" dominantBaseline="middle">0</text>
                <text x="42.32" y="-58.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">10</text>
                <text x="68.48" y="-22.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">20</text>
                <text x="68.48" y="22.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">30</text>
                <text x="42.32" y="58.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">40</text>
                <text x="0.00" y="72.00" fontSize="15" textAnchor="middle" dominantBaseline="middle">50</text>
                <text x="-42.32" y="58.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">60</text>
                <text x="-68.48" y="22.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">70</text>
                <text x="-68.48" y="-22.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">80</text>
                <text x="-42.32" y="-58.25" fontSize="15" textAnchor="middle" dominantBaseline="middle">90</text>
              </g>
              <circle className="cofre-dial-anel" r="15" />
              <line className="cofre-dial-anel" x1="0" y1="0" x2="0" y2="-11" />
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
