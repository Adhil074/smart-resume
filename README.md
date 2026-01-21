==AURARES.AI==

- AuraRes.ai is a full-stack web application that helps users build resumes, analyze resumes using ATS logic, match resumes with job descriptions, and get learning suggestions in one place.
  This project focuses on practical resume workflows, clean UI, and clear backend logic.

- Features

1. Upload Resume
   a. Users can upload an existing resume in PDF format.
   b. The resume is stored securely in the database.
   c. Resume text and skills are extracted using AI.
   d. Uploaded resumes can be viewed later from the Previous Resumes page.

2. ATS Resume Analysis
   a. The system analyzes the uploaded resume.
   b. It checks for:
   c. Important skills
   Missing keywords
   Overall ATS compatibility
   d. Results are displayed in a clean and readable format.
   e. If analysis fails or data is missing, safe fallbacks are applied.

3. Resume ↔ Job Description Match
   a. Users can upload a Job Description (JD).
   b. Skills are extracted from the JD.
   c. Resume skills and JD skills are normalized before comparison.
   d. A match score is calculated based on actual matched skills.
   e. The result includes:
   Match percentage
   Matched skills - Keywords
   Missing skills - keywords

4. Learning Resources
   a. Based on extracted or missing skills, learning resources are shown.
   b. For each skill, users get links to:
   YouTube
   Official documentation
   Courses
   c. This section appears only when relevant data exists.

5. Create Resume (From Scratch)
   a. Users can create a resume without uploading one.
   b. Two resume templates are available:
   – Professional Classic
   – Modern Career
   c. Resume preview updates in real time.
   d. Empty fields are not shown in the preview or exported PDF.

6. Resume Export (PDF)
   a. Created resumes can be exported as PDFs.
   b. PDF generation is handled on the server.
   c. Only filled sections are included in the final PDF.

7. AI Chatbot
   a. A built-in AI chatbot is available for resume and career-related queries.
   b. Works independently from resume upload and analysis features.

- Tech Stack

* Frontend
  Next.js (App Router)
  React
  TypeScript
  Tailwind CSS
* Backend
  Next.js API Routes
  MongoDB
  Mongoose
  NextAuth (Authentication)

- AI & Processing

* AI-based text and skill extraction.
* Manual logic for ATS scoring and resume–JD matching

- PDF Generation

* Puppeteer (HTML to PDF)

- How Resume–JD Matching Works?

* Resume skills and JD skills are extracted.
* Skills are normalized (lowercase, cleaned text).
* Matching is done using set comparison.
* Match percentage is calculated based on actual matches.

- Error Handling and Fallbacks

* Empty fields are skipped automatically.
* Missing resume or JD is handled safely.
* API routes are protected using authentication.
* UI avoids rendering incomplete or invalid data.

- Purpose of This Project

* To practice full-stack development with Next.js.
* To understand ATS logic and resume workflows.
* To learn server-side PDF generation.
* To build a real, usable application instead of a demo project.

- Deployment

* The application is prepared for deployment on Vercel with environment-based configuration.
