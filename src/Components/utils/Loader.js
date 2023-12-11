import React from "react";
import loaderImg from "../../media/loader2.gif";
export default function Loader(props) {
  return (
    <img
      src={props.src ? props.src : loaderImg}
      alt="Loading....."
      style={{ width: props.w + "px" }}
      className={"block " + props.addCls}
    />
  );
}
