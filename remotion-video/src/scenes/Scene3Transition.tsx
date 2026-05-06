import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// Scene 3: short transition - "Det finnes en bedre måte."
export const Scene3Transition = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12, 30, 45], [0, 1, 1, 0]);
  const sweep = interpolate(frame, [0, 45], [-100, 100]);
  return (
    <AbsoluteFill style={{ background: "#0a1020", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 20}%, rgba(45,212,191,0.12) ${sweep}%, transparent ${sweep + 20}%)` }} />
      <div style={{ opacity: op, textAlign: "center" }}>
        <div style={{ fontSize: 28, color: "#2dd4bf", letterSpacing: 6, fontWeight: 600 }}>VIEW GROUP</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 16 }}>Det finnes en bedre måte.</div>
      </div>
    </AbsoluteFill>
  );
};
