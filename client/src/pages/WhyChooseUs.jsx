import React from 'react';

export default function WhyChooseUs() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      ),
      title: 'TU Affiliated Programs',
      description: 'Offering industry-aligned BCA & B.Sc. CSIT degrees with standard 4-year, 8-semester curriculum excellence.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: 'Industry Partnerships & 100% Placement',
      description: 'Direct ties with top IT & Fintech giants like F1Soft and eSewa to provide internships, workshops, and career readiness.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: 'Practical & Professional Training',
      description: 'Beyond standard theory, students gain hands-on expertise through continuous lab work, bootcamps, and real projects.',
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: 'Experienced Faculty',
      description: 'Guided by seasoned educators, tech leaders, and vibrant entrepreneurs dedicated to student mentorship.',
    },
  ];

  return (
    <section className="w-full bg-slate-50/80 dark:bg-navy-900/90 py-16 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60 dark:border-navy-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D9383A] dark:text-[#3B82F6]">
            Excellence in Education
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white tracking-tight mt-2">
            Why <span className="text-[#D9383A] dark:text-[#3B82F6]">Choose Us?</span>
          </h2>
          <p className="text-slate-600 dark:text-navy-100 text-sm sm:text-base mt-3 leading-relaxed">
            Empowering students with quality education, modern facilities, and real-world tech exposure to shape the next generation of leaders.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {features.map((item, index) => (
            <div
              key={index}
              className="bg-white dark:bg-navy-800 p-6 sm:p-8 rounded-2xl border border-slate-200/80 dark:border-navy-700/80 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-5 group"
            >
              {/* Icon Container */}
              <div className="p-3 bg-red-50 dark:bg-navy-700/60 group-hover:bg-[#D9383A] dark:group-hover:bg-[#1E3A8A] rounded-xl transition-colors duration-300 shrink-0">
                {React.cloneElement(item.icon, {
                  className: "w-6 h-6 text-[#D9383A] dark:text-blue-400 group-hover:text-white dark:group-hover:text-white transition-colors duration-300"
                })}
              </div>

              {/* Text Body */}
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-600 dark:text-navy-100 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}