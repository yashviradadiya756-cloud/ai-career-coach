import React from "react";

import "../styles/cards.css";

const WelcomeCard = ({ user }) => {
  const displayName =
    user?.name ||
    user?.username ||
    "User";

  return (
    <div className="welcome-card">

      <h2 className="welcome-title">
        <span role="img" aria-label="wave">
          👋
        </span>{" "}
        Welcome, {displayName}!
      </h2>

      <p className="welcome-subtitle">
        Continue your AI career journey where
        you left off.
      </p>

    </div>
  );
};

export default WelcomeCard;
