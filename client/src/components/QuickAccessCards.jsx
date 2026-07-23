import { Link } from 'react-router-dom';
import { Bell, GraduationCap, FileText, ClipboardList, ArrowUpRight } from 'lucide-react';

const CARDS = [
  { icon: Bell, title: 'Notice Board', desc: 'Exam routines, admissions & campus alerts', to: '/notices' },
  { icon: GraduationCap, title: 'Courses', desc: 'BSc. CSIT, BCA and BBS programs', to: '/programs' },
  { icon: FileText, title: 'Syllabus', desc: 'Semester-wise curriculum, downloadable', to: '/programs' },
  { icon: ClipboardList, title: 'Admissions', desc: 'Eligibility, forms and deadlines', to: '/contact' },
];

export default function QuickAccessCards() {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ icon: Icon, title, desc, to }) => (
          <Link
            key={title}
            to={to}
            className="group bg-white dark:bg-navy-800 border border-navy-100 dark:border-navy-700 rounded-xl p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <div className="w-10 h-10 rounded-lg bg-teal-50 dark:bg-navy-700 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-4">
              <Icon size={19} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-navy dark:text-paper text-sm sm:text-base">{title}</h3>
              <ArrowUpRight size={15} className="text-navy-300 group-hover:text-marigold-500 transition-colors" />
            </div>
            <p className="text-xs sm:text-sm text-navy-400 dark:text-navy-200 mt-1.5">{desc}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
