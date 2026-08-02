import { Link } from "react-router";
import {
  Bell,
  GraduationCap,
  FileText,
  ClipboardList,
  ArrowUpRight,
} from "lucide-react";
import { useSettings } from "../context/SettingsContext";

const CARDS = [
  {
    icon: Bell,
    title: "Notice Board",
    desc: "Exam routines, admissions & college alerts",
    to: "/notices",
    page: "notices",
  },
  {
    icon: GraduationCap,
    title: "Courses",
    desc: "BSc. CSIT and BCA programs",
    to: "/programs",
    page: "programs",
  },
  {
    icon: FileText,
    title: "Syllabus",
    desc: "Semester-wise curriculum, downloadable",
    to: "/programs",
    page: "programs",
  },
  {
    icon: ClipboardList,
    title: "Admissions",
    desc: "Eligibility, forms and deadlines",
    to: "/contact",
    page: "contact",
  },
];

export default function QuickAccessCards() {
  const { isPageEnabled } = useSettings();
  const cards = CARDS.filter((c) => isPageEnabled(c.page));
  if (cards.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:flex md:justify-center">
        {cards.map(({ icon: Icon, title, desc, to }) => (
          <Link
            key={title}
            to={to}
            className="group bg-white dark:bg-slate-900 rounded-xl p-5 border-b-2 border-b-transparent hover:border-b-[#1E3A8A] dark:hover:border-b-blue-400 hover:-translate-y-1 transition-all duration-300 w-full lg:max-w-xs"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-slate-800 text-[#1E3A8A] dark:text-blue-400 group-hover:bg-[#1E3A8A] group-hover:text-white flex items-center justify-center mb-4 transition-colors">
              <Icon size={19} />
            </div>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-900 dark:text-white text-sm sm:text-base group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
              <ArrowUpRight
                size={15}
                className="text-slate-400 group-hover:text-[#1E3A8A] dark:group-hover:text-blue-400 transition-colors"
              />
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1.5">
              {desc}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
