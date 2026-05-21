import { AbsoluteFill, Series } from "remotion";
import { loadFont } from "@remotion/google-fonts/Inter";
import { Scene1Excel } from "./scenes/Scene1Excel";
import { Scene2Limit } from "./scenes/Scene2Limit";
import { Scene3Transition } from "./scenes/Scene3Transition";
import { Scene4Dashboard } from "./scenes/Scene4Dashboard";
import { Scene5Logo } from "./scenes/Scene5Logo";
import { SceneXledgerDemo } from "./scenes/SceneXledgerDemo";

const { fontFamily } = loadFont("normal", { weights: ["400", "600", "700", "800"], subsets: ["latin"] });

// Xledger-scener basert på skjermbilder fanget av capture-xledger.mjs.
// Legg til én oppføring per skjermbilde — tilpass headline, sub og highlight.
const XLEDGER_SCENES: {
  imageSrc: string;
  headline: string;
  sub?: string;
  highlight?: { x: number; y: number; w: number; h: number };
  durationInFrames: number;
}[] = [
  {
    imageSrc: "images/xledger/screen-01.png",
    headline: "Konsernrapportering i sanntid",
    sub: "Alle selskaper. Én oversikt.",
    durationInFrames: 100,
  },
  // Eksempel på flere scener — legg til etter hvert som skjermbilder fanges:
  // {
  //   imageSrc: "images/xledger/screen-02.png",
  //   headline: "Automatisk konsolidering",
  //   sub: "Fra dager til sekunder",
  //   highlight: { x: 0.3, y: 0.2, w: 0.4, h: 0.35 },
  //   durationInFrames: 110,
  // },
  // {
  //   imageSrc: "images/xledger/screen-03.png",
  //   headline: "Likviditetsoversikt",
  //   sub: "Valuta og selskaper — samlet",
  //   durationInFrames: 100,
  // },
];

export const MainVideo = () => (
  <AbsoluteFill style={{ fontFamily, backgroundColor: "#0a1020", color: "white" }}>
    <Series>
      <Series.Sequence durationInFrames={95}><Scene1Excel /></Series.Sequence>
      <Series.Sequence durationInFrames={95}><Scene2Limit /></Series.Sequence>
      <Series.Sequence durationInFrames={60}><Scene3Transition /></Series.Sequence>
      {XLEDGER_SCENES.map((scene) => (
        <Series.Sequence key={scene.imageSrc} durationInFrames={scene.durationInFrames}>
          <SceneXledgerDemo
            imageSrc={scene.imageSrc}
            headline={scene.headline}
            sub={scene.sub}
            highlight={scene.highlight}
          />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={140}><Scene4Dashboard /></Series.Sequence>
      <Series.Sequence durationInFrames={90}><Scene5Logo /></Series.Sequence>
    </Series>
  </AbsoluteFill>
);
