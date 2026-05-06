import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

const KPI = ({ label, value, delta, delay }: { label: string; value: string; delta: string; delay: number }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame: frame - delay, fps, config: { damping: 16 } });
  return (
    <div style={{
      background: "#0f1a36", border: "1px solid #1f2c52", borderRadius: 14, padding: 22,
      opacity: s, transform: `translateY(${interpolate(s,[0,1],[20,0])}px)`, flex: 1,
    }}>
      <div style={{ fontSize: 14, color: "#7a8aa8", letterSpacing: 2, fontWeight: 600 }}>{label}</div>
      <div style={{ fontSize: 42, fontWeight: 800, marginTop: 8, color: "#fff" }}>{value}</div>
      <div style={{ fontSize: 16, color: "#2dd4bf", marginTop: 4, fontWeight: 600 }}>↑ {delta}</div>
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
    <div style={{ background: "#0f1a36", border: "1px solid #1f2c52", borderRadius: 14, padding: 20, flex: 1 }}>
      <div style={{ fontSize: 16, color: "#cbd5e1", marginBottom: 8, fontWeight: 600 }}>{title}</div>
      <svg width={w} height={h}>
        <path d={`${path} L${w},${h} L0,${h} Z`} fill={color} opacity={0.15 * t} />
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
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#0a1020,#0c1530)", padding: 60 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", opacity: headerOp }}>
        <div>
          <div style={{ fontSize: 18, color: "#7a8aa8", letterSpacing: 3, fontWeight: 600 }}>VIEW · POWER BI</div>
          <div style={{ fontSize: 48, fontWeight: 800, marginTop: 6 }}>Sanntid for hele konsernet</div>
        </div>
        <div style={{
          padding: "10px 18px", border: "1px solid #2dd4bf", borderRadius: 999,
          color: "#2dd4bf", fontWeight: 700, fontSize: 18, display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: 5, background: "#2dd4bf", opacity: pulse }} />
          LIVE — Sanntid
        </div>
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 36 }}>
        <KPI label="OMSETNING (NOK)" value="14,36 mill." delta="12,7%" delay={10} />
        <KPI label="EBITDA (NOK)" value="3,78 mill." delta="21,3%" delay={18} />
        <KPI label="EBITDA-MARGIN" value="26,3 %" delta="1,6 pp" delay={26} />
        <KPI label="NETTO RESULTAT" value="2,18 mill." delta="16,9%" delay={34} />
      </div>

      <div style={{ display: "flex", gap: 18, marginTop: 24 }}>
        <Chart delay={45} color="#2dd4bf" title="Omsetning – siste 12 mnd" />
        <Chart delay={55} color="#60a5fa" title="EBITDA – siste 12 mnd" />
      </div>

      <div style={{ marginTop: 28, fontSize: 22, color: "#cbd5e1", opacity: interpolate(frame,[80,100],[0,1],{extrapolateRight:"clamp"}) }}>
        Ingen brukergrenser. Ingen ventetid. Bare beslutninger.
      </div>
    </AbsoluteFill>
  );
};
