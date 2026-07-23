import mongoose from 'mongoose';

// Singleton document holding every "small detail" of the site the admin
// should be able to edit without touching code: identity, contact info,
// social links, homepage hero content, footer text and quick stats.
const siteSettingsSchema = new mongoose.Schema(
  {
    key: { type: String, default: 'main', unique: true },

    collegeName: { type: String, default: 'Swastik College' },
    collegeShortName: { type: String, default: 'Swastik' },
    tagline: { type: String, default: 'Shaping Careers, Building Futures' },
    logoUrl: { type: String, default: '' },
    establishedYear: { type: String, default: '2005' },
    affiliation: { type: String, default: 'Tribhuvan University (TU)' },

    heroHeadline: { type: String, default: 'Shaping Careers, Building Futures' },
    heroSubheadline: {
      type: String,
      default:
        'A TU-affiliated college offering BSc. CSIT, BCA and BBS programs, built around small classes and real project experience.',
    },
    heroImageUrl: { type: String, default: '' },
    heroCtaText: { type: String, default: 'Explore Programs' },
    heroCtaLink: { type: String, default: '/programs' },

    aboutSummary: { type: String, default: '' },
    missionStatement: { type: String, default: '' },
    visionStatement: { type: String, default: '' },

    address: { type: String, default: 'Kathmandu, Nepal' },
    phone: { type: String, default: '+977-1-0000000' },
    email: { type: String, default: 'info@swastikcollege.edu.np' },
    officeHours: { type: String, default: 'Sun–Fri, 9:00 AM – 4:00 PM' },
    mapEmbedUrl: { type: String, default: '' },

    socialLinks: {
      facebook: { type: String, default: '' },
      instagram: { type: String, default: '' },
      youtube: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      twitter: { type: String, default: '' },
      tiktok: { type: String, default: '' },
    },

    stats: [
      {
        label: { type: String, required: true },
        value: { type: Number, required: true },
        suffix: { type: String, default: '' },
      },
    ],

    footerNote: {
      type: String,
      default: 'Affiliated to Tribhuvan University. All rights reserved.',
    },
    announcementBarText: { type: String, default: '' },
    announcementBarEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('SiteSettings', siteSettingsSchema);
