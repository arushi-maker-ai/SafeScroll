import React, { useState } from 'react';
import {
  Newspaper,
  Calendar,
  Clock,
  Search,
  ExternalLink,
  BookOpen,
  X,
  Share2,
  Bookmark,
  Sparkles,
  CheckCircle2,
  Tag,
  ArrowRight,
} from 'lucide-react';
import { NEWS_ARTICLES } from '../data/defaultData';
import { NewsArticle } from '../types';

export const NewsView: React.FC = () => {
  const [articles] = useState<NewsArticle[]>(NEWS_ARTICLES);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeArticleModal, setActiveArticleModal] = useState<NewsArticle | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Mental Health', 'Brain Science', 'Legislation & Safety', 'Parent Guide'];

  const filteredArticles = articles.filter((a) => {
    if (selectedCategory !== 'All' && a.category !== selectedCategory) {
      return false;
    }
    if (
      searchQuery &&
      !a.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.summary.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !a.source.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const featuredArticle = articles[0];

  const handleShare = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCopiedId(id);
    navigator.clipboard?.writeText(window.location.href);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Header */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
            <Newspaper className="w-4 h-4" />
            Global Research & Policy News
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mt-1">
            Youth Social Media Impact News
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Curated scientific publications, clinical findings, and emerging child safety regulations worldwide.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
          <input
            type="text"
            placeholder="Search news & research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Featured Headline Article Banner */}
      {selectedCategory === 'All' && !searchQuery && featuredArticle && (
        <div
          onClick={() => setActiveArticleModal(featuredArticle)}
          className="group relative bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer grid grid-cols-1 lg:grid-cols-12"
        >
          <div className="lg:col-span-7 relative h-64 lg:h-auto overflow-hidden bg-slate-900">
            <img
              src={featuredArticle.imageUrl}
              alt={featuredArticle.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
            />
            <div className="absolute top-4 left-4">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider shadow-xs">
                Featured Lead Report
              </span>
            </div>
          </div>

          <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-semibold text-blue-600">{featuredArticle.source}</span>
                <span>•</span>
                <span>{featuredArticle.publishedDate}</span>
                <span>•</span>
                <span>{featuredArticle.readTime}</span>
              </div>

              <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-tight">
                {featuredArticle.title}
              </h2>

              <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                {featuredArticle.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                Read Full Advisory & Takeaways <ArrowRight className="w-3.5 h-3.5" />
              </span>
              <button
                onClick={(e) => handleShare(featuredArticle.id, e)}
                className="p-1.5 rounded text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                title="Share link"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <div
            key={article.id}
            onClick={() => setActiveArticleModal(article)}
            className="group bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              {/* Image */}
              <div className="relative h-44 overflow-hidden bg-slate-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold">
                  {article.category}
                </span>
                <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-white/90 text-slate-800 text-[10px] font-semibold">
                  {article.recommendedAgeFocus}
                </span>
              </div>

              {/* Content */}
              <div className="p-5 space-y-2">
                <div className="flex items-center gap-2 text-[11px] text-slate-500">
                  <span className="font-semibold text-blue-600">{article.source}</span>
                  <span>•</span>
                  <span>{article.publishedDate}</span>
                </div>

                <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                  {article.summary}
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-600 group-hover:underline flex items-center gap-1">
                Read Study <ArrowRight className="w-3.5 h-3.5" />
              </span>

              <button
                onClick={(e) => handleShare(article.id, e)}
                className="p-1 rounded text-slate-400 hover:text-blue-600 hover:bg-slate-100"
              >
                {copiedId === article.id ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {activeArticleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative h-52 bg-slate-900">
              <img
                src={activeArticleModal.imageUrl}
                alt={activeArticleModal.title}
                className="w-full h-full object-cover opacity-85"
              />
              <button
                onClick={() => setActiveArticleModal(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-4 left-4 flex gap-2">
                <span className="px-2.5 py-0.5 rounded bg-blue-600 text-white text-xs font-bold">
                  {activeArticleModal.category}
                </span>
                <span className="px-2.5 py-0.5 rounded bg-white/90 text-slate-900 text-xs font-semibold">
                  Focus: {activeArticleModal.recommendedAgeFocus}
                </span>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-bold text-blue-600">{activeArticleModal.source}</span>
                  <span>•</span>
                  <span>{activeArticleModal.author}</span>
                  <span>•</span>
                  <span>{activeArticleModal.publishedDate}</span>
                </div>
                <h2 className="text-xl font-bold text-blue-900 leading-tight">
                  {activeArticleModal.title}
                </h2>
              </div>

              <div className="p-4 rounded-lg bg-blue-50 border border-blue-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5 mb-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  Key Clinical & Parent Takeaways
                </h4>
                <ul className="space-y-1.5">
                  {activeArticleModal.keyTakeaways.map((takeaway, idx) => (
                    <li
                      key={idx}
                      className="text-xs text-slate-700 flex items-start gap-2 leading-relaxed"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{takeaway}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-slate-600 text-xs sm:text-sm leading-relaxed space-y-3">
                <p>{activeArticleModal.content}</p>
                <p>
                  Researchers emphasize that maintaining a regular feedback loop with children regarding how apps make them feel—combined with automated parental threshold alerts—is the most effective way to foster digital literacy without breeding resentment.
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-medium">
                  Reference: ShieldKids Youth Digital Literacy Database
                </span>
                <button
                  onClick={() => setActiveArticleModal(null)}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-md shadow-xs"
                >
                  Close Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
