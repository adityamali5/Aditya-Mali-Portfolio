import React from 'react';
import { Brain, Target, Users, Sparkles, Layers } from 'lucide-react';

export const ArrowPuzzleLab: React.FC = () => {
  return (
    <div className="glass-card rounded-3xl p-6 sm:p-9 border border-cyan-500/30 glow-cyan mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Project Info Panel */}
        <div className="lg:col-span-7 space-y-5">
          <h3 className="text-2xl sm:text-4xl font-extrabold text-white flex items-center gap-3">
            <span>Arrow Puzzle</span>
          </h3>
          
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A strategic puzzle game engineered specifically for young school students to sharpen their logical thinking, spatial awareness, and concentration. Players analyze arrow directional paths to align the grid towards mission targets without collisions.
          </p>

          <div className="flex flex-wrap gap-2 pt-1">
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-cyan-300 border border-slate-700">Strategic Logic</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-purple-300 border border-slate-700">AI-Assisted Vibe Coded</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-amber-300 border border-slate-700">Pedagogical Design</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-emerald-300 border border-slate-700">Pure React Engine</span>
            <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-xs font-mono text-sky-300 border border-slate-700">Spatial Geometry</span>
          </div>
        </div>

        {/* Project Highlights & Architecture */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5 hover:border-cyan-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Spatial Cognition Engine</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                Nurtures spatial reasoning in young learners by requiring mental simulation of 90° and 180° rotations.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5 hover:border-purple-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
              <Target className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Algorithmic Cascade Logic</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                Multi-level neighbor propagation logic powered by reactive immutable state architectures.
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3.5 hover:border-emerald-500/30 transition-colors">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Classroom Pedagogical Design</div>
              <div className="text-xs text-slate-400 mt-1 leading-relaxed">
                Distraction-free UX structured specifically to enhance student attention span and logical problem-solving.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
