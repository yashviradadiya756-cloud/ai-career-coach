import React, { useEffect, useState } from "react";
import { generateRoadmap, getRoadmap } from "../../api/roadmapApi";

export default function Roadmap() {
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  loadRoadmap();
}, []);

  const loadRoadmap = async () => {
    try {
      const res = await getRoadmap();

      console.log(res.data);

      setRoadmap(res.data.roadmap);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
    };
    
    const handleGenerate = async () => {
    console.log("Generate button clicked");

    try {
      const role = "UI-UX";

      const res = await generateRoadmap(role);

      console.log(res.data);

      await loadRoadmap();

      alert("Roadmap Generated Successfully");
    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.message || "Failed");
    }
  };

if (loading) {
  return <h2 style={{ padding: "30px" }}>Loading Roadmap...</h2>;
}

if (!roadmap) {
  return (
    <div style={{ padding: "30px" }}>
      <h2>No Roadmap Found</h2>

      <button onClick={handleGenerate}>
        Generate Roadmap
      </button>
    </div>
  );
}

    


  return (
    <div style={styles.container}>

      <button onClick={handleGenerate}>
        Generate Roadmap
      </button>

      {/* Header */}
      <div style={styles.header}>
        <h1>{roadmap.roadmapTitle}</h1>
        <p>
          Target Role: <strong>{roadmap.targetRole}</strong>
        </p>
      </div>

      {/* Summary */}
      <div style={styles.card}>
        <h3>Total Phases</h3>
        <h1>{roadmap.phases.length}</h1>
      </div>

    <div style={styles.card}>
      <h3>Target Role</h3>
      <h1>{roadmap.targetRole}</h1>
    </div>

    <div style={styles.card}>
      <h3>Current Phase</h3>
      <h1>Phase 1</h1>
    </div>

    <div style={styles.card}>
      <h3>Status</h3>
      <h1 style={{ color: "#16a34a" }}>Started</h1>
    </div>

      {/* Learning Roadmap */}

      <div style={styles.section}>
        <h2>📚 Learning Progress</h2>

        {roadmap.phases.map((phase, index) => (
        <div key={index} style={{ marginBottom: "25px" }}>

          <h3>
            Phase {index + 1} : {phase.title}
          </h3>

          <p>
            <strong>Duration:</strong> {phase.duration}
          </p>

          <h4>Topics</h4>

          <ul>
            {phase.topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>

          <h4>Projects</h4>

          <ul>
            {phase.projects.map((project, i) => (
              <li key={i}>{project}</li>
            ))}
          </ul>

          <h4>Resources</h4>

          <ul>
            {phase.resources.map((resource, i) => (
              <li key={i}>{resource}</li>
            ))}
          </ul>

          <hr />

        </div>
      ))}

      </div>

      {/* Upcoming Tasks */}

      <div style={styles.section}>
      <h2>Upcoming Topics</h2>

      <ul>
        {roadmap.phases.flatMap((phase) =>
          phase.topics.map((topic, index) => (
            <li key={topic + index}>{topic}</li>
          ))
        )}
      </ul>
    </div>

      {/* AI Recommendation */}

      <div style={styles.section}>
        <h2>AI Recommendation</h2>

        <p>
          Complete each phase in sequence. Finish all topics and projects before moving to the next phase.
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