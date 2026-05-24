import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
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

// VIEW Group brand palette
const C = {
  bg: "#160822",
  bg2: "#2E0A44",
  purple: "#7B2FA0",
  lavender: "#CC99FF",
  border: "#B978F5",
  white: "#FFFFFF",
  kpiBg: "#F0E4FF",
  green: "#16A34A",
  amber: "#EA580C",
  darkText: "#1E0830",
  midPurple: "#6B3A8E",
};

const LENS_R = 160;
const TEXT_LEFT = 80;
const TEXT_TOP = 220;
// Center Y of the 4-line text block (58px × 1.3 lineHeight × 4 lines ≈ 302px, starting at TEXT_TOP)
const LENS_Y = TEXT_TOP + 151;

// ─── Timing (360 frames = 12 s at 30 fps) ─────────────────────────────────
const T = {
  bgIn: 14,
  glassIn: 20,
  sweepStart: 24,
  sweepEnd: 108,       // ~2.8 s to sweep across
  glassFadeEnd: 123,
  line3In: 120,
  line4In: 148,
  textFadeStart: 185,  // all text starts fading
  textFadeEnd: 210,
  // Scene 3: dashboard
  cardStart: 195,
  topLabelIn: 198,
  kpiIn: [242, 258, 274, 290] as const,
  barsStart: 296,
  ctaIn: 308,
  end: 360,
};

