import { Terminal } from 'lucide-react';
import { useSettings } from '../context/SettingsContext';

export default function NotificationTicker() {
  const { settings } = useSettings();

  if (!settings.announcementBarEnabled || !settings.announcementBarText) return null;

  const loopItems = [settings.announcementBarText, settings.announcementBarText];

  return (
    <div className="bg-navy-900 text-paper text-sm overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="hidden sm:flex items-center gap-1.5 shrink-0 bg-marigold text-navy-900 font-mono text-xs font-semibold px-3 py-1.5 tracking-wide">
          <Terminal size={13} strokeWidth={2.5} />
          ALERTS
        </div>
        <div className="relative flex-1 overflow-hidden py-1.5">
          <div className="flex whitespace-nowrap animate-ticker will-change-transform">
            {loopItems.map((item, i) => (
              <span key={i} className="mx-6 font-mono text-xs sm:text-[13px] text-navy-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
