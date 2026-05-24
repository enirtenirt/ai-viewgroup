import { Composition } from "remotion";
import { LinkedInAd } from "./LinkedInAd";
import { MagnifyingGlassAd } from "./MagnifyingGlassAd";

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
      id="magnifying-glass"
      component={MagnifyingGlassAd}
      durationInFrames={470}
      fps={30}
      width={1080}
      height={1080}
    />
  </>
);
