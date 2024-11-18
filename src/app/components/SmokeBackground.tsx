import React from "react";
import styles from "./smokeBackground.module.css";

const SmokeBackground = () => {
  const url =
    "https://video.wixstatic.com/video/d47472_58cce06729c54ccb935886c4b3647274/1080p/mp4/file.mp4";
  return (
    <div className={styles.video_background}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={styles.fullscreen_video}
      >
        <source src={url} type="video/mp4" />
      </video>
    </div>
  );
};

export default SmokeBackground;
