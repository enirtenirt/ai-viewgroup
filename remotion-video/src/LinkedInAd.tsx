import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const inter = loadInter("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const playfair = loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });

const C = {
  bg1: "#3D1547",
  bg2: "#581B66",
  card: "#2A0A33",
  cardLight: "#B978F5",
  cardLighter: "#CC99FF",
  border: "#B978F5",
  text: "#FFFFFF",
  light: "#CC99FF",
  yellow: "#FFC832",
  line: "#B978F5",
};

const Box = ({
  cx, cy, label, delay, fill, textColor,
}: { cx: number; cy: number; label: string; delay: number; fill: string; textColor: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 140 } });
  const w = 220, h = 56;
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
      background: fill, border: `1.5px solid ${C.border}`, borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: textColor, fontSize: 16, fontWeight: 600, fontFamily: inter.fontFamily,
      opacity: s, transform: `scale(${0.85 + s * 0.15})`,
    }}>
      {label}
    </div>
  );
};

const DashLine = ({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={2}
      strokeDasharray="5 6" strokeDashoffset={len - len * t} opacity={0.85} />
  );
};

const FlowDot = ({ x1, y1, x2, y2, delay, color }: { x1: number; y1: number; x2: number; y2: number; delay: number; color: string }) => {
  const frame = useCurrentFrame();
  if (frame < delay) return null;
  const t = (((frame - delay) % 50) / 50);
  const x = x1 + (x2 - x1) * t;
  const y = y1 + (y2 - y1) * t;
  return <circle cx={x} cy={y} r={3.5} fill={color} opacity={1 - t * 0.5} />;
};

export const LinkedInAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const eyebrowOp = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const headlineSp = spring({ frame: frame - 18, fps, config: { damping: 20 } });
  const subOp = interpolate(frame, [38, 55], [0, 1], { extrapolateRight: "clamp" });
  const footerOp = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: "clamp" });

  // Org chart positions (canvas 1080x1080)
  const cx = 540;
  const top = { x: cx, y: 620 };
  const mid1 = { x: cx - 130, y: 730 };
  const mid2 = { x: cx + 130, y: 730 };
  const bot1 = { x: cx - 130, y: 820 };
  const bot2 = { x: cx + 130, y: 820 };
  const TURQ = "#00C8B4";

  return (
    <AbsoluteFill style={{
      background: `linear-gradient(160deg, ${C.bg1} 0%, ${C.bg2} 100%)`,
      fontFamily: inter.fontFamily, color: "#fff", padding: 60,
    }}>
      {/* Top header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: headerOp }}>
        <Img src={staticFile("images/view-logo.png")} style={{ height: 48, filter: "brightness(0) invert(1)" }} />
        <div style={{ fontSize: 13, color: "#fff", letterSpacing: 1.5, fontWeight: 600, textAlign: "right", lineHeight: 1.3 }}>
          XLEDGER<br />
          <span style={{ color: C.light, fontWeight: 500 }}>Platinum Certified Partner 2026</span>
        </div>
      </div>

      {/* Eyebrow */}
      <div style={{
        marginTop: 130, textAlign: "center",
        opacity: eyebrowOp, transform: `translateY(${interpolate(eyebrowOp,[0,1],[8,0])}px)`,
        fontSize: 16, color: C.yellow, letterSpacing: 5, fontWeight: 700,
      }}>
        XLEDGER ERP FOR KONSERN
      </div>

      {/* Headline */}
      <div style={{
        marginTop: 24, textAlign: "center",
        opacity: headlineSp, transform: `translateY(${interpolate(headlineSp,[0,1],[20,0])}px)`,
        fontFamily: playfair.fontFamily, fontSize: 78, fontWeight: 700,
        lineHeight: 1.05, color: "#fff",
      }}>
        En sannhet for<br />hele konsernet
      </div>

      {/* Subtitle */}
      <div style={{
        marginTop: 24, textAlign: "center",
        opacity: subOp, fontSize: 26, color: C.light, fontWeight: 500,
      }}>
        Bygd for konsern. Ikke tilpasset.
      </div>

      {/* Org chart connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <DashLine x1={top.x} y1={top.y + 28} x2={mid1.x} y2={mid1.y - 28} delay={70} />
        <DashLine x1={top.x} y1={top.y + 28} x2={mid2.x} y2={mid2.y - 28} delay={75} />
        <DashLine x1={mid1.x + 110} y1={mid1.y} x2={mid2.x - 110} y2={mid2.y} delay={95} />
        <DashLine x1={mid1.x} y1={mid1.y + 28} x2={bot1.x} y2={bot1.y - 28} delay={105} />
        <DashLine x1={mid2.x} y1={mid2.y + 28} x2={bot2.x} y2={bot2.y - 28} delay={108} />
        <DashLine x1={bot1.x + 110} y1={bot1.y} x2={bot2.x - 110} y2={bot2.y} delay={120} />

        <FlowDot x1={top.x} y1={top.y + 28} x2={mid1.x} y2={mid1.y - 28} delay={140} color={TURQ} />
        <FlowDot x1={top.x} y1={top.y + 28} x2={mid2.x} y2={mid2.y - 28} delay={155} color={TURQ} />
        <FlowDot x1={mid1.x} y1={mid1.y + 28} x2={bot1.x} y2={bot1.y - 28} delay={170} color={TURQ} />
        <FlowDot x1={mid2.x} y1={mid2.y + 28} x2={bot2.x} y2={bot2.y - 28} delay={185} color={TURQ} />
      </svg>

      {/* Org chart boxes */}
      <Box cx={top.x} cy={top.y} label="Holdingselskap AS" delay={60} fill={C.card} textColor="#fff" />
      <Box cx={mid1.x} cy={mid1.y} label="Driftsselskap AS" delay={80} fill="#7742A8" textColor="#fff" />
      <Box cx={mid2.x} cy={mid2.y} label="Dotterbolag AB" delay={86} fill="#7742A8" textColor="#fff" />
      <Box cx={bot1.x} cy={bot1.y} label="Eiendom AS" delay={100} fill={C.cardLighter} textColor="#2A0A33" />
      <Box cx={bot2.x} cy={bot2.y} label="Handel AB" delay={106} fill={C.cardLighter} textColor="#2A0A33" />

      {/* Footer */}
      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center",
        fontSize: 16, color: "#fff", opacity: footerOp, letterSpacing: 0.5,
      }}>
        VIEW Group <span style={{ color: C.light, margin: "0 10px" }}>│</span> Xledger Platinum Certified Partner 2026
      </div>
    </AbsoluteFill>
  );
};
