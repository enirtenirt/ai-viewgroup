import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Sequence,
  Img,
  staticFile,
  random,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
  springTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { wipe } from "@remotion/transitions/wipe";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";

const inter = loadInter("normal", {
  weights: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
});

// VIEW Group brand palette
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
  blue: "#00C8FF",
  yellow: "#FFCB32",
  red: "#E5484D",
};

const FONT = inter.fontFamily;

/* ────────────────────────────── SCENE 1 — HEADLINE ────────────────────────────── */
const Scene1Headline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const words = ["AI-en", "din", "kan", "lyve", "til", "styret."];
  const subOp = interpolate(frame, [70, 90], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 30% 20%, ${C.primary} 0%, ${C.dark} 60%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: 80,
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      {/* eyebrow */}
      <div
        style={{
          opacity: interpolate(frame, [0, 18], [0, 1], {
            extrapolateRight: "clamp",
          }),
          fontSize: 18,
          letterSpacing: 6,
          fontWeight: 600,
          color: C.yellow,
          marginBottom: 36,
        }}
      >
        STYREBRIEFING · Q1
      </div>

      <h1
        style={{
          fontSize: 110,
          lineHeight: 1.02,
          fontWeight: 700,
          letterSpacing: -2,
          margin: 0,
          maxWidth: 920,
        }}
      >
        {words.map((w, i) => {
          const delay = 8 + i * 9;
          const op = interpolate(frame, [delay, delay + 14], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const y = interpolate(frame, [delay, delay + 18], [22, 0], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: op,
                transform: `translateY(${y}px)`,
                marginRight: 22,
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
          marginTop: 40,
          fontSize: 36,
          color: C.lighter,
          fontStyle: "italic",
          fontWeight: 400,
          opacity: subOp,
        }}
      >
        Den vet det ikke selv.
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────────── SCENE 2 — REPORT GENERATING ────────────────────────────── */
const TerminalLines = [
  "> Genererer Q1 styrebriefing...",
  "> Henter data fra 5 ERP-systemer...",
  "> Konsoliderer NOK / SEK / DKK...",
  "> Konfidens: 94%  ✓",
];

const Scene2Report: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // wobble grows from 0 → 1 across the scene
  const wobble = interpolate(frame, [0, 60, 110], [0, 0.05, 1], {
    extrapolateRight: "clamp",
  });

  const cardSp = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 110 },
  });

  // numbers flickering
  const omsetning = (847 + Math.sin(frame * 0.6) * 60 * wobble).toFixed(0);
  const yoy = (12.4 + Math.sin(frame * 0.9) * 22 * wobble - 4 * wobble).toFixed(1);
  const ebitda = (14.2 + Math.sin(frame * 0.75 + 2) * 9 * wobble).toFixed(1);
  const conf = Math.max(20, Math.round(94 - wobble * 60 + Math.sin(frame * 1.3) * 10 * wobble));

  const danger = wobble > 0.5;
  const shake = wobble > 0.3 ? Math.sin(frame * 4) * wobble * 5 : 0;

  // terminal lines reveal
  const lineDelays = [0, 14, 28, 44];

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.dark} 0%, #2a0833 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: 60,
        justifyContent: "center",
      }}
    >
      {/* terminal */}
      <div
        style={{
          fontFamily: "ui-monospace, Menlo, monospace",
          background: "rgba(0,0,0,0.55)",
          border: `1px solid ${C.medium}55`,
          borderRadius: 12,
          padding: 22,
          fontSize: 18,
          lineHeight: 1.9,
          color: C.lighter,
          marginBottom: 32,
          opacity: cardSp,
        }}
      >
        <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#ff5f57" }} />
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#febc2e" }} />
          <span style={{ width: 10, height: 10, borderRadius: 5, background: "#28c840" }} />
        </div>
        {TerminalLines.map((l, i) => {
          const op = interpolate(frame, [lineDelays[i], lineDelays[i] + 6], [0, 1], {
            extrapolateRight: "clamp",
            extrapolateLeft: "clamp",
          });
          const isLast = i === TerminalLines.length - 1;
          return (
            <div
              key={i}
              style={{
                opacity: op,
                color: isLast ? C.green : C.light,
              }}
            >
              {l}
            </div>
          );
        })}
      </div>

      {/* report card */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
          border: `1px solid ${danger ? C.red + "88" : C.medium + "55"}`,
          borderRadius: 18,
          padding: 36,
          opacity: cardSp,
          transform: `translateX(${shake}px) rotate(${shake * 0.05}deg) scale(${0.95 + cardSp * 0.05})`,
          boxShadow: danger
            ? `0 0 60px ${C.red}55`
            : `0 20px 60px rgba(0,0,0,0.4)`,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            paddingBottom: 18,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <div>
            <div style={{ fontSize: 12, letterSpacing: 3, color: C.light, fontWeight: 600 }}>
              Q1 · STYREBRIEFING
            </div>
            <div style={{ fontSize: 32, fontWeight: 600, marginTop: 4 }}>
              Konsern · sammendrag
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.light }}>KONFIDENS</div>
            <div
              style={{
                fontSize: 36,
                fontWeight: 700,
                color: conf > 80 ? C.green : conf > 55 ? C.yellow : C.red,
              }}
            >
              {conf}%
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginTop: 28 }}>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.light }}>
              KONSERNOMSETNING
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                marginTop: 6,
                color: danger ? C.red : "#fff",
              }}
            >
              NOK {omsetning}M
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 16,
                color: parseFloat(yoy) < 0 ? C.red : C.green,
                fontWeight: 600,
              }}
            >
              {parseFloat(yoy) >= 0 ? "+" : ""}
              {yoy}% YoY
            </div>
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: 2, color: C.light }}>
              EBITDA-MARGIN
            </div>
            <div
              style={{
                fontSize: 48,
                fontWeight: 700,
                marginTop: 6,
                color: danger ? C.red : "#fff",
              }}
            >
              {ebitda}%
            </div>
            <div style={{ marginTop: 4, fontSize: 16, color: C.green, fontWeight: 600 }}>
              +180 bps
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────────── SCENE 3 — REVEAL ────────────────────────────── */
const Scene3Reveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // background fades from purple toward deep red-purple
  const r = interpolate(frame, [0, 30], [25, 90]);
  const g = interpolate(frame, [0, 30], [5, 15]);
  const b = interpolate(frame, [0, 30], [35, 30]);

  const titleSp = spring({
    frame: frame - 10,
    fps,
    config: { damping: 20, stiffness: 90 },
  });
  const subOp = interpolate(frame, [50, 75], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at center, rgb(${r}, ${g}, ${b}) 0%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: 80,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <h2
        style={{
          fontSize: 140,
          lineHeight: 0.95,
          fontWeight: 700,
          letterSpacing: -3,
          margin: 0,
          opacity: titleSp,
          transform: `scale(${0.92 + titleSp * 0.08})`,
        }}
      >
        Alle tallene
        <br />
        <span style={{ color: C.pop, fontStyle: "italic" }}>var feil.</span>
      </h2>

      <div
        style={{
          marginTop: 40,
          fontSize: 32,
          color: C.lighter,
          fontStyle: "italic",
          opacity: subOp,
        }}
      >
        AI-en visste det ikke. Styret heller ikke.
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────────── SCENE 4 — VIEW GROUP CTA ────────────────────────────── */
const Scene4CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoSp = spring({
    frame: frame - 5,
    fps,
    config: { damping: 18, stiffness: 110 },
  });
  const titleOp = interpolate(frame, [20, 40], [0, 1], {
    extrapolateRight: "clamp",
  });
  const subOp = interpolate(frame, [40, 60], [0, 1], {
    extrapolateRight: "clamp",
  });
  const ctaSp = spring({
    frame: frame - 60,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${C.primary} 0%, ${C.dark} 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: 80,
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
      }}
    >
      <Img
        src={staticFile("images/view-logo.png")}
        style={{
          height: 90,
          filter: "brightness(0) invert(1)",
          opacity: logoSp,
          transform: `translateY(${interpolate(logoSp, [0, 1], [10, 0])}px)`,
          marginBottom: 50,
        }}
      />

      <h2
        style={{
          fontSize: 84,
          lineHeight: 1.05,
          fontWeight: 700,
          letterSpacing: -1.5,
          margin: 0,
          opacity: titleOp,
          maxWidth: 900,
        }}
      >
        En sannhet
        <br />
        <span style={{ color: C.pop }}>for hele konsernet.</span>
      </h2>

      <div
        style={{
          marginTop: 28,
          fontSize: 26,
          color: C.lighter,
          opacity: subOp,
          maxWidth: 760,
        }}
      >
        Vi viser deg hvordan AI-en slutter å lyve.
      </div>

      <div
        style={{
          marginTop: 52,
          opacity: ctaSp,
          transform: `translateY(${interpolate(ctaSp, [0, 1], [16, 0])}px) scale(${0.95 + ctaSp * 0.05})`,
          background: C.pop,
          color: C.dark,
          fontWeight: 700,
          fontSize: 26,
          padding: "22px 44px",
          borderRadius: 999,
          letterSpacing: 0.3,
          boxShadow: `0 20px 50px ${C.pop}55`,
        }}
      >
        Book en 20 min uforpliktende demo →
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 50,
          fontSize: 14,
          color: C.lighter,
          opacity: ctaSp * 0.8,
          letterSpacing: 2,
        }}
      >
        VIEW GROUP · XLEDGER PLATINUM CERTIFIED PARTNER 2026
      </div>
    </AbsoluteFill>
  );
};

/* ────────────────────────────── ROOT VIDEO ────────────────────────────── */
export const AiLyverAd: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.dark, fontFamily: FONT }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={130}>
          <Scene1Headline />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={140}>
          <Scene2Report />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={wipe({ direction: "from-right" })}
          timing={springTiming({ durationInFrames: 24, config: { damping: 200 } })}
        />
        <TransitionSeries.Sequence durationInFrames={110}>
          <Scene3Reveal />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition
          presentation={fade()}
          timing={linearTiming({ durationInFrames: 18 })}
        />
        <TransitionSeries.Sequence durationInFrames={140}>
          <Scene4CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
