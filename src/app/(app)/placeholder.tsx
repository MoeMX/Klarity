import { Link } from "react-router-dom";

export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm">
      <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 mb-6">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
      </div>
      <h2 className="text-2xl font-black text-slate-900 mb-2">{title}</h2>
      <p className="text-slate-500 max-w-sm mx-auto mb-8">
        This feature is currently under active development. Check back soon for updates to the {title.toLowerCase()} module.
      </p>
      <Link to="/app/dashboard" className="px-6 py-3 font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors">
        Return to Executive Summary
      </Link>
    </div>
  );
}
