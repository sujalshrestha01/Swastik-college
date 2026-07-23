import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Bell, Users, CalendarDays, Mail, Images } from 'lucide-react';
import {
  getCourses, getFaculty, getEvents, messagesAdmin, noticesAdmin, getGallery,
} from '../../api/client';
import { Card } from '../../components/admin/ui';

const cards = [
  { key: 'courses', label: 'Courses', icon: BookOpen, to: '/admin/courses', color: 'text-teal-500 bg-teal-50' },
  { key: 'notices', label: 'Notices', icon: Bell, to: '/admin/notices', color: 'text-marigold-500 bg-marigold-50' },
  { key: 'faculty', label: 'Faculty', icon: Users, to: '/admin/faculty', color: 'text-navy-500 bg-navy-50' },
  { key: 'events', label: 'Events', icon: CalendarDays, to: '/admin/events', color: 'text-teal-500 bg-teal-50' },
  { key: 'gallery', label: 'Gallery images', icon: Images, to: '/admin/gallery', color: 'text-marigold-500 bg-marigold-50' },
  { key: 'messages', label: 'Inbox messages', icon: Mail, to: '/admin/messages', color: 'text-navy-500 bg-navy-50' },
];

export default function AdminDashboard() {
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [courses, notices, faculty, events, gallery, messages] = await Promise.all([
        getCourses({ all: true }),
        noticesAdmin.list(),
        getFaculty(),
        getEvents(),
        getGallery(),
        messagesAdmin.list().catch(() => []),
      ]);
      setCounts({
        courses: courses.length,
        notices: notices.length,
        faculty: faculty.length,
        events: events.length,
        gallery: gallery.length,
        messages: messages.length,
      });
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl text-navy-800">Welcome back</h1>
        <p className="text-sm text-navy-500 mt-1">
          Manage every part of the college website from here — courses, subjects, notices, faculty, events, gallery,
          site settings and incoming inquiries.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map(({ key, label, icon: Icon, to, color }) => (
          <Link key={key} to={to}>
            <Card>
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="text-2xl font-display text-navy-800">{loading ? '—' : counts[key] ?? 0}</p>
                  <p className="text-sm text-navy-500">{label}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card title="Quick tips">
        <ul className="text-sm text-navy-600 space-y-1.5 list-disc pl-4">
          <li>Use <strong>Site Settings</strong> to update the Facebook link, phone, address, homepage hero text and stats.</li>
          <li>Use <strong>Courses & Subjects</strong> to add/remove programs and edit each semester's subjects — including for BSc. CSIT.</li>
          <li>New contact-form submissions appear under <strong>Inquiries</strong>.</li>
        </ul>
      </Card>
    </div>
  );
}
