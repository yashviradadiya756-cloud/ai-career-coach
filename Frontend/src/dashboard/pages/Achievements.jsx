import React from "react";

export default function Achievements(){

const achievements=[

{
title:"🏆 React Master",
date:"12 July 2026",
desc:"Completed React.js Course"
},

{
title:"🥇 Resume Expert",
date:"20 July 2026",
desc:"ATS Score above 90%"
},

{
title:"💼 Internship Ready",
date:"28 July 2026",
desc:"Completed Career Roadmap"
},

{
title:"🎤 Interview Champion",
date:"2 August 2026",
desc:"Scored 95% in Mock Interview"
}

];

return(

<div style={styles.container}>

<div style={styles.header}>
<h1>🏅 Achievements</h1>
<p>Your certificates, badges and career milestones.</p>
</div>

<div style={styles.cards}>

<div style={styles.card}>
<h3>Badges</h3>
<h1 style={{color:"#2563eb"}}>18</h1>
</div>

<div style={styles.card}>
<h3>Certificates</h3>
<h1 style={{color:"#16a34a"}}>10</h1>
</div>

<div style={styles.card}>
<h3>Courses</h3>
<h1 style={{color:"#f59e0b"}}>15</h1>
</div>

<div style={styles.card}>
<h3>Projects</h3>
<h1 style={{color:"#dc2626"}}>8</h1>
</div>

</div>

<div style={styles.section}>

<h2>🎖 Achievement Timeline</h2>

{achievements.map((item,index)=>(

<div key={index} style={styles.achievement}>

<h3>{item.title}</h3>

<p><strong>Date:</strong> {item.date}</p>

<p>{item.desc}</p>

<button style={styles.button}>
View Certificate
</button>

</div>

))}

</div>

<div style={styles.section}>

<h2>⭐ Next Milestones</h2>

<ul>

<li>Complete AWS Course</li>

<li>Build 3 MERN Projects</li>

<li>Reach 95% Career Score</li>

<li>Complete 10 Mock Interviews</li>

<li>Get First Internship</li>

</ul>

</div>

<div style={styles.section}>

<h2>🤖 AI Motivation</h2>

<p>
Excellent progress! Continue learning consistently.
Complete your roadmap and apply for internships every week.
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

achievement:{
border:"1px solid #e5e7eb",
padding:"20px",
borderRadius:"10px",
marginTop:"15px",
background:"#fafafa"
},

button:{
marginTop:"12px",
padding:"10px 20px",
background:"#2563eb",
color:"#fff",
border:"none",
borderRadius:"8px",
cursor:"pointer"
}

};