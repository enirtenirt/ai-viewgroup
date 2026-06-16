import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

const C = {
  beige: "#F1F0EA",
  dark: "#190523",
  primary: "#50145A",
  medium: "#7742A8",
  pop: "#B978F5",
  light: "#CC99FF",
  lighter: "#DCBEFA",
  lightest: "#F0E6FF",
  green: "#00B45A",
  red: "#E5484D",
  yellow: "#FFCB32",
};

const FONT = inter.fontFamily;

/* Top-right white VIEW logo (50% larger than original 20px = 30px) */
const ViewLogoCorner: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => (
  <div
    style={{
      position: "absolute",
      top: 20,
      right: 28,
      opacity,
    }}
  >
    <Img
      src={staticFile("images/view-logo.png")}
      style={{
        height: 30,
        filter: "brightness(0) invert(1)",
      }}
    />
  </div>
);

/* SCENE 1 — Hook */
const S1: React.FC = () => {
  const frame = useCurrentFrame();
  const words = ["AI-en", "din", "kan", "lyve", "til", "styret."];
  const sub = interpolate(frame, [55, 75], [0, 1], { extrapolateRight: "clamp" });
  const logoOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 25% 30%, ${C.primary} 0%, ${C.dark} 65%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: "28px 40px",
        justifyContent: "center",
      }}
    >
      <ViewLogoCorner opacity={logoOp} />
      <h1
        style={{
          fontSize: 54,
          lineHeight: 1.0,
          fontWeight: 700,
          letterSpacing: -1.5,
          margin: 0,
        }}
      >
        {words.map((w, i) => {
          const d = 6 + i * 7;
          const op = interpolate(frame, [d, d + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const y = interpolate(frame, [d, d + 16], [14, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: op,
                transform: `translateY(${y}px)`,
                marginRight: 12,
                color: w === "lyve" ? C.pop : "#fff",
                fontStyle: w === "lyve" ? "italic" : "normal",
              }}
            >
              {w}
            </span>
          );
        })}
      </h1>
      <div
        style={{
          marginTop: 12,
          fontSize: 18,
          color: C.lighter,
          fontStyle: "italic",
          opacity: sub,
        }}
      >
        Den vet det ikke selv.
      </div>
    </AbsoluteFill>
  );
};

