import { Composition } from "remotion";
import { LinkedInAd } from "./LinkedInAd";

export const RemotionRoot = () => (
  <Composition
    id="main"
    component={LinkedInAd}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1080}
  />
);
