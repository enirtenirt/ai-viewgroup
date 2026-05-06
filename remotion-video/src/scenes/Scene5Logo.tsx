import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig, Img, staticFile } from "remotion";

const C = {
  dark: "#190523",
  primary: "#50145A",
  pop: "#B978F5",
  light: "#CC99FF",
  lightest: "#F0E6FF",
};

export const Scene5Logo = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = spring({ frame, fps, config: { damping: 18 } });
  const lineW = interpolate(frame, [10, 40], [0, 320], { extrapolateRight: "clamp" });
  const subOp = interpolate(frame, [25, 45], [0, 1], { extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: `linear-gradient(135deg, ${C.light} 0%, ${C.pop} 100%)`, justifyContent: "center", alignItems: "center" }}>
      <div style={{ textAlign: "center", transform: `scale(${0.9 + s * 0.1})`, opacity: s, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <Img
          src={staticFile("images/view-logo.png")}
          style={{ height: 180, filter: "brightness(0) invert(1)" }}
        />
        <div style={{ height: 2, width: lineW, background: "#fff", margin: "28px auto" }} />
        <div style={{ fontSize: 30, color: "#fff", opacity: subOp, letterSpacing: 3, fontWeight: 600 }}>
          ALLTID SANNTIDSINFORMASJON
        </div>
      </div>
    </AbsoluteFill>
  );
};
