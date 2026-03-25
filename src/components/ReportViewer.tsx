"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Download, FileText, Code2, Link as LinkIcon, DownloadCloud } from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { motion } from "framer-motion";

interface ReportViewerProps {
    markdown: string;
    repoData: any;
}

export default function ReportViewer({ markdown, repoData }: ReportViewerProps) {
    const reportRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const downloadPDF = () => {
        window.print();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl mx-auto mt-12 mb-20"
        >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 pb-6 border-b border-border/50 gap-4 print:hidden">
                <div>
                    <h2 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300 font-outfit">
                        Generation Complete
                    </h2>
                    <p className="text-slate-400 text-sm flex items-center gap-2 mt-2">
                        <Code2 size={16} /> {repoData?.language || "Mixed"} •
                        <FileText size={16} /> {repoData?.treePaths?.length || 0} files analyzed
                    </p>
                </div>

                <button
                    onClick={downloadPDF}
                    disabled={downloading}
                    className="flex items-center gap-2 px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 active:bg-indigo-700 text-white rounded-full font-medium transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                    {downloading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        >
                            <DownloadCloud size={18} />
                        </motion.div>
                    ) : (
                        <Download size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    )}
                    {downloading ? "Generating PDF..." : "Export to PDF"}
                </button>
            </div>

            <div
                className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden print:bg-white print:border-none print:shadow-none print:p-0"
            >
                {/* Subtle decorative glows inside the card */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

                <div
                    ref={reportRef}
                    className="relative z-10 prose prose-invert prose-blue max-w-none text-slate-300 font-inter"
                >
                    <div className="mb-10 text-center">
                        <h1 className="text-4xl text-white font-extrabold mb-4 font-outfit tracking-tight">Project Report: {repoData?.repo || "Unknown"}</h1>
                        <p className="text-xl text-slate-400 font-light flex items-center justify-center gap-2">
                            <LinkIcon size={18} /> Owner: {repoData?.owner || "Unknown"}
                        </p>
                    </div>

                    <ReactMarkdown
                        components={{
                            h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-12 mb-6 font-outfit border-b border-border/30 pb-3" {...props} />,
                            h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-slate-100 mt-8 mb-4 font-outfit" {...props} />,
                            p: ({ node, ...props }) => <p className="mb-6 leading-relaxed text-[17px]" {...props} />,
                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-6 space-y-2 text-slate-300" {...props} />,
                            li: ({ node, ...props }) => <li className="" {...props} />,
                            strong: ({ node, ...props }) => <strong className="font-semibold text-indigo-300" {...props} />,
                            code: ({ node, inline, ...props }: any) =>
                                inline ? (
                                    <code className="bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props} />
                                ) : (
                                    <div className="rounded-xl overflow-hidden mb-6 border border-border/50">
                                        <pre className="bg-[#0b1121] p-4 overflow-x-auto text-sm font-mono text-slate-300" {...props} />
                                    </div>
                                ),
                            blockquote: ({ node, ...props }) => (
                                <blockquote className="border-l-4 border-indigo-500 pl-6 italic text-slate-400 my-8 py-2 bg-indigo-500/5 rounded-r-xl" {...props} />
                            )
                        }}
                    >
                        {markdown}
                    </ReactMarkdown>
                </div>
            </div>
        </motion.div>
    );
}
