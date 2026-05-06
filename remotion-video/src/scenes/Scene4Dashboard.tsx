import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const C = {
  bg1: "#3D1547",
  bg2: "#581B66",
  card: "#1a0420",
  border: "#B978F5",
  text: "#F0E6FF",
  light: "#CC99FF",
  green: "#00B45A",
  cyan: "#00C8FF",
  yellow: "#FFC832",
};

const Box = ({
  x, y, label, sub, flag, delay,
}: { x: number; y: number; label: string; sub: string; flag: string; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16, stiffness: 140 } });
  return (
    <div style={{
      position: "absolute", left: x, top: y, width: 360,
      background: C.card, border: `2px solid ${C.border}`, borderRadius: 14,
      padding: "18px 22px", color: "#fff",
      opacity: s, transform: `translateY(${interpolate(s,[0,1],[20,0])}px) scale(${0.9 + s * 0.1})`,
      boxShadow: `0 12px 40px rgba(0,0,0,0.5), 0 0 0 1px ${C.border}33`,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 28, height: 20, background: flag, borderRadius: 3, border: "1px solid #fff3" }} />
        <div style={{ fontSize: 22, fontWeight: 800 }}>{label}</div>
      </div>
      <div style={{ marginTop: 6, fontSize: 16, color: C.light, fontWeight: 600, letterSpacing: 1 }}>{sub}</div>
      <div style={{ marginTop: 8, fontSize: 14, color: C.yellow, fontWeight: 700, letterSpacing: 1 }}>→ SE FUNKSJONALITET</div>
    </div>
  );
};

const Line = ({ x1, y1, x2, y2, delay }: { x1: number; y1: number; x2: number; y2: number; delay: number }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 25], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const len = Math.hypot(x2 - x1, y2 - y1);
  return (
    <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={C.cyan} strokeWidth={2.5}
      strokeDasharray={`6 6`} strokeDashoffset={len - len * t} opacity={0.85} />
  );
};

const Pulse = ({ x, y, delay, color }: { x: number; y: number; delay: number; color: string }) => {
  const frame = useCurrentFrame();
  const t = ((frame - delay) % 60) / 60;
  if (frame < delay) return null;
  return <circle cx={x} cy={y} r={4 + t * 6} fill={color} opacity={1 - t} />;
};

export const Scene4Dashboard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const headSp = spring({ frame, fps, config: { damping: 18 } });
  const subOp = interpolate(frame, [15, 35], [0, 1], { extrapolateRight: "clamp" });
  const tagOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });

  // org chart layout (in 1920x1080)
  const cx = 960;
  const top = { x: cx - 180, y: 470, cx: cx, cy: 510 };
  const mid1 = { x: cx - 400, y: 640, cx: cx - 220, cy: 680 };
  const mid2 = { x: cx + 40, y: 640, cx: cx + 220, cy: 680 };
  const bot1 = { x: cx - 400, y: 800, cx: cx - 220, cy: 840 };
  const bot2 = { x: cx + 40, y: 800, cx: cx + 220, cy: 840 };

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.bg1} 0%, ${C.bg2} 100%)`, padding: 60 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: tagOp }}>
        <Img src={staticFile("images/view-logo.png")} style={{ height: 56, filter: "brightness(0) invert(1)" }} />
        <div style={{ fontSize: 16, color: C.light, letterSpacing: 2, fontWeight: 700 }}>XLEDGER · PLATINUM CERTIFIED PARTNER 2026</div>
      </div>

      {/* Eyebrow pill */}
      <div style={{ marginTop: 60, opacity: tagOp, transform: `translateY(${interpolate(tagOp,[0,1],[10,0])}px)` }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10,
          padding: "10px 20px", borderRadius: 999,
          border: `1px solid ${C.green}`, color: C.green, fontWeight: 700, fontSize: 16, letterSpacing: 1,
        }}>
          <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />
          ERP BYGGET FOR KONSERN
        </div>
      </div>

      {/* Headline */}
      <div style={{
        marginTop: 18, opacity: headSp,
        transform: `translateY(${interpolate(headSp,[0,1],[20,0])}px)`,
      }}>
        <div style={{ fontSize: 110, fontWeight: 800, color: "#fff", lineHeight: 1, fontFamily: "Georgia, serif" }}>
          Én plattform.
        </div>
        <div style={{ fontSize: 110, fontWeight: 400, color: C.light, lineHeight: 1.05, fontStyle: "italic", fontFamily: "Georgia, serif" }}>
          Hele konsernet.
        </div>
      </div>

      <div style={{ marginTop: 16, fontSize: 24, color: C.text, opacity: subOp, maxWidth: 900 }}>
        Konsolidering på timer — ikke uker. Sanntid for hele konsernet.
      </div>

      {/* Org chart */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        <Line x1={top.cx} y1={top.cy + 70} x2={mid1.cx} y2={mid1.cy - 40} delay={50} />
        <Line x1={top.cx} y1={top.cy + 70} x2={mid2.cx} y2={mid2.cy - 40} delay={55} />
        <Line x1={mid1.cx} y1={mid1.cy + 50} x2={bot1.cx} y2={bot1.cy - 40} delay={75} />
        <Line x1={mid2.cx} y1={mid2.cy + 50} x2={bot2.cx} y2={bot2.cy - 40} delay={80} />
        <Pulse x={mid1.cx} y={mid1.cy - 20} delay={90} color={C.green} />
        <Pulse x={mid2.cx} y={mid2.cy - 20} delay={100} color={C.cyan} />
      </svg>

      <Box x={top.x} y={top.y} label="Holdingselskap AS" sub="NOK · EUR · SEK" flag="#BA0C2F" delay={40} />
      <Box x={mid1.x} y={mid1.y} label="Driftsselskap AS" sub="NOK" flag="#BA0C2F" delay={55} />
      <Box x={mid2.x} y={mid2.y} label="Dotterbolag AB" sub="SEK" flag="#006AA7" delay={62} />
      <Box x={bot1.x} y={bot1.y} label="Eiendom AS" sub="NOK" flag="#BA0C2F" delay={75} />
      <Box x={bot2.x} y={bot2.y} label="Handel AB" sub="SEK" flag="#006AA7" delay={82} />
    </AbsoluteFill>
  );
};
