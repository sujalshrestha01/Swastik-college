import React from "react";

export default function TakeATour() {
  return (
    <section className="w-full bg-white dark:bg-navy-900/90 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100 dark:border-navy-700 transition-colors duration-300">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left Column: Responsive Video Container */}
        <div className="w-full">
          <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-md dark:shadow-navy-950/50 bg-black border border-slate-200/60 dark:border-navy-700">
            <iframe
              className="absolute top-0 left-0 w-full h-full border-0"
              src="https://www.youtube-nocookie.com/embed/ZohVkVKwLQc"
              title="Why F1Soft and eSewa are in Swastik College"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>

        {/* Right Column: Content */}
        <div className="flex flex-col justify-center space-y-4">
          <span className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-[#D9383A] dark:text-[#3B82F6]">
            Take a tour
          </span>

          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
            Why F1Soft and eSewa are in Swastik College?
          </h2>

          <p className="text-slate-600 dark:text-navy-100 text-sm sm:text-base leading-relaxed">
            Swastik College is one of the best IT colleges in Nepal. It offers
            BCA and B.Sc. CSIT, 4 years - 8 semesters, courses affiliated with
            TU. This college has recently partnered with F1Soft group of
            companies including eSewa. Apart from high quality regular classes,
            Swastik College provides extra professional training, workshops, and
            100% Job placement to its IT students.
          </p>
        </div>
      </div>
    </section>
  );
}
