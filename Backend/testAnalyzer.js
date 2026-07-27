require("dotenv").config();

const analyzeResume = require("./utils/geminiResumeAnalyzer");

async function test() {

    const result = await analyzeResume(`
        Name: Yashvi Radariya

        Skills:
        React
        Node.js
        MongoDB
        JavaScript

        Projects:
        AI Career Coach
    `);

    console.log(result);
}

test();