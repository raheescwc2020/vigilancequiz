import React from 'react';

function ProgressBar({ current, total }) {
  const percentage = (current / total) * 100;
  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={{ width: `${percentage}%` }}></div>
      <span className="progress-text">{current}/{total} Answered</span>
    </div>
  );
}

export default ProgressBar;