import React, { useEffect, useState } from "react";

import {
  Plus,
  Edit,
  Trash2,
  Award,
  Save,
} from "lucide-react";

import {
  getCertificateCriteria,
  createCertificateCriteria,
  updateCertificateCriteria,
  deleteCertificateCriteria,
} from "../../api/adminApi";

import "../styles/adminCertificateCriteria.css";

const initialForm = {
  name: "",
  description: "",
  resumeScore: 60,
  roadmapCompleted: 80,
  learningCompleted: 70,
  interviewScore: 60,
  overallProgress: 70,
  certificateTitle: "Certificate of Achievement",
  organizationName: "CareerPilot",
};

const AdminCertificateCriteria = () => {
  const [criteria, setCriteria] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadCriteria = async () => {
  try {
    console.log("=================================");
    console.log("ADMIN CERTIFICATE RULES");
    console.log("=================================");

    const response =
      await getCertificateCriteria();

    console.log(
      "ADMIN CERTIFICATE RULES RESPONSE:",
      response
    );

    console.log(
      "ADMIN CERTIFICATE RULES DATA:",
      response?.criteria
    );

    const formattedData =
      Array.isArray(response?.criteria)
        ? response.criteria
        : [];

    console.log(
      "FORMATTED ADMIN CERTIFICATE RULES:",
      formattedData
    );

    setCriteria(formattedData);

  } catch (error) {

    console.error(
      "ADMIN CERTIFICATE RULES ERROR:",
      error.response?.data || error
    );

    setCriteria([]);

  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    loadCriteria();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        [
          "resumeScore",
          "roadmapCompleted",
          "learningCompleted",
          "interviewScore",
          "overallProgress",
        ].includes(name)
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateCertificateCriteria(
          editingId,
          form
        );
      } else {
        await createCertificateCriteria(form);
      }

      setForm(initialForm);
      setEditingId(null);

      await loadCriteria();
    } catch (error) {
      console.error(
        "SAVE CERTIFICATE CRITERIA ERROR:",
        error.response?.data || error.message
      );
    }
  };

  const handleEdit = (item) => {
    setEditingId(item._id);

    setForm({
      name: item.name || "",
      description: item.description || "",
      resumeScore: item.resumeScore || 0,
      roadmapCompleted:
        item.roadmapCompleted || 0,
      learningCompleted:
        item.learningCompleted || 0,
      interviewScore:
        item.interviewScore || 0,
      overallProgress:
        item.overallProgress || 0,
      certificateTitle:
        item.certificateTitle ||
        "Certificate of Achievement",
      organizationName:
        item.organizationName ||
        "CareerPilot",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this certificate criteria?"
    );

    if (!confirmed) return;

    try {
      await deleteCertificateCriteria(id);

      await loadCriteria();
    } catch (error) {
      console.error(
        "DELETE CRITERIA ERROR:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="certificate-admin-page">

      <div className="certificate-page-header">
        <div>
          <div className="certificate-heading">
            <Award size={28} />

            <div>
              <h1>Certificate Criteria</h1>

              <p>
                Decide which requirements users must
                complete before receiving a certificate.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          CREATE / EDIT FORM
      ========================================== */}

      <form
        className="criteria-form"
        onSubmit={handleSubmit}
      >
        <div className="form-header">
          <div>
            <h2>
              {editingId
                ? "Edit Certificate Criteria"
                : "Create Certificate Criteria"}
            </h2>

            <p>
              Set the minimum requirements for earning
              this certificate.
            </p>
          </div>
        </div>

        <div className="form-grid">

          <div className="form-group full">
            <label>Certificate Name</label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Career Ready Certificate"
              required
            />
          </div>

          <div className="form-group full">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Certificate awarded after completing CareerPilot requirements."
              rows="3"
            />
          </div>

          <div className="form-group">
            <label>Resume Score Minimum</label>

            <input
              type="number"
              name="resumeScore"
              min="0"
              max="100"
              value={form.resumeScore}
              onChange={handleChange}
            />

            <span>Required: {form.resumeScore}%</span>
          </div>

          <div className="form-group">
            <label>Roadmap Completion</label>

            <input
              type="number"
              name="roadmapCompleted"
              min="0"
              max="100"
              value={form.roadmapCompleted}
              onChange={handleChange}
            />

            <span>Required: {form.roadmapCompleted}%</span>
          </div>

          <div className="form-group">
            <label>Learning Completion</label>

            <input
              type="number"
              name="learningCompleted"
              min="0"
              max="100"
              value={form.learningCompleted}
              onChange={handleChange}
            />

            <span>Required: {form.learningCompleted}%</span>
          </div>

          <div className="form-group">
            <label>Interview Score</label>

            <input
              type="number"
              name="interviewScore"
              min="0"
              max="100"
              value={form.interviewScore}
              onChange={handleChange}
            />

            <span>Required: {form.interviewScore}%</span>
          </div>

          <div className="form-group">
            <label>Overall Progress</label>

            <input
              type="number"
              name="overallProgress"
              min="0"
              max="100"
              value={form.overallProgress}
              onChange={handleChange}
            />

            <span>Required: {form.overallProgress}%</span>
          </div>

          <div className="form-group">
            <label>Certificate Title</label>

            <input
              name="certificateTitle"
              value={form.certificateTitle}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Organization Name</label>

            <input
              name="organizationName"
              value={form.organizationName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          {editingId && (
            <button
              type="button"
              className="cancel-btn"
              onClick={() => {
                setEditingId(null);
                setForm(initialForm);
              }}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="save-btn"
          >
            {editingId ? (
              <Edit size={17} />
            ) : (
              <Plus size={17} />
            )}

            {editingId
              ? "Update Criteria"
              : "Create Criteria"}
          </button>
        </div>
      </form>

      {/* ==========================================
          EXISTING CRITERIA
      ========================================== */}

      <div className="criteria-section">

        <div className="section-title">
          <h2>Certificate Rules</h2>

          <span>
            {criteria.length} criteria
          </span>
        </div>

        {loading ? (
          <div className="loading">
            Loading certificate criteria...
          </div>
        ) : criteria.length === 0 ? (
          <div className="empty">
            No certificate criteria created yet.
          </div>
        ) : (
          <div className="criteria-grid">

            {criteria.map((item) => (
              <div
                className="criteria-card"
                key={item._id}
              >
                <div className="criteria-card-header">

                  <div className="criteria-icon">
                    <Award size={22} />
                  </div>

                  <div>
                    <h3>{item.name}</h3>

                    <p>
                      {item.description ||
                        "Certificate achievement criteria"}
                    </p>
                  </div>
                </div>

                <div className="criteria-list">

                  <div>
                    <span>Resume Score</span>
                    <strong>
                      {item.resumeScore}%
                    </strong>
                  </div>

                  <div>
                    <span>Roadmap</span>
                    <strong>
                      {item.roadmapCompleted}%
                    </strong>
                  </div>

                  <div>
                    <span>Learning</span>
                    <strong>
                      {item.learningCompleted}%
                    </strong>
                  </div>

                  <div>
                    <span>Interview</span>
                    <strong>
                      {item.interviewScore}%
                    </strong>
                  </div>

                  <div>
                    <span>Overall Progress</span>
                    <strong>
                      {item.overallProgress}%
                    </strong>
                  </div>
                </div>

                <div className="criteria-actions">

                  <button
                    onClick={() =>
                      handleEdit(item)
                    }
                  >
                    <Edit size={16} />
                    Edit
                  </button>

                  <button
                    className="delete-btn"
                    onClick={() =>
                      handleDelete(item._id)
                    }
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCertificateCriteria;