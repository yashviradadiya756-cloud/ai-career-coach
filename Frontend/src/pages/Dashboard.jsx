import { useEffect, useState } from "react";
import { getDashboard } from "../api/resumeApi";

export default function Dashboard(){

const [data,setData]=useState({});

useEffect(()=>{

loadDashboard();

},[]);

const loadDashboard=async()=>{

const res=await getDashboard();

setData(res.data);

};

return(

<div>

<h1>Dashboard</h1>

<h2>Total Resume : {data.totalResumes}</h2>

<h2>Average Score : {data.averageScore}</h2>

<h2>Latest Score : {data.latestResume?.analysis?.score}</h2>

</div>

);

}