/* SCENE 2 — Report wobble (UNCHANGED) */
const S2: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const wobble = interpolate(frame, [0, 35, 75], [0, 0.1, 1], { extrapolateRight: "clamp" });
  const omsetning = (847 + Math.sin(frame * 0.6) * 70 * wobble).toFixed(0);
  const yoy = (12.4 + Math.sin(frame * 0.9) * 24 * wobble - 5 * wobble).toFixed(1);
  const conf = Math.max(20, Math.round(94 - wobble * 65 + Math.sin(frame * 1.3) * 10 * wobble));
  const danger = wobble > 0.5;
  const shake = wobble > 0.3 ? Math.sin(frame * 4) * wobble * 4 : 0;
  const sp = spring({ frame: frame - 4, fps, config: { damping: 18, stiffness: 110 } });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.dark} 0%, #2a0833 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: 26,
        flexDirection: "row",
        alignItems: "center",
        gap: 26,
      }}
    >
      <div
        style={{
          flex: 1,
          fontFamily: "ui-monospace, Menlo, monospace",
          background: "rgba(0,0,0,0.55)",
          border: `1px solid ${C.medium}55`,
          borderRadius: 10,
          padding: 14,
          fontSize: 12,
          lineHeight: 1.7,
          color: C.lighter,
          opacity: sp,
        }}
      >
        <div style={{ display: "flex", gap: 5, marginBottom: 6 }}>
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "#ff5f57" }} />
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "#febc2e" }} />
          <span style={{ width: 7, height: 7, borderRadius: 4, background: "#28c840" }} />
        </div>
        {[
          "> Genererer Q1 styrebriefing...",
          "> Henter data fra 5 ERP-systemer...",
          "> Konsoliderer NOK / SEK / DKK...",
          danger ? "> Konfidens: synker..." : "> Konfidens: 94%  ✓",
        ].map((l, i) => {
          const d = i * 10;
          const op = interpolate(frame, [d, d + 6], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <div
              key={i}
              style={{
                opacity: op,
                color: i === 3 ? (danger ? C.red : C.green) : C.light,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>

      <div
        style={{
          flex: 1.1,
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: `1px solid ${danger ? C.red + "aa" : C.medium + "55"}`,
          borderRadius: 12,
          padding: 18,
          opacity: sp,
          transform: `translateX(${shake}px) rotate(${shake * 0.05}deg)`,
          boxShadow: danger ? `0 0 40px ${C.red}55` : "0 12px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: C.light, fontWeight: 700 }}>Q1 · STYREBRIEFING</div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 2 }}>Konsern · sammendrag</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 8, letterSpacing: 2, color: C.light }}>KONFIDENS</div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: conf > 80 ? C.green : conf > 55 ? C.yellow : C.red,
              }}
            >
              {conf}%
            </div>
          </div>
        </div>
        <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: C.light }}>KONSERNOMSETNING</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2, color: danger ? C.red : "#fff" }}>
              NOK {omsetning}M
            </div>
            <div style={{ fontSize: 11, color: parseFloat(yoy) < 0 ? C.red : C.green, fontWeight: 600 }}>
              {parseFloat(yoy) >= 0 ? "+" : ""}{yoy}% YoY
            </div>
          </div>
          <div>
            <div style={{ fontSize: 8, letterSpacing: 2, color: C.light }}>EBITDA</div>
            <div style={{ fontSize: 24, fontWeight: 700, marginTop: 2, color: danger ? C.red : "#fff" }}>
              {(14.2 + Math.sin(frame * 0.75) * 9 * wobble).toFixed(1)}%
            </div>
            <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>+180 bps</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* SCENE 3 — AI-ready insight */
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 90 } });
  const logoOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  // animated "stack" — data layer lights up before model layer
  const dataPulse = interpolate(frame % 60, [0, 30, 60], [0.4, 1, 0.4]);
  const modelDim = interpolate(frame, [0, 40], [0.18, 0.28], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 50%, ${C.primary} 0%, ${C.dark} 65%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: "26px 40px",
        flexDirection: "row",
        alignItems: "center",
        gap: 28,
      }}
    >
      <ViewLogoCorner opacity={logoOp} />

      {/* left: headline */}
      <div style={{ flex: 1.4 }}>
        <div
          style={{
            fontSize: 10,
            letterSpacing: 3,
            fontWeight: 700,
            color: C.light,
            marginBottom: 10,
            opacity: sp,
          }}
        >
          INNSIKT
        </div>
        <h2
          style={{
            fontSize: 30,
            lineHeight: 1.1,
            fontWeight: 700,
            letterSpacing: -0.8,
            margin: 0,
            opacity: sp,
            transform: `translateY(${interpolate(sp, [0, 1], [12, 0])}px)`,
          }}
        >
          <span style={{ color: C.pop, fontStyle: "italic" }}>«AI-ready»</span> begynner med{" "}
          <span style={{ textDecoration: "underline", textDecorationColor: C.pop, textUnderlineOffset: 4 }}>
            datagrunnlaget
          </span>{" "}
          – ikke modellene.
        </h2>
      </div>

      {/* right: layered stack */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          opacity: sp,
        }}
      >
        {[
          { label: "AI-MODELLER", weight: modelDim, accent: false },
          { label: "RAPPORTLAG", weight: modelDim + 0.05, accent: false },
          { label: "KONSOLIDERING", weight: 0.55, accent: false },
          { label: "DATAGRUNNLAG", weight: dataPulse, accent: true },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              background: row.accent
                ? `linear-gradient(90deg, ${C.pop} 0%, ${C.medium} 100%)`
                : `rgba(255,255,255,${0.04 + row.weight * 0.06})`,
              border: `1px solid ${row.accent ? C.pop : C.medium + "44"}`,
              opacity: row.accent ? 1 : 0.45 + row.weight * 0.3,
              boxShadow: row.accent ? `0 0 26px ${C.pop}66` : "none",
              fontSize: 11,
              letterSpacing: 2,
              fontWeight: 700,
              color: row.accent ? "#fff" : C.lighter,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{row.label}</span>
            {row.accent && <span style={{ fontSize: 10 }}>← START HER</span>}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};

/* SCENE 4 — One truth */
const S4: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - 4, fps, config: { damping: 22, stiffness: 90 } });
  const sub = interpolate(frame, [30, 55], [0, 1], { extrapolateRight: "clamp" });
  const logoOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: "#fff",
        fontFamily: FONT,
        color: C.dark,
        padding: "26px 36px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ViewLogoCorner opacity={0} />

      <div style={{ fontSize: 10, letterSpacing: 3, fontWeight: 700, color: C.primary, opacity: logoOp }}>
        ÉN SANNHET
      </div>
      <h2
        style={{
          fontSize: 38,
          lineHeight: 1.15,
          fontWeight: 700,
          letterSpacing: -0.8,
          margin: "6px 0 0 0",
          opacity: sp,
          transform: `translateY(${interpolate(sp, [0, 1], [10, 0])}px)`,
        }}
      >
        Har du <span style={{ color: C.primary, fontStyle: "italic" }}>et sannhet</span> for konsernet?
      </h2>
      <div
        style={{
          marginTop: 14,
          fontSize: 18,
          color: "#555",
          opacity: sub,
          lineHeight: 1.45,
          maxWidth: 800,
        }}
      >
        Et ERP for hele konsernet gir CFO er godt datagrunnlag.
      </div>
    </AbsoluteFill>
  );
};

