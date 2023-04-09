import React from "react";
import { SelectOutlined } from "@ant-design/icons";

export default function LinkOut({ href, children, simple, style }) {
  if(simple){
    return (
      <a href={href} target="_blank" rel="noreferrer" style={style}>
        {children} <span style={{color:"#8C8C8C"}}>&gt;</span>
      </a>
    );
  }
  return (
    <a href={href} target="_blank" rel="noreferrer" style={style}>
      {children}
      <SelectOutlined rotate={90} style={{ marginLeft: "1em" }} />
    </a>
  );
}
