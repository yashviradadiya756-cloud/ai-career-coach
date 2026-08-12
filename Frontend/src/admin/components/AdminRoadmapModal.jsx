import React from "react";

import {
  X,
  Map,
  User,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

const AdminRoadmapModal = ({
  roadmap,
  onClose,
}) => {
  if (!roadmap) return null;

  return (
    <div
      className="admin-roadmap-modal-overlay"
      onClick={onClose}
    >
      <div
        className="admin-roadmap-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        {/* HEADER */}

        <div className="admin-roadmap-modal-header">

          <div>
            <span>
              CAREER ROADMAP
            </span>

            <h2>
              {roadmap.career}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="admin-roadmap-close"
          >
            <X size={17} />
          </button>

        </div>

        {/* USER */}

        <div className="admin-roadmap-user-info">

          <div className="admin-roadmap-avatar">
            {roadmap.initials}
          </div>

          <div>
            <strong>
              {roadmap.user}
            </strong>

            <span>
              {roadmap.email}
            </span>
          </div>

          <div className="admin-roadmap-meta">

            <span>
              <Calendar size={13} />

              {roadmap.createdAt}
            </span>

            <span>
              <Clock size={13} />

              {roadmap.duration}
            </span>

          </div>

        </div>

        {/* PROGRESS */}

        <div className="admin-roadmap-progress-section">

          <div className="admin-roadmap-progress-header">

            <div>
              <span>
                OVERALL PROGRESS
              </span>

              <strong>
                {roadmap.progress}%
              </strong>
            </div>

            <small>
              {roadmap.completedSteps}/
              {roadmap.totalSteps} steps completed
            </small>

          </div>

          <div className="admin-roadmap-progress-bar">
            <i
              style={{
                width: `${roadmap.progress}%`,
              }}
            ></i>
          </div>

        </div>

        {/* ROADMAP */}

        <div className="admin-roadmap-timeline">

          <div className="admin-roadmap-timeline-title">

            <Map size={15} />

            <h3>
              Roadmap Stages
            </h3>

          </div>

          <div className="admin-roadmap-steps">

            {roadmap.steps.map(
              (step, index) => (
                <div
                  className={`admin-roadmap-step ${
                    step.completed
                      ? "completed"
                      : index ===
                        roadmap.currentStep
                      ? "current"
                      : ""
                  }`}
                  key={index}
                >

                  <div className="admin-roadmap-step-icon">

                    {step.completed ? (
                      <CheckCircle2
                        size={17}
                      />
                    ) : (
                      <Circle
                        size={17}
                      />
                    )}

                  </div>

                  <div className="admin-roadmap-step-content">

                    <div>

                      <strong>
                        {step.title}
                      </strong>

                      <span>
                        {step.duration}
                      </span>

                    </div>

                    <p>
                      {step.description}
                    </p>

                    {index ===
                      roadmap.currentStep &&
                      !step.completed && (
                        <small>
                          Current stage
                        </small>
                      )}

                  </div>

                </div>
              )
            )}

          </div>

        </div>

        {/* FOOTER */}

        <div className="admin-roadmap-modal-footer">

          <span>
            Last updated:{" "}
            {roadmap.updatedAt}
          </span>

          <button onClick={onClose}>
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default AdminRoadmapModal;