import React, { useState, useEffect } from "react";
import makeBlockie from "ethereum-blockies-base64";
import styles from "./Avatar.module.css";

interface AvatarProps {
  entropy: string;
}

export const Avatar = ({ entropy }: AvatarProps) => {
  const [src, setSrc] = useState<string>("");

  useEffect(() => {
    setSrc(makeBlockie(entropy));
  }, []);

  return (
    <div className={styles.avatar}>
      <img className={styles.avatar__image} src={src} />
    </div>
  );
};
