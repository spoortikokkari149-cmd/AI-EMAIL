import { useState, useEffect } from 'react';
import { 
  Quote, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  Star,
  CheckCircle2
} from 'lucide-react';

interface Testimonial {
  id: string;
  author: string;
  role: string;
  org: string;
  story: string;
  attackVectorDeflected: string;
  avatarInitials: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: 't-1',
    author: 'Marcus Vance',
    role: 'Lead Security Operations Analyst',
    org: 'FinTech Defense Labs',
    story: 'CyberShield’s breakdown of OTP interception tactics directly prepared our non-technical staff. When a targeted vishing campaign hit our payroll department, our team recognized the fake callback script and reported the attacker in under 2 minutes.',
    attackVectorDeflected: 'Voice OTP Social Engineering',
    avatarInitials: 'MV',
  },
  {
    id: 't-2',
    author: 'Elena Rostova',
    role: 'E-Commerce Business Owner',
    org: 'Nordic Artisans',
    story: 'Our customers were being targeted by a cloned webstore operating on a .top domain. The WHOIS age verification and DNS lookup checklist on CyberShield gave us the exact forensics to file an ICANN takedown within 24 hours.',
    attackVectorDeflected: 'Brand Cloned Ghost Shop',
    avatarInitials: 'ER',
  },
  {
    id: 't-3',
    author: 'David Chen',
    role: 'Senior Systems Administrator',
    org: 'Apex Logistics Corp',
    story: 'We used CyberShield as the baseline training curriculum for over 450 remote employees. The interactive 3D scam anatomy cards and realistic email samples transformed our phishing simulation click rates from 18% down to 0.4%.',
    attackVectorDeflected: 'Executive BEC Wire Fraud',
    avatarInitials: 'DC',
  },
];

export function TestimonialsCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const item = TESTIMONIALS[currentIndex];

  return (
    <section className="py-16 lg:py-20 bg-[#050811] border-y border-slate-900 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-2 mb-10">
          <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400">
            Real Defense Case Studies
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tested In Real Cyber Incident Trenches
          </h2>
        </div>

        {/* 3D Carousel Box */}
        <div className="relative p-8 sm:p-10 rounded-2xl bg-slate-900/80 border border-cyan-500/30 backdrop-blur-xl shadow-2xl space-y-6">
          <Quote className="w-10 h-10 text-cyan-500/30 absolute top-6 right-6" />

          {/* Defense Vector Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Deflected Threat: {item.attackVectorDeflected}</span>
          </div>

          <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
            "{item.story}"
          </p>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-600/30 border border-cyan-400/40 flex items-center justify-center font-bold text-cyan-300 font-mono text-sm">
                {item.avatarInitials}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  {item.author}
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </h4>
                <p className="text-xs text-slate-400 font-mono">
                  {item.role} &bull; <span className="text-slate-300">{item.org}</span>
                </p>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handlePrev}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Previous story"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                aria-label="Next story"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel indicator dots */}
        <div className="flex justify-center gap-2 mt-6">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                currentIndex === i ? 'w-6 bg-cyan-400' : 'w-2 bg-slate-800 hover:bg-slate-700'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
