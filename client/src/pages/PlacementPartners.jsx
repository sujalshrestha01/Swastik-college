import { useEffect, useState } from 'react';
import { getPlacementPartners, resolveImageUrl } from '../api/client';

export default function PlacementPartners() {
  const [partners, setPartners] = useState([]);

  useEffect(() => {
    getPlacementPartners().then(setPartners);
  }, []);

  // Nothing added in Admin → Placement Partners yet — hide quietly rather
  // than showing an empty section.
  if (partners.length === 0) return null;

  return (
    <section className="w-full bg-slate-100/90 dark:bg-navy-900/90 py-12 px-4 sm:px-8 border-y border-slate-200/60 dark:border-navy-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">

        {/* Title Section */}
        <div className="text-center lg:text-left shrink-0 max-w-sm">
          <h2 className="text-2xl sm:text-3xl font-serif text-slate-800 dark:text-white tracking-tight font-medium">
            Our <span className="text-[#D9383A] dark:text-[#3B82F6] font-bold">Placement Partners</span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-navy-100 mt-2 font-sans leading-relaxed">
            Collaborating with industry leaders to provide direct career pathways for our graduates.
          </p>
        </div>

        {/* Logos Grid */}
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
          {partners.map((partner) => {
            const card = (
              <div className="bg-white/90 hover:bg-white dark:bg-white/95 dark:hover:bg-white border border-slate-200/80 dark:border-navy-700/80 rounded-2xl px-8 py-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col items-center justify-center min-w-[200px] text-center">
                <div className="h-16 sm:h-20 flex items-center justify-center mb-1">
                  <img
                    src={resolveImageUrl(partner.logoUrl)}
                    alt={partner.name}
                    className="max-h-full max-w-[160px] w-auto object-contain transition-transform duration-200 hover:scale-105"
                  />
                </div>
              </div>
            );
            return partner.websiteUrl ? (
              <a key={partner._id} href={partner.websiteUrl} target="_blank" rel="noopener noreferrer">
                {card}
              </a>
            ) : (
              <div key={partner._id}>{card}</div>
            );
          })}
        </div>

      </div>
    </section>
  );
}