import { useEffect, useState } from "react";
import { Link } from "react-router";
import { ArrowRight, BookOpen } from "lucide-react";
import { getBlogs, resolveImageUrl } from "../api/client";
import { useSettings } from "../context/SettingsContext";

function formatDate(iso) {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function BlogSection() {
  const { settings, isPageEnabled } = useSettings();
  const isBlogDisabled =
    settings?.features?.blogDisabled || !isPageEnabled("blog");
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    if (!isBlogDisabled) {
      getBlogs()
        .then((data) => setBlogs(data ? data.slice(0, 3) : []))
        .catch((err) => console.error("Failed to load blogs:", err));
    }
  }, [isBlogDisabled]);

  // Completely hide this section when disabled
  if (isBlogDisabled) {
    return null;
  }

  return (
    <section className="py-16 sm:py-20 bg-white dark:bg-navy-900/90 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              Featured Articles &amp; Insights
            </h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1 text-sm font-semibold text-[#D9383A] dark:text-[#3B82F6] hover:underline"
          >
            Explore all posts <ArrowRight size={16} />
          </Link>
        </div>

        {blogs.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-navy-100/70 italic">
            No published articles available right now.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {blogs.map((article) => (
              <article
                key={article._id || article.id || article.slug}
                className="group bg-white dark:bg-navy-800/80 rounded-r-2xl rounded-l-md overflow-hidden  shadow-xs hover:shadow-md dark:shadow-navy-950/50 transition-all duration-300 flex flex-col justify-between"
              >
                {article.imageUrl && (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={resolveImageUrl(article.imageUrl)}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-navy-100/70 mb-3">
                      <span className="font-mono uppercase px-2.5 py-1 rounded-md bg-red-50 dark:bg-blue-950/50 border border-red-100 dark:border-blue-900/40 text-[#D9383A] dark:text-[#3B82F6] font-semibold">
                        {article.category || "General"}
                      </span>
                      <span className="font-mono">
                        {formatDate(article.createdAt || article.date)}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-slate-900 dark:text-white group-hover:text-[#D9383A] dark:group-hover:text-[#3B82F6] transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-xs text-slate-600 dark:text-navy-100 mt-2 line-clamp-3 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>

                  <Link
                    to="/blog"
                    className="mt-6 inline-flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-navy-100 group-hover:text-[#D9383A] dark:group-hover:text-[#3B82F6] transition-colors"
                  >
                    Read Story <ArrowRight size={14} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
