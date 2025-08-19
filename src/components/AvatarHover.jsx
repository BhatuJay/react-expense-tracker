import React, { useState } from "react";
import "./AvatarHover.css"; // Your CSS file

const AvatarHover = ({ avatarUrl }) => {
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e) => {
    setTooltipVisible(true);
    updateTooltipPosition(e);
  };

  const handleMouseMove = (e) => {
    updateTooltipPosition(e);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  const updateTooltipPosition = (e) => {
    setCoords({ x: e.pageX + 20, y: e.pageY + 20 });
  };

  return (
    <>
      <img
        src={avatarUrl}
        alt="User Avatar"
        className="avatar"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      />

      {tooltipVisible && (
        <div
          className="avatar-tooltip"
          style={{
            display: "block",
            top: coords.y,
            left: coords.x,
          }}
        >
          <img src={avatarUrl} alt="Zoom Preview" />
        </div>
      )}
    </>
  );
};

export default AvatarHover;