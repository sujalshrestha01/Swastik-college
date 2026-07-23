import { Target, Eye, ShieldCheck } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function About() {
  const { settings } = useSettings();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
      <p className="font-mono text-xs tracking-[0.2em] text-teal-600 dark:text-teal-400 uppercase mb-2">About Us</p>
      <h1 className="font-display text-3xl sm:text-4xl font-medium text-navy dark:text-paper mb-6">
        About {settings.collegeName}
      </h1>
      <p className="text-navy-500 dark:text-navy-200 leading-relaxed mb-10">{settings.aboutSummary}</p>

      <div className="grid sm:grid-cols-2 gap-6">
        <div className="border border-navy-100 dark:border-navy-700 rounded-xl p-6 bg-white dark:bg-navy-800">
          <Target className="text-marigold-500 mb-3" size={22} />
          <h2 className="font-display text-lg text-navy dark:text-paper mb-2">Our Mission</h2>
          <p className="text-sm text-navy-500 dark:text-navy-200 leading-relaxed">{settings.missionStatement}</p>
        </div>
        <div className="border border-navy-100 dark:border-navy-700 rounded-xl p-6 bg-white dark:bg-navy-800">
          <Eye className="text-teal-500 mb-3" size={22} />
          <h2 className="font-display text-lg text-navy dark:text-paper mb-2">Our Vision</h2>
          <p className="text-sm text-navy-500 dark:text-navy-200 leading-relaxed">{settings.visionStatement}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-10 text-sm text-navy-400 dark:text-navy-300">
        <ShieldCheck size={16} className="text-teal-500" />
        Established {settings.establishedYear} · Affiliated to {settings.affiliation}
      </div>
    </div>
  );
}
