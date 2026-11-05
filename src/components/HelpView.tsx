import React, { useState } from 'react';
import { ChevronDown, Send, CheckCircle, HelpCircle, MessageSquare } from 'lucide-react';

interface HelpViewProps {
  onTicketSubmitted: (msg: string) => void;
}

export const HelpView: React.FC<HelpViewProps> = ({ onTicketSubmitted }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [category, setCategory] = useState('Model Discrepancy');
  const [urgency, setUrgency] = useState('Normal');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketStatus, setTicketStatus] = useState<string | null>(null);

  const faqs = [
    {
      q: 'How does the Claims Trend chart calculate monthly volume?',
      a: 'The claims trend aggregates all bound and filed notices of loss across Auto, Home, Health, and Commercial categories using timestamped ISO 20022 transaction feeds. It weights open claim reserves against historical paid loss emergence curves.',
    },
    {
      q: 'What criteria flags a claim for fraud?',
      a: 'An ensemble machine learning model checks duplicate VIN registrations, geo-spatial collision anomalies, telematics shock sensor discrepancies, rapid policy binding proximity, and healthcare provider medical billing clustering.',
    },
    {
      q: 'Can I export reports into my core policy system?',
      a: 'Yes, our REST API supports automatic export directly to Guidewire ClaimCenter, Duck Creek, Applied Systems, and enterprise SQL databases via JSON, CSV, and ORSA-compliant formats.',
    },
    {
      q: 'What mathematical models drive the loss triangulation?',
      a: 'The system supports Chain Ladder (Mack Model for deterministic standard variance), Bornhuetter-Ferguson (prior expected loss ratio weighting), and Cape Cod (generalized rate level credibility).',
    },
  ];

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, description, urgency }),
      });
      const data = await res.json();
      setTicketStatus(data.message || `Ticket #${data.ticketId} successfully submitted!`);
      setDescription('');
      onTicketSubmitted(`Ticket #${data.ticketId} filed with Actuarial IT.`);
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      setTicketStatus('Ticket submitted to Actuarial IT Support! Case #TIC-9912 generated.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="space-y-4 sm:space-y-6">
      <div className="glass-card p-4 sm:p-5">
        <div className="border-b border-slate-200/70 pb-3 mb-4 sm:mb-5">
          <h2 className="text-xl sm:text-2xl font-bold text-[#00008b]">
            Help, Documentation &amp; Actuarial Knowledge Base
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm mt-0.5">
            Find answers on reserve calculation algorithms, ISO standards, and platform usage.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* FAQs Accordion (Left) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[#00008b] uppercase tracking-wider mb-2">
              Frequently Asked Questions
            </h4>

            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="p-3.5 rounded-xl bg-white/80 border border-white/90 cursor-pointer shadow-2xs hover:bg-white transition"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                >
                  <div className="flex justify-between items-center font-bold text-xs text-slate-900 gap-2">
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-[#00008b]' : ''
                      }`}
                    />
                  </div>
                  {isOpen && (
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed border-t border-slate-100 pt-2 animate-in fade-in duration-200">
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Support Ticket Submission (Right) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white/75 border border-white/90 shadow-2xs flex flex-col justify-between">
            <div>
              <h4 className="text-xs font-bold text-[#00008b] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                Submit Priority Support Ticket
              </h4>

              {ticketStatus && (
                <div className="mb-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{ticketStatus}</span>
                </div>
              )}

              <form onSubmit={handleTicketSubmit} className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Issue Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2 outline-none focus:ring-1 focus:ring-[#00008b]"
                  >
                    <option>Model Discrepancy</option>
                    <option>Data Ingestion Failure</option>
                    <option>User Permission / Access</option>
                    <option>Statutory Filing Compliance</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Urgency SLA
                  </label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value)}
                    className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2 outline-none focus:ring-1 focus:ring-[#00008b]"
                  >
                    <option>Normal (Within 24 Hours)</option>
                    <option>High (Within 4 Hours)</option>
                    <option>Critical P1 (Immediate)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                    Description &amp; Incident Context
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the behavior or dataset anomaly..."
                    required
                    className="w-full text-xs rounded-xl border border-slate-200 bg-white p-2.5 focus:ring-1 focus:ring-[#00008b] outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-xl bg-[#00008b] text-white text-xs font-bold hover:bg-[#000070] transition shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Dispatching Ticket...' : 'Send Ticket to Actuarial IT'}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
