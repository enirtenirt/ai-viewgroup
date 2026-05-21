import { Composition } from "remotion";
import { LinkedInAd } from "./LinkedInAd";
import { MainVideo } from "./MainVideo";

// Total varighet MainVideo: 95 + 95 + 60 + (sum av XLEDGER_SCENES) + 140 + 90
// Med én Xledger-scene (100 frames): 95+95+60+100+140+90 = 580 frames
// Oppdater durationInFrames her når du legger til flere scener i XLEDGER_SCENES.
const MAIN_VIDEO_FRAMES = 580;

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={LinkedInAd}
      durationInFrames={300}
      fps={30}
      width={1080}
      height={1080}
    />
    <Composition
      id="demo"
      component={MainVideo}
      durationInFrames={MAIN_VIDEO_FRAMES}
      fps={30}
      width={1080}
      height={1080}
    />
  </>
);