export const MagnifyingGlassAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background ─────────────────────────────────────────────
  const bgOp = interpolate(frame, [0, T.bgIn], [0, 1], {
    extrapolateRight: "clamp",
  });

  // ── Magnifying glass ───────────────────────────────────────
  const lensX = interpolate(frame, [T.sweepStart, T.sweepEnd], [80, 1000], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const glassOp = interpolate(
    frame,
    [T.glassIn - 6, T.glassIn, T.sweepEnd + 6, T.glassFadeEnd],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // ── Text ───────────────────────────────────────────────────
  const textBlockOp = interpolate(
    frame,
    [T.textFadeStart, T.textFadeEnd],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fullRevealOp = interpolate(
    frame,
    [T.sweepEnd, T.glassFadeEnd],
    [0, 1],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const fadeIn = (start: number, dur = 24) =>
    interpolate(frame, [start, start + dur], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  const slideIn = (start: number, dur = 24, dist = 12) =>
    interpolate(frame, [start, start + dur], [dist, 0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });

  // ── Dashboard card ──────────────────────────────────────────
  const cardSpring = spring({
    frame: frame - T.cardStart,
    fps,
    config: { damping: 22, stiffness: 100, mass: 1 },
  });
  const cardOp = fadeIn(T.cardStart, 20);

  const kpiSprings = T.kpiIn.map((s) =>
    spring({ frame: frame - s, fps, config: { damping: 18, stiffness: 240 } })
  );

  const BAR_COUNT = 12;
  const barVals = [0.42, 0.50, 0.46, 0.53, 0.57, 0.61, 0.59, 0.65, 0.70, 0.76, 0.80, 0.88];
  const barProgress = Array.from({ length: BAR_COUNT }, (_, i) => {
    const s = T.barsStart + i * 4;
    return interpolate(frame, [s, s + 28], [0, 1], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    });
  });

  const clipPath = `circle(${LENS_R}px at ${lensX}px ${LENS_Y}px)`;

  const textPos = {
    position: "absolute" as const,
    left: TEXT_LEFT,
    right: TEXT_LEFT,
    top: TEXT_TOP,
  };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 25% 18%, #3D1250 0%, #1F0930 55%, ${C.bg} 100%)`,
        opacity: bgOp,
      }}
    >
      {/* ════════════ SCENE 1 + 2 : TEXT REVEAL ════════════ */}
      <div style={{ opacity: textBlockOp }}>
        {/* Dim ghost text */}
        <div style={{ ...textPos, opacity: 0.08 }}>
          <MainLines pf={playfair.fontFamily} />
        </div>

        {/* Text visible through the lens */}
        {glassOp > 0.005 && (
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

        {/* Full reveal once glass exits */}
        <div style={{ ...textPos, opacity: fullRevealOp }}>
          <MainLines pf={playfair.fontFamily} />
        </div>

        {/* "Dette gjelder spesielt i regnskapet." */}
        <div
          style={{
            position: "absolute",
            left: TEXT_LEFT,
            right: TEXT_LEFT,
            top: 565,
            opacity: fadeIn(T.line3In),
            transform: `translateY(${slideIn(T.line3In)}px)`,
          }}
        >
          <span
            style={{
              fontFamily: playfair.fontFamily,
              fontSize: 46,
              fontWeight: 400,
              fontStyle: "italic",
              color: C.lavender,
              lineHeight: 1.3,
            }}
          >
            Dette gjelder spesielt i regnskapet.
          </span>
        </div>

        {/* Question */}
        <div
          style={{
            position: "absolute",
            left: TEXT_LEFT,
            right: TEXT_LEFT,
            top: 650,
            opacity: fadeIn(T.line4In),
            transform: `translateY(${slideIn(T.line4In)}px)`,
          }}
        >
          <p
            style={{
              fontFamily: inter.fontFamily,
              fontSize: 37,
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
      </div>

      {/* Magnifying glass SVG */}
      {glassOp > 0.005 && (
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: glassOp * textBlockOp,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          {/* Outer glow ring */}
          <circle
            cx={lensX}
            cy={LENS_Y}
            r={LENS_R + 24}
            fill="none"
            stroke="rgba(185,120,245,0.12)"
            strokeWidth={24}
          />
          {/* Lens tint */}
          <circle cx={lensX} cy={LENS_Y} r={LENS_R} fill="rgba(90,30,140,0.08)" />
          {/* Lens ring */}
          <circle
            cx={lensX}
            cy={LENS_Y}
            r={LENS_R}
            fill="none"
            stroke={C.border}
            strokeWidth={6}
          />
          {/* Handle */}
          <line
            x1={lensX + LENS_R * 0.707 - 4}
            y1={LENS_Y + LENS_R * 0.707 - 4}
            x2={lensX + LENS_R * 0.707 + 86}
            y2={LENS_Y + LENS_R * 0.707 + 86}
            stroke={C.border}
            strokeWidth={13}
            strokeLinecap="round"
          />
          {/* Gleam */}
          <ellipse
            cx={lensX - 38}
            cy={LENS_Y - 42}
            rx={28}
            ry={18}
            fill="rgba(255,255,255,0.06)"
            transform={`rotate(-30 ${lensX - 38} ${LENS_Y - 42})`}
          />
        </svg>
      )}

      {/* ════════════ SCENE 3 : DASHBOARD ════════════ */}
      {cardOp > 0.005 && (
        <>
          {/* Small label above card */}
          <div
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              top: 60,
              textAlign: "center",
              opacity: fadeIn(T.topLabelIn, 20),
            }}
          >
            <span
              style={{
                fontFamily: inter.fontFamily,
                fontSize: 15,
                fontWeight: 600,
                color: C.lavender,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              VIEW Group · Regnskap &amp; Innsikt
            </span>
          </div>

          {/* Dashboard card */}
          <div
            style={{
              position: "absolute",
              left: 58,
              right: 58,
              top: 108,
              background: "#FFFFFF",
              borderRadius: 22,
              padding: "42px 48px",
              boxShadow: "0 12px 80px rgba(80,15,130,0.42), 0 2px 20px rgba(0,0,0,0.22)",
              opacity: cardOp,
              transform: `translateY(${(1 - cardSpring) * 44}px) scale(${0.80 + cardSpring * 0.20})`,
              transformOrigin: "50% 0%",
            }}
          >
            {/* Traffic lights + label */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 26,
              }}
            >
              <div style={{ display: "flex", gap: 7 }}>
                {["#FF5F57", "#FEBC2E", "#28C840"].map((col, i) => (
                  <div
                    key={i}
                    style={{ width: 13, height: 13, borderRadius: 7, background: col }}
                  />
                ))}
              </div>
              <span
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 14,
                  color: C.midPurple,
                  fontWeight: 600,
                  letterSpacing: 0.4,
                }}
              >
                OverVIEW · Konsern
              </span>
            </div>

            {/* KPI 2 × 2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 13,
                marginBottom: 24,
              }}
            >
              {(
                [
                  { label: "Omsetning YTD", value: "48,2 MNOK", delta: "+12,4%", pos: true },
                  { label: "EBITDA-margin", value: "18,7 %", delta: "+2,1pp", pos: true },
                  { label: "Likviditet", value: "6,4 MNOK", delta: "–3 dager", pos: false },
                  { label: "AR > 30 d", value: "1,2 MNOK", delta: "–18%", pos: false },
                ] as const
              ).map((item, i) => (
                <div
                  key={i}
                  style={{
                    background: C.kpiBg,
                    borderRadius: 13,
                    padding: "15px 18px",
                    opacity: kpiSprings[i],
                    transform: `scale(${0.88 + kpiSprings[i] * 0.12})`,
                  }}
                >
                  <div
                    style={{
                      fontFamily: inter.fontFamily,
                      fontSize: 11,
                      color: C.midPurple,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      marginBottom: 5,
                    }}
                  >
                    {item.label}
                  </div>
                  <div
                    style={{
                      fontFamily: inter.fontFamily,
                      fontSize: 28,
                      fontWeight: 700,
                      color: C.darkText,
                      lineHeight: 1,
                      marginBottom: 5,
                    }}
                  >
                    {item.value}
                  </div>
                  <div
                    style={{
                      fontFamily: inter.fontFamily,
                      fontSize: 13,
                      fontWeight: 600,
                      color: item.pos ? C.green : C.amber,
                    }}
                  >
                    {item.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div>
              <div
                style={{
                  fontFamily: inter.fontFamily,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#7B5A9A",
                  marginBottom: 12,
                  letterSpacing: 0.3,
                }}
              >
                Resultat – siste 12 mnd
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 6,
                  height: 88,
                }}
              >
                {barVals.map((v, i) => (
                  <div
                    key={i}
                    style={{
                      flex: 1,
                      height: `${v * barProgress[i] * 100}%`,
                      background: "linear-gradient(to top, #7B2FA0, #B978F5)",
                      borderRadius: "3px 3px 0 0",
                      minWidth: 0,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* CTA below card */}
          <div
            style={{
              position: "absolute",
              left: 80,
              right: 80,
              bottom: 88,
              textAlign: "center",
              opacity: fadeIn(T.ctaIn, 26),
              transform: `translateY(${slideIn(T.ctaIn, 26, 10)}px)`,
            }}
          >
            <p
              style={{
                fontFamily: inter.fontFamily,
                fontSize: 27,
                fontWeight: 500,
                color: "rgba(255,255,255,0.88)",
                margin: 0,
                lineHeight: 1.5,
              }}
            >
              VIEW Group –{" "}
              <span style={{ color: C.lavender, fontWeight: 700 }}>fastpris</span>
              , bedre innsikt og en partner
              <br />
              som faktisk bidrar – ikke bare bokfører.
            </p>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

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
