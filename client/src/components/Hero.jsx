import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function Hero() {
  const { settings } = useSettings();

  return (
    <section className="relative overflow-hidden bg-navy-900 text-paper">
      <div
        className="absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, #E8A33D 1px, transparent 0)',
          backgroundSize: '22px 22px',
        }}
        aria-hidden
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-20 sm:py-28 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          {/* <p className="font-mono text-xs tracking-[0.2em] text-marigold-300 uppercase mb-5">
            Est. {settings.establishedYear} — {settings.affiliation}
          </p> */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-medium">
            {settings.heroHeadline}
          </h1>
          <p className="mt-6 text-navy-100 text-base sm:text-lg max-w-xl">
            {settings.heroSubheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-marigold hover:bg-marigold-500 text-navy-900 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Apply for Admission
              <ArrowUpRight size={18} />
            </Link>
            <Link
              to={settings.heroCtaLink || '/programs'}
              className="inline-flex items-center gap-2 border border-navy-500 hover:border-marigold-300 text-paper px-6 py-3 rounded-full transition-colors text-sm font-medium"
            >
              {settings.heroCtaText || 'Explore Programs'}
            </Link>
          </div>
        </div>

        <div className="bg-navy-800/70 border border-navy-600 rounded-2xl p-5 font-mono text-xs sm:text-sm">
          <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-navy-600">
            <span className="w-2.5 h-2.5 rounded-full bg-marigold-300/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400/70" />
            <span className="w-2.5 h-2.5 rounded-full bg-navy-300/70" />
            <span className="ml-3 text-navy-300">campus_status.log</span>
          </div>
          <ul className="space-y-2.5 text-navy-100">
            <li className="flex justify-between"><span className="text-navy-400">college</span><span>{settings.collegeShortName}</span></li>
            <li className="flex justify-between"><span className="text-navy-400">admissions</span><span className="text-marigold-300">open</span></li>
            <li className="flex justify-between"><span className="text-navy-400">affiliation</span><span>{settings.affiliation}</span></li>
            <li className="flex justify-between"><span className="text-navy-400">contact</span><span>{settings.phone}</span></li>
          </ul>
        </div>
      </div>
    </section>
  );
}
