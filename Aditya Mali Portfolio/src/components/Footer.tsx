import React from 'react';
import { ArrowUp, Mail, Linkedin } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Footer: React.FC = () => {
  const { data, openEmailModal } = usePortfolio();
  const linkedinUrl = data.contact.linkedin || 'https://www.linkedin.com/in/adityamali0890/';
  const emailAddress = data.contact.email || 'adityamali0890@gmail.com';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-slate-900 bg-slate-950/90 py-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-slate-900">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div>
              <span className="font-bold text-white text-base block">Aditya Mali</span>
              <span className="text-xs text-cyan-400 font-mono">Software Developer • ISRO SPARK Intern</span>
            </div>

            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Computer Engineering student at RITP College and active software developer intern at ISRO SPARK India. Dedicated to crafting mission-ready web solutions, educational logic games, and AI-powered web tools.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2">Navigate</h4>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
              <a href="#home" className="hover:text-cyan-400 transition-colors">Home</a>
              <a href="#about" className="hover:text-cyan-400 transition-colors">About Aditya</a>
              <a href="#projects" className="hover:text-cyan-400 transition-colors">Arrow Puzzle</a>
              <a href="#skills" className="hover:text-cyan-400 transition-colors">Skills</a>
              <a href="#education" className="hover:text-cyan-400 transition-colors">RITP College</a>
              <a href="#experience" className="hover:text-cyan-400 transition-colors">ISRO SPARK</a>
              <a href="#certifications" className="hover:text-cyan-400 transition-colors">Certifications</a>
              <a href="#contact" className="hover:text-cyan-400 transition-colors">Hire / Contact</a>
            </div>
          </div>

          {/* Direct Contact & CTA */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-2">Get Your Website Built</h4>
            <p className="text-xs text-slate-400">
              Have a web project, landing page, or game idea? Let's discuss today.
            </p>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => openEmailModal({
                  to: emailAddress,
                  subject: `Connecting with ${data.hero.name}`,
                  body: `Hi ${data.hero.name},\n\nI was looking at your portfolio and wanted to reach out regarding a web project or engineering collaboration.\n\nBest regards!`,
                  isProjectRequest: false,
                })}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-cyan-300 hover:border-cyan-500/50 hover:text-white transition-colors text-left cursor-pointer"
              >
                <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="truncate">{emailAddress}</span>
              </button>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-blue-400 hover:border-blue-500/50 hover:text-white transition-colors"
              >
                <Linkedin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>LinkedIn Profile</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 font-mono">
          <div>
            © 2026 Aditya Mali. Built with AI Vibe Coding & Space Engineering Standards.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-all border border-slate-800"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5 text-cyan-400" />
          </button>
        </div>

      </div>
    </footer>
  );
};
