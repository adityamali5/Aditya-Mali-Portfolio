import React from 'react';
import { Rocket, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Experience: React.FC = () => {
  const { data } = usePortfolio();
  const experiences = data.experience;

  return (
    <section id="experience" className="pt-0 pb-20 lg:pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Experience & Internships</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-amber-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto relative">
          {/* Vertical connecting line */}
          <div className="absolute left-4 sm:left-8 top-6 bottom-6 w-0.5 bg-gradient-to-b from-cyan-500 via-purple-500 to-emerald-500/20"></div>

          {experiences.map((exp) => (
            <div key={exp.id} className="relative pl-12 sm:pl-20 mb-12 group">
              {/* Timeline Dot */}
              <div className="absolute left-2 sm:left-6 -top-1 w-5 h-5 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center glow-cyan group-hover:scale-125 transition-transform duration-300"></div>

              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-cyan-500/30 glow-cyan">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-800">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                      <span>{exp.role}</span>
                    </h3>
                    <div className="text-cyan-400 font-semibold text-sm sm:text-base mt-0.5 flex items-center gap-2">
                      <Rocket className="w-4 h-4 text-cyan-400" />
                      <span>{exp.organization}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {exp.programTag && (
                      <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-medium">
                        {exp.programTag}
                      </span>
                    )}
                    {exp.typeTag && (
                      <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono">
                        {exp.typeTag}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-5 space-y-4 text-slate-300 text-sm sm:text-base leading-relaxed">
                  <p>
                    {exp.description}
                  </p>

                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <ul className="space-y-2.5 text-sm text-slate-300">
                      {exp.bulletPoints.map((bp, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-1" />
                          <span>{bp}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="pt-3 flex flex-wrap gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-800">React & Web Dashboards</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-purple-300 border border-slate-800">Space Telemetry Logic</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-amber-300 border border-slate-800">RESTful Architecture</span>
                    <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-emerald-300 border border-slate-800">Python Systems</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
};
