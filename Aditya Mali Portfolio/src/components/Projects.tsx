import React from 'react';
import { ArrowPuzzleLab } from './ArrowPuzzleLab';

export const Projects: React.FC = () => {
  return (
    <section
      id="projects"
      style={{ paddingTop: '0px', paddingBottom: '39px' }}
      className="relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Featured Projects</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* 1. Flagship Arrow Puzzle Game Lab */}
        <ArrowPuzzleLab />

      </div>
    </section>
  );
};
