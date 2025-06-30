import React from "react";
import "../css/LoadingSpinner.css"

const LoadingSpinner = () => {
  return (
    <div className="spinner-wrapper">
      <div className="spinner" />
      <p className="loading-text">잠시만 기다려주세요...</p>
    </div>
  );
};

export default LoadingSpinner;
