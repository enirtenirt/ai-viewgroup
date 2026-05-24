import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  useVideoConfig,
  Img,
  staticFile,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700"],
  subsets: ["latin"],
});
const playfair = loadPlayfair("normal", {
  weights: ["400", "700"],
  subsets: ["latin"],
});

const C = {
  bg1: "#150720",
  bg2: "#2C0A40",
  purple: "#7B2FA0",
  lavender: "#CC99FF",
  border: "#B978F5",
  white: "#FFFFFF",
};

const LENS_R = 115;

// Timing (frames at 30 fps)
// Lines 1–2 of the message are revealed by the glass.
// Lines 3–5 fade in after.
const T = {
  bgIn: 22,
  glassAppear: 28,
  // sweep 1: left → right, across display lines 1–2 of msg line 1
  s1Start: 32,
  s1End: 130,
  // drop to next display line
  dropMid: 150,
  // sweep 2: right → left, lines 3–4 of display (wrapping msg line 1 + msg line 2)
  s2Start: 160,
  s2End: 255,
  // glass fades out
  glassFadeStart: 265,
  glassFadeEnd: 295,
  // remaining text fades in
  fullReveal: 270,
  line3In: 295,
  line4In: 340,
  ctaIn: 385,
  logoIn: 420,
  end: 470,
};

// Shared text position (same for dim and clear layers so clip-path aligns)
const TEXT_LEFT = 80;
const TEXT_TOP = 220;

export const MagnifyingGlassAd = () => {
  const frame = useCurrentFrame();

  const bgOp = interpolate(frame, [0, T.bgIn], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Lens position ────────────────────────────────────────────
  // Display lines of "Forstørrelsesglasset…" at 58px, lineHeight 1.3 ≈ 75px each
  // Text top 220 → line centers approx:  258, 333, 408, 483
  const Y_L1 = 262; // display line 1
  const Y_L2 = 337; // display line 2
  const Y_L3 = 412; // display line 3 (end of msg line 1 + msg line 2)
  const Y_L4 = 487; // display line 4 ("hvis ingen…")

  // Phase 1: sweep left → right at Y_L1 / Y_L2
  const xPhase1 = interpolate(frame, [T.s1Start, T.s1End], [160, 960], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yPhase1 = interpolate(
    frame,
    [T.s1Start, T.s1End],
    [Y_L1, Y_L2],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Phase 2: sweep right → left at Y_L3 / Y_L4
  const xPhase2 = interpolate(frame, [T.s2Start, T.s2End], [960, 160], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const yPhase2 = interpolate(
    frame,
    [T.s2Start, T.s2End],
    [Y_L3, Y_L4],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Drop transition between sweeps
  const xDrop = interpolate(
    frame,
    [T.s1End, T.dropMid, T.s2Start],
    [960, 960, 960],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const yDrop = interpolate(
    frame,
    [T.s1End, T.dropMid, T.s2Start],
    [Y_L2, (Y_L2 + Y_L3) / 2, Y_L3],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  let lensX: number;
  let lensY: number;
  if (frame <= T.s1End) {
    lensX = xPhase1;
    lensY = yPhase1;
  } else if (frame <= T.s2Start) {
    lensX = xDrop;
    lensY = yDrop;
  } else {
    lensX = xPhase2;
    lensY = yPhase2;
  }

  // ── Opacities ────────────────────────────────────────────────
  const glassOp = interpolate(
    frame,
    [T.glassAppear - 8, T.glassAppear, T.glassFadeStart, T.glassFadeEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const fullRevealOp = interpolate(
    frame,
    [T.fullReveal, T.glassFadeEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const line3Op = interpolate(frame, [T.line3In, T.line3In + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line3Shift = interpolate(frame, [T.line3In, T.line3In + 28], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const line4Op = interpolate(frame, [T.line4In, T.line4In + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const line4Shift = interpolate(frame, [T.line4In, T.line4In + 28], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const ctaOp = interpolate(frame, [T.ctaIn, T.ctaIn + 28], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const ctaShift = interpolate(frame, [T.ctaIn, T.ctaIn + 28], [14, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const logoOp = interpolate(frame, [T.logoIn, T.logoIn + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const headerOp = interpolate(frame, [5, 25], [0, 1], {
    extrapolateRight: "clamp",
  });

  const clipPath = `circle(${LENS_R}px at ${lensX}px ${lensY}px)`;

  const textPos: React.CSSProperties = {
    position: "absolute",
    left: TEXT_LEFT,
    right: TEXT_LEFT,
    top: TEXT_TOP,
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 28% 18%, #3D1250 0%, #1A0828 55%, ${C.bg1} 100%)`,
        opacity: bgOp,
      }}
    >
      <FinancialBg frame={frame} />

      {/* Header logo */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          top: 68,
          opacity: headerOp,
        }}
      >
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 40, filter: "brightness(0) invert(1)" }}
        />
      </div>

      {/* Dim background text (always visible at low opacity) */}
      <div style={{ ...textPos, opacity: 0.09 }}>
        <MainLines pf={playfair.fontFamily} />
      </div>

      {/* Clear text clipped to the lens */}
      {glassOp > 0.01 && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            clipPath,
            WebkitClipPath: clipPath,
            opacity: glassOp,
          }}
        >
          <div style={textPos}>
            <MainLines pf={playfair.fontFamily} />
          </div>
        </div>
      )}

      {/* Full reveal after glass exits */}
      <div style={{ ...textPos, opacity: fullRevealOp }}>
        <MainLines pf={playfair.fontFamily} />
      </div>

      {/* Line 3: "Dette gjelder spesielt i regnskapet." */}
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          right: TEXT_LEFT,
          top: 555,
          opacity: line3Op,
          transform: `translateY(${line3Shift}px)`,
        }}
      >
        <span
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 50,
            fontWeight: 400,
            fontStyle: "italic",
            color: C.lavender,
            lineHeight: 1.3,
          }}
        >
          Dette gjelder spesielt i regnskapet.
        </span>
      </div>

      {/* Line 4: question */}
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          right: TEXT_LEFT,
          top: 645,
          opacity: line4Op,
          transform: `translateY(${line4Shift}px)`,
        }}
      >
        <p
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 38,
            fontWeight: 400,
            color: C.white,
            margin: 0,
            lineHeight: 1.45,
          }}
        >
          Tallene dine forteller en historie.
          <br />
          <span style={{ color: C.lavender }}>
            Får du hjelp til å lese den riktig?
          </span>
        </p>
      </div>

      {/* Line 5: CTA */}
      <div
        style={{
          position: "absolute",
          left: TEXT_LEFT,
          right: TEXT_LEFT,
          top: 800,
          opacity: ctaOp,
          transform: `translateY(${ctaShift}px)`,
        }}
      >
        <p
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 30,
            fontWeight: 500,
            color: "rgba(255,255,255,0.82)",
            margin: 0,
            lineHeight: 1.55,
          }}
        >
          VIEW Group gir selskaper{" "}
          <span style={{ color: C.white, fontWeight: 700 }}>fastpris</span>,
          bedre innsikt
          <br />
          og en partner som faktisk bidrar – ikke bare bokfører.
        </p>
      </div>

      {/* Magnifying glass SVG */}
      {glassOp > 0.01 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: glassOp,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          {/* Outer soft glow ring */}
          <circle
            cx={lensX}
            cy={lensY}
            r={LENS_R + 22}
            fill="none"
            stroke="rgba(185,120,245,0.14)"
            strokeWidth={22}
          />
          {/* Lens tint */}
          <circle
            cx={lensX}
            cy={lensY}
            r={LENS_R}
            fill="rgba(90,30,140,0.10)"
          />
          {/* Lens border */}
          <circle
            cx={lensX}
            cy={lensY}
            r={LENS_R}
            fill="none"
            stroke={C.border}
            strokeWidth={6}
          />
          {/* Handle */}
          <line
            x1={lensX + LENS_R * 0.71 - 5}
            y1={lensY + LENS_R * 0.71 - 5}
            x2={lensX + LENS_R * 0.71 + 82}
            y2={lensY + LENS_R * 0.71 + 82}
            stroke={C.border}
            strokeWidth={13}
            strokeLinecap="round"
          />
          {/* Inner highlight gleam */}
          <ellipse
            cx={lensX - 36}
            cy={lensY - 40}
            rx={26}
            ry={18}
            fill="rgba(255,255,255,0.07)"
            transform={`rotate(-30 ${lensX - 36} ${lensY - 40})`}
          />
        </svg>
      )}

      {/* Footer */}
      <div
        style={{
          position: "absolute",
          left: 80,
          right: 80,
          bottom: 68,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          opacity: logoOp,
        }}
      >
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 36, filter: "brightness(0) invert(1)" }}
        />
        <span
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 17,
            color: C.lavender,
            letterSpacing: 2.2,
            fontWeight: 600,
          }}
        >
          REGNSKAP · INNSIKT · FASTPRIS
        </span>
      </div>
    </AbsoluteFill>
  );
};

