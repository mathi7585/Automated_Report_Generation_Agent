"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, FileCode2, Github, Loader2, Sparkles, AlertCircle } from "lucide-react";
import ReportViewer from "@/components/ReportViewer";

export default function Home() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ report: string; repoData: any } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate report");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen px-4 py-12 md:px-8 font-inter overflow-hidden pb-32">
      {/* Dynamic Background Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-12 print:hidden">
        {/* Header section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6 pt-12 md:pt-20"
        >
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-card border border-border/60 shadow-xl shadow-blue-500/10 rounded-2xl sm:rounded-3xl mb-4">
            <FileCode2 className="w-10 h-10 sm:w-12 sm:h-12 text-blue-500" />
            <span className="w-1 h-10 sm:h-12 bg-border/50 mx-4 sm:mx-6 rounded-full" />
            <Bot className="w-10 h-10 sm:w-12 sm:h-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight font-outfit text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-400">
            Intelligent Report <br className="hidden md:block" /> Generator
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
            Transform any public GitHub repository into a comprehensive, professionally structured academic or overview report in seconds.
          </p>
        </motion.div>

        {/* Input Form */}
        <motion.form
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="relative max-w-2xl mx-auto"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative flex flex-col sm:flex-row items-center bg-card/90 backdrop-blur-xl border border-border/80 rounded-2xl p-2 gap-2 shadow-2xl">
            <div className="flex-1 flex items-center px-4 w-full">
              <Github className="text-slate-400 mr-3" size={24} />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://github.com/owner/repository"
                required
                className="w-full bg-transparent border-none text-white text-lg placeholder:text-slate-500 focus:outline-none focus:ring-0 py-3"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !url}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-4 sm:py-3.5 rounded-xl font-semibold text-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={20} className="text-blue-200 group-hover:text-white transition-colors" />
                  Generate
                </>
              )}
            </button>
          </div>
        </motion.form>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 text-red-400 max-w-2xl mx-auto rounded-xl"
          >
            <AlertCircle size={20} />
            <p>{error}</p>
          </motion.div>
        )}

        {/* Loading State Skeleton */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-2xl mx-auto mt-16 space-y-6 text-center"
          >
            <div className="inline-block p-4 rounded-full bg-blue-500/10 mb-4 animate-pulse">
              <Bot className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-2xl font-outfit font-semibold text-slate-200">AI is reading the repository...</h3>
            <p className="text-slate-400">This might take 10-20 seconds as we analyze the codebase and craft your report.</p>
            <div className="w-full max-w-md mx-auto h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 w-1/3 animate-[indeterminate_1.5s_infinite_linear] rounded-full" />
            </div>
          </motion.div>
        )}
      </div>

      {/* Result Viewer */}
      {result && !isLoading && (
        <ReportViewer markdown={result.report} repoData={result.repoData} />
      )}

      {/* Simple Keyframes style added directly for loader */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @keyframes indeterminate {
          0% { transform: translateX(-100%); width: 30%; }
          50% { width: 50%; }
          100% { transform: translateX(300%); width: 30%; }
        }
      `}} />
    </main>
  );
}
