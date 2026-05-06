import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

export const Scene5Logo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });
  const lineW = interpolate(frame, [10, 40], [0, 280], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#0a1020,#101a3a)", justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.9 + s * 0.1})`, opacity: s }}>
        <div style={{ fontSize: 110, fontWeight: 800, letterSpacing: -2 }}>
          VIEW <span style={{ color: "#2dd4bf" }}>Group</span>
        </div>
        <div style={{ height: 2, width: lineW, background: "#2dd4bf", margin: "20px auto" }} />
        <div style={{ fontSize: 28, color: "#cbd5e1", opacity: subOp, letterSpacing: 2 }}>
          alltid sanntidsinformasjon
        </div>
      </div>
    </AbsoluteFill>
  );
};
