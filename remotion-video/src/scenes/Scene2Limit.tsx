import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from "remotion";

// Scene 2: Claude "User limit reached"
export const Scene2Limit = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chatOp = interpolate(frame, [0, 12], [0, 1], { extrapolateRight: "clamp" });
  const modal = spring({ frame: frame - 18, fps, config: { damping: 12, stiffness: 180 } });
  const shake = frame > 30 && frame < 45 ? Math.sin(frame * 2) * 4 : 0;

  return (
    <AbsoluteFill style={{ background: "linear-gradient(135deg,#0a1020,#0e1426)", padding: 80, justifyContent: "center", alignItems: "center" }}>
      <div style={{
        width: 900, background: "#10172e", border: "1px solid #243056", borderRadius: 16,
        opacity: chatOp, boxShadow: "0 40px 100px rgba(0,0,0,0.6)", overflow: "hidden",
      }}>
        <div style={{ display: "flex", alignItems: "center", padding: "16px 20px", borderBottom: "1px solid #1d2748", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 6, background: "#d97757", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 800, color: "white" }}>A</div>
          <div style={{ fontSize: 20, fontWeight: 600 }}>Claude</div>
        </div>
        <div style={{ padding: 24, minHeight: 220 }}>
          <div style={{ background: "#1a2447", padding: "14px 18px", borderRadius: 12, maxWidth: 600, fontSize: 20, color: "#cdd6f4", marginBottom: 14, opacity: interpolate(frame,[6,16],[0,1],{extrapolateRight:"clamp"}) }}>
            Kan du analysere EBITDA-utviklingen for Q2 og lage en prognose for…
          </div>
        </div>
      </div>

      <div style={{
        position: "absolute", inset: 0, background: `rgba(8,12,24,${interpolate(modal,[0,1],[0,0.65])})`,
        display: "flex", justifyContent: "center", alignItems: "center",
      }}>
        <div style={{
          width: 520, background: "#1a0f12", border: "1px solid #5c1a1a", borderRadius: 16,
          padding: 36, textAlign: "center", transform: `scale(${0.85 + modal * 0.15}) translateX(${shake}px)`,
          opacity: modal, boxShadow: "0 30px 80px rgba(220,40,40,0.35)",
        }}>
          <div style={{ width: 64, height: 64, borderRadius: 32, background: "#e0364c", margin: "0 auto 18px", display: "flex", justifyContent: "center", alignItems: "center", fontSize: 38, fontWeight: 800 }}>!</div>
          <div style={{ fontSize: 32, fontWeight: 700, color: "#fff" }}>User limit reached</div>
          <div style={{ fontSize: 18, color: "#f0b8c0", marginTop: 12, lineHeight: 1.5 }}>
            You've reached your usage limit.<br />Please try again in 4 hours.
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
