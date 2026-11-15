import React from "react";
import { Composition } from "remotion";
import { BrandTest } from "./BrandTest";
import { VIDEO } from "./brand";
import { HashCodeReboot, TOTAL } from "./reboot/HashCodeReboot";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HashCodeReboot"
        component={HashCodeReboot}
        durationInFrames={TOTAL}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
        defaultProps={{ withMusic: true }}
      />
      <Composition
        id="BrandTest"
        component={BrandTest}
        durationInFrames={90}
        fps={VIDEO.fps}
        width={VIDEO.width}
        height={VIDEO.height}
      />
    </>
  );
};
