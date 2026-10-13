import React from 'react';
import { usePortfolio } from '../context/PortfolioContext';

export const Education: React.FC = () => {
  const { data } = usePortfolio();
  const { education } = data;

  return (
    <section id="education" className="pt-0 pb-20 lg:pb-24 relative bg-slate-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Education</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border border-slate-800 relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="pb-6 border-b border-slate-800">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                {education.degree}
              </h3>
              <p className="text-cyan-300 text-base font-semibold mt-1 flex items-center gap-2">
                <span>{education.college}</span>
                <span className="text-slate-600">•</span>
                <span className="text-xs text-slate-400 font-normal">{education.department}</span>
              </p>
            </div>

            <div className="pt-6 space-y-4">
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {education.description}
              </p>
              {education.areasOfInterest && (
                <p className="text-cyan-300 text-sm sm:text-base font-medium leading-relaxed pt-2">
                  Areas of Interest: <span className="text-slate-300 font-normal">{education.areasOfInterest.replace(/^Areas of Interest:\s*/i, '')}</span>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
