import React from "react";
import "../styles/progress.css";

const ProgressBar = ({ percentage = 75 }) => {
  return (
    <div className="progress-card">

      <div className="progress-header">

        <span className="progress-title">
          Overall Progress
        </span>

        <span className="progress-percentage">
          {percentage}%
        </span>

      </div>

      <div className="progress-track">

        <div
          className="progress-fill"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
};

export default ProgressBar;