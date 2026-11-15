import React from "react";
import { Composition } from "remotion";
import { BrandTest } from "./BrandTest";
import { VIDEO } from "./brand";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="BrandTest"
        component={BrandTest}
        durationInFrames={90}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
      {/* La composition maître "HashCodeReboot" (900 frames) sera ajoutée
          quand les ressources prioritaires (F07) seront fournies. */}
    </>
  );
};
