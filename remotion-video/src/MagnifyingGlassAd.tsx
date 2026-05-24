import {
  AbsoluteFill,
  useCurrentFrame,
  interpolate,
  spring,
  useVideoConfig,
} from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const inter = loadInter("normal", { weights: ["400", "500", "600", "700"], subsets: ["latin"] });
const playfair = loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });

const C = {
  bg: "#150720",
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

const LENS_R = 162;
const TEXT_LEFT = 80;
// Scene 1 text starts at top=240; 4 lines × 58px × 1.3 ≈ 302px → center at 240+151=391
const TEXT_TOP = 240;
const LENS_Y = 391;

// 360 frames = 12 s at 30 fps
const T = {
  bgIn: 14,
  glassIn: 20,
  sweepStart: 24,
  sweepEnd: 112,
  glassFadeEnd: 126,
  textFadeStart: 182,
  textFadeEnd: 206,
  // Scene 2
  s2Start: 148,
  s2Q1: 148,
  s2Q2: 172,
  // Scene 3
  cardStart: 210,
  headlineIn: 212,
  kpiIn: [248, 264, 280, 296] as const,
  barsStart: 300,
  ctaIn: 312,
  end: 360,
};

// ── Fixed number matrix data ──────────────────────────────────────────────────
// 14 columns × 40 rows, fills 1080×1120px at col-width=78px, row-height=28px
const NUM_COLS = 14;
const NUM_ROWS = 40;
const MATRIX: string[][] = [
  ["3000","4820","18,7%","482","01/25","6.420","12,4","93.500","4200","–18%","48,2","7500","0,42","284"],
  ["4000","284,5","–3d","284","02/25","1.200","2,1pp","48.200","6000","+2,1","18,7","8050","0,50","93"],
  ["4200","93,7","12,4%","93","03/25","482,3","18,7","6.420","3400","–3d","6,4","3000","0,46","482"],
  ["6000","482","–18%","482","04/25","93,7","–18","284.500","7500","12,4%","1,2","4000","0,53","18"],
  ["7500","1,2","+2,1","18","05/25","284,5","6,4","93.700","8050","18,7","93,7","6000","0,57","6"],
  ["8050","6,4","18,7","6","06/25","1.200","93,7","482.350","3000","–18%","284","4200","0,61","1"],
  ["3400","18,7","–3d","93","07/25","6.420","484","93.500","4000","2,1pp","48","7500","0,59","93"],
  ["3000","482","12,4","18","08/25","93,7","18,7","284.500","6000","12,4","6","8050","0,65","18"],
  ["4000","284","–18","482","09/25","284,5","93","93.700","3400","18,7","18","3000","0,70","284"],
  ["4200","93","18,7","93","10/25","1.200","284","482.350","7500","–3d","482","4000","0,76","93"],
  ["6000","482","2,1pp","6","11/25","6.420","6,4","93.500","8050","12,4","93","6000","0,80","482"],
  ["7500","1,2","12,4","18","12/25","93,7","1,2","284.500","3000","–18%","18","3400","0,88","18"],
].concat(
  Array.from({ length: NUM_ROWS - 12 }, (_, r) => {
    const vals = ["482","93","18,7%","284","6,4","1,2","12,4","18,7","–3d","+2,1","–18%","48,2","93,7","6"];
    return vals.map((v, c) => vals[(r + c * 3) % vals.length]);
  })
);

export const MagnifyingGlassAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = interpolate(frame, [0, T.bgIn], [0, 1], { extrapolateRight: "clamp" });

  // ── Lens ──────────────────────────────────────────────────────────────────
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

  // ── Scene 1 text ──────────────────────────────────────────────────────────
  const s1Out = interpolate(frame, [T.textFadeStart, T.textFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const fullReveal = interpolate(frame, [T.sweepEnd, T.glassFadeEnd], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Number matrix fades out as text comes fully in
  const matrixOp = interpolate(frame, [T.sweepEnd, T.glassFadeEnd + 10], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene 2 ───────────────────────────────────────────────────────────────
  const s2Op = interpolate(frame, [T.s2Start, T.s2Start + 10], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const s2Out = interpolate(frame, [T.textFadeStart, T.textFadeEnd], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const q1Op = interpolate(frame, [T.s2Q1, T.s2Q1 + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const q2Op = interpolate(frame, [T.s2Q2, T.s2Q2 + 22], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // ── Scene 3 ───────────────────────────────────────────────────────────────
  const cardSpring = spring({ frame: frame - T.cardStart, fps, config: { damping: 22, stiffness: 100 } });
  const cardOp = interpolate(frame, [T.cardStart, T.cardStart + 18], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const kpiSprings = T.kpiIn.map((s) =>
    spring({ frame: frame - s, fps, config: { damping: 18, stiffness: 240 } })
  );
  const BAR_COUNT = 12;
  const barVals = [0.42, 0.50, 0.46, 0.53, 0.57, 0.61, 0.59, 0.65, 0.70, 0.76, 0.80, 0.88];
  const barP = Array.from({ length: BAR_COUNT }, (_, i) => {
    const s = T.barsStart + i * 4;
    return interpolate(frame, [s, s + 26], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  });
  const fi = (s: number, d = 22) =>
    interpolate(frame, [s, s + d], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const si = (s: number, d = 22, dist = 12) =>
    interpolate(frame, [s, s + d], [dist, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  const clipPath = `circle(${LENS_R}px at ${lensX}px ${LENS_Y}px)`;
  // Inverse clip: outside the lens (for hiding numbers inside lens)
  // We use a radial-gradient mask on the matrix layer instead

  const textPos = { position: "absolute" as const, left: TEXT_LEFT, right: TEXT_LEFT, top: TEXT_TOP };

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 25% 20%, #3D1250 0%, #200A32 55%, ${C.bg} 100%)`,
        opacity: bgOp,
      }}
    >
      {/* ══════════════ SCENE 1: NUMBER MATRIX + GLASS ══════════════ */}

      {/* Number matrix — dim, fills canvas, fades out after glass passes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          opacity: Math.min(s1Out, matrixOp) * 0.28,
        }}
      >
        <NumberMatrix frame={frame} />
      </div>

      {/* Ghost text (dim, always behind glass) */}
      <div style={{ ...textPos, opacity: s1Out * 0.07 }}>
        <Scene1Text pf={playfair.fontFamily} />
      </div>

      {/* Text revealed THROUGH the lens (numbers "become" words inside the glass) */}
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
          {/* Clear the numbers inside the lens — dark fill */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(25,6,45,0.82)" }} />
          <div style={textPos}>
            <Scene1Text pf={playfair.fontFamily} />
          </div>
        </div>
      )}

      {/* Full text after glass exits */}
      <div style={{ ...textPos, opacity: fullReveal * s1Out }}>
        <Scene1Text pf={playfair.fontFamily} />
      </div>

      {/* Magnifying glass SVG */}
      {glassOp > 0.005 && (
        <svg
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            opacity: glassOp,
            pointerEvents: "none",
            overflow: "visible",
          }}
        >
          <circle cx={lensX} cy={LENS_Y} r={LENS_R + 26}
            fill="none" stroke="rgba(185,120,245,0.10)" strokeWidth={26} />
          <circle cx={lensX} cy={LENS_Y} r={LENS_R} fill="none" stroke={C.border} strokeWidth={6} />
          <line
            x1={lensX + LENS_R * 0.707 - 4} y1={LENS_Y + LENS_R * 0.707 - 4}
            x2={lensX + LENS_R * 0.707 + 88} y2={LENS_Y + LENS_R * 0.707 + 88}
            stroke={C.border} strokeWidth={13} strokeLinecap="round"
          />
          <ellipse cx={lensX - 40} cy={LENS_Y - 44} rx={30} ry={18}
            fill="rgba(255,255,255,0.05)"
            transform={`rotate(-30 ${lensX - 40} ${LENS_Y - 44})`} />
        </svg>
      )}

      {/* ══════════════ SCENE 2: QUESTION ══════════════ */}
      <div style={{ opacity: s2Op * s2Out }}>
        <div style={{
          position: "absolute", left: TEXT_LEFT, right: TEXT_LEFT, top: 320,
          opacity: q1Op,
          transform: `translateY(${interpolate(frame, [T.s2Q1, T.s2Q1 + 22], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <span style={{
            fontFamily: playfair.fontFamily,
            fontSize: 66,
            fontWeight: 700,
            color: C.white,
            lineHeight: 1.25,
          }}>
            Tallene dine forteller en historie.
          </span>
        </div>
        <div style={{
          position: "absolute", left: TEXT_LEFT, right: TEXT_LEFT, top: 530,
          opacity: q2Op,
          transform: `translateY(${interpolate(frame, [T.s2Q2, T.s2Q2 + 22], [14, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}px)`,
        }}>
          <span style={{
            fontFamily: playfair.fontFamily,
            fontSize: 66,
            fontWeight: 400,
            fontStyle: "italic",
            color: C.lavender,
            lineHeight: 1.25,
          }}>
            Får du hjelp til å lese den riktig?
          </span>
        </div>
      </div>

      {/* ══════════════ SCENE 3: DASHBOARD ══════════════ */}
      {cardOp > 0.005 && (
        <>
          {/* Headline above card */}
          <div style={{
            position: "absolute", left: 68, right: 68, top: 52,
            opacity: fi(T.headlineIn, 20),
            transform: `translateY(${si(T.headlineIn, 20, 10)}px)`,
          }}>
            <p style={{
              fontFamily: inter.fontFamily,
              fontSize: 28,
              fontWeight: 600,
              color: C.white,
              margin: 0,
              lineHeight: 1.35,
              textAlign: "center",
            }}>
              VIEW Group leverer regnskap og{" "}
              <span style={{ color: C.lavender }}>økonomistyring i sanntid</span>
            </p>
          </div>

          {/* Dashboard card */}
          <div style={{
            position: "absolute",
            left: 58, right: 58, top: 142,
            background: "#FFFFFF",
            borderRadius: 22,
            padding: "40px 46px",
            boxShadow: "0 12px 80px rgba(80,15,130,0.42), 0 2px 18px rgba(0,0,0,0.22)",
            opacity: cardOp,
            transform: `translateY(${(1 - cardSpring) * 44}px) scale(${0.80 + cardSpring * 0.20})`,
            transformOrigin: "50% 0%",
          }}>
            {/* Traffic lights + label */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <div style={{ display: "flex", gap: 7 }}>
                {(["#FF5F57","#FEBC2E","#28C840"] as const).map((col, i) => (
                  <div key={i} style={{ width: 13, height: 13, borderRadius: 7, background: col }} />
                ))}
              </div>
              <span style={{ fontFamily: inter.fontFamily, fontSize: 14, color: C.midPurple, fontWeight: 600, letterSpacing: 0.4 }}>
                OverVIEW · Konsern
              </span>
            </div>

            {/* KPI grid */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 13, marginBottom: 22 }}>
              {(
                [
                  { label: "Omsetning YTD", value: "48,2 MNOK", delta: "+12,4%", pos: true },
                  { label: "EBITDA-margin",  value: "18,7 %",    delta: "+2,1pp",  pos: true },
                  { label: "Likviditet",     value: "6,4 MNOK",  delta: "–3 dager",pos: false },
                  { label: "AR > 30 d",      value: "1,2 MNOK",  delta: "–18%",    pos: false },
                ] as const
              ).map((item, i) => (
                <div key={i} style={{
                  background: C.kpiBg, borderRadius: 13, padding: "14px 18px",
                  opacity: kpiSprings[i],
                  transform: `scale(${0.88 + kpiSprings[i] * 0.12})`,
                }}>
                  <div style={{ fontFamily: inter.fontFamily, fontSize: 11, color: C.midPurple, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 5 }}>
                    {item.label}
                  </div>
                  <div style={{ fontFamily: inter.fontFamily, fontSize: 28, fontWeight: 700, color: C.darkText, lineHeight: 1, marginBottom: 5 }}>
                    {item.value}
                  </div>
                  <div style={{ fontFamily: inter.fontFamily, fontSize: 13, fontWeight: 600, color: item.pos ? C.green : C.amber }}>
                    {item.delta}
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div>
              <div style={{ fontFamily: inter.fontFamily, fontSize: 12, fontWeight: 600, color: "#7B5A9A", marginBottom: 12, letterSpacing: 0.3 }}>
                Resultat – siste 12 mnd
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 86 }}>
                {barVals.map((v, i) => (
                  <div key={i} style={{
                    flex: 1, minWidth: 0,
                    height: `${v * barP[i] * 100}%`,
                    background: "linear-gradient(to top, #7B2FA0, #B978F5)",
                    borderRadius: "3px 3px 0 0",
                  }} />
                ))}
              </div>
            </div>
          </div>

          {/* CTA below card */}
          <div style={{
            position: "absolute", left: 80, right: 80, bottom: 80,
            textAlign: "center",
            opacity: fi(T.ctaIn, 24),
            transform: `translateY(${si(T.ctaIn, 24, 10)}px)`,
          }}>
            <p style={{
              fontFamily: inter.fontFamily,
              fontSize: 26,
              fontWeight: 600,
              color: C.lavender,
              margin: 0,
              letterSpacing: 0.3,
            }}>
              Få din fastpris og se vårt tilbud →
            </p>
          </div>
        </>
      )}
    </AbsoluteFill>
  );
};

// ── Scene 1 text ──────────────────────────────────────────────────────────────
const Scene1Text = ({ pf }: { pf: string }) => (
  <div style={{ fontFamily: pf, fontSize: 58, fontWeight: 700, color: C.white, lineHeight: 1.3, margin: 0 }}>
    viktige detaljer
    <br />
    gjemmer seg
    <br />
    hvis ingen viser dem tydelig.
    <br />
    <span style={{ fontStyle: "italic", color: C.lavender, fontSize: 50 }}>
      Det gjelder spesielt i regnskapet.
    </span>
  </div>
);

// ── Number matrix background ──────────────────────────────────────────────────
const NumberMatrix = ({ frame }: { frame: number }) => {
  const drift = interpolate(frame, [0, 360], [0, -32], { extrapolateRight: "clamp" });
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      {Array.from({ length: NUM_COLS }, (_, ci) => (
        <div
          key={ci}
          style={{
            position: "absolute",
            left: ci * 78,
            top: drift + (ci % 2 === 0 ? 0 : -14),
            fontFamily: "monospace",
            fontSize: 15,
            color: C.lavender,
            lineHeight: "28px",
            whiteSpace: "nowrap",
          }}
        >
          {MATRIX.map((row, ri) => (
            <div key={ri}>{row[ci % row.length]}</div>
          ))}
        </div>
      ))}
    </div>
  );
};
