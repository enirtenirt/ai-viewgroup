import {
  AbsoluteFill,
  Img,
  interpolate,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";

const { fontFamily } = loadFont("normal", {
  weights: ["400", "600", "700", "800"],
  subsets: ["latin"],
});

const C = {
  bg: "#0a1020",
  overlay: "rgba(10,16,32,0.72)",
  purple: "#581B66",
  border: "#B978F5",
  text: "#F0E6FF",
  light: "#CC99FF",
  green: "#00D96A",
  yellow: "#FFC832",
};

export type HighlightBox = {
  /** Left edge as fraction of screenshot width (0–1) */
  x: number;
  /** Top edge as fraction of screenshot height (0–1) */
  y: number;
  /** Width as fraction of screenshot width (0–1) */
  w: number;
  /** Height as fraction of screenshot height (0–1) */
  h: number;
};

type Props = {
  /** Path relative to /public, e.g. "images/xledger/screen-01.png" */
  imageSrc: string;
  /** Main headline shown in the overlay badge */
  headline: string;
  /** Optional sub-headline */
  sub?: string;
  /** Optional highlight box over a region of interest in the screenshot */
  highlight?: HighlightBox;
  /** Zoom factor at rest (default 1.08 — slight zoom-in) */
  zoom?: number;
};

export const SceneXledgerDemo: React.FC<Props> = ({
  imageSrc,
  headline,
  sub,
  highlight,
  zoom = 1.08,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width, height } = useVideoConfig();

  // Entry spring
  const entry = spring({ frame, fps, config: { damping: 18, stiffness: 120 } });

  // Slow pan: starts at top, moves to center over the full scene
  const pan = interpolate(frame, [0, durationInFrames], [-3, 3], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // Fade out last 15 frames
  const fadeOut = interpolate(
    frame,
    [durationInFrames - 15, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  // Overlay badge enters with a slight delay
  const badgeEntry = spring({
    frame: frame - 12,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  // Highlight pulse (0→1→0 over 60-frame cycles)
  const pulseT = frame % 60;
  const pulseOpacity =
    highlight && frame > 20
      ? interpolate(pulseT, [0, 15, 45, 60], [0.4, 0.9, 0.9, 0.4])
      : 0;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.bg,
        fontFamily,
        opacity: fadeOut,
      }}
    >
      {/* Screenshot */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          overflow: "hidden",
          transform: `scale(${zoom}) translateY(${pan}%)`,
          transformOrigin: "center center",
          opacity: entry,
        }}
      >
        <Img
          src={staticFile(imageSrc)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />

        {/* Dark vignette edges */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse at center, transparent 55%, rgba(10,16,32,0.65) 100%)",
          }}
        />
      </div>

      {/* Highlight box over region of interest */}
      {highlight && (
        <div
          style={{
            position: "absolute",
            left: `${highlight.x * 100}%`,
            top: `${highlight.y * 100}%`,
            width: `${highlight.w * 100}%`,
            height: `${highlight.h * 100}%`,
            border: `3px solid ${C.green}`,
            borderRadius: 8,
            boxShadow: `0 0 20px ${C.green}88`,
            opacity: pulseOpacity,
            transform: `scale(${zoom}) translateY(${pan}%)`,
            transformOrigin: "center center",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Overlay badge — bottom-left */}
      <div
        style={{
          position: "absolute",
          bottom: 64,
          left: 60,
          right: 60,
          opacity: badgeEntry,
          transform: `translateY(${interpolate(badgeEntry, [0, 1], [24, 0])}px)`,
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            width: 56,
            height: 4,
            background: `linear-gradient(90deg, ${C.border}, ${C.light})`,
            borderRadius: 2,
            marginBottom: 14,
          }}
        />

        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: "#fff",
            lineHeight: 1.1,
            textShadow: "0 2px 16px rgba(0,0,0,0.8)",
            maxWidth: 820,
          }}
        >
          {headline}
        </div>

        {sub && (
          <div
            style={{
              marginTop: 10,
              fontSize: 22,
              color: C.light,
              fontWeight: 600,
              textShadow: "0 2px 8px rgba(0,0,0,0.7)",
            }}
          >
            {sub}
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
};
