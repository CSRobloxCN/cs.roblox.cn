import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styles from "./LoadingWindow.module.css";

export default function LoadingWindow({ loadText }) {
  let [showLoadText, setShowLoadText] = useState(false);
  useEffect(() => {
    let showLoadTextTimer = setTimeout(() => {
      setShowLoadText(true);
    }, 3000);
    return () => {
      clearTimeout(showLoadTextTimer);
    };
  });
  return (
    <div className={styles.spin}>
      <Spin indicator={<LoadingOutlined />} size="large" />
      {showLoadText ? <div>{loadText}</div> : null}
    </div>
  );
}
