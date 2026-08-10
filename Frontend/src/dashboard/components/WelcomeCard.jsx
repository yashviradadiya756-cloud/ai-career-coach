import React from "react";
import "../styles/cards.css";

const WelcomeCard = ({ user }) => {
  const displayName =
    user?.name?.trim() ||
    user?.username?.trim() ||
    "User";

  return (
    <div className="welcome-card">

      <h2 className="welcome-title">
        <span>👋</span>

        <span>
          Welcome, {displayName}!
        </span>
      </h2>

      <p className="welcome-subtitle">
        Continue your AI career journey where you left off.
      </p>

    </div>
  );
};

export default WelcomeCard;