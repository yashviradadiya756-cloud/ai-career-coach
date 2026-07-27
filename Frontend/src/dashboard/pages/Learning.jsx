import React from "react";

export default function Learning() {
  const courses = [
    {
      title: "React.js Complete Course",
      duration: "30 Hours",
      progress: 90,
      color: "#2563eb",
    },
    {
      title: "Node.js & Express",
      duration: "28 Hours",
      progress: 70,
      color: "#16a34a",
    },
    {
      title: "MongoDB Masterclass",
      duration: "18 Hours",
      progress: 60,
      color: "#f59e0b",
    },
    {
      title: "DSA Preparation",
      duration: "45 Hours",
      progress: 40,
      color: "#dc2626",
    },
  ];

  const resources = [
    "JavaScript Notes",
    "React Cheat Sheet",
    "Node.js Documentation",
    "MongoDB Tutorial",
    "Interview Questions PDF",
  ];

  return (
    <div style={styles.container}>

      {/* Header */}

      <div style={styles.header}>
        <h1>📚 Learning Center</h1>

        <p>
          Learn new technologies, track your progress, and become
          job-ready with AI-recommended learning resources.
        </p>
      </div>

      {/* Dashboard Cards */}

      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Courses</h3>
          <h1 style={{ color: "#2563eb" }}>24</h1>
        </div>

        <div style={styles.card}>
          <h3>Completed</h3>
          <h1 style={{ color: "#16a34a" }}>12</h1>
        </div>

        <div style={styles.card}>
          <h3>Certificates</h3>
          <h1 style={{ color: "#f59e0b" }}>8</h1>
        </div>

        <div style={styles.card}>
          <h3>Learning Time</h3>
          <h1 style={{ color: "#dc2626" }}>120 hrs</h1>
        </div>

      </div>

      {/* Learning Courses */}

      <div style={styles.section}>

        <h2>🚀 Recommended Courses</h2>

        {courses.map((course, index) => (

          <div key={index} style={styles.courseCard}>

            <div style={{
              display:"flex",
              justifyContent:"space-between",
              marginBottom:"10px"
            }}>
              <strong>{course.title}</strong>
              <span>{course.duration}</span>
            </div>

            <div style={styles.progress}>
              <div
                style={{
                  width:`${course.progress}%`,
                  background:course.color,
                  height:"100%",
                  borderRadius:"20px"
                }}
              ></div>
            </div>

            <p style={{marginTop:"8px"}}>
              Progress : {course.progress}%
            </p>

            <button style={styles.button}>
              Continue Learning
            </button>

          </div>

        ))}

      </div>

      {/* Resources */}

      <div style={styles.section}>

        <h2>📖 Study Resources</h2>

        {resources.map((item,index)=>(

          <div key={index} style={styles.resource}>
            📄 {item}
          </div>

        ))}

      </div>

      {/* Daily Goal */}

      <div style={styles.section}>

        <h2>🎯 Today's Goal</h2>

        <p>✔ Complete one React Module.</p>
        <p>✔ Solve 5 JavaScript Questions.</p>
        <p>✔ Watch 30 minutes of Node.js tutorials.</p>

      </div>

      {/* AI Recommendation */}

      <div style={styles.section}>

        <h2>🤖 AI Recommendation</h2>

        <p>
          Based on your career goal, complete React.js,
          Node.js, Express.js, MongoDB, JWT Authentication,
          Docker, AWS and System Design before placements.
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

courseCard:{
padding:"20px",
marginTop:"20px",
border:"1px solid #e5e7eb",
borderRadius:"10px",
background:"#fafafa"
},

progress:{
width:"100%",
height:"12px",
background:"#ddd",
borderRadius:"20px",
overflow:"hidden"
},

button:{
marginTop:"15px",
padding:"10px 20px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"8px",
cursor:"pointer",
fontWeight:"600"
},

resource:{
padding:"12px",
marginTop:"10px",
background:"#f8fafc",
borderRadius:"8px",
border:"1px solid #e5e7eb"
}

};