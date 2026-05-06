import { AbsoluteFill, useCurrentFrame, interpolate } from "remotion";

// Scene 3: short transition - "Det finnes en bedre måte."
export const Scene3Transition = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [0, 12, 30, 45], [0, 1, 1, 0]);
  const sweep = interpolate(frame, [0, 45], [-100, 100]);
  return (
    <AbsoluteFill style={{ background: "#190523", justifyContent: "center", alignItems: "center", overflow: "hidden" }}>
      <div style={{ position: "absolute", inset: 0, background: `linear-gradient(115deg, transparent ${sweep - 20}%, rgba(185,120,245,0.15) ${sweep}%, transparent ${sweep + 20}%)` }} />
      <div style={{ opacity: op, textAlign: "center", fontFamily: "Inter, sans-serif" }}>
        <div style={{ fontSize: 28, color: "#CC99FF", letterSpacing: 6, fontWeight: 600 }}>VIEW GROUP</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 16, fontFamily: "Inter, sans-serif" }}>Det finnes en bedre måte.</div>
      </div>
    </AbsoluteFill>
  );
};
