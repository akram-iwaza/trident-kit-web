import React, { FC } from "react";
interface IPropsProgressBar {
  percent: any;
}

const ProgressBar: FC<IPropsProgressBar> = ({ percent }) => {
  return (
    <div className="w-full bg-nickle rounded-full h-3">
      <div
        className="bg-primary h-3 rounded-full text-center text-white"
        style={{ width: `${percent}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
