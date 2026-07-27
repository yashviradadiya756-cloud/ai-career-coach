import React from "react";

export default function AICoach() {
  const suggestions = [
    "How can I improve my resume?",
    "Recommend a career based on my skills",
    "Create a 6-month MERN roadmap",
    "Prepare me for HR interviews",
    "Suggest projects for placements",
  ];

  const tips = [
    "Practice coding for 1 hour every day.",
    "Update your resume every month.",
    "Complete at least 2 real-world projects.",
    "Improve communication and interview skills.",
    "Apply for internships regularly.",
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1>🤖 AI Career Coach</h1>
        <p>
          Get personalized career guidance, interview preparation,
          resume suggestions, and learning recommendations.
        </p>
      </div>

      {/* Dashboard Cards */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Career Score</h3>
          <h1 style={{ color: "#2563eb" }}>84%</h1>
        </div>

        <div style={styles.card}>
          <h3>Roadmap Progress</h3>
          <h1 style={{ color: "#16a34a" }}>65%</h1>
        </div>

        <div style={styles.card}>
          <h3>Resume Score</h3>
          <h1 style={{ color: "#f59e0b" }}>78%</h1>
        </div>

        <div style={styles.card}>
          <h3>Interview Score</h3>
          <h1 style={{ color: "#dc2626" }}>87%</h1>
        </div>

      </div>

      {/* AI Chat */}
      <div style={styles.section}>

        <h2>💬 Chat with AI Coach</h2>

        <div style={styles.chatBox}>

          <div style={styles.aiMessage}>
            👋 Hello! I'm your AI Career Coach.
            <br />
            How can I help you today?
          </div>

          <textarea
            placeholder="Ask anything about career, resume, interview, roadmap..."
            style={styles.input}
          />

          <button style={styles.button}>
            Send Message
          </button>

        </div>

      </div>

      {/* Quick Questions */}
      <div style={styles.section}>

        <h2>⚡ Quick Questions</h2>

        {suggestions.map((item, index) => (

          <div key={index} style={styles.question}>
            {item}
          </div>

        ))}

      </div>

      {/* AI Tips */}
      <div style={styles.section}>

        <h2>🎯 AI Career Tips</h2>

        <ul>

          {tips.map((tip, index) => (

            <li key={index} style={styles.list}>
              ✅ {tip}
            </li>

          ))}

        </ul>

      </div>

      {/* Weekly Goal */}
      <div style={styles.section}>

        <h2>📅 Weekly Goal</h2>

        <p>
          Finish your Resume Analysis, complete one Mock Interview,
          solve 20 DSA problems, and apply to at least 5 internships.
        </p>

      </div>

      {/* AI Recommendation */}
      <div style={styles.section}>

        <h2>🚀 AI Recommendation</h2>

        <p>
          Based on your profile, you should focus on
          <strong> React.js, Node.js, Express.js, MongoDB,
          JWT Authentication, Docker, and AWS </strong>
          to become placement-ready.
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
textAlign:"center",
borderRadius:"12px",
boxShadow:"0 2px 10px rgba(0,0,0,.08)"
},

section:{
background:"#fff",
padding:"20px",
borderRadius:"12px",
marginBottom:"20px",
boxShadow:"0 2px 10px rgba(0,0,0,.08)"
},

chatBox:{
display:"flex",
flexDirection:"column",
gap:"15px"
},

aiMessage:{
background:"#eef4ff",
padding:"15px",
borderRadius:"10px",
fontSize:"15px"
},

input:{
width:"100%",
height:"120px",
padding:"15px",
fontSize:"15px",
border:"1px solid #ccc",
borderRadius:"10px",
resize:"none"
},

button:{
width:"180px",
padding:"12px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"600"
},

question:{
padding:"14px",
background:"#f8fafc",
border:"1px solid #e5e7eb",
borderRadius:"8px",
marginBottom:"10px",
cursor:"pointer"
},

list:{
marginBottom:"12px",
fontSize:"16px"
}

};