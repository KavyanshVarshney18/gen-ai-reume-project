const pdfParse = require("pdf-parse");
const {generateInterviewReport , getResumepdf} = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.mode");
 

async function generateInterviewReportController(req, res) {
    try {

        if (!req.file) {
            return res.status(400).json({
                msg: "Resume file is required"
            });
        }

        const resumeData = await (
        new pdfParse.PDFParse(
            Uint8Array.from(req.file.buffer)
        )
        ).getText();

        // FIX: read both possible field names from frontend
        const jobDescription = req.body.jobDescription || req.body.jobDesc;
        const selfDescription = req.body.selfDescription || req.body.selfDesc;

        const interviewReportByai = await generateInterviewReport({
            resume: resumeData.text,
            selfDescription: selfDescription,
            jobDescription: jobDescription
        });

        console.log(
            "AI OBJECT:",
            JSON.stringify(interviewReportByai, null, 2)
        );

        const interviewReport = await interviewReportModel.create({
            user: req.user.id,

            title: interviewReportByai.title,

            resume: resumeData.text,
            selfDescription,
            jobDescription,

            matchScore: interviewReportByai.matchingscore,

            technicalquestion: interviewReportByai.technicalquestion,

            behaviouralQuestion: interviewReportByai.behaviouralquestion,

            skillGaps: interviewReportByai.skillgaps.map(item => ({
                skillGap: item.skillgap,
                severity: item.severity
            })),

            preparationPlan: interviewReportByai.preparationplan
        });

        return res.status(201).json({
            msg: "Interview report generated successfully",
            interviewReport
        });

    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Failed to generate interview report",
            error: err.message
        });
    }
}

async function getInterviewReportController(req, res) {
    const { interviewId } = req.params;

    try {
        const interviewReport = await interviewReportModel.findById(interviewId);

        if(!interviewReport) {
            return res.status(404).json({
                msg: "Interview report not found"
            });
        }

        return res.status(200).json({
            msg: "Interview report retrieved successfully",
            interviewReport
        });
    } catch (err) {
        console.error(err);

        return res.status(500).json({
            msg: "Failed to retrieve interview report",
            error: err.message
        });
    }
}

async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -_v -technicalquestion -behaviouralQuestion -skillGaps -preparationPlan');    
        return res.status(200).json({
            msg: "Interview reports retrieved successfully",
            interviewReports
        });
    } catch (err) {
        console.error(err); 
        return res.status(500).json({   
            msg: "Failed to retrieve interview reports",
            error: err.message
        });
    }   
}

// ✅ Add try/catch
async function generateresumepdfcontroller(req, res) {
    try {
        const { interviewReportId } = req.params;
        const interviewReport = await interviewReportModel.findById(interviewReportId);
        if (!interviewReport) {
            return res.status(404).json({ msg: "Interview report not found" });
        }
        const { resume, jobDescription, selfDescription } = interviewReport;
        const pdfBuffer = await getResumepdf({ resume, jobDescription, selfDescription });
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename=interview_report_${interviewReportId}.pdf`
        });
        return res.send(pdfBuffer);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ msg: "Failed to generate resume PDF", error: err.message });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportController,
    getAllInterviewReportsController,
    generateresumepdfcontroller
};