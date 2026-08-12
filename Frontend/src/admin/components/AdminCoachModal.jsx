import React from "react";

import {
  X,
  Bot,
  User,
  Clock,
  Calendar,
  MessageSquare,
  CheckCircle,
} from "lucide-react";

const AdminCoachModal = ({
  session,
  onClose,
}) => {
  if (!session) return null;

  return (
    <div
      className="admin-coach-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-coach-modal"
        onClick={(e) => e.stopPropagation()}
      >

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-coach-modal-header">

          <div>
            <span className="admin-coach-modal-eyebrow">
              AI COACH SESSION
            </span>

            <h2>
              Conversation Details
            </h2>
          </div>

          <button
            className="admin-coach-close"
            onClick={onClose}
          >
            <X size={18} />
          </button>

        </div>

        {/* =================================================
            SESSION INFO
        ================================================= */}

        <div className="admin-coach-session-info">

          <div className="admin-coach-user">

            <div className="admin-coach-user-avatar">
              {session.initials}
            </div>

            <div>
              <strong>
                {session.user}
              </strong>

              <span>
                {session.email}
              </span>
            </div>

          </div>

          <div className="admin-coach-session-meta">

            <div>
              <Calendar size={14} />

              <span>
                {session.date}
              </span>
            </div>

            <div>
              <Clock size={14} />

              <span>
                {session.duration}
              </span>
            </div>

            <div>
              <MessageSquare size={14} />

              <span>
                {session.messages} messages
              </span>
            </div>

          </div>

        </div>

        {/* =================================================
            TOPIC
        ================================================= */}

        <div className="admin-coach-topic">

          <span>TOPIC</span>

          <strong>
            {session.topic}
          </strong>

        </div>

        {/* =================================================
            CONVERSATION
        ================================================= */}

        <div className="admin-coach-conversation">

          <div className="admin-coach-conversation-title">
            <Bot size={16} />

            <h3>
              Conversation
            </h3>
          </div>

          <div className="admin-coach-messages">

            <div className="admin-chat-message user">

              <div className="admin-chat-avatar user">
                <User size={13} />
              </div>

              <div className="admin-chat-content">

                <span className="admin-chat-label">
                  {session.user}
                </span>

                <p>
                  {session.question}
                </p>

              </div>

            </div>

            <div className="admin-chat-message ai">

              <div className="admin-chat-avatar ai">
                <Bot size={13} />
              </div>

              <div className="admin-chat-content">

                <span className="admin-chat-label">
                  AI Career Coach
                </span>

                <p>
                  {session.answer}
                </p>

              </div>

            </div>

            <div className="admin-chat-message user">

              <div className="admin-chat-avatar user">
                <User size={13} />
              </div>

              <div className="admin-chat-content">

                <span className="admin-chat-label">
                  {session.user}
                </span>

                <p>
                  {session.followUp}
                </p>

              </div>

            </div>

            <div className="admin-chat-message ai">

              <div className="admin-chat-avatar ai">
                <Bot size={13} />
              </div>

              <div className="admin-chat-content">

                <span className="admin-chat-label">
                  AI Career Coach
                </span>

                <p>
                  {session.finalAnswer}
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            FOOTER
        ================================================= */}

        <div className="admin-coach-modal-footer">

          <div className="admin-coach-session-completed">

            <CheckCircle size={15} />

            <span>
              Session completed
            </span>

          </div>

          <button
            className="admin-coach-done-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminCoachModal;