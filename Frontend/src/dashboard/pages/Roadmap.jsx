import React from "react";

export default function Roadmap() {
  const roadmap = [
    {
      week: "Phase 1",
      title: "Frontend Development",
      progress: 100,
      status: "Completed",
      color: "#16a34a",
    },
    {
      week: "Phase 2",
      title: "Backend Development",
      progress: 80,
      status: "In Progress",
      color: "#2563eb",
    },
    {
      week: "Phase 3",
      title: "Database & APIs",
      progress: 60,
      status: "Learning",
      color: "#f59e0b",
    },
    {
      week: "Phase 4",
      title: "Deployment & DevOps",
      progress: 20,
      status: "Pending",
      color: "#dc2626",
    },
  ];

  const upcoming = [
    "Learn JWT Authentication",
    "Build REST APIs",
    "Deploy MERN Project",
    "Practice DSA",
    "Mock Interviews",
  ];

  return (
    <div style={styles.container}>

      {/* Header */}
      <div style={styles.header}>
        <h1>🗺 Career Roadmap</h1>
        <p>
          Track your learning journey and complete every milestone to become
          a Full Stack MERN Developer.
        </p>
      </div>

      {/* Summary */}
      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Total Progress</h3>
          <h1 style={{color:"#2563eb"}}>65%</h1>
        </div>

        <div style={styles.card}>
          <h3>Completed</h3>
          <h1 style={{color:"#16a34a"}}>2 / 4</h1>
        </div>

        <div style={styles.card}>
          <h3>Current Phase</h3>
          <h1 style={{color:"#f59e0b"}}>Backend</h1>
        </div>

        <div style={styles.card}>
          <h3>Target</h3>
          <h1 style={{color:"#dc2626"}}>6 Months</h1>
        </div>

      </div>

      {/* Learning Roadmap */}

      <div style={styles.section}>
        <h2>📚 Learning Progress</h2>

        {roadmap.map((item,index)=>(

          <div key={index} style={{marginBottom:"25px"}}>

            <div style={{
              display:"flex",
              justifyContent:"space-between",
              marginBottom:"8px"
            }}>
              <strong>{item.week} - {item.title}</strong>

              <span>{item.progress}%</span>
            </div>

            <div style={styles.progressBg}>
              <div
                style={{
                  width:`${item.progress}%`,
                  background:item.color,
                  height:"100%",
                  borderRadius:"20px"
                }}
              ></div>
            </div>

            <p style={{marginTop:"8px"}}>
              Status :
              <strong style={{color:item.color}}>
                {" "}{item.status}
              </strong>
            </p>

          </div>

        ))}

      </div>

      {/* Upcoming Tasks */}

      <div style={styles.section}>
        <h2>✅ Upcoming Tasks</h2>

        <ul>

          {upcoming.map((task,index)=>(

            <li key={index} style={styles.list}>
              📌 {task}
            </li>

          ))}

        </ul>

      </div>

      {/* AI Recommendation */}

      <div style={styles.section}>
        <h2>🤖 AI Recommendation</h2>

        <p>
          You have completed Frontend Development successfully.
          Focus on Express.js, MongoDB, JWT Authentication,
          Deployment, Docker and AWS to become placement ready.
        </p>

      </div>

      {/* Weekly Goal */}

      <div style={styles.section}>
        <h2>🎯 Weekly Goal</h2>

        <p>
          Complete Backend APIs, Authentication, and MongoDB Integration.
          Build one complete MERN project this week.
        </p>

      </div>

    </div>
  );
}

const styles={

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

progressBg:{
width:"100%",
height:"12px",
background:"#ddd",
borderRadius:"20px",
overflow:"hidden"
},

list:{
marginBottom:"12px",
fontSize:"16px"
}

};