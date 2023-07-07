import React from "react";

const ExtraInfo = ({ Icon, title, value, unit }) => {
  return (
    <div>
      <Icon sx={{ fontSize: 40 }} />
      <h4 className="font-semibold mt-2">{title}</h4>
      <p className="text-xs">
        {value} {unit && unit}
      </p>
    </div>
  );
};

export default ExtraInfo;
