import { useState, useRef, useEffect } from "react";
import { useInterview } from "../hooks/useInterview";
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/hooks/useAuth';  // FIX: use import not require

const Home = () => {
  const { user, handlelogout } = useAuth();
  const [fileName, setFileName] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [selfDesc, setSelfDesc] = useState("");
  const fileRef = useRef();
  const navigate = useNavigate();

  const onLogout = async () => {
    await handlelogout();
    navigate('/login');
  };

  const { loading, generateReport, getAllReports, reports } = useInterview();

  useEffect(() => {
    getAllReports();
  }, []);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) setFileName(file.name);
  };

  const handleGenerateReport = async () => {
    const resumefile = fileRef.current.files[0];
    const data = await generateReport({ jobDescription: jobDesc, selfDescription: selfDesc, resume: resumefile });
    navigate(`/interview/${data._id}`);
  };

  // FIX: only ONE return, logout button added in header
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-4">
            <span className="text-zinc-400">Welcome, {user?.username}</span>
            <button
              onClick={onLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg active:scale-95 cursor-pointer text-sm"
            >
              Logout
            </button>
          </div>
          <h1 className="text-5xl font-bold mb-4">AI Interview Preparation</h1>
          <p className="text-zinc-400 max-w-xl mx-auto">
            Upload your resume, add the job description,
            and get interview questions, skill-gap analysis,
            and a preparation roadmap.
          </p>
        </div>

        {/* Resume Upload */}
        <div className="mb-6">
          <label className="block text-sm text-zinc-300 mb-2">Resume</label>
          <div
            onClick={() => fileRef.current.click()}
            className="border border-zinc-800 bg-zinc-900 rounded-2xl p-8 text-center cursor-pointer hover:border-zinc-700 transition"
          >
            <input
              type="file"
              hidden
              ref={fileRef}
              accept=".pdf,.doc,.docx"
              onChange={handleFile}
            />
            {fileName ? (
              <p className="text-emerald-400">{fileName}</p>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 flex items-center justify-center mx-auto mb-4 bg-green-300 rounded-full p-1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 8.25H7.5a2.25 2.25 0 0 0-2.25 2.25v9a2.25 2.25 0 0 0 2.25 2.25h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25H15m0-3-3-3m0 0-3 3m3-3V15" />
                </svg>
                <p className="font-medium underline text-emerald-500">Upload Resume</p>
                <p className="text-sm text-zinc-500 mt-2">PDF</p>
              </>
            )}
          </div>
        </div>

        {/* Job Description */}
        <div className="mb-6">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-zinc-300">Job Description</label>
            <span className="text-xs text-zinc-500">{jobDesc.length}</span>
          </div>
          <textarea
            value={jobDesc}
            onChange={(e) => setJobDesc(e.target.value)}
            rows={8}
            placeholder="Paste job description..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Self Description */}
        <div className="mb-8">
          <div className="flex justify-between mb-2">
            <label className="text-sm text-zinc-300">About Yourself</label>
            <span className="text-xs text-zinc-500">{selfDesc.length}</span>
          </div>
          <textarea
            value={selfDesc}
            onChange={(e) => setSelfDesc(e.target.value)}
            rows={8}
            placeholder="Tell us about yourself..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <button
          disabled={!fileName || !jobDesc || !selfDesc || loading}
          onClick={handleGenerateReport}
          className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed text-black font-semibold transition cursor-pointer"
        >
          {loading ? "Generating..." : "Generate Interview Report"}
        </button>

        {/* Previous Reports */}
        {reports?.length > 0 && (
          <div className="mt-10">
            <h2 className="text-lg font-semibold text-white mb-4">Previous Reports</h2>
            <div className="space-y-3">
              {reports.map((report) => (
                <div
                  key={report._id}
                  onClick={() => navigate(`/interview/${report._id}`)}
                  className="border border-zinc-800 bg-zinc-900 rounded-xl px-5 py-4 flex items-center justify-between cursor-pointer hover:border-zinc-600 transition"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-200">{report.title}</p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 text-zinc-500 shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                  </svg>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </main>
  );
};

export default Home;