/* SCENE 5 — CTA */
const S5: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - 4, fps, config: { damping: 22, stiffness: 90 } });
  const ctaOp = interpolate(frame, [30, 50], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 1 + Math.sin(frame * 0.18) * 0.02;
  const logoOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 50%, ${C.primary} 0%, ${C.dark} 70%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: "26px 40px",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 30,
      }}
    >
      <ViewLogoCorner opacity={logoOp} />

      <div style={{ flex: 1.5 }}>
        <h2
          style={{
            fontSize: 30,
            lineHeight: 1.15,
            fontWeight: 700,
            letterSpacing: -0.8,
            margin: 0,
            opacity: sp,
            transform: `translateY(${interpolate(sp, [0, 1], [10, 0])}px)`,
          }}
        >
          Opplev <span style={{ color: C.pop, fontStyle: "italic" }}>Xledger</span> gjennom VIEW Group.
        </h2>
        <div
          style={{
            marginTop: 10,
            fontSize: 16,
            color: C.lighter,
            opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
            lineHeight: 1.45,
            maxWidth: 540,
          }}
        >
          Vi hjelper konsern samle forretningsinnsikt i én plattform.
        </div>
      </div>

      <div
        style={{
          opacity: ctaOp,
          transform: `scale(${pulse})`,
          background: `linear-gradient(135deg, ${C.pop} 0%, ${C.medium} 100%)`,
          color: "#fff",
          padding: "16px 28px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: 0.3,
          boxShadow: `0 12px 40px ${C.pop}55`,
          whiteSpace: "nowrap",
        }}
      >
        Book 20 min demo →
      </div>
    </AbsoluteFill>
  );
};

export const AiLyverBanner: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.dark }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={125}>
          <S1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={140}>
          <S2 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={wipe({ direction: "from-right" })} timing={linearTiming({ durationInFrames: 14 })} />
        <TransitionSeries.Sequence durationInFrames={125}>
          <S3 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={140}>
          <S4 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
        <TransitionSeries.Sequence durationInFrames={150}>
          <S5 />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
