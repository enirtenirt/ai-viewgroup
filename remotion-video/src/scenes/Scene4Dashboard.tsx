import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

// VIEW Group brand palette
const C = {
  dark: "#190523",
  primary: "#50145A",
  medium: "#7742A8",
  pop: "#B978F5",
  light: "#CC99FF",
  lightest: "#F0E6FF",
  beige: "#F1F0EA",
  green: "#00B45A",
  blue: "#00C8FF",
  yellow: "#FFC832",
};

const KPI = ({ label, value, delta, delay, accent }: { label: string; value: string; delta: string; delay: number; accent: string }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  return (
    <div style={{
      background: "rgba(255,255,255,0.06)", border: `1px solid ${C.medium}55`, borderRadius: 14, padding: 22,
      opacity: s, transform: `translateY(${interpolate(s,[0,1],[20,0])}px)`, flex: 1,
      backdropFilter: "blur(0)",
    }}>
      <div style={{ fontSize: 14, color: C.light, letterSpacing: 2, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 42, fontWeight: 800, marginTop: 8, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 16, color: accent, marginTop: 4, fontWeight: 700 }}>↑ {delta}</div>
    </div>
  );
};

const Chart = ({ delay, color, title }: { delay: number; color: string; title: string }) => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [delay, delay + 40], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const pts = [0.2, 0.35, 0.3, 0.5, 0.45, 0.6, 0.55, 0.7, 0.75, 0.85, 0.9, 1.0];
  const w = 540, h = 180;
  const path = pts.map((p, i) => {
    const x = (i / (pts.length - 1)) * w;
    const y = h - p * h * 0.9 - 10;
    return `${i === 0 ? "M" : "L"}${x},${y}`;
  }).join(" ");
  const dash = 1400;
  return (
    <div style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.medium}55`, borderRadius: 14, padding: 20, flex: 1 }}>
      <div style={{ fontSize: 16, color: C.lightest, marginBottom: 8, fontWeight: 600 }}>{title}</div>
      <svg width={w} height={h}>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill={color} opacity={0.18 * t} />
        <path d={path} fill="none" stroke={color} strokeWidth={3}
          strokeDasharray={dash} strokeDashoffset={dash - dash * t} />
      </svg>
    </div>
  );
};

export const Scene4Dashboard = () => {
  const frame = useCurrentFrame();
  const headerOp = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: "clamp" });
  const pulse = 0.5 + Math.sin(frame * 0.2) * 0.5;

  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.dark} 0%, ${C.primary} 100%)`, padding: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: headerOp }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <Img
            src={staticFile("images/view-logo.png")}
            style={{ height: 70, filter: "brightness(0) invert(1)" }}
          />
          <div style={{ width: 2, height: 56, background: `${C.pop}77` }} />
          <div style={{ fontSize: 40, fontWeight: 800, color: "#fff" }}>Sanntid for hele konsernet</div>
        </div>
        <div style={{
          padding: "10px 18px", border: `1px solid ${C.green}`, borderRadius: 999,
          color: C.green, fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: C.green, opacity: pulse }} />
          LIVE — Sanntid
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 36 }}>
        <KPI label="OMSETNING (NOK)" value="14,36 mill." delta="12,7%" delay={10} accent={C.green} />
        <KPI label="EBITDA (NOK)" value="3,78 mill." delta="21,3%" delay={18} accent={C.pop} />
        <KPI label="EBITDA-MARGIN" value="26,3 %" delta="1,6 pp" delay={26} accent={C.yellow} />
        <KPI label="NETTO RESULTAT" value="2,18 mill." delta="16,9%" delay={34} accent={C.blue} />
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
        <Chart delay={45} color={C.pop} title="Omsetning – siste 12 mnd" />
        <Chart delay={55} color={C.blue} title="EBITDA – siste 12 mnd" />
      </div>

      <div style={{ marginTop: 28, fontSize: 22, color: C.lightest, opacity: interpolate(frame,[80,100],[0,1],{extrapolateRight:"clamp"}) }}>
        Ingen brukergrenser. Ingen ventetid. Bare beslutninger.
      </div>
    </AbsoluteFill>
  );
};
