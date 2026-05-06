import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";
import { loadFont as loadInter } from "@remotion/google-fonts/Inter";
import { loadFont as loadPlayfair } from "@remotion/google-fonts/PlayfairDisplay";

const inter = loadInter("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });
const playfair = loadPlayfair("normal", { weights: ["400", "700"], subsets: ["latin"] });

const C = {
  bg1: "#3D1547",
  bg2: "#581B66",
  card: "#2A0A33",
  cardLighter: "#CC99FF",
  border: "#B978F5",
  light: "#CC99FF",
  yellow: "#FFC832",
  line: "#B978F5",
  green: "#00D96A",
  turq: "#00D9C8",
};

const ORG_DELAY = 60;

const Box = ({
  cx, cy, label, fill, textColor,
}: { cx: number; cy: number; label: string; fill: string; textColor: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - ORG_DELAY, fps, config: { damping: 20, stiffness: 130 } });
  const w = 220, h = 56;
  return (
    <div style={{
      position: "absolute", left: cx - w / 2, top: cy - h / 2, width: w, height: h,
      background: fill, border: `1.5px solid ${C.border}`, borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      color: textColor, fontSize: 16, fontWeight: 600, fontFamily: inter.fontFamily,
      opacity: s, transform: `scale(${0.92 + s * 0.08})`,
    }}>
      {label}
    </div>
  );
};

const DashLine = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [ORG_DELAY, ORG_DELAY + 20], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.line} strokeWidth={2}
      strokeDasharray="5 6" strokeDashoffset={len - len * t} opacity={0.85} />
  );
};

const Dot = ({ x, y, color, glow = false }: { x: number; y: number; color: string; glow?: boolean }) => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [ORG_DELAY + 12, ORG_DELAY + 28], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pulse = 0.7 + 0.3 * Math.sin((frame - ORG_DELAY) * 0.15);
  return (
    <>
      {glow && <circle cx={x} cy={y} r={9} fill={color} opacity={op * 0.25 * pulse} />}
      <circle cx={x} cy={y} r={5} fill={color} opacity={op} />
    </>
  );
};

export const LinkedInAd = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOp = interpolate(frame, [0, 18], [0, 1], { extrapolateRight: "clamp" });
  const eyebrowOp = interpolate(frame, [10, 25], [0, 1], { extrapolateRight: "clamp" });
  const headlineSp = spring({ frame: frame - 18, fps, config: { damping: 20 } });
  const subOp = interpolate(frame, [38, 55], [0, 1], { extrapolateRight: "clamp" });
  const legendOp = interpolate(frame, [ORG_DELAY + 20, ORG_DELAY + 40], [0, 1], { extrapolateRight: "clamp" });
  const footerOp = interpolate(frame, [140, 160], [0, 1], { extrapolateRight: "clamp" });

  const cx = 540;
  const top = { x: cx, y: 620 };
  const mid1 = { x: cx - 140, y: 740 };
  const mid2 = { x: cx + 140, y: 740 };
  const bot1 = { x: cx - 140, y: 840 };
  const bot2 = { x: cx + 140, y: 840 };

  // mid points for dots
  const dotTopMid1 = { x: (top.x + mid1.x) / 2, y: (top.y + 28 + mid1.y - 28) / 2 };
  const dotTopMid2 = { x: (top.x + mid2.x) / 2, y: (top.y + 28 + mid2.y - 28) / 2 };
  const dotMidH = { x: cx, y: 740 }; // between mid1 and mid2
  const dotMid1Bot1 = { x: mid1.x, y: (mid1.y + 28 + bot1.y - 28) / 2 };
  const dotMid2Bot2 = { x: mid2.x, y: (mid2.y + 28 + bot2.y - 28) / 2 };
  const dotBotH = { x: cx, y: 840 };

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

      {/* Org chart connection lines + dots */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <DashLine x1={top.x} y1={top.y + 28} x2={mid1.x} y2={mid1.y - 28} />
        <DashLine x1={top.x} y1={top.y + 28} x2={mid2.x} y2={mid2.y - 28} />
        <DashLine x1={mid1.x + 110} y1={mid1.y} x2={mid2.x - 110} y2={mid2.y} />
        <DashLine x1={mid1.x} y1={mid1.y + 28} x2={bot1.x} y2={bot1.y - 28} />
        <DashLine x1={mid2.x} y1={mid2.y + 28} x2={bot2.x} y2={bot2.y - 28} />
        <DashLine x1={bot1.x + 110} y1={bot1.y} x2={bot2.x - 110} y2={bot2.y} />

        {/* Konsolideres = green (parent → child vertical/diagonal) */}
        <Dot x={dotTopMid1.x} y={dotTopMid1.y} color={C.green} />
        <Dot x={dotTopMid2.x} y={dotTopMid2.y} color={C.green} />
        <Dot x={dotMid1Bot1.x} y={dotMid1Bot1.y} color={C.green} />
        <Dot x={dotMid2Bot2.x} y={dotMid2Bot2.y} color={C.green} />

        {/* Intercompany = turquoise (sibling horizontal) */}
        <Dot x={dotMidH.x} y={dotMidH.y} color={C.turq} glow />
        <Dot x={dotBotH.x} y={dotBotH.y} color={C.turq} glow />
      </svg>

      {/* Org chart boxes */}
      <Box cx={top.x} cy={top.y} label="Holdingselskap AS" fill={C.card} textColor="#fff" />
      <Box cx={mid1.x} cy={mid1.y} label="Driftsselskap AS" fill="#7742A8" textColor="#fff" />
      <Box cx={mid2.x} cy={mid2.y} label="Dotterbolag AB" fill="#7742A8" textColor="#fff" />
      <Box cx={bot1.x} cy={bot1.y} label="Eiendom AS" fill={C.cardLighter} textColor="#2A0A33" />
      <Box cx={bot2.x} cy={bot2.y} label="Handel AB" fill={C.cardLighter} textColor="#2A0A33" />

      {/* Legend */}
      <div style={{
        position: "absolute", left: 0, right: 0, top: 905, textAlign: "center",
        opacity: legendOp, fontSize: 15, color: "#fff", fontWeight: 500,
        display: "flex", justifyContent: "center", gap: 32,
      }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.green, display: "inline-block" }} />
          Konsolideres
        </span>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 5, background: C.turq, display: "inline-block" }} />
          Intercompany
        </span>
      </div>

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
