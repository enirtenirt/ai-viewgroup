import { AbsoluteFill, Series } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Scene1Excel } from "./scenes/Scene1Excel";
import { Scene2Limit } from "./scenes/Scene2Limit";
import { Scene3Transition } from "./scenes/Scene3Transition";
import { Scene4Dashboard } from "./scenes/Scene4Dashboard";
import { Scene5Logo } from "./scenes/Scene5Logo";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

export const MainVideo = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: "#0a1020", color: "white" }}>
    <Series>
      <Series.Sequence durationInFrames={75}><Scene1Excel /></Series.Sequence>
      <Series.Sequence durationInFrames={75}><Scene2Limit /></Series.Sequence>
      <Series.Sequence durationInFrames={45}><Scene3Transition /></Series.Sequence>
      <Series.Sequence durationInFrames={120}><Scene4Dashboard /></Series.Sequence>
      <Series.Sequence durationInFrames={75}><Scene5Logo /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