// The two revealed lines (user's message lines 1 & 2)
const MainLines = ({ pf }: { pf: string }) => (
  <div
    style={{
      fontFamily: pf,
      fontSize: 58,
      fontWeight: 700,
      color: C.white,
      lineHeight: 1.3,
      margin: 0,
    }}
  >
    Forstørrelsesglasset er en
    <br />
    påminnelse om at viktige
    <br />
    detaljer gjemmer seg,
    <br />
    <span style={{ fontStyle: "italic", color: C.lavender }}>
      hvis ingen viser dem tydelig.
    </span>
  </div>
);

// Faint floating financial numbers in the background
const FinancialBg = ({ frame }: { frame: number }) => {
  const items = [
    { text: "48,2 MNOK", x: 68, y: 130 },
    { text: "EBITDA", x: 310, y: 150 },
    { text: "+12,4%", x: 620, y: 110 },
    { text: "18,7 %", x: 820, y: 155 },
    { text: "Likviditet", x: 140, y: 660 },
    { text: "6,4 MNOK", x: 400, y: 680 },
    { text: "AR > 30 d", x: 700, y: 655 },
    { text: "–18%", x: 880, y: 680 },
    { text: "Resultat", x: 80, y: 890 },
    { text: "1,2 MNOK", x: 330, y: 905 },
    { text: "KPI", x: 640, y: 880 },
    { text: "Avvik", x: 820, y: 900 },
    { text: "+2,1pp", x: 200, y: 965 },
    { text: "Q1 2025", x: 500, y: 960 },
    { text: "Budget", x: 760, y: 950 },
  ];

  const op = interpolate(frame, [12, 35], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {items.map((item, i) => {
        const drift = interpolate(frame, [0, 470], [0, (i % 2 === 0 ? 1 : -1) * 18], {
          extrapolateRight: "clamp",
        });
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: item.x,
              top: item.y + drift,
              fontFamily: "monospace",
              fontSize: 17,
              color: "rgba(185,120,245,0.16)",
              fontWeight: 600,
              letterSpacing: 0.8,
              whiteSpace: "nowrap",
              opacity: op,
            }}
          >
            {item.text}
          </div>
        );
      })}
    </div>
  );
};
