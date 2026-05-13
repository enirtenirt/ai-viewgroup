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
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const inter = loadInter("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const playfair = loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });

const FLAG = { red: "#EF2B2D", white: "#FFFFFF", blue: "#002868" };
const BRAND = { dark: "#3D1547", mid: "#581B66", pop: "#B978F5", light: "#CC99FF" };

type CardData = {
  emoji: string;
  label: string;
  bg: string;
  accent: string;
};

const CARD_DATA: CardData[] = [
  { emoji: "👘", label: "Bunad", bg: "linear-gradient(135deg, #8B4513 0%, #CD853F 100%)", accent: "#FFD700" },
  { emoji: "🍦", label: "Is", bg: "linear-gradient(135deg, #FF69B4 0%, #FFB6C1 100%)", accent: "#FFFFFF" },
  { emoji: "🌭", label: "Pølser", bg: "linear-gradient(135deg, #CC4400 0%, #FF6600 100%)", accent: "#FFD700" },
  { emoji: "🥂", label: "Champagne", bg: "linear-gradient(135deg, #B8860B 0%, #FFD700 100%)", accent: "#FFF8DC" },
  { emoji: "☀️", label: "Sol", bg: "linear-gradient(135deg, #FF8C00 0%, #FFD700 100%)", accent: "#FFFFFF" },
  { emoji: "🇳🇴", label: "Flagg", bg: "linear-gradient(160deg, #EF2B2D 0%, #002868 100%)", accent: "#FFFFFF" },
  { emoji: "🎺", label: "Korps", bg: "linear-gradient(135deg, #1A237E 0%, #3949AB 100%)", accent: "#FFD700" },
];

// Pure-CSS Norwegian flag cross layers
const NorwegianCross = ({ opacity }: { opacity: number }) => (
  <div style={{ position: "absolute", inset: 0, opacity }}>
    {/* White horizontal bar */}
    <div style={{ position: "absolute", top: "43.5%", left: 0, right: 0, height: "13%", background: FLAG.white }} />
    {/* White vertical bar (offset left per flag proportions) */}
    <div style={{ position: "absolute", left: "22%", top: 0, bottom: 0, width: "13%", background: FLAG.white }} />
    {/* Blue horizontal bar */}
    <div style={{ position: "absolute", top: "46%", left: 0, right: 0, height: "8%", background: FLAG.blue }} />
    {/* Blue vertical bar */}
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
    <AbsoluteFill
      style={{
        background: `linear-gradient(160deg, ${FLAG.red} 0%, ${FLAG.blue} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: exitOp,
      }}
    >
      <NorwegianCross opacity={crossOp} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 60px" }}>
        <div
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 96,
            fontWeight: 700,
            color: FLAG.white,
            lineHeight: 1.1,
            opacity: headlineSp,
            transform: `translateY(${interpolate(headlineSp, [0, 1], [40, 0])}px)`,
            textShadow: "0 4px 24px rgba(0,0,0,0.35)",
          }}
        >
          Gratulerer<br />med dagen!
        </div>
        <div
          style={{
            marginTop: 32,
            fontFamily: inter.fontFamily,
            fontSize: 36,
            fontWeight: 600,
            color: "#FFD700",
            letterSpacing: 4,
            opacity: subOp,
          }}
        >
          🇳🇴 17. mai 🇳🇴
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneCard = ({ emoji, label, bg, accent }: CardData) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = interpolate(frame, [0, 8], [0, 1], { extrapolateRight: "clamp" });
  const ringR = interpolate(frame, [2, 18], [0, 200], { extrapolateRight: "clamp" });
  const ringOp = interpolate(frame, [2, 18], [0, 0.4], { extrapolateRight: "clamp" });
  const emojiSp = spring({ frame: frame - 4, fps, config: { stiffness: 200, damping: 14 } });
  const labelSp = spring({ frame: frame - 12, fps, config: { stiffness: 160, damping: 18 } });
  const exitOp = interpolate(frame, [35, 42], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ background: bg, opacity: bgOp * exitOp, justifyContent: "center", alignItems: "center" }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <circle cx={540} cy={480} r={ringR} fill="none" stroke={accent} strokeWidth={5} opacity={ringOp} />
      </svg>
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontSize: 260,
            lineHeight: 1,
            opacity: emojiSp,
            transform: `scale(${0.4 + emojiSp * 0.6})`,
          }}
        >
          {emoji}
        </div>
        <div
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 80,
            fontWeight: 700,
            color: FLAG.white,
            marginTop: 16,
            letterSpacing: 3,
            opacity: labelSp,
            transform: `translateY(${interpolate(labelSp, [0, 1], [30, 0])}px)`,
            textShadow: "0 3px 16px rgba(0,0,0,0.3)",
          }}
        >
          {label}
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneOutro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const bgOp = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const textSp = spring({ frame: frame - 8, fps, config: { damping: 20, stiffness: 110 } });
  const emojisOp = interpolate(frame, [20, 32], [0, 1], { extrapolateRight: "clamp" });
  const bylineOp = interpolate(frame, [30, 44], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [46, 51], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${FLAG.blue} 0%, ${FLAG.red} 100%)`,
        justifyContent: "center",
        alignItems: "center",
        opacity: bgOp * exitOp,
        padding: "0 80px",
      }}
    >
      <NorwegianCross opacity={0.1} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div
          style={{
            fontFamily: playfair.fontFamily,
            fontSize: 56,
            fontWeight: 700,
            color: FLAG.white,
            lineHeight: 1.25,
            opacity: textSp,
            transform: `translateY(${interpolate(textSp, [0, 1], [24, 0])}px)`,
            textShadow: "0 3px 20px rgba(0,0,0,0.3)",
          }}
        >
          Vi i VIEW Group ønsker<br />alle sammen en fin<br />17. mai feiring!
        </div>
        <div
          style={{
            marginTop: 32,
            fontSize: 72,
            lineHeight: 1,
            opacity: emojisOp,
          }}
        >
          🇳🇴 🎉 🇳🇴
        </div>
        <div
          style={{
            marginTop: 24,
            fontFamily: inter.fontFamily,
            fontSize: 20,
            fontWeight: 600,
            color: BRAND.light,
            letterSpacing: 4,
            opacity: bylineOp,
          }}
        >
          VIEW GROUP
        </div>
      </div>
    </AbsoluteFill>
  );
};

const SceneLogoEnd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const s = spring({ frame, fps, config: { damping: 18 } });
  const lineW = interpolate(frame, [10, 28], [0, 300], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [20, 30], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill
      style={{
        background: `linear-gradient(135deg, ${BRAND.light} 0%, ${BRAND.pop} 100%)`,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          textAlign: "center",
          opacity: s,
          transform: `scale(${0.9 + s * 0.1})`,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 180, filter: "brightness(0) invert(1)" }}
        />
        <div style={{ height: 2, width: lineW, background: FLAG.white, margin: "28px auto" }} />
        <div
          style={{
            fontFamily: inter.fontFamily,
            fontSize: 28,
            color: FLAG.white,
            opacity: subOp,
            letterSpacing: 3,
            fontWeight: 600,
          }}
        >
          God 17. mai! 🇳🇴
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const May17Video = () => (
  <AbsoluteFill style={{ fontFamily: inter.fontFamily }}>
    <Series>
      <Series.Sequence durationInFrames={75}>
        <SceneIntro />
      </Series.Sequence>
      {CARD_DATA.map((card, i) => (
        <Series.Sequence key={i} durationInFrames={42}>
          <SceneCard {...card} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={51}>
        <SceneOutro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={30}>
        <SceneLogoEnd />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
