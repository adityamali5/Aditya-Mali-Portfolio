import React, { useState, useEffect, useRef } from 'react';
import { Award, Sparkles, GraduationCap, Gamepad2, ShieldCheck, ChevronLeft, ChevronRight, ExternalLink, ZoomIn } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { CertificateItem } from '../types/portfolio';

export const Certifications: React.FC = () => {
  const { data } = usePortfolio();
  const certificates = data.certifications;

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const totalSlides = certificates.length;

  // Keep currentSlide within valid index if certificates are added/removed
  useEffect(() => {
    if (currentSlide >= totalSlides && totalSlides > 0) {
      setCurrentSlide(0);
    }
  }, [totalSlides, currentSlide]);

  const nextSlide = () => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    if (totalSlides === 0) return;
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  // 5-second automatic slide interval
  useEffect(() => {
    if (isPaused || totalSlides <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, currentSlide, totalSlides]);

  const getFallbackIcon = (idx: number) => {
    const icons = [
      <Award className="w-9 h-9 text-cyan-400" />,
      <Sparkles className="w-9 h-9 text-purple-400" />,
      <GraduationCap className="w-9 h-9 text-blue-400" />,
      <Gamepad2 className="w-9 h-9 text-amber-400" />,
      <ShieldCheck className="w-9 h-9 text-emerald-400" />,
    ];
    return icons[idx % icons.length];
  };

  return (
    <section id="certifications" className="pt-0 pb-20 lg:pb-28 relative bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 relative">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">Certifications & Achievements</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-emerald-500 to-cyan-500 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Carousel Outer Container */}
        {totalSlides > 0 ? (
          <div className="max-w-4xl mx-auto relative">
            
            <div
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="relative glass-card rounded-3xl p-5 sm:p-9 border border-slate-800 overflow-hidden shadow-2xl transition-all"
            >
              {/* 5-Second Visual Progress Bar */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                <div
                  key={currentSlide}
                  className={`h-full bg-gradient-to-r from-cyan-400 to-purple-500 ${
                    isPaused ? 'w-full opacity-50' : 'w-full'
                  }`}
                  style={{
                    animation: !isPaused ? 'grow 5s linear' : 'none',
                  }}
                />
              </div>

              {/* Slides Viewport */}
              <div className="relative min-h-[380px] sm:min-h-[320px] flex items-center">
                {certificates.map((cert, idx) => {
                  const isActive = idx === currentSlide;
                  return (
                    <div
                      key={cert.id}
                      className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col md:flex-row items-center gap-6 sm:gap-8 ${
                        isActive
                          ? 'opacity-100 pointer-events-auto translate-x-0'
                          : 'opacity-0 pointer-events-none translate-x-8'
                      }`}
                    >
                      {/* Certificate Visual Display (Direct Photo Mode OR Holographic Crest) */}
                      {cert.imageUrl ? (
                        /* Directly Certificate Photo Mode - Frame Removed */
                        <div
                          onClick={() => setSelectedCert(cert)}
                          className="w-full md:w-1/2 relative rounded-2xl overflow-hidden cursor-pointer group shadow-2xl transition-all duration-300 hover:scale-[1.02] flex items-center justify-center bg-slate-950/70 border border-slate-700/60 hover:border-cyan-400/80 p-1.5 sm:p-2"
                        >
                          <img
                            src={cert.imageUrl}
                            alt={cert.title}
                            className="w-full h-auto max-h-[320px] sm:max-h-[360px] object-contain rounded-xl transition-all duration-300 group-hover:brightness-105"
                          />
                          <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center pointer-events-none rounded-xl">
                            <span className="px-3.5 py-1.5 rounded-full bg-slate-900/95 text-cyan-300 text-xs font-mono font-semibold flex items-center gap-1.5 shadow-2xl border border-cyan-500/40 backdrop-blur-md">
                              <ZoomIn className="w-3.5 h-3.5" />
                              <span>Click to inspect certificate</span>
                            </span>
                          </div>
                        </div>
                      ) : (
                        /* Holographic Crest Mode for certificates without uploaded photo */
                        <div
                          onClick={() => setSelectedCert(cert)}
                          className={`w-full md:w-1/2 rounded-2xl bg-gradient-to-br ${cert.gradientClass || 'from-cyan-950 via-slate-900 to-slate-950'} p-5 sm:p-6 border-2 ${cert.borderClass || 'border-cyan-500/40'} relative shadow-2xl cursor-pointer group hover:scale-[1.02] transition-transform overflow-hidden`}
                        >
                          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs font-mono">
                            <span className="text-slate-300 font-semibold">{cert.badge}</span>
                            <span className="text-amber-400 font-bold">{cert.verifiedText}</span>
                          </div>

                          <div className="my-5 text-center">
                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-cyan-400 flex items-center justify-center mx-auto mb-3 border border-white/15 shadow-inner">
                              {getFallbackIcon(idx)}
                            </div>
                            <h4 className="font-extrabold text-lg text-white group-hover:text-cyan-300 transition-colors">
                              {cert.title}
                            </h4>
                            <p className="text-xs text-slate-300 mt-1">{cert.subtitle}</p>
                            <p className={`text-[11px] font-mono mt-2.5 font-bold ${cert.accentColor || 'text-cyan-400'}`}>
                              Awarded to: {cert.recipient}
                            </p>
                          </div>

                          <div className="pt-3 border-t border-white/10 flex justify-between text-[10px] text-slate-400 font-mono">
                            <span>{cert.metaLeft}</span>
                            <span>{cert.metaRight}</span>
                          </div>
                        </div>
                      )}

                      {/* Certificate Descriptive Details */}
                      <div className="w-full md:w-1/2 space-y-3.5 text-left">
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-semibold">
                          {cert.tag}
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                          {cert.heading || cert.title}
                        </h3>
                        <p className="text-slate-300 text-sm leading-relaxed">
                          {cert.description}
                        </p>
                        <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span>{cert.highlightText}</span>
                        </div>

                        <div className="pt-2 flex items-center gap-4">
                          <button
                            onClick={() => setSelectedCert(cert)}
                            className="text-xs text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1.5 transition-colors"
                          >
                            <span>Click card to inspect credential details</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom Controls Bar */}
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
                <div></div>

                {/* Indicator Dots */}
                <div className="flex items-center gap-2">
                  {certificates.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentSlide(dotIdx)}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        dotIdx === currentSlide
                          ? 'w-8 bg-cyan-400'
                          : 'w-2.5 bg-slate-700 hover:bg-slate-500'
                      }`}
                    />
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="Previous Slide"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    aria-label="Next Slide"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          </div>
        ) : (
          <div className="text-center py-12 glass-card rounded-3xl max-w-xl mx-auto p-8 border border-slate-800">
            <Award className="w-12 h-12 text-cyan-400 mx-auto mb-3 opacity-60" />
            <h3 className="text-xl font-bold text-white">No Certificates Added Yet</h3>
            <p className="text-slate-400 text-sm mt-1">
              Certificates will appear here once published from the admin panel.
            </p>
          </div>
        )}

      </div>

      {/* Detail Credential Inspection Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 lg:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-4xl lg:max-w-5xl w-full rounded-3xl p-5 sm:p-7 border border-cyan-500/40 glow-cyan relative flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3.5 mb-4 border-b border-slate-700/80 shrink-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                  {selectedCert.badge}
                </span>
                <span className="text-xs text-slate-400 font-mono hidden sm:inline">
                  • Verified Credential Preview
                </span>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                aria-label="Close Preview"
              >
                <span>Close</span>
                <span className="text-sm">✕</span>
              </button>
            </div>

            {/* Modal Content: Wide 2-Column or Centered Layout */}
            <div className="flex-1 overflow-y-auto pr-1">
              {selectedCert.imageUrl ? (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-5 lg:gap-7 items-center">
                  {/* Left Column: Certificate Image Document */}
                  <div className="md:col-span-7 flex items-center justify-center rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-2xl p-2.5">
                    <img
                      src={selectedCert.imageUrl}
                      alt={selectedCert.title}
                      className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                    />
                  </div>

                  {/* Right Column: Credential Details */}
                  <div className="md:col-span-5 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-xs text-cyan-400 font-mono font-semibold uppercase tracking-wider block mb-1">
                        {selectedCert.tag || 'CREDENTIAL DETAILS'}
                      </span>
                      <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">
                        {selectedCert.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-cyan-300 font-medium mt-1">
                        {selectedCert.subtitle}
                      </p>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300 space-y-2">
                      <div className="flex justify-between items-center pb-1.5 border-b border-slate-800">
                        <span className="text-slate-400">Recipient:</span>
                        <strong className="text-white font-bold">{selectedCert.recipient}</strong>
                      </div>
                      <div className={`flex justify-between items-center ${selectedCert.metaRight ? 'pb-1.5 border-b border-slate-800' : ''}`}>
                        <span className="text-slate-400">Status:</span>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Verified</span>
                        </span>
                      </div>
                      {selectedCert.metaRight && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-400">Issuer:</span>
                          <span className="text-slate-200">{selectedCert.metaRight}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3 rounded-xl border border-slate-800/60">
                      {selectedCert.description}
                    </p>

                    <button
                      onClick={() => setSelectedCert(null)}
                      className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer shadow-lg shadow-cyan-500/20"
                    >
                      Close Preview
                    </button>
                  </div>
                </div>
              ) : (
                /* When no image is uploaded: elegant wide showcase card */
                <div className="max-w-2xl mx-auto py-2 space-y-4 text-center">
                  <div className="p-8 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
                      <Award className="w-6 h-6" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">{selectedCert.title}</h3>
                    <p className="text-sm text-cyan-300 font-semibold">{selectedCert.subtitle}</p>
                    <p className="text-xs text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
                      {selectedCert.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-left">
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">RECIPIENT</div>
                      <div className="text-xs font-bold text-white truncate">{selectedCert.recipient}</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">STATUS</div>
                      <div className="text-xs font-bold text-emerald-400">Verified</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="text-[10px] font-mono text-slate-400">ISSUER</div>
                      <div className="text-xs font-bold text-slate-200 truncate">{selectedCert.metaRight || 'Verified'}</div>
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedCert(null)}
                    className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors cursor-pointer"
                  >
                    Close Preview
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
