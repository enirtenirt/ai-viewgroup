import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  interpolate,
  spring,
  Img,
  staticFile,
} from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

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

const ViewLogoCorner: React.FC<{ opacity?: number; dark?: boolean }> = ({ opacity = 1, dark = false }) => (
  <div style={{ position: "absolute", top: 28, right: 36, opacity }}>
    <Img
      src={staticFile("images/view-logo.png")}
      style={{
        height: 42,
        filter: dark ? "none" : "brightness(0) invert(1)",
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
        padding: "60px 70px",
        justifyContent: "center",
      }}
    >
      <ViewLogoCorner opacity={logoOp} />
      <h1
        style={{
          fontSize: 92,
          lineHeight: 1.0,
          fontWeight: 700,
          letterSpacing: -2.5,
          margin: 0,
          maxWidth: 820,
        }}
      >
        {words.map((w, i) => {
          const d = 6 + i * 7;
          const op = interpolate(frame, [d, d + 12], [0, 1], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          const y = interpolate(frame, [d, d + 16], [22, 0], { extrapolateRight: "clamp", extrapolateLeft: "clamp" });
          return (
            <span
              key={i}
              style={{
                display: "inline-block",
                opacity: op,
                transform: `translateY(${y}px)`,
                marginRight: 20,
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
          marginTop: 28,
          fontSize: 36,
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

/* SCENE 3 — AI-ready insight */
const S3: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const sp = spring({ frame: frame - 6, fps, config: { damping: 20, stiffness: 90 } });
  const logoOp = interpolate(frame, [0, 14], [0, 1], { extrapolateRight: "clamp" });
  const dataPulse = interpolate(frame % 60, [0, 30, 60], [0.4, 1, 0.4]);
  const modelDim = interpolate(frame, [0, 40], [0.18, 0.28], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse at 70% 50%, ${C.primary} 0%, ${C.dark} 65%, #0a0210 100%)`,
        fontFamily: FONT,
        color: "#fff",
        padding: "60px 70px",
        flexDirection: "column",
        justifyContent: "center",
        gap: 32,
      }}
    >
      <ViewLogoCorner opacity={logoOp} />

      <h2
        style={{
          fontSize: 52,
          lineHeight: 1.1,
          fontWeight: 700,
          letterSpacing: -1.2,
          margin: 0,
          opacity: sp,
          transform: `translateY(${interpolate(sp, [0, 1], [16, 0])}px)`,
          maxWidth: 820,
        }}
      >
        <span style={{ color: C.pop, fontStyle: "italic" }}>«AI-ready»</span> begynner med{" "}
        <span style={{ textDecoration: "underline", textDecorationColor: C.pop, textUnderlineOffset: 6 }}>
          datagrunnlaget
        </span>{" "}
        – ikke modellene.
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 10, opacity: sp, maxWidth: 600 }}>
        {[
          { label: "AI-MODELLER", weight: modelDim, accent: false },
          { label: "RAPPORTLAG", weight: modelDim + 0.05, accent: false },
          { label: "KONSOLIDERING", weight: 0.55, accent: false },
          { label: "DATAGRUNNLAG", weight: dataPulse, accent: true },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              padding: "14px 20px",
              borderRadius: 10,
              background: row.accent
                ? `linear-gradient(90deg, ${C.pop} 0%, ${C.medium} 100%)`
                : `rgba(255,255,255,${0.04 + row.weight * 0.06})`,
              border: `1px solid ${row.accent ? C.pop : C.medium + "44"}`,
              opacity: row.accent ? 1 : 0.45 + row.weight * 0.3,
              boxShadow: row.accent ? `0 0 32px ${C.pop}66` : "none",
              fontSize: 16,
              letterSpacing: 2.4,
              fontWeight: 700,
              color: row.accent ? "#fff" : C.lighter,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>{row.label}</span>
            {row.accent && <span style={{ fontSize: 14 }}>← START HER</span>}
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
        padding: "60px 70px",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <ViewLogoCorner opacity={logoOp} dark />

      <div style={{ fontSize: 16, letterSpacing: 4, fontWeight: 700, color: C.primary, opacity: logoOp }}>
        ÉN SANNHET
      </div>
      <h2
        style={{
          fontSize: 64,
          lineHeight: 1.12,
          fontWeight: 700,
          letterSpacing: -1.4,
          margin: "14px 0 0 0",
          opacity: sp,
          transform: `translateY(${interpolate(sp, [0, 1], [14, 0])}px)`,
          maxWidth: 820,
        }}
      >
        Har du <span style={{ color: C.primary, fontStyle: "italic" }}>et sannhet</span> for konsernet?
      </h2>
      <div
        style={{
          marginTop: 24,
          fontSize: 34,
          color: "#555",
          opacity: sub,
          lineHeight: 1.4,
          maxWidth: 820,
        }}
      >
        Eller flere ERP-systemer som gjør det vanskelig å få oversikt?
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
        padding: "60px 70px",
        flexDirection: "column",
        justifyContent: "center",
        gap: 28,
      }}
    >
      <ViewLogoCorner opacity={logoOp} />

      <h2
        style={{
          fontSize: 56,
          lineHeight: 1.12,
          fontWeight: 700,
          letterSpacing: -1.3,
          margin: 0,
          opacity: sp,
          transform: `translateY(${interpolate(sp, [0, 1], [14, 0])}px)`,
          maxWidth: 820,
        }}
      >
        Opplev <span style={{ color: C.pop, fontStyle: "italic" }}>Xledger</span> gjennom VIEW Group.
      </h2>
      <div
        style={{
          fontSize: 30,
          color: C.lighter,
          opacity: interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" }),
          lineHeight: 1.4,
          maxWidth: 900,
        }}
      >
        Vi hjelper konsern samle forretningsinnsikt i én plattform.
      </div>

      <div
        style={{
          opacity: ctaOp,
          transform: `scale(${pulse})`,
          transformOrigin: "left center",
          background: `linear-gradient(135deg, ${C.pop} 0%, ${C.medium} 100%)`,
          color: "#fff",
          padding: "22px 38px",
          borderRadius: 999,
          fontWeight: 700,
          fontSize: 26,
          letterSpacing: 0.4,
          boxShadow: `0 16px 48px ${C.pop}55`,
          whiteSpace: "nowrap",
          alignSelf: "flex-start",
        }}
      >
        Book 20 min demo →
      </div>
    </AbsoluteFill>
  );
};

export const AiLyverLarge: React.FC = () => {
  return (
    <AbsoluteFill style={{ background: C.dark }}>
      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={125}>
          <S1 />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={linearTiming({ durationInFrames: 12 })} />
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
