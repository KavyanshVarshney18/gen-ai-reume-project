const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");
const zod = require("zod");
const z = zod;

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

async function generateInterviewReport({
    resume,
    selfDescription,
    jobDescription
}) {

    const prompt = `
You are an expert technical interviewer.

Return ONLY valid JSON.

The JSON MUST follow EXACTLY this structure:

{
  "title": "string",
  "matchingscore": 85,
  "technicalquestion": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "behaviouralquestion": [
    {
      "question": "string",
      "intention": "string",
      "answer": "string"
    }
  ],
  "skillgaps": [
    {
      "skillgap": "string",
      "severity": "low"
    }
  ],
  "preparationplan": [
    {
      "day": 1,
      "focus": "string",
      "tasks": ["task1","task2","task3"]
    }
  ]
}

Rules:
1. Generate 10 technical questions.
2. Generate 10 behavioural questions.
3. Generate 5 skill gaps.
4. Generate 5 preparation days.
5. Do NOT return markdown.
6. Do NOT return explanations outside JSON.
7. Use ONLY the field names shown above.

Resume:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json"
        }
    });

    console.log("RAW GEMINI RESPONSE:");
    console.log(response.text);

    return JSON.parse(response.text);
}

async function generatepdffromhtml(htmlcontent) {
    try {
        console.log("Launching browser...");

        const browser = await puppeteer.launch({
            headless: true,
            args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });

        console.log("Opening page...");

        const page = await browser.newPage();

        console.log("Setting HTML content...");

        await page.setContent(htmlcontent, {
            waitUntil: "networkidle0"
        });

        console.log("Generating PDF...");

        const pdfbuffer = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: {
        top: "40px",
        bottom: "40px",
        left: "40px",
        right: "40px"
    }
});

        console.log("Closing browser...");

        await browser.close();

        console.log("PDF generated successfully");

        return pdfbuffer;

    } catch (err) {
        console.error("PDF Generation Error:", err);
        throw err;
    }
}
async function getResumepdf({ resume , selfDescription , jobDescription }) {

  const resumepdfschema = z.object({
    html : z.string().describe("HTML content of the resume")
  })

  const prompt = `
You are a world-class resume writer, ATS optimization expert, and UI designer specializing in creating visually stunning yet ATS-compatible resumes.

Your task is to generate a complete, self-contained HTML resume that is:
- Visually professional and modern
- Fully ATS-parseable
- Tailored specifically to the job description
- Ready to print or export as PDF

---

INPUT DATA:

Resume Data:
${resume}

Self Description:
${selfDescription}

Job Description:
${jobDescription}

---

DESIGN REQUIREMENTS:

1. Use a clean single-column or subtle two-column layout.
2. Use an embedded <style> block inside <head> with:
   - Font: 'Segoe UI', Arial, or sans-serif
   - Primary color: #2C3E50 (dark navy) for headings
   - Accent color: #2980B9 (blue) for name and section borders
   - Font sizes: Name 28px, Section headers 14px bold uppercase, Body 12px
   - Subtle horizontal rule or left-border accent under each section heading
   - Adequate white space and line-height: 1.6
   - Page-ready: max-width 850px, margin auto, padding 40px
   - Print-friendly: @media print styles included
3. Structure layout as:
   - Header: Full Name (large), contact info in one line (email | phone | LinkedIn | GitHub)
   - Sections in this order (skip if no data): Professional Summary, Technical Skills, Experience, Projects, Education, Achievements, Certifications

---

CONTENT REQUIREMENTS:

1. Professional Summary: 3-4 impactful sentences tailored to the job description using keywords from the JD.
2. Technical Skills: Grouped by category (Languages, Frontend, Backend, Databases, Tools). Use inline comma-separated lists, NOT bullet points, for ATS compatibility.
3. Experience: Use strong action verbs. Quantify impact where possible (e.g., "Reduced load time by 40%"). Format: Company | Role | Duration.
4. Projects: Highlight tech stack used. Lead with the most impressive/relevant project first. Include 2-3 bullet points per project.
5. Education: Degree, University, Year. Include CGPA only if strong.
6. Achievements: Specific, quantified where possible (e.g., "Ranked Top 150 of 3000+ students").
7. Use keywords from the job description naturally throughout.
8. Do NOT fabricate any information. Only use what is provided.
9. Improve phrasing and professionalism of existing content.

---

HTML OUTPUT RULES:

1. Return a COMPLETE HTML document (<!DOCTYPE html> through </html>).
2. All CSS must be embedded in a <style> tag inside <head>.
3. No external CSS links, no JavaScript, no images, no icons.
4. Use semantic tags: <header>, <section>, <h1>, <h2>, <h3>, <ul>, <li>, <p>.
5. Each section must have a clear <h2> heading.
6. Must be directly renderable in a browser and printable as A4.
7. Do NOT include markdown, backticks, comments, or explanations.

---

Return ONLY valid JSON in EXACTLY this structure, nothing else:
{
  "html": "<!DOCTYPE html><html>...</html>"
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
        }
    });

    console.log("RAW GEMINI RESPONSE:");
    console.log(response.text);

    const jsoncontent = JSON.parse(response.text);
    const pdfbuffer = await generatepdffromhtml(jsoncontent.html);
    return pdfbuffer;

}

module.exports = { generateInterviewReport, getResumepdf };