// client/src/components/Hero.jsx — replace the whole file
import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { ArrowUpRight } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { resolveImageUrl } from '../api/client';
import { Section } from './Visibility';
import img1 from '../../assets/img1.jpg';

function HeroBackground({ images }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [images.length]);

  return (
    <>
      {images.map((src, i) => (
        <div
          key={src + i}
          className="absolute inset-0 opacity-[0.4] transition-opacity duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${src})`,
            backgroundPosition: 'center center',
            backgroundSize: 'cover',
            opacity: i === index ? 0.6 : 0,
          }}
          aria-hidden
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Show slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? 'w-6 bg-marigold-400' : 'w-1.5 bg-navy-300/60 hover:bg-navy-200'
              }`}
            />
          ))}
        </div>
      )}
    </>
  );
}

export default function Hero() {
  const { settings } = useSettings();
  const carouselImages = (settings.heroImages || []).map(resolveImageUrl);
  const fallbackImage = settings.heroImageUrl ? resolveImageUrl(settings.heroImageUrl) : img1;
  const images = carouselImages.length > 0 ? carouselImages : [fallbackImage];

  return (
    <section className="relative overflow-hidden bg-navy-900 text-paper">
      <HeroBackground images={images} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-28 sm:py-36 grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] leading-[1.08] font-medium">
            {settings.heroHeadline}
          </h1>
          <p className="mt-6 text-navy-100 text-base sm:text-lg max-w-xl">
            {settings.heroSubheadline}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 bg-marigold-500 hover:bg-marigold-600 text-navy-900 font-semibold px-6 py-3 rounded-full transition-colors"
            >
              Apply for Admission
              <ArrowUpRight size={18} />
            </Link>
            <Link
              to={settings.heroCtaLink || '/programs'}
              className="inline-flex items-center gap-2 border border-navy-500 hover:border-marigold-500 text-paper px-6 py-3 rounded-full transition-colors text-sm font-medium"
            >
              {settings.heroCtaText || 'Explore Programs'}
            </Link>
          </div>
        </div>

        <Section page="home" section="heroStatusLog">
          <div className="bg-navy-800/70 border border-navy-600 rounded-2xl p-5 font-mono text-xs sm:text-sm">
            <div className="flex items-center gap-1.5 pb-3 mb-3 border-b border-navy-600">
              <span className="w-2.5 h-2.5 rounded-full bg-marigold-300/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-teal-400/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-navy-300/70" />
              <span className="ml-3 text-navy-300">college_status.log</span>
            </div>
            <ul className="space-y-2.5 text-navy-100">
              {(settings.heroStatusLog?.length ? settings.heroStatusLog : []).map((row, i) => (
                <li key={i} className="flex justify-between">
                  <span className="text-navy-400">{row.label}</span>
                  <span className={row.label === 'admissions' ? 'text-marigold-300' : ''}>
                    {row.value || (row.label === 'college' ? settings.collegeShortName
                      : row.label === 'affiliation' ? settings.affiliation
                      : row.label === 'contact' ? settings.phone
                      : '')}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Section>
      </div>
    </section>
  );
}