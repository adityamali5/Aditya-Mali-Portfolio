import React, { useState } from 'react';
import { Mail, User, Copy, Check, Send, CheckCircle2, Clock, Linkedin, ExternalLink } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const Contact: React.FC = () => {
  const { data, openEmailModal } = usePortfolio();
  const { contact, hero } = data;
  const emailAddress = contact.email || 'adityamali0890@gmail.com';
  const linkedinUrl = contact.linkedin || 'https://www.linkedin.com/in/adityamali0890/';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    timeline: '',
    message: '',
  });

  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    openEmailModal({
      to: emailAddress,
      subject: `Connecting with ${hero.name}`,
      body: `Hi ${hero.name},\n\nI was exploring your portfolio and would love to connect regarding a web project or engineering opportunity.\n\nLooking forward to hearing from you!`,
      isProjectRequest: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const projectTypeDisplay = formData.projectType || 'General Project / Custom Request';
    const timelineDisplay = formData.timeline || 'Flexible';
    const subject = `Project Inquiry: ${projectTypeDisplay} - from ${formData.name}`;
    const body = `Hi ${hero.name},\n\nMy name is ${formData.name} (${formData.email}).\n\nI would love to collaborate on a project with you:\n\nProject Type: ${projectTypeDisplay}\nExpected Timeline: ${timelineDisplay}\n\nProject Details:\n${formData.message}\n\nLooking forward to your reply!`;

    openEmailModal({
      to: emailAddress,
      subject,
      body,
      senderName: formData.name,
      senderEmail: formData.email,
      isProjectRequest: true,
    });
  };

  return (
    <section id="contact" className="pt-0 pb-20 lg:pb-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white">{contact.heading || "Let's Build Your Next Website"}</h2>
          <p className="text-slate-400 text-sm sm:text-base mt-3">
            {contact.subheading || `Need a professional website, an AI-powered application, or an interactive game? Reach out directly to ${hero.name} below.`}
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-cyan-500 to-purple-500 mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Contact Details Card */}
          <div className="lg:col-span-5 glass-card rounded-3xl p-6 sm:p-8 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Direct Contact</h3>
              <p className="text-slate-400 text-sm">
                I am actively taking on new website commissions, software collaborations, and engineering roles.
              </p>
            </div>

            <div className="space-y-3.5 pt-1">
              {/* Name Card */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                  <User className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-slate-400">FULL NAME</div>
                  <div className="font-bold text-white text-base">{hero.name}</div>
                  <div className="text-xs text-cyan-400">{hero.roleTitle}</div>
                </div>
              </div>

              {/* Email Card */}
              <button
                type="button"
                onClick={handleEmailClick}
                className="w-full text-left flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 group hover:border-cyan-500/50 hover:bg-slate-900 transition-all cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                  <Mail className="w-6 h-6" />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                    <span>EMAIL ADDRESS</span>
                    <span className="text-[10px] text-cyan-400 opacity-90 group-hover:opacity-100 flex items-center gap-1 font-sans">
                      <span>Choose App</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                  <div className="font-bold text-white text-sm sm:text-base group-hover:text-cyan-400 transition-colors truncate block">
                    {emailAddress}
                  </div>
                  <div className="text-xs text-slate-500">Click to choose Gmail, Outlook, or system app</div>
                </div>
              </button>

              {/* LinkedIn Tab / Card */}
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/50 group transition-all hover:bg-slate-900 block"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-600/15 border border-blue-500/40 flex items-center justify-center text-blue-400 group-hover:scale-105 group-hover:bg-blue-600/25 transition-all shrink-0">
                  <Linkedin className="w-6 h-6" />
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <span>LINKEDIN PROFILE</span>
                    <ExternalLink className="w-3 h-3 text-blue-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                  <div className="font-bold text-white text-sm sm:text-base group-hover:text-blue-400 transition-colors truncate">
                    linkedin.com/in/adityamali0890
                  </div>
                  <div className="text-xs text-slate-500">Connect with Aditya Mali</div>
                </div>
              </a>
            </div>

            {/* Quick Copy Email Button */}
            <button
              onClick={handleCopyEmail}
              className="w-full py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white text-xs font-mono flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-bold">Email Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-cyan-400" />
                  <span>Copy Email: {emailAddress}</span>
                </>
              )}
            </button>
          </div>

          {/* Project Inquiry Form */}
          <div className="lg:col-span-7 glass-card rounded-3xl p-6 sm:p-10 border border-cyan-500/30 glow-cyan">
            <div className="mb-6">
              <span className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
                CUSTOM INQUIRY
              </span>
              <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                Want Me To Build Your Website?
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Fill out the details below and I will get back to you promptly with an architectural proposal.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-mono text-slate-300 mb-1.5">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aditya Mali"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-mono text-slate-300 mb-1.5">
                    YOUR EMAIL *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="adityamali0890@gmail.com"
                    className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600 text-sm outline-none transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="projectType" className="block text-xs font-mono text-slate-300 mb-1.5">
                    PROJECT TYPE
                  </label>
                  <select
                    id="projectType"
                    value={formData.projectType}
                    onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm outline-none transition-all ${
                      formData.projectType ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    <option value="" className="bg-slate-900 text-slate-500">
                      Select Project Type...
                    </option>
                    <option value="Custom Website / Business Web App" className="bg-slate-900 text-white">
                      Custom Website / Business Web App
                    </option>
                    <option value="AI-Powered Web Solution" className="bg-slate-900 text-white">
                      AI-Powered Web Solution / Automation
                    </option>
                    <option value="Educational Game / Interactive App (Like Arrow Puzzle)" className="bg-slate-900 text-white">
                      Educational Game (Like Arrow Puzzle)
                    </option>
                    <option value="Personal Portfolio / Showcase" className="bg-slate-900 text-white">
                      Personal Portfolio / Showcase Site
                    </option>
                    <option value="Other Software Consulting" className="bg-slate-900 text-white">
                      Other Software Engineering Request
                    </option>
                  </select>
                  {formData.projectType && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Selected: {formData.projectType}</span>
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="timeline" className="block text-xs font-mono text-slate-300 mb-1.5">
                    DESIRED TIMELINE
                  </label>
                  <select
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    className={`w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-sm outline-none transition-all ${
                      formData.timeline ? 'text-white' : 'text-slate-500'
                    }`}
                  >
                    <option value="" className="bg-slate-900 text-slate-500">
                      Select Desired Timeline...
                    </option>
                    <option value="Urgent (1-2 Weeks)" className="bg-slate-900 text-white">Urgent (1-2 Weeks)</option>
                    <option value="Standard (2-4 Weeks)" className="bg-slate-900 text-white">Standard (2-4 Weeks)</option>
                    <option value="Flexible Timeline" className="bg-slate-900 text-white">Flexible Timeline</option>
                  </select>
                  {formData.timeline && (
                    <div className="mt-1.5 flex items-center gap-1.5 text-xs text-cyan-400 font-mono">
                      <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">Selected: {formData.timeline}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono text-slate-300 mb-1.5">
                  PROJECT DETAILS & REQUIREMENTS *
                </label>
                <textarea
                  id="message"
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your project vision, target audience, preferred styling, or any specific AI/interactive features needed..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-white placeholder-slate-600 text-sm outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-xl font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Send Project Request to {hero.name}</span>
              </button>
            </form>

            {/* Submission confirmation toast */}
            {submitted && (
              <div className="mt-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-emerald-400" />
                  <div>
                    <div className="font-bold">Project inquiry prepared!</div>
                    <div className="text-xs text-slate-300 mt-0.5">
                      Select your preferred application (Gmail, Outlook, Yahoo, or System App) to dispatch to <strong>{emailAddress}</strong>.
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => openEmailModal({
                    to: emailAddress,
                    subject: `Project Inquiry: ${formData.projectType || 'General Project'} - from ${formData.name}`,
                    body: `Hi ${hero.name},\n\nMy name is ${formData.name} (${formData.email}).\n\nI would love to collaborate on a project with you:\n\nProject Type: ${formData.projectType || 'General Web Project'}\nExpected Timeline: ${formData.timeline || 'Flexible'}\n\nProject Details:\n${formData.message}\n\nLooking forward to your reply!`,
                    senderName: formData.name,
                    senderEmail: formData.email,
                    isProjectRequest: true,
                  })}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/30 hover:bg-emerald-500/50 text-white text-xs font-semibold shrink-0 transition-colors self-start sm:self-auto"
                >
                  Choose Email App
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
};
