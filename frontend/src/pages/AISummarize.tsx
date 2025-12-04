import { useState, useEffect } from "react";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { Appbar } from "../components/Appbar";
import { Sparkles, Link as LinkIcon, FileText, Copy, Check, Brain, Zap, BookOpen, Coffee } from "lucide-react";
import ReactMarkdown from "react-markdown";

const loadingTips = [
    { icon: Brain, text: "AI is reading and understanding the content..." },
    { icon: Zap, text: "Extracting key insights and main ideas..." },
    { icon: BookOpen, text: "Organizing information into a clear summary..." },
    { icon: Coffee, text: "Almost there! Polishing the final summary..." },
];

const funFacts = [
    "💡 The average person reads 200-250 words per minute",
    "📚 AI can process thousands of words in seconds",
    "🎯 Good summaries capture 20% of content with 80% of meaning",
    "🧠 Your brain processes images 60,000x faster than text",
    "⚡ This AI uses advanced language understanding",
    "🌍 Over 7,000 languages exist, but AI is learning them all",
];

export const AISummarize = () => {
    const [mode, setMode] = useState<"url" | "text">("url");
    const [input, setInput] = useState("");
    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [loadingStep, setLoadingStep] = useState(0);
    const [currentFact, setCurrentFact] = useState(0);

    useEffect(() => {
        let stepInterval: ReturnType<typeof setInterval>;
        let factInterval: ReturnType<typeof setInterval>;
        
        if (loading) {
            stepInterval = setInterval(() => {
                setLoadingStep(prev => (prev + 1) % loadingTips.length);
            }, 3000);
            
            factInterval = setInterval(() => {
                setCurrentFact(prev => (prev + 1) % funFacts.length);
            }, 4000);
        }
        
        return () => {
            clearInterval(stepInterval);
            clearInterval(factInterval);
        };
    }, [loading]);

    const handleSummarize = async () => {
        if (!input.trim()) return;
        
        setLoading(true);
        setError("");
        setSummary("");
        setLoadingStep(0);
        
        try {
            const payload = mode === "url" ? { url: input } : { text: input };
            const token = localStorage.getItem("token");
            const res = await axios.post<{ summary?: string; error?: string }>(`${BACKEND_URL}/api/v1/ai/summarize`, payload, {
                headers: {
                    Authorization: token
                }
            });
            if (res.data.error) {
                setError(res.data.error);
            } else {
                setSummary(res.data.summary || "");
            }
        } catch (e: unknown) {
            const errorMessage = (e as { response?: { data?: { error?: string } } })?.response?.data?.error || "Failed to generate summary. Please try again.";
            setError(errorMessage);
            console.error(e);
        }
        setLoading(false);
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const CurrentIcon = loadingTips[loadingStep].icon;

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
            <Appbar />
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg shadow-blue-500/30 mb-6">
                        <Sparkles className="text-white" size={32} />
                    </div>
                    <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                        AI Summarizer
                    </h1>
                    <p className="text-slate-600 dark:text-slate-400 text-lg max-w-lg mx-auto">
                        Instantly summarize articles, blog posts, or any text content with the power of AI.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8">
                    <div className="flex gap-4 mb-8 justify-center">
                        <button 
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                                mode === 'url' 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setMode("url")}
                            disabled={loading}
                        >
                            <LinkIcon size={20} />
                            URL
                        </button>
                        <button 
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 cursor-pointer ${
                                mode === 'text' 
                                ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/30' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }`}
                            onClick={() => setMode("text")}
                            disabled={loading}
                        >
                            <FileText size={20} />
                            Text
                        </button>
                    </div>

                    <div className="mb-8">
                        {mode === "url" ? (
                            <input 
                                type="text" 
                                placeholder="Paste the URL here..."
                                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                        ) : (
                            <textarea 
                                placeholder="Paste your text here..."
                                className="w-full p-4 h-48 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none text-slate-900 dark:text-white placeholder-slate-400"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                        )}
                    </div>

                    <button 
                        onClick={handleSummarize}
                        disabled={loading || !input.trim()}
                        className="w-full bg-gradient-to-r from-slate-900 to-slate-800 dark:from-blue-600 dark:to-blue-500 hover:from-slate-800 hover:to-slate-700 dark:hover:from-blue-500 dark:hover:to-blue-400 text-white font-bold py-4 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                    >
                        <Sparkles size={20} />
                        Summarize
                    </button>

                    {loading && (
                        <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-800/50 rounded-2xl border border-blue-100 dark:border-slate-700">
                            <div className="flex flex-col items-center text-center">
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center animate-pulse">
                                        <CurrentIcon className="text-white" size={36} />
                                    </div>
                                    <div className="absolute inset-0 w-20 h-20 rounded-full border-4 border-blue-500/30 animate-ping" />
                                </div>
                                
                                <p className="text-lg font-semibold text-slate-800 dark:text-white mb-2 transition-all duration-500">
                                    {loadingTips[loadingStep].text}
                                </p>
                                
                                <div className="flex gap-2 mb-6">
                                    {loadingTips.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                idx === loadingStep 
                                                    ? 'w-8 bg-blue-600' 
                                                    : idx < loadingStep 
                                                        ? 'bg-blue-400' 
                                                        : 'bg-slate-300 dark:bg-slate-600'
                                            }`}
                                        />
                                    ))}
                                </div>
                                
                                <div className="bg-white/50 dark:bg-slate-700/50 px-6 py-3 rounded-xl">
                                    <p className="text-sm text-slate-600 dark:text-slate-300 transition-all duration-500">
                                        {funFacts[currentFact]}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-100 dark:border-red-900/50 text-center">
                            {error}
                        </div>
                    )}

                    {summary && (
                        <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
                                        <Sparkles className="text-white" size={18} />
                                    </div>
                                    AI Summary
                                </h2>
                                <button
                                    onClick={handleCopy}
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                                >
                                    {copied ? (
                                        <>
                                            <Check size={16} className="text-green-500" />
                                            Copied!
                                        </>
                                    ) : (
                                        <>
                                            <Copy size={16} />
                                            Copy
                                        </>
                                    )}
                                </button>
                            </div>
                            <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800/80 dark:to-slate-800/50 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-inner">
                                <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-slate-900 dark:prose-headings:text-white prose-p:text-slate-700 dark:prose-p:text-slate-300 prose-strong:text-slate-900 dark:prose-strong:text-white prose-ul:text-slate-700 dark:prose-ul:text-slate-300 prose-li:text-slate-700 dark:prose-li:text-slate-300">
                                    <ReactMarkdown>{summary}</ReactMarkdown>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
