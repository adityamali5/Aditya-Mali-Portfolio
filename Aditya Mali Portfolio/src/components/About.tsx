import React from 'react';
import { Cpu, Gamepad2, Globe, Sparkles, Rocket, GraduationCap } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const About: React.FC = () => {
  const { data } = usePortfolio();
  const { about } = data;

  return (
    <section
      id="about"
      style={{ paddingTop: '43px', paddingBottom: '82px' }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">{about.heading || 'About Aditya Mali'}</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Main Story Card */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 space-y-6 flex flex-col justify-between">
            <div className="space-y-4 text-slate-300 leading-relaxed text-base sm:text-lg">
              <p>
                {about.paragraph1}
              </p>
              <p>
                {about.paragraph2}
              </p>
              <p>
                {about.paragraph3}
              </p>
              <p>
                {about.paragraph4}
              </p>
            </div>

            {/* Credential summary pills */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                  <Rocket className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-cyan-400 mb-0.5">CURRENT ROLE</div>
                  <div className="font-bold text-white text-base">{about.currentRoleTitle}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{about.currentRoleSub}</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-mono text-purple-400 mb-0.5">{about.institutionTitle || 'INSTITUTION'}</div>
                  <div className="font-bold text-white text-base">{about.institutionName}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{about.institutionSub}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Offerings & Philosophies */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-cyan-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-105 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <span>AI-Driven Web Development</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Harnessing modern AI workflows ("vibe coding") to write clean architectures, integrate conversational AI agents, and build intelligent web tools in fraction of normal timeframes.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-purple-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-105 transition-transform">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Game & Interactive Tools</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Architect of interactive pedagogical tools like <span className="text-cyan-300 font-medium">Arrow Puzzle</span>, blending algorithmic thinking, spatial geometry, and delightful UX.
              </p>
            </div>

            <div className="glass-card rounded-3xl p-6 sm:p-7 border border-slate-800 hover:border-emerald-500/40 transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-105 transition-transform">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Custom Websites For You</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Looking for an eye-catching business site, high-conversion landing page, or personal portfolio? I design, code, and deploy end-to-end responsive web experiences.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
