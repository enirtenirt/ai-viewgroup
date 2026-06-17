import { Composition } from "remotion";
import { AiLyverAd } from "./AiLyverAd";
import { AiLyverBanner } from "./AiLyverBanner";
import { AiLyverMrec } from "./AiLyverMrec";
import { AiLyverLarge } from "./AiLyverLarge";

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
      durationInFrames={576}
      fps={30}
      width={980}
      height={300}
    />
    <Composition
      id="mrec"
      component={AiLyverMrec}
      durationInFrames={576}
      fps={30}
      width={320}
      height={250}
    />
    <Composition
      id="large"
      component={AiLyverLarge}
      durationInFrames={480}
      fps={30}
      width={980}
      height={600}
    />
  </>
);
