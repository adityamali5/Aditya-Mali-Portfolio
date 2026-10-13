import React, { useState } from 'react';
import { Mail, X, Copy, Check, ExternalLink, Laptop, Send, Sparkles, CheckCircle2 } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export const EmailClientModal: React.FC = () => {
  const { emailModal, closeEmailModal } = usePortfolio();
  const [copied, setCopied] = useState(false);
  const [lastOpenedApp, setLastOpenedApp] = useState<string | null>(null);

  if (!emailModal.isOpen) return null;

  const { to, subject, body, isProjectRequest, senderName } = emailModal;

  const encodedTo = encodeURIComponent(to);
  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);

  // App URLs
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodedTo}&su=${encodedSubject}&body=${encodedBody}`;
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${encodedTo}&subject=${encodedSubject}&body=${encodedBody}`;
  const yahooUrl = `https://compose.mail.yahoo.com/?to=${encodedTo}&subj=${encodedSubject}&body=${encodedBody}`;
  const defaultMailto = `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;

  const handleOpenApp = (name: string, url: string, isMailto: boolean = false) => {
    setLastOpenedApp(name);
    if (isMailto) {
      window.location.href = url;
    } else {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  const handleCopyAll = () => {
    const fullText = `To: ${to}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Backdrop click to dismiss */}
      <div className="fixed inset-0" onClick={closeEmailModal} aria-hidden="true" />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-slate-900/95 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[92vh] glow-cyan">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-cyan-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Choose Email Application</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  Direct Dispatch
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Select your preferred mail client to send this message to Aditya Mali
              </p>
            </div>
          </div>

          <button
            onClick={closeEmailModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5">
          
          {/* Inquiry / Message Context Preview */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">RECIPIENT:</span>
              <span className="text-cyan-400 font-bold">{to}</span>
            </div>
            <div className="flex items-start justify-between text-xs font-mono gap-2 pt-1 border-t border-slate-900">
              <span className="text-slate-400 shrink-0">SUBJECT:</span>
              <span className="text-white font-medium text-right truncate">{subject}</span>
            </div>

            {isProjectRequest && (
              <div className="pt-2 border-t border-slate-900 text-xs">
                <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Project details from {senderName || 'you'} are ready</span>
                </div>
                <div className="text-[11px] text-slate-400 bg-slate-900/90 rounded-lg p-2.5 max-h-24 overflow-y-auto whitespace-pre-wrap font-sans border border-slate-800/80">
                  {body}
                </div>
              </div>
            )}
          </div>

          {/* Feedback if user just clicked an app */}
          {lastOpenedApp && (
            <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs text-cyan-300 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Opened in <strong>{lastOpenedApp}</strong>. Just review and click Send!</span>
              </span>
              <button
                onClick={() => setLastOpenedApp(null)}
                className="text-[10px] text-slate-400 hover:text-white underline ml-2"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Application Selection Options */}
          <div className="space-y-2.5">
            <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
              Select Your Mail Service
            </div>

            {/* 1. Gmail */}
            <button
              onClick={() => handleOpenApp('Gmail', gmailUrl, false)}
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-red-500/50 flex items-center justify-between group transition-all text-left hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* Google Gmail Icon */}
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#EA4335" d="M12 12.713L2.25 5.5v11.75C2.25 18.216 3.034 19 4 19h16c.966 0 1.75-.784 1.75-1.75V5.5L12 12.713z" />
                    <path fill="#FBBC05" d="M20 5H4c-.966 0-1.75.784-1.75 1.75v.25l9.75 7.213L21.75 7V6.75C21.75 5.784 20.966 5 20 5z" />
                    <path fill="#4285F4" d="M2 6.75v2.5l10 7.213 10-7.213v-2.5L12 14.125 2 6.75z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-red-400 transition-colors flex items-center gap-2">
                    <span>Google Gmail</span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-red-500/10 text-red-300 border border-red-500/20">
                      Most Popular
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Open compose window directly in Gmail Web
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-red-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 2. Microsoft Outlook */}
            <button
              onClick={() => handleOpenApp('Outlook', outlookUrl, false)}
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/50 flex items-center justify-between group transition-all text-left hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  {/* Outlook Icon */}
                  <svg className="w-5 h-5 text-blue-400" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.88 12.04c0 .45-.11.87-.33 1.25-.22.38-.53.69-.93.91-.4.22-.87.33-1.42.33-.52 0-.98-.1-1.39-.31-.4-.2-.72-.5-.95-.88-.22-.38-.34-.84-.34-1.37 0-.5.12-.96.35-1.36.23-.41.56-.73.98-.95.42-.22.9-.33 1.44-.33.51 0 .97.11 1.37.33.4.22.71.53.93.92.21.39.32.86.32 1.41zm-1.63.02c0-.41-.09-.75-.27-1.02-.18-.27-.45-.41-.81-.41-.35 0-.62.13-.8.4-.18.27-.27.61-.27 1.03 0 .44.09.79.28 1.05.19.26.46.39.81.39.35 0 .62-.13.8-.4.18-.26.26-.61.26-1.04zM24 12v9a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-1.5l14-8.5V12zm0-2.42L10 18.08V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v4.58zM1 18h7v5H1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-blue-400 transition-colors flex items-center gap-2">
                    <span>Microsoft Outlook / Office 365</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    Open compose window in Outlook Web
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 3. Yahoo Mail */}
            <button
              onClick={() => handleOpenApp('Yahoo Mail', yahooUrl, false)}
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-purple-500/50 flex items-center justify-between group transition-all text-left hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-purple-400 font-bold text-lg font-serif">
                  Y!
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors">
                    Yahoo Mail
                  </div>
                  <div className="text-xs text-slate-400">
                    Open compose window in Yahoo Mail Web
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>

            {/* 4. Default System App (Apple Mail, Windows Mail, Thunderbird, Mobile) */}
            <button
              onClick={() => handleOpenApp('Default Mail Client', defaultMailto, true)}
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/50 flex items-center justify-between group transition-all text-left hover:scale-[1.01] active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform text-cyan-400">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm group-hover:text-cyan-400 transition-colors">
                    Default System App
                  </div>
                  <div className="text-xs text-slate-400">
                    Apple Mail, Windows Mail, Thunderbird, or Mobile App
                  </div>
                </div>
              </div>
              <Send className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
            </button>

            {/* 5. Copy Email & Draft Text */}
            <button
              onClick={handleCopyAll}
              className="w-full p-3.5 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border border-dashed border-slate-700 hover:border-slate-500 flex items-center justify-between group transition-all text-left active:scale-[0.99]"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 text-slate-300">
                  {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>{copied ? 'Copied to Clipboard!' : 'Copy Email & Message Text'}</span>
                    {copied && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        Ready to paste
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-400">
                    {copied ? 'Details copied! Paste into any email provider manually.' : 'Copy to paste into ProtonMail, Zoho, or custom webmail'}
                  </div>
                </div>
              </div>
              <span className="text-xs font-mono text-cyan-400 shrink-0">
                {copied ? 'Done!' : 'Copy'}
              </span>
            </button>

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span>Aditya Mali typically responds within 24 hours.</span>
          <button
            onClick={closeEmailModal}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-medium transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
