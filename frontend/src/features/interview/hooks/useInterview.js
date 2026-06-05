import {getAllInterviewReports,getInterviewReportById,generateInterviewReport,generateResumePDF} from "../services/interview.api"
import { InterviewContext } from "../interview.context"
import { useContext } from "react"



export const useInterview = () => {
    const context = useContext(InterviewContext);
    if(!context){
        throw new Error("use interview must be within interview provider")
    }
    const {loading, setloading, report, setReport, reports, setReports} = context;

    const generateReport = async ({ jobDescription, selfDescription, resume }) => {
    setloading(true);

    try {
        const data = await generateInterviewReport({
            jobDesc: jobDescription,
            selfDesc: selfDescription,
            resume
        });

        setReport(data.interviewReport);
        return data.interviewReport;
    } catch (err) {
        console.error("Failed to generate interview report", err);
    } finally {
        setloading(false);
    }
    }

    const getReportById = async (interviewId) => {
        setloading(true);
        try{
           const data = await getInterviewReportById(interviewId);
            setReport(data.interviewReport);
            return data.interviewReport;
        }   
        catch(err){
            console.error("Failed to fetch interview report",err);
        }
        finally{
            setloading(false);
        }
    }

    const getAllReports = async () => {
        
        setloading(true);
        try{
            const data = await getAllInterviewReports();
            setReports(data.interviewReports);

            return data.interviewReports;
        }
        catch(err){
            console.error("Failed to fetch interview reports",err);
        }
        finally{
            setloading(false);
        }
    }

    const handleGenerateResumePdf = async (interviewReportId) => {
    setloading(true)
    try {
        const response = await generateResumePDF({ interviewReportId })
        
        const blob = new Blob([response.data], { type: "application/pdf" })  // ✅ response.data
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", `resume_${interviewReportId}.pdf`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
    } catch (error) {
        console.error("Failed to generate resume PDF:", error)
    } finally {
        setloading(false)
    }
    }

    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getAllReports,
        handleGenerateResumePdf
    }
}