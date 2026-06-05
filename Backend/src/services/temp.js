require('dotenv').config();

const generateInterviewReport = require("./ai.service");

async function main() {
    const tempData = {
        resume: `
        Name: Kavya Sharma

        Education:
        B.Tech Computer Science, GLA University

        Skills:
        Java, JavaScript, React, Node.js, Express.js,
        MongoDB, SQL, Git, GitHub

        Projects:
        - Paytm Clone using MERN Stack
        - AI Interview Preparation Tool using Gemini API

        Internship:
        - Java Struts Application Development
        - SSO Integration
        `,

        selfdescription: `
        I am a Computer Science student interested in
        Full Stack Development and AI.
        I have experience in MERN stack development,
        Java backend development, and API integration.
        I am preparing for Software Engineer roles.
        `,

        jobdescription: `
        Software Engineer Intern

        Requirements:
        - JavaScript
        - React
        - Node.js
        - Express
        - MongoDB
        - REST APIs
        - Git/GitHub
        - Data Structures and Algorithms

        Preferred:
        - AI/ML knowledge
        - Cloud fundamentals
        `
    };

    try {
        const report = await generateInterviewReport(tempData);

        console.log("=== INTERVIEW REPORT ===");
        console.log(report);
    } catch (err) {
        console.error("Error:", err);
    }
}

main();