import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getSettings } from '../api/client';

const defaultSettings = {
  collegeName: 'Swastik College',
  collegeShortName: 'Swastik',
  tagline: 'Shaping Careers, Building Futures',
  establishedYear: '2005',
  affiliation: 'Tribhuvan University (TU)',
  heroHeadline: 'Shaping Careers, Building Futures',
  heroSubheadline:
    'A TU-affiliated college offering BSc. CSIT, BCA and BBS programs, built around small classes and real project experience.',
  heroCtaText: 'Explore Programs',
  heroCtaLink: '/programs',
  aboutSummary: '',
  missionStatement: '',
  visionStatement: '',
  address: 'Kathmandu, Nepal',
  phone: '',
  email: '',
  officeHours: '',
  socialLinks: {},
  stats: [],
  footerNote: 'All rights reserved.',
  announcementBarText: '',
  announcementBarEnabled: false,
};

const SettingsContext = createContext({ settings: defaultSettings, loading: true, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await getSettings();
    if (data) setSettings({ ...defaultSettings, ...data });
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refresh }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
