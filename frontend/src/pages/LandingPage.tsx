import { useNavigate } from "react-router-dom";
import hero3d from "../assets/hero_3d.png";
import logo from "../assets/logo.png";

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-sans selection:bg-blue-200 selection:text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Inkspire Logo"
              className="w-10 h-10 object-contain drop-shadow-md"
            />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              Inkspire
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={() => navigate("/signin")}
              className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="px-6 py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-blue-600 rounded-xl hover:bg-slate-800 dark:hover:bg-blue-700 transition-all transform hover:scale-105 shadow-xl shadow-slate-900/20 cursor-pointer"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-cyan-100/50 dark:bg-cyan-900/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-blue-100/50 dark:bg-blue-900/20 rounded-full blur-[100px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="flex flex-col justify-center text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm w-fit mx-auto lg:mx-0 mb-8 animate-fade-in-up">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">The Future of Publishing</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-8 leading-[1.1] animate-fade-in-up delay-100">
              Craft stories that <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-600">
                defy dimensions.
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up delay-200">
              Experience a writing platform designed for the modern age. 
              Immersive, distraction-free, and beautifully crafted for your ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up delay-300">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-105 transition-all duration-300 cursor-pointer"
              >
                Start Writing Free
              </button>
              <button
                onClick={() => navigate("/signin")}
                className="px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-bold border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-300 shadow-sm cursor-pointer"
              >
                Explore Stories
              </button>
            </div>
          </div>
          
          <div className="relative lg:h-[600px] flex items-center justify-center animate-float">
             {/* 3D Hero Image */}
            <div className="relative w-full max-w-lg aspect-square">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-blue-500/20 rounded-full blur-[80px]" />
                <img 
                    src={hero3d} 
                    alt="3D Abstract Art" 
                    className="relative z-10 w-full h-full object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Cards */}
                <div className="absolute -left-8 top-1/4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700 rounded-2xl shadow-2xl animate-float-delayed hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyan-100 dark:bg-cyan-900/30 flex items-center justify-center text-cyan-600 dark:text-cyan-400">
                            ✍️
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">Seamless Editor</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Just start typing</div>
                        </div>
                    </div>
                </div>

                <div className="absolute -right-4 bottom-1/4 p-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl border border-white/40 dark:border-slate-700 rounded-2xl shadow-2xl animate-float hidden md:block">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            🚀
                        </div>
                        <div>
                            <div className="text-sm font-bold text-slate-800 dark:text-white">Instant Publish</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400">Share with the world</div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          opacity: 0;
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 5s ease-in-out infinite;
          animation-delay: 1s;
        }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-700 { animation-delay: 0.7s; }
      `}</style>
    </div>
  );
};
