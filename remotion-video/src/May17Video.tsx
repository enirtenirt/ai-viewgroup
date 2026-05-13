import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
  Img,
  staticFile,
  Series,
} from "remotion";

const FONT_SERIF = "Georgia, 'Times New Roman', serif";
const FONT_SANS = "Arial, Helvetica, sans-serif";

const FLAG = { red: "#EF2B2D", white: "#FFFFFF", blue: "#002868" };
const BRAND = { dark: "#3D1547", mid: "#581B66", pop: "#B978F5", light: "#CC99FF" };

const useCardAnim = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const sp = spring({ frame: frame - 4, fps, config: { stiffness: 180, damping: 16 } });
  const exitOp = interpolate(frame, [35, 42], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { bgOp, sp, exitOp, frame, fps };
};

// Scale from center of 1080x1080 SVG
const svgScale = (s: number) =>
  `translate(${540 * (1 - s)}, ${540 * (1 - s)}) scale(${s})`;

// ── 1. BUNAD ─────────────────────────────────────────────────────────────────
const SceneBunad = () => {
  const { bgOp, sp, exitOp } = useCardAnim();
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #8B1A1A 0%, #1A237E 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        <g transform={svgScale(0.7 + sp * 0.3)} opacity={sp}>
          {/* Outer gold border */}
          <rect x="60" y="60" width="960" height="960" fill="none" stroke="#FFD700" strokeWidth="8" opacity="0.6" />
          <rect x="80" y="80" width="920" height="920" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.35" />

          {/* Large diamond */}
          <polygon points="540,160 920,540 540,920 160,540" fill="none" stroke="#FFD700" strokeWidth="5" opacity="0.7" />
          <polygon points="540,220 860,540 540,860 220,540" fill="none" stroke="#FFD700" strokeWidth="2" opacity="0.35" />

          {/* Corner rosettes */}
          {([[200, 200], [880, 200], [200, 880], [880, 880]] as [number, number][]).map(([cx, cy], i) => (
            <g key={i}>
              <circle cx={cx} cy={cy} r="72" fill="none" stroke="#FFD700" strokeWidth="4" opacity="0.7" />
              <circle cx={cx} cy={cy} r="42" fill="#FFD700" opacity="0.18" />
              <circle cx={cx} cy={cy} r="18" fill="#FFD700" opacity="0.85" />
              {([0, 45, 90, 135, 180, 225, 270, 315] as number[]).map(a => {
                const r = a * Math.PI / 180;
                return (
                  <line key={a}
                    x1={cx + 22 * Math.cos(r)} y1={cy + 22 * Math.sin(r)}
                    x2={cx + 56 * Math.cos(r)} y2={cy + 56 * Math.sin(r)}
                    stroke="#FFD700" strokeWidth="3" opacity="0.55" />
                );
              })}
            </g>
          ))}

          {/* Central medallion */}
          <circle cx="540" cy="540" r="190" fill="none" stroke="#FFD700" strokeWidth="6" opacity="0.7" />
          <circle cx="540" cy="540" r="150" fill="rgba(255,215,0,0.08)" />
          <circle cx="540" cy="540" r="110" fill="none" stroke="#FFD700" strokeWidth="2.5" opacity="0.45" />
          {(Array.from({ length: 12 }) as unknown[]).map((_, i) => {
            const a = i * 30 * Math.PI / 180;
            return (
              <ellipse key={i}
                cx={540 + 128 * Math.cos(a)} cy={540 + 128 * Math.sin(a)}
                rx="17" ry="10"
                transform={`rotate(${i * 30}, ${540 + 128 * Math.cos(a)}, ${540 + 128 * Math.sin(a)})`}
                fill="#FFD700" opacity="0.5" />
            );
          })}

          {/* Center flower petals */}
          {([0, 72, 144, 216, 288] as number[]).map(a => {
            const r = a * Math.PI / 180;
            return (
              <ellipse key={a}
                cx={540 + 40 * Math.cos(r)} cy={540 + 40 * Math.sin(r)}
                rx="24" ry="14"
                transform={`rotate(${a + 90}, ${540 + 40 * Math.cos(r)}, ${540 + 40 * Math.sin(r)})`}
                fill="#CC0000" opacity="0.9" />
            );
          })}
          <circle cx="540" cy="540" r="22" fill="#FFD700" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── 2. IS ────────────────────────────────────────────────────────────────────
const SceneIs = () => {
  const { bgOp, sp, exitOp, frame, fps } = useCardAnim();
  const drip = spring({ frame: frame - 14, fps, config: { stiffness: 55, damping: 18 } });
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #87CEEB 0%, #E8F5FF 38%, #FFE4E1 68%, #F8BBD9 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        {/* Background dots */}
        {([[100, 200], [980, 180], [120, 860], [940, 900], [80, 540], [1010, 520]] as [number, number][]).map(([cx, cy], i) => (
          <circle key={i} cx={cx} cy={cy} r="18" fill="rgba(255,182,193,0.35)" opacity={sp} />
        ))}

        <g transform={svgScale(0.55 + sp * 0.45)} opacity={sp}>
          {/* Waffle cone */}
          <polygon points="540,940 350,540 730,540" fill="#D2691E" />
          {/* Cone grid */}
          {([0, 1, 2, 3, 4, 5] as number[]).map(i => (
            <line key={i} x1={350 + i * 63} y1={540} x2={540} y2={940} stroke="#A0522D" strokeWidth="2" opacity="0.45" />
          ))}
          {([0, 1, 2, 3] as number[]).map(i => {
            const y = 580 + i * 88;
            const f = (y - 540) / 400;
            return <line key={i} x1={350 + f * 190} y1={y} x2={730 - f * 190} y2={y} stroke="#A0522D" strokeWidth="2" opacity="0.45" />;
          })}

          {/* Three scoops */}
          <circle cx="540" cy="495" r="125" fill="#FF6B8A" />
          <circle cx="488" cy="374" r="118" fill="#FFFDD0" />
          <circle cx="572" cy="255" r="112" fill="#8FBC8F" />

          {/* Drip */}
          <ellipse cx={595 + drip * 28} cy={425 + drip * 55} rx="13" ry={22 + drip * 18} fill="#FF6B8A" opacity="0.82" />

          {/* Sprinkles */}
          {([[415, 218, 42], [615, 198, -28], [475, 168, 14], [645, 248, 58], [398, 292, -18], [655, 302, 33], [455, 312, 78]] as [number, number, number][]).map(([x, y, rot], i) => (
            <rect key={i} x={x - 13} y={y - 4} width="26" height="8" rx="4"
              fill={["#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94", "#C3A6FF"][i % 6]}
              transform={`rotate(${rot}, ${x}, ${y})`} opacity="0.92" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── 3. PØLSER ────────────────────────────────────────────────────────────────
const ScenePolser = () => {
  const { bgOp, sp, exitOp, frame } = useCardAnim();
  const flicker = Math.sin(frame * 0.55) * 0.14 + 0.86;
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #CC3300 0%, #FF5500 55%, #FF8C00 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        {/* Flames */}
        <g opacity={sp * flicker}>
          {([[270, 790], [410, 758], [550, 748], [690, 758], [830, 790]] as [number, number][]).map(([cx, cy], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy - 65} rx="42" ry="95" fill="#FF4500" opacity="0.68" />
              <ellipse cx={cx} cy={cy - 85} rx="27" ry="73" fill="#FF8C00" opacity="0.78" />
              <ellipse cx={cx} cy={cy - 100} rx="16" ry="52" fill="#FFD700" opacity="0.88" />
            </g>
          ))}
        </g>

        {/* Grill grate */}
        <g opacity={sp}>
          {([610, 672, 734, 796] as number[]).map(y => (
            <rect key={y} x="155" y={y} width="770" height="25" rx="12" fill="#2A2A2A" opacity="0.9" />
          ))}
          {([198, 278, 358, 438, 518, 598, 678, 758, 838] as number[]).map(x => (
            <rect key={x} x={x} y="600" width="18" height="220" rx="9" fill="#383838" opacity="0.7" />
          ))}
        </g>

        {/* Sausages */}
        <g transform={svgScale(0.72 + sp * 0.28)} opacity={sp}>
          {([[195, 572], [455, 545], [710, 558]] as [number, number][]).map(([x, y], i) => (
            <g key={i}>
              <rect x={x} y={y} width="295" height="78" rx="39" fill="#B22222" />
              <rect x={x} y={y} width="295" height="78" rx="39" fill="none" stroke="#8B0000" strokeWidth="3" />
              {/* Grill marks */}
              {([52, 112, 172, 232] as number[]).map(dx => (
                <line key={dx} x1={x + dx} y1={y + 10} x2={x + dx - 14} y2={y + 68} stroke="#6B0000" strokeWidth="5" opacity="0.55" />
              ))}
              {/* Sheen */}
              <ellipse cx={x + 80} cy={y + 24} rx="58" ry="15" fill="rgba(255,160,160,0.28)" />
            </g>
          ))}
        </g>

        {/* Smoke */}
        <g opacity={sp * 0.45}>
          {([[350, 505], [545, 485], [735, 495]] as [number, number][]).map(([cx, cy], i) => (
            <path key={i}
              d={`M${cx},${cy} Q${cx + 28},${cy - 42} ${cx},${cy - 84} Q${cx - 22},${cy - 125} ${cx + 12},${cy - 165}`}
              stroke="white" strokeWidth="9" fill="none" strokeLinecap="round" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── 4. CHAMPAGNE ─────────────────────────────────────────────────────────────
const SceneChampagne = () => {
  const { bgOp, sp, exitOp, frame } = useCardAnim();
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(180deg, #080812 0%, #1A1200 48%, #8B6914 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        {/* Rising bubbles */}
        {(Array.from({ length: 22 }) as unknown[]).map((_, i) => {
          const x = 140 + (i % 8) * 115;
          const y = ((900 - (i * 37) % 820) - frame * (1.4 + (i % 3) * 0.6) % 920 + 920) % 920 + 80;
          const r = 7 + (i % 5) * 5;
          return (
            <circle key={i} cx={x} cy={y} r={r}
              fill="none" stroke="#FFD700" strokeWidth="2"
              opacity={sp * (0.25 + (i % 4) * 0.15)} />
          );
        })}

        {/* Bottle */}
        <g transform={svgScale(0.62 + sp * 0.38)} opacity={sp}>
          {/* Body */}
          <path d="M448,810 Q418,755 398,682 L398,452 Q398,378 450,338 L450,215 Q450,195 492,185 L592,185 Q632,195 632,215 L632,338 Q684,378 684,452 L684,682 Q662,755 634,810 Z"
            fill="#1A5C1A" stroke="#0A3D0A" strokeWidth="4" />
          {/* Label */}
          <rect x="418" y="482" width="246" height="162" rx="8" fill="#F5E642" opacity="0.92" />
          <rect x="428" y="492" width="226" height="142" rx="6" fill="none" stroke="#8B6914" strokeWidth="2" />
          {/* Foil cap */}
          <rect x="458" y="185" width="166" height="82" rx="6" fill="#B8860B" />
          <rect x="458" y="185" width="166" height="82" rx="6" fill="none" stroke="#FFD700" strokeWidth="3" />
          {/* Cork */}
          <rect x="498" y="145" width="86" height="50" rx="6" fill="#D2B48C" />
          {/* Cage wire lines */}
          {([488, 540, 592] as number[]).map(x => (
            <line key={x} x1={x} y1={185} x2={x} y2={148} stroke="#888" strokeWidth="2.5" />
          ))}
          {/* Fizz spray */}
          {(Array.from({ length: 9 }) as unknown[]).map((_, i) => {
            const a = (-95 + i * 22) * Math.PI / 180;
            const len = 38 + (i % 3) * 32;
            return <line key={i} x1={540} y1={138} x2={540 + len * Math.cos(a)} y2={138 + len * Math.sin(a)}
              stroke="#FFD700" strokeWidth="3.5" strokeLinecap="round" opacity="0.85" />;
          })}
        </g>

        {/* Gold sparkles */}
        {([[175, 195], [905, 245], [145, 705], [955, 645], [295, 905], [805, 875]] as [number, number][]).map(([x, y], i) => (
          <g key={i} opacity={sp * 0.72}>
            <line x1={x - 13} y1={y} x2={x + 13} y2={y} stroke="#FFD700" strokeWidth="2.5" />
            <line x1={x} y1={y - 13} x2={x} y2={y + 13} stroke="#FFD700" strokeWidth="2.5" />
            <line x1={x - 9} y1={y - 9} x2={x + 9} y2={y + 9} stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
            <line x1={x + 9} y1={y - 9} x2={x - 9} y2={y + 9} stroke="#FFD700" strokeWidth="1.5" opacity="0.6" />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

// ── 5. SOL ───────────────────────────────────────────────────────────────────
const SceneSol = () => {
  const { bgOp, sp, exitOp, frame } = useCardAnim();
  const rot = frame * 0.35;
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(185deg, #1565C0 0%, #1976D2 28%, #42A5F5 58%, #FDD835 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        {/* Ground */}
        <rect x="0" y="755" width="1080" height="325" fill="#4CAF50" opacity={sp * 0.58} />
        <rect x="0" y="745" width="1080" height="18" fill="#388E3C" opacity={sp * 0.82} />

        {/* Light beams */}
        {([0, 1, 2, 3, 4] as number[]).map(i => (
          <line key={i} x1={540} y1={420}
            x2={160 + i * 200} y2={1080}
            stroke="#FDD835" strokeWidth="44" opacity={sp * 0.06} />
        ))}

        {/* Rotating rays */}
        <g transform={`rotate(${rot}, 540, 420)`} opacity={sp}>
          {(Array.from({ length: 14 }) as unknown[]).map((_, i) => {
            const a = i * (360 / 14) * Math.PI / 180;
            return (
              <line key={i}
                x1={540 + 218 * Math.cos(a)} y1={420 + 218 * Math.sin(a)}
                x2={540 + 330 * Math.cos(a)} y2={420 + 330 * Math.sin(a)}
                stroke="#FDD835" strokeWidth={14 + (i % 2) * 8} strokeLinecap="round" opacity="0.75" />
            );
          })}
        </g>

        {/* Sun glow rings */}
        <circle cx="540" cy="420" r="230" fill="#FDD835" opacity={sp * 0.18} />
        <circle cx="540" cy="420" r="205" fill="#FDD835" opacity={sp * 0.35} />

        {/* Sun */}
        <circle cx="540" cy="420" r="185" fill="#FDD835" opacity={sp} />
        <circle cx="540" cy="420" r="165" fill="#FFEB3B" opacity={sp} />
        <circle cx="540" cy="420" r="140" fill="#FFF176" opacity={sp * 0.78} />

        {/* Clouds */}
        <g opacity={sp * 0.92}>
          <g transform="translate(130, 195)">
            <ellipse cx="0" cy="0" rx="92" ry="56" fill="white" />
            <ellipse cx="72" cy="-16" rx="72" ry="46" fill="white" />
            <ellipse cx="-62" cy="-12" rx="62" ry="42" fill="white" />
          </g>
          <g transform="translate(770, 285)">
            <ellipse cx="0" cy="0" rx="82" ry="52" fill="white" opacity="0.88" />
            <ellipse cx="62" cy="-13" rx="63" ry="40" fill="white" opacity="0.88" />
            <ellipse cx="-52" cy="-9" rx="56" ry="36" fill="white" opacity="0.88" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── 6. FLAGG ─────────────────────────────────────────────────────────────────
const SceneFlagg = () => {
  const { bgOp, sp, exitOp } = useCardAnim();
  return (
    <AbsoluteFill style={{ background: FLAG.red, opacity: bgOp * exitOp }}>
      <div style={{
        position: "absolute", inset: 0,
        opacity: sp,
        transform: `scale(${0.85 + sp * 0.15})`,
      }}>
        {/* Norwegian flag cross — correct proportions */}
        {/* White horizontal bar */}
        <div style={{ position: "absolute", top: "39%", left: 0, right: 0, height: "22%", background: FLAG.white }} />
        {/* White vertical bar (offset left) */}
        <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, width: "16%", background: FLAG.white }} />
        {/* Blue horizontal bar */}
        <div style={{ position: "absolute", top: "43%", left: 0, right: 0, height: "14%", background: FLAG.blue }} />
        {/* Blue vertical bar */}
        <div style={{ position: "absolute", left: "25.5%", top: 0, bottom: 0, width: "9%", background: FLAG.blue }} />
      </div>
    </AbsoluteFill>
  );
};

// ── 7. KORPS ─────────────────────────────────────────────────────────────────
const SceneKorps = () => {
  const { bgOp, sp, exitOp, frame } = useCardAnim();
  const bounce = Math.sin(frame * 0.28) * 10;
  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #1A237E 0%, #283593 58%, #3949AB 100%)",
      opacity: bgOp * exitOp,
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} viewBox="0 0 1080 1080">
        {/* Confetti */}
        {([[150, 195], [305, 145], [505, 175], [705, 155], [905, 185], [195, 405], [805, 375], [405, 605], [655, 578], [98, 705], [955, 675], [480, 900], [720, 880]] as [number, number][]).map(([cx, cy], i) => (
          <rect key={i} x={cx - 11} y={cy - 4} width="22" height="9" rx="4.5"
            fill={["#FF6B6B", "#FFD700", "#4ECDC4", "#FFFFFF", "#FF8B94", "#FFA500", "#98D9FF"][i % 7]}
            transform={`rotate(${i * 37 + frame * 2.2}, ${cx}, ${cy})`}
            opacity={sp * 0.82} />
        ))}

        {/* Trumpet */}
        <g opacity={sp} transform={`translate(0, ${bounce})`}>
          <g transform="translate(460, 490) rotate(-18)">
            {/* Bell */}
            <ellipse cx="200" cy="0" rx="145" ry="102" fill="#B8860B" />
            <ellipse cx="200" cy="0" rx="125" ry="82" fill="#DAA520" />
            <ellipse cx="200" cy="0" rx="105" ry="62" fill="none" stroke="#FFD700" strokeWidth="4" opacity="0.7" />

            {/* Main tube */}
            <path d="M55,0 L0,0 Q-92,0 -92,-92 Q-92,-184 0,-184 L68,-184"
              fill="none" stroke="#B8860B" strokeWidth="32" strokeLinecap="round" />
            <path d="M55,0 L0,0 Q-92,0 -92,-92 Q-92,-184 0,-184 L68,-184"
              fill="none" stroke="#DAA520" strokeWidth="22" strokeLinecap="round" />

            {/* Valves */}
            {([-115, -72, -28] as number[]).map((x, i) => (
              <g key={i}>
                <rect x={x - 14} y={-200} width="28" height="55" rx="14" fill="#B8860B" />
                <rect x={x - 12} y={-198} width="24" height="51" rx="12" fill="#DAA520" />
              </g>
            ))}

            {/* Mouthpiece */}
            <line x1="68" y1="-184" x2="155" y2="-184" stroke="#B8860B" strokeWidth="22" strokeLinecap="round" />
            <circle cx="165" cy="-184" r="18" fill="#DAA520" />
          </g>
        </g>

        {/* Musical notes */}
        {([[195, 348, 1], [855, 275, -0.45], [895, 598, 0.75]] as [number, number, number][]).map(([x, y, sc], i) => (
          <g key={i} transform={`translate(${x},${y}) scale(${sc})`} opacity={sp} fill="#FFD700">
            <ellipse cx="0" cy="0" rx="24" ry="17" transform="rotate(-15)" />
            <line x1="24" y1="-2" x2="24" y2="-86" stroke="#FFD700" strokeWidth="5" />
            <line x1="24" y1="-86" x2="64" y2="-68" stroke="#FFD700" strokeWidth="5" />
          </g>
        ))}

        {/* Paired 8th notes */}
        <g transform="translate(195, 710)" opacity={sp} fill="#FFD700">
          <ellipse cx="0" cy="0" rx="21" ry="15" transform="rotate(-15)" opacity="0.75" />
          <line x1="21" y1="-2" x2="21" y2="-75" stroke="#FFD700" strokeWidth="5" opacity="0.75" />
          <ellipse cx="64" cy="-22" rx="21" ry="15" transform="rotate(-15)" opacity="0.75" />
          <line x1="85" y1="-24" x2="85" y2="-75" stroke="#FFD700" strokeWidth="5" opacity="0.75" />
          <line x1="21" y1="-75" x2="85" y2="-75" stroke="#FFD700" strokeWidth="5" opacity="0.75" />
        </g>

        {/* Sound waves */}
        <g opacity={sp * 0.35}>
          {([1, 2, 3] as number[]).map(i => (
            <ellipse key={i} cx="820" cy="505" rx={90 + i * 65} ry={55 + i * 42}
              fill="none" stroke="#FFD700" strokeWidth="3" />
          ))}
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ── INTRO ─────────────────────────────────────────────────────────────────────
const NorwegianCross = ({ opacity }: { opacity: number }) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    <div style={{ position: "absolute", top: "43.5%", left: 0, right: 0, height: "13%", background: FLAG.white }} />
    <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, width: "13%", background: FLAG.white }} />
    <div style={{ position: "absolute", top: "46%", left: 0, right: 0, height: "8%", background: FLAG.blue }} />
    <div style={{ position: "absolute", left: "24.5%", top: 0, bottom: 0, width: "8%", background: FLAG.blue }} />
  </div>
);

const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const crossOp = interpolate(frame, [0, 20], [0, 0.18], { extrapolateRight: "clamp" });
  const headlineSp = spring({ frame: frame - 10, fps, config: { damping: 16, stiffness: 120 } });
  const subOp = interpolate(frame, [30, 42], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [65, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${FLAG.red} 0%, ${FLAG.blue} 100%)`,
      justifyContent: "center", alignItems: "center", opacity: exitOp,
    }}>
      <NorwegianCross opacity={crossOp} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 60px" }}>
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 96, fontWeight: 700, color: FLAG.white,
          lineHeight: 1.1, opacity: headlineSp,
          transform: `translateY(${interpolate(headlineSp, [0, 1], [40, 0])}px)`,
          textShadow: "0 4px 24px rgba(0,0,0,0.35)",
        }}>
          Gratulerer<br />med dagen!
        </div>
        <div style={{
          marginTop: 32, fontFamily: FONT_SANS, fontSize: 36, fontWeight: 600,
          color: "#FFD700", letterSpacing: 4, opacity: subOp,
        }}>
          🇳🇴 17. mai 🇳🇴
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── OUTRO ─────────────────────────────────────────────────────────────────────
const SceneOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const bgOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const textSp = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 110 } });
  const emojisOp = interpolate(frame, [20, 32], [0, 1], { extrapolateRight: "clamp" });
  const bylineOp = interpolate(frame, [30, 44], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [46, 51], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${FLAG.blue} 0%, ${FLAG.red} 100%)`,
      justifyContent: "center", alignItems: "center",
      opacity: bgOp * exitOp, padding: "0 80px",
    }}>
      <NorwegianCross opacity={0.1} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: FONT_SERIF, fontSize: 56, fontWeight: 700, color: FLAG.white,
          lineHeight: 1.25, opacity: textSp,
          transform: `translateY(${interpolate(textSp, [0, 1], [24, 0])}px)`,
          textShadow: "0 3px 20px rgba(0,0,0,0.3)",
        }}>
          Vi i VIEW Group ønsker<br />alle sammen en fin<br />17. mai feiring!
        </div>
        <div style={{ marginTop: 32, fontSize: 72, lineHeight: 1, opacity: emojisOp }}>
          🇳🇴 🎉 🇳🇴
        </div>
        <div style={{
          marginTop: 24, fontFamily: FONT_SANS, fontSize: 20, fontWeight: 600,
          color: BRAND.light, letterSpacing: 4, opacity: bylineOp,
        }}>
          VIEW GROUP
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── LOGO ──────────────────────────────────────────────────────────────────────
const SceneLogoEnd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });
  const lineW = interpolate(frame, [10, 28], [0, 300], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${BRAND.light} 0%, ${BRAND.pop} 100%)`,
      justifyContent: "center", alignItems: "center",
    }}>
      <div style={{
        textAlign: "center", opacity: s,
        transform: `scale(${0.9 + s * 0.1})`,
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <Img src={staticFile("images/view-logo.png")} style={{ height: 180, filter: "brightness(0) invert(1)" }} />
        <div style={{ height: 2, width: lineW, background: FLAG.white, margin: "28px auto" }} />
        <div style={{
          fontFamily: FONT_SANS, fontSize: 28, color: FLAG.white,
          opacity: subOp, letterSpacing: 3, fontWeight: 600,
        }}>
          God 17. mai! 🇳🇴
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ── ROOT ──────────────────────────────────────────────────────────────────────
export const May17Video = () => (
  <AbsoluteFill style={{ fontFamily: FONT_SANS }}>
    <Series>
      <Series.Sequence durationInFrames={75}><SceneIntro /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneBunad /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneIs /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><ScenePolser /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneChampagne /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneSol /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneFlagg /></Series.Sequence>
      <Series.Sequence durationInFrames={42}><SceneKorps /></Series.Sequence>
      <Series.Sequence durationInFrames={51}><SceneOutro /></Series.Sequence>
      <Series.Sequence durationInFrames={30}><SceneLogoEnd /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
