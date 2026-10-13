/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { StarBackground } from './components/StarBackground';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Projects } from './components/Projects';
import { Education } from './components/Education';
import { Experience } from './components/Experience';
import { Certifications } from './components/Certifications';
import { Skills } from './components/Skills';
import { Contact } from './components/Contact';
import { Footer } from './components/Footer';
import { AdminPanel } from './components/AdminPanel';
import { EmailClientModal } from './components/EmailClientModal';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';

function PortfolioApp() {
  const { setIsAdminOpen } = usePortfolio();

  // Secret Admin Access: Press Shift and type "adi" (or hold Shift while typing a-d-i)
  useEffect(() => {
    let keyBuffer: string[] = [];
    let resetTimer: ReturnType<typeof setTimeout> | null = null;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is currently typing inside an input, textarea, or contentEditable element
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check if Shift is held or active and user presses 'a', 'd', or 'i'
      const key = e.key.toLowerCase();
      if (e.shiftKey && ['a', 'd', 'i'].includes(key)) {
        keyBuffer.push(key);
        if (keyBuffer.length > 5) {
          keyBuffer.shift();
        }

        // Reset buffer if no key is pressed within 2.5 seconds
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          keyBuffer = [];
        }, 2500);

        const recentSequence = keyBuffer.join('');
        if (recentSequence.endsWith('adi')) {
          e.preventDefault();
          keyBuffer = [];
          setIsAdminOpen(true);
        }
      } else if (!e.shiftKey && ['a', 'd', 'i'].includes(key)) {
        // Also track sequence if user pressed shift before typing or types 'ADI' / 'adi'
        keyBuffer.push(key);
        if (keyBuffer.length > 5) {
          keyBuffer.shift();
        }
        if (resetTimer) clearTimeout(resetTimer);
        resetTimer = setTimeout(() => {
          keyBuffer = [];
        }, 2500);

        const recentSequence = keyBuffer.join('');
        if (recentSequence.endsWith('adi') && e.shiftKey) {
          e.preventDefault();
          keyBuffer = [];
          setIsAdminOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (resetTimer) clearTimeout(resetTimer);
    };
  }, [setIsAdminOpen]);

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Interactive Cosmos Star Background */}
      <StarBackground />

      {/* Top Glass Navigation Bar */}
      <Navbar />

      {/* Main Portfolio Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Education />
        <Experience />
        <Certifications />
        <Contact />
      </main>

      {/* Footer */}
      <Footer />

      {/* Admin Panel Studio Modal */}
      <AdminPanel />

      {/* Email Application Chooser Modal */}
      <EmailClientModal />
    </div>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioApp />
    </PortfolioProvider>
  );
}
