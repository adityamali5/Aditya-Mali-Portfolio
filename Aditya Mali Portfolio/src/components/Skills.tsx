import React from 'react';
import { Bot, Layout, Server, Rocket, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Skills: React.FC = () => {
  const { data } = usePortfolio();
  const categories = data.skills;

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'ai':
        return <Bot className="w-6 h-6 text-cyan-400" />;
      case 'frontend':
        return <Layout className="w-6 h-6 text-blue-400" />;
      case 'backend':
        return <Server className="w-6 h-6 text-purple-400" />;
      default:
        return <Rocket className="w-6 h-6 text-amber-400" />;
    }
  };

  return (
    <section
      id="skills"
      style={{ paddingTop: '0px', paddingBottom: '80px' }}
      className="relative bg-slate-950/60"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Skills & Competencies</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-purple-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className={`glass-card rounded-3xl p-6 border ${cat.borderColor || 'border-slate-800'} transition-all duration-300 group hover:-translate-y-1.5 flex flex-col justify-between`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  {getCategoryIcon(cat.id)}
                </div>
                <h3 className="text-lg font-bold text-white mb-1.5">{cat.title}</h3>
                <p className="text-xs text-slate-400 mb-2 leading-relaxed">{cat.subtitle}</p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                <span>Production Ready</span>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
