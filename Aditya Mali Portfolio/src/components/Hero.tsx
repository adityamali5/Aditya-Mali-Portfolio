import React from 'react';
import { ArrowRight, MessageSquare } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Hero: React.FC = () => {
  const { data } = usePortfolio();
  const { hero } = data;

  return (
    <section id="home" className="min-h-[calc(100vh-5rem)] flex items-center justify-center relative py-12 lg:py-20 bg-grid-pattern">
      {/* Ambient gradient glows */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-cyan-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-600/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Hero Left Column */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Developer Photo right on top of Hi I'm Aditya section - Big & High Impact */}
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="relative group shrink-0">
                <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-70 blur-xl group-hover:opacity-100 transition duration-500 animate-pulse-slow"></div>
                <div className="relative w-[326px] h-[326px] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border-0">
                  <img
                    src={hero.photoUrl || '/src/assets/images/aditya_mali_portrait_1791703483959.jpg'}
                    alt={`${hero.name} - ${hero.roleTitle}`}
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/src/assets/images/aditya_mali_portrait_1791703483959.jpg';
                    }}
                    style={{ width: '325.8px', borderWidth: '0px' }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </div>

            <h1
              style={{ fontStyle: 'normal', textDecorationLine: 'none', textAlign: 'left', fontSize: '74px' }}
              className="text-4xl sm:text-6xl lg:text-[74px] font-extrabold tracking-tight leading-[1.08] text-left"
            >
              Hi, I'm <br className="hidden sm:inline"/>
              <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">
                {hero.name}
              </span>
            </h1>

            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 font-light leading-relaxed">
              {hero.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <a
                href="#projects"
                className="px-6 sm:px-7 py-3.5 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              >
                <span>{hero.ctaText1 || 'Explore Projects & Games'}</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#contact"
                className="px-6 sm:px-7 py-3.5 rounded-xl font-semibold glass-card border border-slate-700 hover:border-cyan-400/50 hover:bg-white/5 text-slate-200 hover:text-white transition-all flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>{hero.ctaText2 || 'Want Me To Build Your Website?'}</span>
              </a>
            </div>

            {/* Highlights counter stats */}
            <div className="pt-6 grid grid-cols-3 gap-3 sm:gap-4 border-t border-slate-800/80 max-w-lg mx-auto lg:mx-0">
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-colors text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400">{hero.stat1Value}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{hero.stat1Label}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-purple-500/40 transition-colors text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-purple-400">{hero.stat2Value}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{hero.stat2Label}</div>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-emerald-500/40 transition-colors text-center sm:text-left">
                <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">{hero.stat3Value}</div>
                <div className="text-xs text-slate-400 mt-0.5 font-medium">{hero.stat3Label}</div>
              </div>
            </div>
          </div>

          {/* Hero Right Column: Enhanced & Expanded Terminal Code Block */}
          <div className="lg:col-span-5 flex justify-center w-full">
            <div className="relative w-full max-w-lg lg:max-w-xl">
              <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-600 opacity-40 blur-2xl animate-pulse-slow"></div>
              
              <div
                style={{ height: '900px' }}
                className="relative glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 glow-cyan shadow-2xl flex flex-col justify-between overflow-y-auto"
              >
                {/* Terminal Header */}
                <div>
                  <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-700/70">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3.5 h-3.5 rounded-full bg-rose-500/90 shadow-sm"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-amber-500/90 shadow-sm"></span>
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500/90 shadow-sm"></span>
                    </div>
                  </div>

                  {/* Written Code block simulation - More Big & Detailed */}
                  <div className="space-y-2.5 font-mono text-xs sm:text-sm md:text-[15px] text-slate-200 leading-relaxed">
                    <p><span className="text-purple-400">const</span> developer: <span className="text-amber-300">SoftwareEngineer</span> = &#123;</p>
                    <p className="pl-4">name: <span className="text-cyan-300">'{hero.name}'</span>,</p>
                    <p className="pl-4">institution: <span className="text-cyan-300">'RITP College'</span>,</p>
                    <p className="pl-4">course: <span className="text-teal-300">'Computer Engineering'</span>,</p>
                    <p className="pl-4">internship: <span className="text-amber-300">'ISRO (SPARK India Program)'</span>,</p>
                    <p className="pl-4">coreStack: [<span className="text-emerald-300">'TypeScript'</span>, <span className="text-emerald-300">'React'</span>, <span className="text-emerald-300">'Python'</span>, <span className="text-emerald-300">'Tailwind'</span>],</p>
                    <p className="pl-4">aiMethodology: <span className="text-pink-300">'Autonomous Vibe Coding'</span>,</p>
                    <p className="pl-4">flagshipProject: <span className="text-cyan-300">'Arrow Puzzle Game'</span>,</p>
                    <p className="pl-4">availableForClientWebsites: <span className="text-emerald-400">true</span>,</p>
                    <p className="pl-4">currentFocus: <span className="text-amber-200">'Building High-Impact Websites'</span></p>
                    <p>&#125;;</p>
                  </div>

                  {/* Terminal Execution Status */}
                  <div className="mt-5 pt-3.5 border-t border-slate-800/80 space-y-2 text-xs">
                    <div className="text-emerald-400 flex items-center gap-2">
                      <span className="font-bold">✔</span>
                      <span>Compilation: 0 errors • space-grade reliability verified</span>
                    </div>
                    <div className="text-cyan-400/90 flex items-center gap-1.5 font-mono">
                      <span>➜</span>
                      <span>ready to build custom websites & AI web applications</span>
                      <span className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle"></span>
                    </div>
                  </div>
                </div>

                {/* Floating tech badges & Footer Action */}
                <div className="mt-6 pt-5 border-t border-slate-800">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-800 text-cyan-300 text-xs font-mono">#ISRO</span>
                    <span className="px-3 py-1 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 text-xs font-mono">#AIWeb</span>
                    <span className="px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs font-mono">#ArrowPuzzle</span>
                    <span className="px-3 py-1 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 text-xs font-mono">#FullStack</span>
                    <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono">#RITP</span>
                  </div>
                  <a
                    href="#contact"
                    className="w-full block py-2.5 px-4 rounded-xl text-center text-xs font-mono font-semibold bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-colors"
                  >
                    $ ping aditya --request-website-quote
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
