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

          {/* Grupo unificado para diminuir escala e mover para a esquerda */}
          <g transform="translate(175, 260) scale(0.68) translate(-260, -260)">
            {/* Grupo da Engrenagem Superior (Nova) conectada à direita */}
            <g transform="translate(430, 143)">
              <g
                className="grupo-engrenagem-sup cofre-engrenagem"
                style={{ transform: `rotate(${angle * 2.0}deg)`, transition: `transform ${duration}s ease-in-out`, opacity: 0.30 }}
              >
                <path d="M53.76,-5.08 L53.76,5.08 L40.01,8.94 L37.63,16.28 L46.48,27.49 L40.51,35.71 L27.11,30.75 L20.87,35.29 L21.45,49.56 L11.78,52.70 L3.86,40.82 L-3.86,40.82 L-11.78,52.70 L-21.45,49.56 L-20.87,35.29 L-27.11,30.75 L-40.51,35.71 L-46.48,27.49 L-37.63,16.28 L-40.01,8.94 L-53.76,5.08 L-53.76,-5.08 L-40.01,-8.94 L-37.63,-16.28 L-46.48,-27.49 L-40.51,-35.71 L-27.11,-30.75 L-20.87,-35.29 L-21.45,-49.56 L-11.78,-52.70 L-3.86,-40.82 L3.86,-40.82 L11.78,-52.70 L21.45,-49.56 L20.87,-35.29 L27.11,-30.75 L40.51,-35.71 L46.48,-27.49 L37.63,-16.28 L40.01,-8.94 Z" />
                <circle r="20" />
                <circle r="7" />
                <line x1="7.39" y1="3.06" x2="31.41" y2="13.01" />
                <line x1="-3.06" y1="7.39" x2="-13.01" y2="31.41" />
                <line x1="-7.39" y1="-3.06" x2="-31.41" y2="-13.01" />
                <line x1="3.06" y1="-7.39" x2="13.01" y2="-31.41" />
              </g>
            </g>

            {/* Grupo da Engrenagem Direita (Aumentada) */}
            <g transform="translate(430, 260)">
              <g
                className="grupo-engrenagem-dir cofre-engrenagem"
                style={{ transform: `rotate(${-angle * 1.42857 + 12.857}deg)`, transition: `transform ${duration}s ease-in-out`, opacity: 0.30 }}
              >
                <path d="M75.43,-5.09 L75.43,5.09 L61.83,9.79 L59.96,18.00 L70.17,28.15 L65.75,37.31 L51.46,35.65 L46.21,42.23 L51.01,55.80 L43.05,62.14 L30.89,54.45 L23.31,58.10 L21.74,72.41 L11.83,74.67 L4.21,62.46 L-4.21,62.46 L-11.83,74.67 L-21.74,72.41 L-23.31,58.10 L-30.89,54.45 L-43.05,62.14 L-51.01,55.80 L-46.21,42.23 L-51.46,35.65 L-65.75,37.31 L-70.17,28.15 L-59.96,18.00 L-61.83,9.79 L-75.43,5.09 L-75.43,-5.09 L-61.83,-9.79 L-59.96,-18.00 L-70.17,-28.15 L-65.75,-37.31 L-51.46,-35.65 L-46.21,-42.23 L-51.01,-55.80 L-43.05,-62.14 L-30.89,-54.45 L-23.31,-58.10 L-21.74,-72.41 L-11.83,-74.67 L-4.21,-62.46 L4.21,-62.46 L11.83,-74.67 L21.74,-72.41 L23.31,-58.10 L30.89,-54.45 L43.05,-62.14 L51.01,-55.80 L46.21,-42.23 L51.46,-35.65 L65.75,-37.31 L70.17,-28.15 L59.96,-18.00 L61.83,-9.79 Z" />
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
                <path className="cofre-dial-anel" opacity="0.30" d="M107.88,-5.09 L107.88,5.09 L94.43,10.42 L93.03,19.26 L104.17,28.50 L101.03,38.18 L86.58,39.09 L82.52,47.07 L90.27,59.29 L84.29,67.53 L70.26,63.94 L63.94,70.26 L67.53,84.29 L59.29,90.27 L47.07,82.52 L39.09,86.58 L38.18,101.03 L28.50,104.17 L19.26,93.03 L10.42,94.43 L5.09,107.88 L-5.09,107.88 L-10.42,94.43 L-19.26,93.03 L-28.50,104.17 L-38.18,101.03 L-39.09,86.58 L-47.07,82.52 L-59.29,90.27 L-67.53,84.29 L-63.94,70.26 L-70.26,63.94 L-84.29,67.53 L-90.27,59.29 L-82.52,47.07 L-86.58,39.09 L-101.03,38.18 L-104.17,28.50 L-93.03,19.26 L-94.43,10.42 L-107.88,5.09 L-107.88,-5.09 L-94.43,-10.42 L-93.03,-19.26 L-104.17,-28.50 L-101.03,-38.18 L-86.58,-39.09 L-82.52,-47.07 L-90.27,-59.29 L-84.29,-67.53 L-70.26,-63.94 L-63.94,-70.26 L-67.53,-84.29 L-59.29,-90.27 L-47.07,-82.52 L-39.09,-86.58 L-38.18,-101.03 L-28.50,-104.17 L-19.26,-93.03 L-10.42,-94.43 L-5.09,-107.88 L5.09,-107.88 L10.42,-94.43 L19.26,-93.03 L28.50,-104.17 L38.18,-101.03 L39.09,-86.58 L47.07,-82.52 L59.29,-90.27 L67.53,-84.29 L63.94,-70.26 L70.26,-63.94 L84.29,-67.53 L90.27,-59.29 L82.52,-47.07 L86.58,-39.09 L101.03,-38.18 L104.17,-28.50 L93.03,-19.26 L94.43,-10.42 Z" />
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

          {/* Alavanca de Abertura (Lado Direito) */}
          <g transform="translate(385, 260)">
            {/* Base da alavanca presa na porta */}
            <circle r="25" className="cofre-corpo" />
            <circle r="15" className="cofre-dial-anel" />

            {/* Haste da alavanca apontando para baixo */}
            <rect x="-6" y="15" width="12" height="100" rx="6" className="cofre-dial-anel" fill="currentColor" opacity="0.9" />

            {/* Bola na ponta da alavanca */}
            <circle cy="115" r="14" className="cofre-corpo" fill="currentColor" opacity="0.9" />
          </g>
        </g>
      </svg>
    </div>
  );
}
