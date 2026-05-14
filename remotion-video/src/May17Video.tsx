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

const BRAND = { dark: "#3D1547", mid: "#581B66", pop: "#B978F5", light: "#CC99FF" };
const WHITE = "#FFFFFF";

// ── PHOTO CARD ────────────────────────────────────────────────────────────────
const ScenePhoto = ({ file }: { file: string }) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });
  const zoom = interpolate(frame, [0, 42], [1.06, 1.0], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(frame, [35, 42], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ opacity: fadeIn * fadeOut, overflow: "hidden" }}>
      <Img
        src={staticFile(file)}
        style={{
          width: "100%", height: "100%",
          objectFit: "cover",
          transform: `scale(${zoom})`,
        }}
      />
      {/* Cinematic vignette */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.4) 100%)",
      }} />
    </AbsoluteFill>
  );
};

// ── INTRO ─────────────────────────────────────────────────────────────────────
const SceneIntro = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headlineSp = spring({ frame: frame - 8, fps, config: { damping: 18, stiffness: 110 } });
  const subOp = interpolate(frame, [28, 42], [0, 1], { extrapolateRight: "clamp" });
  const exitOp = interpolate(frame, [65, 75], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{
      background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.mid} 100%)`,
      justifyContent: "center",
      alignItems: "center",
      opacity: exitOp,
    }}>
      {/* Subtle radial glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(185,120,245,0.18) 0%, transparent 70%)",
      }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1, padding: "0 70px" }}>
        <div style={{
          fontFamily: FONT_SERIF,
          fontSize: 100,
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.1,
          opacity: headlineSp,
          transform: `translateY(${interpolate(headlineSp, [0, 1], [38, 0])}px)`,
          textShadow: "0 4px 32px rgba(0,0,0,0.45)",
        }}>
          Gratulerer<br />med dagen!
        </div>
        <div style={{
          marginTop: 36,
          fontFamily: FONT_SANS,
          fontSize: 34,
          fontWeight: 600,
          color: BRAND.light,
          letterSpacing: 5,
          opacity: subOp,
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
      background: `linear-gradient(135deg, ${BRAND.dark} 0%, ${BRAND.mid} 100%)`,
      justifyContent: "center",
      alignItems: "center",
      opacity: bgOp * exitOp,
      padding: "0 80px",
    }}>
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, rgba(185,120,245,0.18) 0%, transparent 70%)",
      }} />
      <div style={{ textAlign: "center", position: "relative", zIndex: 1 }}>
        <div style={{
          fontFamily: FONT_SERIF,
          fontSize: 56,
          fontWeight: 700,
          color: WHITE,
          lineHeight: 1.3,
          opacity: textSp,
          transform: `translateY(${interpolate(textSp, [0, 1], [24, 0])}px)`,
          textShadow: "0 3px 20px rgba(0,0,0,0.4)",
        }}>
          Vi i VIEW Group ønsker<br />alle sammen en fin<br />17. mai feiring!
        </div>
        <div style={{ marginTop: 32, fontSize: 68, lineHeight: 1, opacity: emojisOp }}>
          🇳🇴 🎉 🇳🇴
        </div>
        <div style={{
          marginTop: 22,
          fontFamily: FONT_SANS,
          fontSize: 19,
          fontWeight: 600,
          color: BRAND.light,
          letterSpacing: 5,
          opacity: bylineOp,
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
      justifyContent: "center",
      alignItems: "center",
    }}>
      <div style={{
        textAlign: "center",
        opacity: s,
        transform: `scale(${0.9 + s * 0.1})`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 180, filter: "brightness(0) invert(1)" }}
        />
        <div style={{ height: 2, width: lineW, background: WHITE, margin: "28px auto" }} />
        <div style={{
          fontFamily: FONT_SANS,
          fontSize: 28,
          color: WHITE,
          opacity: subOp,
          letterSpacing: 3,
          fontWeight: 600,
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
      <Series.Sequence durationInFrames={75}>
        <SceneIntro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/bunad.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/is.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/polser.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/champagne.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/sol.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/flagg.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={42}>
        <ScenePhoto file="images/may17/korps.jpg" />
      </Series.Sequence>
      <Series.Sequence durationInFrames={51}>
        <SceneOutro />
      </Series.Sequence>
      <Series.Sequence durationInFrames={30}>
        <SceneLogoEnd />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
