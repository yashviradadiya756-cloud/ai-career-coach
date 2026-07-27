import React from "react";

export default function Interview() {
  const interviews = [
    {
      title: "HR Interview",
      questions: 25,
      duration: "20 Min",
      status: "Ready",
      color: "#2563eb",
    },
    {
      title: "Technical Interview",
      questions: 30,
      duration: "45 Min",
      status: "Ready",
      color: "#16a34a",
    },
    {
      title: "Coding Interview",
      questions: 15,
      duration: "60 Min",
      status: "Ready",
      color: "#f59e0b",
    },
    {
      title: "Mock Interview",
      questions: 20,
      duration: "30 Min",
      status: "AI Powered",
      color: "#dc2626",
    },
  ];

  const feedback = [
    "Improve confidence while answering.",
    "Explain projects with more details.",
    "Practice Data Structures & Algorithms.",
    "Maintain eye contact during interviews.",
    "Improve communication skills.",
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1>🎤 AI Mock Interview</h1>

        <p>
          Practice interviews with AI and improve your confidence before real
          placement interviews.
        </p>
      </div>

      {/* Summary Cards */}

      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Total Interviews</h3>
          <h1 style={{ color: "#2563eb" }}>18</h1>
        </div>

        <div style={styles.card}>
          <h3>Completed</h3>
          <h1 style={{ color: "#16a34a" }}>12</h1>
        </div>

        <div style={styles.card}>
          <h3>Average Score</h3>
          <h1 style={{ color: "#f59e0b" }}>87%</h1>
        </div>

        <div style={styles.card}>
          <h3>Confidence</h3>
          <h1 style={{ color: "#dc2626" }}>82%</h1>
        </div>

      </div>

      {/* Interview Types */}

      <div style={styles.section}>

        <h2>Interview Categories</h2>

        <div style={styles.grid}>

          {interviews.map((item, index) => (

            <div key={index} style={styles.interviewCard}>

              <h3 style={{ color: item.color }}>{item.title}</h3>

              <p>
                <strong>Questions:</strong> {item.questions}
              </p>

              <p>
                <strong>Duration:</strong> {item.duration}
              </p>

              <p>
                <strong>Status:</strong>{" "}
                <span style={{ color: item.color }}>
                  {item.status}
                </span>
              </p>

              <button style={styles.button}>
                Start Interview
              </button>

            </div>

          ))}

        </div>

      </div>

      {/* AI Feedback */}

      <div style={styles.section}>

        <h2>🤖 AI Feedback</h2>

        <ul>

          {feedback.map((item, index) => (

            <li key={index} style={styles.list}>
              ✅ {item}
            </li>

          ))}

        </ul>

      </div>

      {/* Performance */}

      <div style={styles.section}>

        <h2>Interview Performance</h2>

        <div style={{ marginBottom: 20 }}>
          <strong>Technical Skills</strong>

          <div style={styles.progress}>
            <div style={{ ...styles.fill, width: "88%" }}></div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <strong>Communication</strong>

          <div style={styles.progress}>
            <div
              style={{
                ...styles.fill,
                width: "82%",
                background: "#16a34a",
              }}
            ></div>
          </div>
        </div>

        <div style={{ marginBottom: 20 }}>
          <strong>Confidence</strong>

          <div style={styles.progress}>
            <div
              style={{
                ...styles.fill,
                width: "78%",
                background: "#f59e0b",
              }}
            ></div>
          </div>
        </div>

      </div>

      {/* AI Recommendation */}

      <div style={styles.section}>

        <h2>🎯 AI Recommendation</h2>

        <p>
          Complete 5 mock interviews this week. Focus on DSA,
          System Design, HR Questions and Project Explanation
          to improve placement success.
        </p>

      </div>

    </div>
  );
}

const styles = {

container:{
padding:"20px",
background:"#f5f7fb",
minHeight:"100vh"
},

header:{
background:"#fff",
padding:"25px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 2px 10px rgba(0,0,0,.08)"
},

cards:{
display:"grid",
gridTemplateColumns:"repeat(4,1fr)",
gap:"20px",
marginBottom:"20px"
},

card:{
background:"#fff",
padding:"20px",
borderRadius:"12px",
textAlign:"center",
boxShadow:"0 2px 10px rgba(0,0,0,.08)"
},

section:{
background:"#fff",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 2px 10px rgba(0,0,0,.08)"
},

grid:{
display:"grid",
gridTemplateColumns:"repeat(auto-fit,minmax(250px,1fr))",
gap:"20px"
},

interviewCard:{
background:"#f8fafc",
padding:"20px",
borderRadius:"10px",
border:"1px solid #e5e7eb"
},

button:{
marginTop:"15px",
width:"100%",
padding:"12px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"600"
},

progress:{
height:"12px",
background:"#ddd",
borderRadius:"20px",
marginTop:"8px",
overflow:"hidden"
},

fill:{
height:"100%",
background:"#2563eb",
borderRadius:"20px"
},

list:{
marginBottom:"12px",
fontSize:"16px"
}

};