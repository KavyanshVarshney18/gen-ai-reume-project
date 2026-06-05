import axios from "axios";

const api = axios.create({
    baseURL : "https://gen-ai-reume-project-1.onrender.com",
    withCredentials : true
})


export const generateInterviewReport = async ({resume,jobDesc,selfDesc}) => {

    //to send file from frontend to backend we need to use FormData
    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("jobDesc", jobDesc);
    formData.append("selfDesc", selfDesc);

    const response = await api.post("/api/interview/", formData, {
        headers : {
            "Content-Type" : "multipart/form-data"
        }
    });

    return response.data;

}



export const getInterviewReportById = async (interviewId) => {
    const response = await api.get(`/api/interview/report/${interviewId}`);
    return response.data;
}

export const getAllInterviewReports = async () => { 
    const response = await api.get("/api/interview/");
    return response.data;
}

export const generateResumePDF = async ({ interviewReportId }) => {
    const response = await api.post(
        `/api/interview/resume/pdf/${interviewReportId}`,{},  
        {
            responseType: "arraybuffer"  
        }
    );
    return response;  // 
}
