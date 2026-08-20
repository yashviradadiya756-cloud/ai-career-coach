import { X, Upload, FileText, CheckCircle, AlertTriangle } from "lucide-react";
import { useEffect, useState } from "react";
import {
  uploadResume,
  getLatestResume,
} from "../../api/resumeApi";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [resumeData, setResumeData] = useState(null);

  const [dataLoading, setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch latest resume
  |--------------------------------------------------------------------------
  */

  const fetchResume = async () => {
    try {
      setDataLoading(true);

      const response = await getLatestResume();

      console.log(
        "FETCH RESUME RESPONSE:",
        response
      );

      if (!response) {
        setResumeData(null);
        return;
      }

      console.log(
        "RESUME OBJECT:",
        response.resume
      );

      console.log(
        "ANALYSIS STATUS:",
        response.resume?.analysisStatus
      );

      console.log(
        "STRENGTHS:",
        response.resume?.strengths
      );

      setResumeData(
        response.resume || null
      );
    } catch (err) {
      console.error(
        "FETCH RESUME ERROR:",
        err.response?.data || err.message
      );

      setResumeData(null);
    } finally {
      setDataLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Load resume when page opens
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchResume();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Handle PDF selection
  |--------------------------------------------------------------------------
  */

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    setError("");
    setSuccess("");

    if (!file) {
      setResume(null);
      return;
    }

    console.log("SELECTED FILE:", file);
    console.log("FILE NAME:", file.name);
    console.log("FILE TYPE:", file.type);
    console.log("FILE SIZE:", file.size);

    /*
    |--------------------------------------------------------------------------
    | Validate extension
    |--------------------------------------------------------------------------
    */

    const isPdfExtension =
      file.name
        .toLowerCase()
        .endsWith(".pdf");

    /*
    |--------------------------------------------------------------------------
    | Validate MIME type
    |--------------------------------------------------------------------------
    |
    | Some browsers may return an empty or unusual MIME type.
    | Therefore extension is also checked.
    |--------------------------------------------------------------------------
    */

    const isPdfMime =
      file.type === "application/pdf" ||
      file.type === "";

    if (!isPdfExtension) {
      setError(
        "Only PDF files are allowed."
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    if (!isPdfMime) {
      setError(
        `Invalid file type: ${file.type}. Please select a PDF file.`
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Maximum 5 MB
    |--------------------------------------------------------------------------
    */

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Resume must be smaller than 5 MB."
      );

      setResume(null);
      e.target.value = "";
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | File accepted
    |--------------------------------------------------------------------------
    */

    setResume(file);

    console.log(
      "PDF FILE ACCEPTED:",
      file.name
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Remove selected file
  |--------------------------------------------------------------------------
  */

  const removeFile = () => {
    setResume(null);
    setError("");
    setSuccess("");

    const input =
      document.getElementById(
        "resumeUpload"
      );

    if (input) {
      input.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Upload / Analyze Resume
  |--------------------------------------------------------------------------
  */

  const handleAnalyze = async () => {
    setError("");
    setSuccess("");

    /*
    |--------------------------------------------------------------------------
    | Check file
    |--------------------------------------------------------------------------
    */

    if (!resume) {
      setError(
        "Please select a PDF resume first."
      );
      return;
    }

    const isPdf =
      resume.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      setError(
        "Only PDF files are allowed."
      );
      return;
    }

    if (
      resume.size >
      5 * 1024 * 1024
    ) {
      setError(
        "Resume must be smaller than 5 MB."
      );
      return;
    }

    try {
      setLoading(true);

      /*
      |--------------------------------------------------------------------------
      | Create FormData
      |--------------------------------------------------------------------------
      */

      const formData = new FormData();

      /*
      |--------------------------------------------------------------------------
      | IMPORTANT
      |--------------------------------------------------------------------------
      |
      | Backend must have:
      |
      | upload.single("resume")
      |
      | Therefore the field name MUST be "resume".
      |--------------------------------------------------------------------------
      */

      formData.append(
        "resume",
        resume,
        resume.name
      );

      /*
      |--------------------------------------------------------------------------
      | Debug FormData
      |--------------------------------------------------------------------------
      */

      console.log(
        "===================================="
      );

      console.log(
        "UPLOADING RESUME"
      );

      console.log(
        "FILE:",
        resume.name
      );

      console.log(
        "TYPE:",
        resume.type
      );

      console.log(
        "SIZE:",
        resume.size
      );

      console.log(
        "FORM DATA:"
      );

      for (
        const [key, value]
        of formData.entries()
      ) {
        console.log(
          key,
          value
        );
      }

      console.log(
        "===================================="
      );

      /*
      |--------------------------------------------------------------------------
      | Call API
      |--------------------------------------------------------------------------
      */

      const response =
        await uploadResume(
          formData
        );

      console.log(
        "UPLOAD SUCCESS:",
        response
      );

      /*
      |--------------------------------------------------------------------------
      | Success message
      |--------------------------------------------------------------------------
      */

      setSuccess(
        "Resume uploaded and analyzed successfully!"
      );

      /*
      |--------------------------------------------------------------------------
      | Clear selected file
      |--------------------------------------------------------------------------
      */

      setResume(null);

      const input =
        document.getElementById(
          "resumeUpload"
        );

      if (input) {
        input.value = "";
      }

      /*
      |--------------------------------------------------------------------------
      | Refresh resume data
      |--------------------------------------------------------------------------
      */

      await fetchResume();
    } catch (err) {
      console.error(
        "RESUME UPLOAD ERROR:",
        err
      );

      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        "Resume upload failed.";

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Helper
  |--------------------------------------------------------------------------
  */

  const atsScore =
    Number(resumeData?.atsScore) || 0;

  const missingSkills =
    Array.isArray(
      resumeData?.missingSkills
    )
      ? resumeData.missingSkills
      : [];

  const suggestions =
    Array.isArray(
      resumeData?.suggestions
    )
      ? resumeData.suggestions
      : [];

  const strengths =
    Array.isArray(
      resumeData?.strengths
    )
      ? resumeData.strengths
      : [];

  const weaknesses =
    Array.isArray(
      resumeData?.weaknesses
    )
      ? resumeData.weaknesses
      : [];

  /*
  |--------------------------------------------------------------------------
  | UI
  |--------------------------------------------------------------------------
  */

  return (
    <div style={styles.container}>

      {/* =========================================================
          HEADER
      ========================================================= */}

      <div style={styles.header}>

        <div style={styles.headerLeft}>

          <div style={styles.headerIcon}>
            <FileText size={28} />
          </div>

          <div>
            <h1 style={styles.headerTitle}>
              Resume Analyzer
            </h1>

            <p style={styles.headerText}>
              Upload your resume to get an ATS
              score, AI suggestions, and
              improvement recommendations.
            </p>
          </div>

        </div>

        <div style={styles.headerBadge}>
          AI Powered
        </div>

      </div>

      {/* =========================================================
          STAT CARDS
      ========================================================= */}

      <div style={styles.cardGrid}>

        {/* ATS */}

        <div style={styles.statCard}>

          <div style={styles.statTop}>

            <div>

              <p style={styles.statLabel}>
                ATS Score
              </p>

              <h1 style={styles.blueValue}>
                {dataLoading
                  ? "..."
                  : `${atsScore}%`}
              </h1>

            </div>

            <div style={styles.blueIcon}>
              📊
            </div>

          </div>

          <div
            style={
              styles.progressBackground
            }
          >
            <div
              style={{
                ...styles.progressBlue,
                width: `${atsScore}%`,
              }}
            />
          </div>

        </div>

        {/* VERSION */}

        <div style={styles.statCard}>

          <div style={styles.statTop}>

            <div>

              <p style={styles.statLabel}>
                Resume Version
              </p>

              <h1 style={styles.greenValue}>
                {resumeData
                  ? "Latest"
                  : "--"}
              </h1>

            </div>

            <div style={styles.greenIcon}>
              <CheckCircle size={22} />
            </div>

          </div>

          <p style={styles.statBottom}>
            {resumeData
              ? "Latest resume analyzed"
              : "No resume uploaded"}
          </p>

        </div>

        {/* MISSING SKILLS */}

        <div style={styles.statCard}>

          <div style={styles.statTop}>

            <div>

              <p style={styles.statLabel}>
                Missing Skills
              </p>

              <h1 style={styles.redValue}>
                {missingSkills.length}
              </h1>

            </div>

            <div style={styles.redIcon}>
              <AlertTriangle size={22} />
            </div>

          </div>

          <p style={styles.statBottom}>
            Skills recommended for improvement
          </p>

        </div>

        {/* APPLICATIONS */}

        <div style={styles.statCard}>

          <div style={styles.statTop}>

            <div>

              <p style={styles.statLabel}>
                Applications
              </p>

              <h1 style={styles.orangeValue}>
                15
              </h1>

            </div>

            <div style={styles.orangeIcon}>
              🚀
            </div>

          </div>

          <p style={styles.statBottom}>
            Total job applications
          </p>

        </div>

      </div>

      {/* =========================================================
          UPLOAD SECTION
      ========================================================= */}

      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              <Upload
                size={20}
                style={{
                  verticalAlign: "middle",
                  marginRight: "7px",
                }}
              />
              Upload Resume
            </h2>

            <p style={styles.sectionSubtitle}>
              Upload your latest PDF resume
              for AI-powered analysis.
            </p>

          </div>

          <span style={styles.pdfBadge}>
            PDF Only
          </span>

        </div>

        {/* Hidden input */}

        <input
          id="resumeUpload"
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          style={{
            display: "none",
          }}
        />

        {/* Upload area */}

        <div style={styles.uploadArea}>

          <div style={styles.uploadIcon}>
            <FileText size={26} />
          </div>

          <h3 style={styles.uploadTitle}>
            Upload your resume
          </h3>

          <p style={styles.uploadText}>
            Select a PDF file from your
            computer
          </p>

          <div
            style={styles.buttonContainer}
          >

            <label
              htmlFor="resumeUpload"
              style={styles.uploadButton}
            >
              <FileText size={17} />
              Choose Resume
            </label>

            <button
              type="button"
              disabled={
                !resume || loading
              }
              onClick={handleAnalyze}
              style={{
                ...styles.button,
                ...(resume && !loading
                  ? styles.buttonActive
                  : styles.buttonDisabled),
              }}
            >
              {loading
                ? "Uploading..."
                : "Analyze Resume"}
            </button>

          </div>

        </div>

        {/* Selected file */}

        {resume && (
          <div style={styles.fileBox}>

            <div style={styles.fileInfo}>

              <div style={styles.fileIcon}>
                PDF
              </div>

              <div>

                <span style={styles.fileName}>
                  {resume.name}
                </span>

                <p style={styles.fileStatus}>
                  Ready for analysis •{" "}
                  {(
                    resume.size /
                    1024 /
                    1024
                  ).toFixed(2)}{" "}
                  MB
                </p>

              </div>

            </div>

            <button
              type="button"
              onClick={removeFile}
              style={styles.removeButton}
            >
              <X size={18} />
            </button>

          </div>
        )}

        {/* Error */}

        {error && (
          <div style={styles.error}>
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}

        {/* Success */}

        {success && (
          <div style={styles.success}>
            <CheckCircle size={17} />
            <span>{success}</span>
          </div>
        )}

      </div>

      {/* =========================================================
          AI SUGGESTIONS
      ========================================================= */}

      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              🤖 AI Suggestions
            </h2>

            <p style={styles.sectionSubtitle}>
              Personalized improvements
              generated from your resume.
            </p>

          </div>

          <div style={styles.aiBadge}>
            AI
          </div>

        </div>

        {suggestions.length > 0 ? (

          <div style={styles.list}>

            {suggestions.map(
              (item, index) => (

                <div
                  key={index}
                  style={styles.listItem}
                >

                  <span
                    style={styles.checkIcon}
                  >
                    ✓
                  </span>

                  <span>{item}</span>

                </div>

              )
            )}

          </div>

        ) : (

          <p style={styles.emptyText}>
            Upload and analyze your resume
            to receive AI suggestions.
          </p>

        )}

      </div>

      {/* =========================================================
          STRENGTHS + WEAKNESSES
      ========================================================= */}

      <div style={styles.twoColumn}>

        {/* STRENGTHS */}

        <div style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>

              <h2 style={styles.sectionTitle}>
                💪 Strengths
              </h2>

              <p style={styles.sectionSubtitle}>
                Strong points identified in
                your resume.
              </p>

            </div>

            <div
              style={styles.strengthBadge}
            >
              ✓
            </div>

          </div>

          {strengths.length > 0 ? (

            <div style={styles.list}>

              {strengths.map(
                (item, index) => (

                  <div
                    key={index}
                    style={
                      styles.strengthItem
                    }
                  >

                    <span
                      style={
                        styles.checkIcon
                      }
                    >
                      ✓
                    </span>

                    <span>{item}</span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p style={styles.emptyText}>
              No strengths available yet.
            </p>

          )}

        </div>

        {/* WEAKNESSES */}

        <div style={styles.section}>

          <div style={styles.sectionHeader}>

            <div>

              <h2 style={styles.sectionTitle}>
                ⚠ Weaknesses
              </h2>

              <p style={styles.sectionSubtitle}>
                Areas that can be improved.
              </p>

            </div>

            <div
              style={styles.warningBadge}
            >
              !
            </div>

          </div>

          {weaknesses.length > 0 ? (

            <div style={styles.list}>

              {weaknesses.map(
                (item, index) => (

                  <div
                    key={index}
                    style={
                      styles.warningItem
                    }
                  >

                    <span
                      style={
                        styles.warningIcon
                      }
                    >
                      !
                    </span>

                    <span>{item}</span>

                  </div>

                )
              )}

            </div>

          ) : (

            <p style={styles.emptyText}>
              No weaknesses available yet.
            </p>

          )}

        </div>

      </div>

      {/* =========================================================
          MISSING SKILLS
      ========================================================= */}

      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              🚀 Missing Skills
            </h2>

            <p style={styles.sectionSubtitle}>
              Skills you can develop to
              improve your career readiness.
            </p>

          </div>

          <div style={styles.skillCount}>
            {missingSkills.length}
          </div>

        </div>

        {missingSkills.length > 0 ? (

          <div style={styles.skillGrid}>

            {missingSkills.map(
              (item, index) => (

                <div
                  key={index}
                  style={styles.skillItem}
                >
                  <span
                    style={styles.skillDot}
                  >
                    ◆
                  </span>

                  <span>{item}</span>

                </div>

              )
            )}

          </div>

        ) : (

          <p style={styles.emptyText}>
            No missing skills available yet.
          </p>

        )}

      </div>

      {/* =========================================================
          RESUME HISTORY
      ========================================================= */}

      <div style={styles.section}>

        <div style={styles.sectionHeader}>

          <div>

            <h2 style={styles.sectionTitle}>
              🕒 Resume History
            </h2>

            <p style={styles.sectionSubtitle}>
              Information about your latest
              uploaded resume.
            </p>

          </div>

          <div style={styles.historyIcon}>
            📋
          </div>

        </div>

        <div style={styles.historyBox}>

          <div>

            <p style={styles.historyLabel}>
              Uploaded on
            </p>

            <p style={styles.historyDate}>
              {resumeData?.createdAt
                ? new Date(
                    resumeData.createdAt
                  ).toLocaleDateString(
                    "en-IN",
                    {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    }
                  )
                : "--"}
            </p>

          </div>

          <div style={styles.historyStatus}>
            {resumeData
              ? "Latest Resume"
              : "No Resume"}
          </div>

        </div>

      </div>

    </div>
  );
}

/* =================================================================
   STYLES
================================================================= */

const styles = {
  container: {
    minHeight: "100vh",
    padding: "28px",
    background: "#f6f8fc",
    color: "#172033",
  },

  /* HEADER */

  header: {
    background:
      "linear-gradient(135deg, #ffffff 0%, #f1f5ff 100%)",
    border: "1px solid #e4e9f2",
    borderRadius: "20px",
    padding: "28px",
    marginBottom: "24px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    boxShadow:
      "0 8px 25px rgba(15, 23, 42, 0.06)",
  },

  headerLeft: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
  },

  headerIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "16px",
    background: "#e8efff",
    color: "#315bdc",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    margin: 0,
    fontSize: "28px",
    fontWeight: "800",
    color: "#111827",
  },

  headerText: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "14px",
    lineHeight: "1.6",
  },

  headerBadge: {
    background: "#e8efff",
    color: "#315bdc",
    padding: "8px 14px",
    borderRadius: "999px",
    fontSize: "13px",
    fontWeight: "700",
    whiteSpace: "nowrap",
  },

  /* CARDS */

  cardGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(4, minmax(0, 1fr))",
    gap: "18px",
    marginBottom: "24px",
  },

  statCard: {
    background: "#ffffff",
    border: "1px solid #e7ebf2",
    borderRadius: "18px",
    padding: "22px",
    boxShadow:
      "0 5px 18px rgba(15, 23, 42, 0.05)",
  },

  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
  },

  statLabel: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "600",
    color: "#64748b",
  },

  blueValue: {
    margin: "9px 0 0",
    color: "#2563eb",
    fontSize: "30px",
    fontWeight: "800",
  },

  greenValue: {
    margin: "9px 0 0",
    color: "#16a34a",
    fontSize: "30px",
    fontWeight: "800",
  },

  redValue: {
    margin: "9px 0 0",
    color: "#dc2626",
    fontSize: "30px",
    fontWeight: "800",
  },

  orangeValue: {
    margin: "9px 0 0",
    color: "#f59e0b",
    fontSize: "30px",
    fontWeight: "800",
  },

  blueIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#eff6ff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  greenIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#ecfdf5",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  redIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#fef2f2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  orangeIcon: {
    width: "44px",
    height: "44px",
    borderRadius: "13px",
    background: "#fffbeb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },

  progressBackground: {
    height: "6px",
    background: "#e5e7eb",
    borderRadius: "10px",
    marginTop: "18px",
    overflow: "hidden",
  },

  progressBlue: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "10px",
    transition: "width 0.4s ease",
  },

  statBottom: {
    margin: "14px 0 0",
    fontSize: "12px",
    color: "#94a3b8",
  },

  /* SECTION */

  section: {
    background: "#ffffff",
    border: "1px solid #e5e9f0",
    borderRadius: "18px",
    padding: "25px",
    marginBottom: "22px",
    boxShadow:
      "0 5px 18px rgba(15, 23, 42, 0.04)",
  },

  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "20px",
    marginBottom: "20px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "19px",
    fontWeight: "750",
    color: "#172033",
    display: "flex",
    alignItems: "center",
  },

  sectionSubtitle: {
    margin: "6px 0 0",
    color: "#64748b",
    fontSize: "13px",
    lineHeight: "1.5",
  },

  pdfBadge: {
    background: "#f1f5f9",
    color: "#475569",
    padding: "7px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
  },

  aiBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#eef2ff",
    color: "#4f46e5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  strengthBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#ecfdf5",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  warningBadge: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#fff7ed",
    color: "#ea580c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  historyIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "10px",
    background: "#f1f5f9",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  /* UPLOAD */

  uploadArea: {
    border: "2px dashed #cbd5e1",
    borderRadius: "16px",
    padding: "35px 20px",
    textAlign: "center",
    background: "#f8fafc",
  },

  uploadIcon: {
    width: "55px",
    height: "55px",
    margin: "0 auto 12px",
    borderRadius: "15px",
    background: "#e8efff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  uploadTitle: {
    margin: 0,
    color: "#1e293b",
    fontSize: "17px",
    fontWeight: "700",
  },

  uploadText: {
    margin: "7px 0 20px",
    color: "#94a3b8",
    fontSize: "13px",
  },

  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },

  uploadButton: {
    background: "#ffffff",
    color: "#2563eb",
    border: "1px solid #2563eb",
    padding: "11px 22px",
    borderRadius: "9px",
    cursor: "pointer",
    fontWeight: "700",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },

  button: {
    padding: "12px 22px",
    border: "none",
    borderRadius: "9px",
    color: "#ffffff",
    fontSize: "14px",
    fontWeight: "700",
  },

  buttonActive: {
    background: "#2563eb",
    cursor: "pointer",
  },

  buttonDisabled: {
    background: "#94a3b8",
    cursor: "not-allowed",
  },

  /* FILE */

  fileBox: {
    marginTop: "16px",
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #dbe3ef",
    background: "#ffffff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "15px",
  },

  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    minWidth: 0,
  },

  fileIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#dc2626",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "11px",
    fontWeight: "800",
    flexShrink: 0,
  },

  fileName: {
    fontWeight: "650",
    color: "#334155",
    fontSize: "14px",
    wordBreak: "break-word",
  },

  fileStatus: {
    margin: "3px 0 0",
    color: "#16a34a",
    fontSize: "12px",
  },

  removeButton: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    border: "none",
    background: "#fee2e2",
    color: "#dc2626",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  /* LISTS */

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "13px 15px",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#475569",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  strengthItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "13px 15px",
    borderRadius: "11px",
    background: "#f0fdf4",
    color: "#365314",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  warningItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: "12px",
    padding: "13px 15px",
    borderRadius: "11px",
    background: "#fff7ed",
    color: "#7c2d12",
    fontSize: "14px",
    lineHeight: "1.5",
  },

  checkIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#dcfce7",
    color: "#16a34a",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  warningIcon: {
    width: "22px",
    height: "22px",
    borderRadius: "50%",
    background: "#ffedd5",
    color: "#ea580c",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: "800",
    flexShrink: 0,
  },

  /* TWO COLUMN */

  twoColumn: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "22px",
  },

  /* SKILLS */

  skillCount: {
    minWidth: "38px",
    height: "38px",
    padding: "0 10px",
    borderRadius: "10px",
    background: "#eff6ff",
    color: "#2563eb",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
  },

  skillGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(2, minmax(0, 1fr))",
    gap: "10px",
  },

  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "13px 15px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "11px",
    color: "#475569",
    fontSize: "14px",
  },

  skillDot: {
    color: "#2563eb",
    fontSize: "10px",
  },

  /* HISTORY */

  historyBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "17px",
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
    borderRadius: "12px",
    gap: "15px",
  },

  historyLabel: {
    margin: 0,
    color: "#94a3b8",
    fontSize: "12px",
  },

  historyDate: {
    margin: "5px 0 0",
    color: "#334155",
    fontSize: "14px",
    fontWeight: "700",
  },

  historyStatus: {
    background: "#dcfce7",
    color: "#15803d",
    padding: "7px 12px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "700",
  },

  /* EMPTY */

  emptyText: {
    margin: 0,
    padding: "15px",
    borderRadius: "11px",
    background: "#f8fafc",
    color: "#64748b",
    fontSize: "14px",
  },

  /* ERROR */

  error: {
    marginTop: "15px",
    padding: "12px 15px",
    borderRadius: "10px",
    background: "#fee2e2",
    color: "#b91c1c",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },

  /* SUCCESS */

  success: {
    marginTop: "15px",
    padding: "12px 15px",
    borderRadius: "10px",
    background: "#dcfce7",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
};