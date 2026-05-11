import { Composition } from "remotion";
import { AiLyverAd } from "./AiLyverAd";

export const RemotionRoot = () => (
  <Composition
    id="main"
    component={AiLyverAd}
    durationInFrames={806}
    fps={30}
    width={1080}
    height={1080}
  />
);
