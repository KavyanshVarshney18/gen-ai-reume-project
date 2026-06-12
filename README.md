# AI Resume Analyzer & CV Generator

An AI-powered career assistant platform that helps users analyze resumes, improve ATS scores, prepare for interviews, and generate professional resumes tailored to specific job roles.

## Features

### Resume Analyzer

* Upload resumes in PDF format.
* Compare resumes against job descriptions and self-introductions.
* Generate ATS compatibility scores.
* Receive AI-powered feedback and candidate evaluation reports.
* Identify strengths, weaknesses, and missing skills.

### AI Interview Preparation

* Generate technical interview questions based on skills and job role.
* Create behavioral interview questions.
* Identify skill gaps and improvement areas.
* Generate personalized interview preparation plans.

### ATS-Friendly CV Generator

* Create professional resumes using AI.
* Tailor resumes to specific job descriptions.
* Generate ATS-optimized content and formatting.
* Download and manage multiple resume versions.

### Authentication & User Management

* Secure JWT-based authentication.
* User registration and login.
* Protected routes and personalized dashboard.

## Tech Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js

### Database

* MongoDB

### Authentication

* JWT (JSON Web Tokens)

### AI Integration

* Gemini API

## Project Architecture

Client (React.js)
↓
REST APIs
↓
Server (Node.js + Express.js)
↓
MongoDB Database
↓
Gemini API

## Key Highlights

* AI-driven resume analysis and evaluation.
* ATS score calculation and optimization suggestions.
* Personalized interview preparation system.
* Dynamic ATS-friendly CV generation.
* Secure authentication and user data management.

## Future Enhancements

* Resume keyword optimization.
* Mock interview simulation with AI feedback.
* LinkedIn profile analysis.
* Multiple resume templates and themes.
* Job recommendation engine.

## Installation

```bash
git clone <repository-url>
cd ai-resume-analyzer
npm install
```

### Frontend

```bash
cd client
npm install
npm run dev
```

### Backend

```bash
cd server
npm install
npm start
```

## Environment Variables

```env
MONGODB_URI=
JWT_SECRET=
GEMINI_API_KEY=
```

## Author

Developed by Kavyansh Varshney
