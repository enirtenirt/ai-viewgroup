import { Composition } from "remotion";
import { LinkedInAd } from "./LinkedInAd";
import { May17Video } from "./May17Video";

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
      id="may17"
      component={May17Video}
      durationInFrames={450}
      fps={30}
      width={1080}
      height={1080}
    />
  </>
);
