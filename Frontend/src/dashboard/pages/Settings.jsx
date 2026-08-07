import React,{useState} from "react";

export default function Settings(){

const[darkMode,setDarkMode]=useState(false);
const[email,setEmail]=useState(true);
const[notification,setNotification]=useState(true);

return(

<div style={styles.container}>

<div style={styles.header}>
<h1>⚙ Settings</h1>
<p>Customize your AI Career Coach experience.</p>
</div>

<div style={styles.section}>

<h2>Appearance</h2>

<label style={styles.row}>
Dark Mode
<input
type="checkbox"
checked={darkMode}
onChange={()=>setDarkMode(!darkMode)}
/>
</label>

</div>

<div style={styles.section}>

<h2>Notifications</h2>

<label style={styles.row}>
Email Notifications
<input
type="checkbox"
checked={email}
onChange={()=>setEmail(!email)}
/>
</label>

<label style={styles.row}>
Push Notifications
<input
type="checkbox"
checked={notification}
onChange={()=>setNotification(!notification)}
/>
</label>

</div>

<div style={styles.section}>

<h2>Account</h2>

<button style={styles.blue}>Change Password</button>

<button style={styles.green}>Export Data</button>

<button style={styles.red}>Delete Account</button>

</div>

</div>

);

}

const styles={

container:{padding:"20px",background:"#f5f7fb",minHeight:"100vh"},

header:{background:"#fff",padding:"25px",borderRadius:"12px",marginBottom:"20px",boxShadow:"0 2px 10px rgba(0,0,0,.08)"},

section:{background:"#fff",padding:"20px",borderRadius:"12px",marginBottom:"20px",boxShadow:"0 2px 10px rgba(0,0,0,.08)"},

row:{display:"flex",justifyContent:"space-between",marginBottom:"20px",fontSize:"18px"},

blue:{padding:"12px 20px",background:"#2563eb",color:"#fff",border:"none",borderRadius:"8px",marginRight:"10px",cursor:"pointer"},

green:{padding:"12px 20px",background:"#16a34a",color:"#fff",border:"none",borderRadius:"8px",marginRight:"10px",cursor:"pointer"},

red:{padding:"12px 20px",background:"#dc2626",color:"#fff",border:"none",borderRadius:"8px",cursor:"pointer"}

};