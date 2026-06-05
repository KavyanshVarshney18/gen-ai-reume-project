import { useState, useEffect } from "react";
import { useInterview } from "../hooks/useInterview";
import { useParams, useNavigate } from "react-router";

const severityColor = (s) =>
  ({ low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", medium: "text-yellow-400 bg-yellow-400/10 border-yellow-400/30", high: "text-red-400 bg-red-400/10 border-red-400/30" }[s] ?? "text-zinc-400");

const ScoreRing = ({ score }) => {
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = score >= 75 ? "#10b981" : score >= 50 ? "#f59e0b" : "#ef4444";
  return (
    <svg width="140" height="140" viewBox="0 0 140 140" className="rotate-[-90deg]">
      <circle cx="70" cy="70" r={r} fill="none" stroke="#27272a" strokeWidth="10" />
      <circle
        cx="70" cy="70" r={r} fill="none"
        stroke={color} strokeWidth="10"
        strokeDasharray={circ}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 1s ease" }}
      />
    </svg>
  );
};

const AccordionItem = ({ index, question, intention, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-zinc-800 rounded-xl overflow-hidden bg-zinc-900 mb-3">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-start gap-4 p-5 text-left hover:bg-zinc-800/50 transition"
      >
        <span className="shrink-0 mt-0.5 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-center">
          {index}
        </span>
        <span className="flex-1 text-sm text-zinc-200 font-medium leading-relaxed">{question}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          strokeWidth={2} stroke="currentColor"
          className={`shrink-0 w-4 h-4 text-zinc-500 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-zinc-800">
          <div className="mt-4 mb-3 p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/40">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">Interviewer's Intention</p>
            <p className="text-sm text-zinc-300">{intention}</p>
          </div>
          <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
            <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Suggested Answer</p>
            <p className="text-sm text-zinc-300 leading-relaxed">{answer}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const Section = ({ title, icon, children }) => (
  <section className="mb-10">
    <div className="flex items-center gap-2 mb-5">
      <span className="text-emerald-400">{icon}</span>
      <h2 className="text-lg font-semibold text-white">{title}</h2>
    </div>
    {children}
  </section>
);

const Interview = () => {
  const [activeTab, setActiveTab] = useState("technical");
  const [pdfLoading, setPdfLoading] = useState(false);
  const { interviewId } = useParams();
  const navigate = useNavigate();
  const { report, loading, getReportById, handleGenerateResumePdf } = useInterview();

  useEffect(() => {
    if (interviewId) {
      getReportById(interviewId);
    }
  }, [interviewId]);

  // const handleGenerateResumePdf = async (id) => {
  //   setPdfLoading(true);
  //   try {
  //     const response = await handleGenerateResumePdf(id);
  //     const blob = new Blob([response.data], { type: "application/pdf" });
  //     const url = window.URL.createObjectURL(blob);
  //     const link = document.createElement("a");
  //     link.href = url;
  //     link.setAttribute("download", `resume_${id}.pdf`);
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(url);
  //   } catch (error) {
  //     console.error("Failed to generate resume PDF:", error);
  //   } finally {
  //     setPdfLoading(false);
  //   }
  // };

  const tabs = [
    { id: "technical", label: "Technical" },
    { id: "behavioural", label: "Behavioural" },
    { id: "gaps", label: "Skill Gaps" },
    { id: "plan", label: "Prep Plan" },
  ];

  const score = report?.matchScore ?? 0;
  const scoreLabel = score >= 75 ? "Strong Match" : score >= 50 ? "Moderate Match" : "Needs Work";
  const scoreColor = score >= 75 ? "text-emerald-400" : score >= 50 ? "text-yellow-400" : "text-red-400";

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-zinc-400">Loading your report...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="max-w-3xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">Interview Report</h1>
          <p className="text-zinc-400 mx-auto">
            Your personalized interview preparation report with questions, skill gaps, and a day-by-day plan.
          </p>
        </div>

        {/* Score card */}
        <div className="border border-zinc-800 bg-zinc-900 rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8 mb-10">
          <div className="relative shrink-0">
            <ScoreRing score={score} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{score}</span>
              <span className="text-xs text-zinc-500">/ 100</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-widest mb-1">Resume Match Score</p>
            <h3 className={`text-2xl font-semibold mb-2 ${scoreColor}`}>{scoreLabel}</h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Your resume aligns well with the job description. Review the sections below to sharpen your preparation and cover any skill gaps before the interview.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-8">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition ${
                activeTab === t.id ? "bg-emerald-500 text-black" : "text-zinc-400 hover:text-white"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Technical Questions */}
        {activeTab === "technical" && (
          <Section
            title="Technical Questions"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" />
              </svg>
            }
          >
            {report?.technicalquestion?.map((q, i) => (
              <AccordionItem key={i} index={i + 1} {...q} />
            ))}
          </Section>
        )}

        {/* Behavioural Questions */}
        {activeTab === "behavioural" && (
          <Section
            title="Behavioural Questions"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
            }
          >
            {report?.behaviouralQuestion?.map((q, i) => (
              <AccordionItem key={i} index={i + 1} {...q} />
            ))}
          </Section>
        )}

        {/* Skill Gaps */}
        {activeTab === "gaps" && (
          <Section
            title="Skill Gaps"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            }
          >
            <div className="space-y-3">
              {report?.skillGaps?.map((g, i) => (
                <div key={i} className="flex items-center justify-between border border-zinc-800 bg-zinc-900 rounded-xl px-5 py-4">
                  <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                    <span className="text-sm text-zinc-200">{g.skillGap}</span>
                  </div>
                  <span className={`text-xs font-semibold uppercase px-3 py-1 rounded-full border ${severityColor(g.severity)}`}>
                    {g.severity}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        {/* Preparation Plan */}
        {activeTab === "plan" && (
          <>
            <Section
              title="5-Day Preparation Plan"
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                </svg>
              }
            >
              <div className="space-y-4">
                {report?.preparationPlan?.map((plan, i) => (
                  <div key={i} className="border border-zinc-800 bg-zinc-900 rounded-xl px-5 py-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 rounded-full bg-emerald-600 text-white text-sm font-bold flex items-center justify-center shrink-0">
                        {plan.day}
                      </span>
                      <h3 className="text-sm font-semibold text-zinc-100">{plan.focus}</h3>
                    </div>
                    <ul className="space-y-1.5 pl-11">
                      {plan.tasks?.map((task, j) => (
                        <li key={j} className="flex items-start gap-2 text-sm text-zinc-400">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {task}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </Section>

            {/* Generate Resume Card — below prep plan */}
            <div className="mt-6 border border-zinc-800 bg-zinc-900 rounded-xl px-6 py-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">Ready to apply?</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Generate a tailored resume based on your profile and this job description.</p>
              </div>
              <button
                onClick={() => handleGenerateResumePdf(report._id)}
                disabled={pdfLoading}
                className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shrink-0 ml-6"
              >
                {pdfLoading ? (
                  <>
                    <svg className="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Generating...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m.75 12 3 3m0 0 3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                    Generate Resume
                  </>
                )}
              </button>
            </div>
          </>
        )}

        {/* Back button */}
        <button
          onClick={() => navigate("/")}
          className="w-full mt-8 py-4 rounded-xl border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white font-semibold transition cursor-pointer"
        >
          ← Generate New Report
        </button>

      </div>
    </main>
  );
};

export default Interview;