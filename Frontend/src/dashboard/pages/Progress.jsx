import React from "react";

export default function Progress() {

  const subjects = [
    { name: "React.js", progress: 90, color: "#2563eb" },
    { name: "Node.js", progress: 75, color: "#16a34a" },
    { name: "MongoDB", progress: 68, color: "#f59e0b" },
    { name: "DSA", progress: 55, color: "#dc2626" },
  ];

  return (
    <div style={styles.container}>

      <div style={styles.header}>
        <h1>📈 Progress Dashboard</h1>
        <p>Track your learning performance and career growth.</p>
      </div>

      <div style={styles.cards}>

        <div style={styles.card}>
          <h3>Overall Progress</h3>
          <h1 style={{color:"#2563eb"}}>76%</h1>
        </div>

        <div style={styles.card}>
          <h3>Courses Completed</h3>
          <h1 style={{color:"#16a34a"}}>12</h1>
        </div>

        <div style={styles.card}>
          <h3>Study Hours</h3>
          <h1 style={{color:"#f59e0b"}}>145</h1>
        </div>

        <div style={styles.card}>
          <h3>Learning Streak</h3>
          <h1 style={{color:"#dc2626"}}>18 Days</h1>
        </div>

      </div>

      <div style={styles.section}>
        <h2>📊 Learning Progress</h2>

        {subjects.map((item,index)=>(

          <div key={index} style={{marginBottom:20}}>

            <div style={{
              display:"flex",
              justifyContent:"space-between"
            }}>
              <strong>{item.name}</strong>
              <span>{item.progress}%</span>
            </div>

            <div style={styles.progress}>
              <div style={{
                width:`${item.progress}%`,
                background:item.color,
                height:"100%",
                borderRadius:"20px"
              }}></div>
            </div>

          </div>

        ))}

      </div>

      <div style={styles.section}>
        <h2>🔥 Weekly Activity</h2>

        <ul>
          <li>✅ Completed React Module</li>
          <li>✅ Solved 35 DSA Problems</li>
          <li>✅ Resume Updated</li>
          <li>✅ One Mock Interview</li>
          <li>✅ Applied for 6 Jobs</li>
        </ul>
      </div>

      <div style={styles.section}>
        <h2>🤖 AI Suggestion</h2>

        <p>
          Continue practicing DSA and System Design.
          Complete AWS and Docker to increase placement opportunities.
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

progress:{
width:"100%",
height:"12px",
background:"#ddd",
borderRadius:"20px",
marginTop:"8px"
}

};