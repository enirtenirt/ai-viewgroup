import { Composition } from "remotion";
import { AiLyverAd } from "./AiLyverAd";
import { AiLyverBanner } from "./AiLyverBanner";

export const RemotionRoot = () => (
  <>
    <Composition
      id="main"
      component={AiLyverAd}
      durationInFrames={806}
      fps={30}
      width={1080}
      height={1080}
    />
    <Composition
      id="banner"
      component={AiLyverBanner}
      durationInFrames={555}
      fps={30}
      width={980}
      height={300}
    />
  </>
);
