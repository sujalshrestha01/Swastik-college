import { Terminal, Mail, Phone, Clock } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function NotificationTicker() {
  const { settings } = useSettings();

  const isAnnouncementActive =
    settings?.announcementBarEnabled && settings?.announcementBarText;

  // Fallback values from settings or standard defaults
  const contactEmail = settings?.email || 'info@swastikcollege.edu.np';
  const contactPhone = settings?.phone || '+977-1-6635174';
  const officeHours = settings?.officeHours || 'Sun - Fri 6:30 A.M - 1:00 P.M';

  // 1. Dark Terminal Alert Bar (When Announcement is Active)
  if (isAnnouncementActive) {
    const loopItems = [
      settings.announcementBarText,
      settings.announcementBarText,
      settings.announcementBarText,
    ];

    return (
      <div className="bg-navy-900 text-paper text-sm overflow-hidden border-b border-slate-800 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex items-center">
          <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-marigold text-navy-900 font-mono text-xs font-semibold px-3 py-1.5 tracking-wide">
            <Terminal size={13} strokeWidth={2.5} />
            ALERTS
          </div>
          <div className="relative flex-1 overflow-hidden py-1.5">
            <div className="flex whitespace-nowrap animate-ticker will-change-transform">
              {loopItems.map((item, i) => (
                <span
                  key={i}
                  className="mx-6 font-mono text-xs sm:text-[13px] text-navy-100"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 2. Official Swastik Red Contact Info Bar (Responsive Fix)
 return (
  <div className="bg-[#D9383A] dark:bg-navy-900/90 dark:border-b-2 dark:border-gray-700 text-white dark:text-navy-100 py-1.5 px-3 sm:px-6 text-[11px] sm:text-xs font-medium transition-colors duration-300">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
      {/* Contact Items */}
      <div className="flex items-center gap-3 sm:gap-5 min-w-0">
        {/* Email: Hidden on extra-small mobile screens to save space */}
        <a
          href={`mailto:${contactEmail}`}
          className="hidden sm:flex items-center gap-1.5 hover:underline truncate"
        >
          <Mail size={12} className="shrink-0" />
          <span className="truncate">{contactEmail}</span>
        </a>

        {/* Phone: Always visible on mobile */}
        <a
          href={`tel:${contactPhone.replace(/[^+\d]/g, '')}`}
          className="flex items-center gap-1.5 hover:underline shrink-0"
        >
          <Phone size={12} className="shrink-0" />
          <span>{contactPhone}</span>
        </a>
      </div>

      {/* Operating Hours: Always single-line on the right */}
      <div className="flex items-center gap-1.5 shrink-0 text-slate-100 dark:text-navy-200">
        <Clock size={12} className="shrink-0" />
        <span className="whitespace-nowrap">{officeHours}</span>
      </div>
    </div>
  </div>
);
}