import { Link, Outlet } from 'react-router-dom';
import { platformConfig } from '../../config/platformConfig';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { KlarityLogo } from '../../components/KlarityLogo';

export default function MarketingLayout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2">
              <KlarityLogo className="h-8 w-8" />
              <span className="text-xl font-bold tracking-tight text-slate-900">{platformConfig.productName}</span>
            </div>
            
            <nav className="hidden md:flex gap-8 items-center">
              <Link to="/features" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Features</Link>
              <Link to="/pricing" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Pricing</Link>
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900">Login</Link>
                <Link to="/pricing" className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition-colors">
                  Request Demo
                </Link>
              </div>
            </nav>

            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-600">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-4 shadow-xl">
            <Link to="/features" className="block text-base font-medium text-slate-600">Features</Link>
            <Link to="/pricing" className="block text-base font-medium text-slate-600">Pricing</Link>
            <hr className="border-slate-200" />
            <Link to="/login" className="block text-base font-medium text-slate-600">Login</Link>
            <Link to="/pricing" className="block rounded-lg bg-slate-900 px-4 py-2 text-center text-base font-medium text-white">
              Request Demo
            </Link>
          </div>
        )}
      </header>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <KlarityLogo className="h-6 w-6 opacity-80" />
            <span className="text-lg font-bold text-slate-900">{platformConfig.productName}</span>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {platformConfig.productName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
