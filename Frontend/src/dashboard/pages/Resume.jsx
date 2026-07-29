import { X } from "lucide-react"; 
import { useEffect, useState } from "react";
import { uploadResume, getLatestResume } from "../../api/resumeApi";

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [resumeData, setResumeData] = useState(null);
  const [dataLoading,setDataLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const fetchResume = async()=>{

  try{
      setDataLoading(true);
      const response = await getLatestResume();
      console.log("LATEST RESUME RESPONSE:", response.data);
      setResumeData(response.data.resume);
   }catch(error){
      console.log(error);
   }finally{
      setDataLoading(false);
   }};

  useEffect(() => {
    fetchResume();
  }, []);

  const tips = [
    "Use ATS-friendly keywords",
    "Keep your resume to one page",
    "Highlight projects and internships",
    "Add measurable achievements",
    "Use a professional summary",
  ];

  // Handle PDF Selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (
      file.type !== "application/pdf" &&
      !file.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("❌ Only PDF files are allowed.");
      setResume(null);
      e.target.value = "";
      return;
    }

    setError("");
    setResume(file);
  };

  // Upload Resume
  const removeFile = () => {
  setResume(null);
  setError("");

  const input = document.getElementById("resumeUpload");
  if (input) input.value = "";
};

 const handleAnalyze = async () => {
  if (!resume) {
    alert("Select a PDF first");
    return;
  }

  try {
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", resume);

    await uploadResume(formData);

    alert("Resume Uploaded Successfully");

    await fetchResume();

    removeFile();
  } catch (err) {
    console.log(err);

    alert(err.response?.data?.message || "Upload Failed");
  } finally {
    setLoading(false);
  }
};
  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1>📄 Resume Analyzer</h1>
        <p>
          Upload your resume to get an ATS score, AI suggestions, and
          improvement recommendations.
        </p>
      </div>

      {/* Cards */}
      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h3>ATS Score</h3>
          <h1 style={{ color: "#2563eb" }}>
            {
              dataLoading
              ?
              "Loading..."
              :
              resumeData?.atsScore || 0
            }%
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Resume Version</h3>
          <h1 style={{ color: "#16a34a" }}>
            {resumeData ? "Latest" : "--"}
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Missing Skills</h3>
          <h1 style={{ color: "#dc2626" }}>
            {
              resumeData?.missingSkills?.length || 0
            }
          </h1>
        </div>

        <div style={styles.card}>
          <h3>Applications</h3>
          <h1 style={{ color: "#f59e0b" }}>15</h1>
        </div>
      </div>

      {/* Upload Section */}
      <div style={styles.section}>
      <h2>📤 Upload Resume</h2>

      <input
        id="resumeUpload"
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      <div style={styles.buttonContainer}>
        <label htmlFor="resumeUpload" style={styles.uploadButton}>
          📄 Choose Resume
        </label>

        <button
          style={{
            ...styles.button,
            opacity: resume ? 1 : 0.5,
          }}
          disabled={!resume}
          onClick={handleAnalyze}
        >
          {loading ? "Uploading..." : "Analyze Resume"}
        </button>
      </div>

      {resume && (
        <div style={styles.fileBox}>
          <span style={styles.fileName}>📄 {resume.name}</span>

          <button
            onClick={removeFile}
            style={styles.removeButton}
          >
            <X size={18} />
          </button>
        </div>
      )}

      {error && (
        <p style={{ color: "red", marginTop: "10px" }}>
          {error}
        </p>
      )}
    </div>


      {/* AI Suggestions */}
      <div style={styles.section}>
        <h2>🤖 AI Suggestions</h2>
          <ul>
          {
          resumeData?.suggestions?.map((item,index)=>(
          <li key={index}>
          ✅ {item}
          </li>
          ))
          }
          </ul>
      </div>

      <div style={styles.section}>
        <h2>💪 Strengths</h2>

        <ul>
          {resumeData?.strengths?.map((item, index) => (
            <li key={index}>
              ✅ {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2>⚠ Weaknesses</h2>

        <ul>
          {resumeData?.weaknesses?.map((item, index) => (
            <li key={index}>
              ❌ {item}
            </li>
          ))}
        </ul>
      </div>

      <div style={styles.section}>
        <h2>🚀 Missing Skills</h2>

        <ul>
          {resumeData?.missingSkills?.map((item, index) => (
            <li key={index}>
              🔹 {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Resume Sections */}
      {/* <div style={styles.section}>
        <h2>📋 Resume Sections</h2>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Section</th>
              <th style={styles.th}>Status</th>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td style={styles.td}>Personal Information</td>
              <td style={styles.td}>✅ Complete</td>
            </tr>

            <tr>
              <td style={styles.td}>Education</td>
              <td style={styles.td}>✅ Complete</td>
            </tr>

            <tr>
              <td style={styles.td}>Skills</td>
              <td style={styles.td}>⚠ Needs Update</td>
            </tr>

            <tr>
              <td style={styles.td}>Projects</td>
              <td style={styles.td}>✅ Complete</td>
            </tr>

            <tr>
              <td style={styles.td}>Experience</td>
              <td style={styles.td}>⚠ Add Internship</td>
            </tr>

            <tr>
              <td style={styles.td}>Certifications</td>
              <td style={styles.td}>❌ Missing</td>
            </tr>
          </tbody>
        </table>
      </div> */}

      {/* Resume History */}
      <div style={styles.section}>
        <h2>🕒 Resume History</h2>

        <p>
          Uploaded on:

          {resumeData &&
          new Date(resumeData.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>

    
  );
}

const styles = {
  container: {
    padding: "20px",
    background: "#f5f7fb",
    minHeight: "100vh",
  },

  header: {
    background: "#fff",
    padding: "25px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },

  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "20px",
    marginBottom: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
    textAlign: "center",
  },

  section: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
    boxShadow: "0 2px 8px rgba(0,0,0,.08)",
  },

  button: {
    marginTop: "20px",
    padding: "12px 24px",
    background: "#2563eb",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "600",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "15px",
  },

  th: {
    border: "1px solid #ddd",
    padding: "10px",
    background: "#2563eb",
    color: "#fff",
  },

  td: {
    border: "1px solid #ddd",
    padding: "10px",
  },
  buttonContainer: {
  display: "flex",
  alignItems: "center",
  gap: "15px",
  marginTop: "20px",
},

uploadButton: {
  background: "#2563eb",
  color: "#fff",
  padding: "12px 25px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "600",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  minWidth: "180px",
},

fileBox: {
  marginTop: "20px",
  background: "#f8fafc",
  border: "1px solid #d1d5db",
  borderRadius: "10px",
  padding: "12px 15px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
},

fileName: {
  fontWeight: "500",
  color: "#1f2937",
},

removeButton: {
  width: "35px",
  height: "35px",
  borderRadius: "50%",
  border: "none",
  background: "#ef4444",
  color: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},
};