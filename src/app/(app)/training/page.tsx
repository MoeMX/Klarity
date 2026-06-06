import React, { useState } from 'react';
import { PlayCircle, FileText, CheckCircle2, ChevronRight, BookOpen, Clock, Lock } from 'lucide-react';

const MODULES = [
  {
    id: 'm1',
    title: 'Getting Started with Klarity',
    description: 'Learn the basics of navigating the platform, setting up your firm profile, and adding your first client.',
    duration: '12 min',
    isCompleted: true,
    videoUrl: 'https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      Welcome to Klarity! In this introductory module, we cover:
      - the general layout of the dashboard
      - how to manage your firm overview
      - adding new clients and managing their active state
      - navigating between different analysis tools
    `
  },
  {
    id: 'm2',
    title: 'Connecting Integrations securely',
    description: 'A walkthrough of the integrations page, adding OAuth connections, and managing custom API keys.',
    duration: '18 min',
    isCompleted: false,
    videoUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      Learn how to safely connect third-party platforms to Klarity.
      
      Step 1: Go to the Integrations tab.
      Step 2: Click 'Connect' on any supported app.
      Step 3: Review the OAuth permission scopes.
      Step 4: Authorize to pull in data.
      
      We also cover how to use custom API keys for enterprise use cases.
    `
  },
  {
    id: 'm3',
    title: 'Financial Performance & Cash Flow',
    description: 'Deep dive into interpreting financial metrics, setting targets, and analyzing cash runways.',
    duration: '24 min',
    isCompleted: false,
    locked: false,
    videoUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      The Financial Performance tab gives you a unified view of your client's health.
      
      - Understand Revenue vs Expenses trends.
      - Track Net Margin quarter over quarter.
      - Use the Cash Flow Monitor to predict runway based on current burn rate.
    `
  },
  {
    id: 'm4',
    title: 'Advanced: Scenarios & Forecasting',
    description: 'Learn how to use the HR Scenario builder and Debt Calculator to model strategic decisions.',
    duration: '30 min',
    isCompleted: false,
    locked: true,
    videoUrl: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=1200&h=600',
    content: `
      This module is locked until you complete the prerequisite modules.
    `
  }
];

export default function TrainingPage() {
  const [activeModule, setActiveModule] = useState(MODULES[0]);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Resource & Training Center</h1>
          <p className="text-sm border-slate-500 mt-1 text-slate-500">Master the platform with video guides and written modules.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-20">
        {/* Module List Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-teal-600" />
                Training Modules
              </h2>
            </div>
            <div className="divide-y divide-slate-100">
              {MODULES.map((mod) => (
                <button
                  key={mod.id}
                  onClick={() => !mod.locked && setActiveModule(mod)}
                  disabled={mod.locked}
                  className={`w-full text-left p-4 hover:bg-slate-50 transition-colors flex items-start gap-3 ${
                    activeModule.id === mod.id ? 'bg-teal-50/50 relative' : ''
                  } ${mod.locked ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  {activeModule.id === mod.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-teal-600" />
                  )}
                  <div className="mt-0.5">
                    {mod.locked ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : mod.isCompleted ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                      <PlayCircle className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-sm font-bold ${activeModule.id === mod.id ? 'text-teal-900' : 'text-slate-900'}`}>
                      {mod.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {mod.duration}
                    </div>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${activeModule.id === mod.id ? 'text-teal-600' : 'text-slate-300'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Video Player Placeholder */}
          <div className="bg-slate-900 rounded-3xl overflow-hidden aspect-video relative group shadow-lg">
            <img 
              src={activeModule.videoUrl} 
              alt={activeModule.title} 
              className="w-full h-full object-cover opacity-60 transition-opacity group-hover:opacity-50"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl hover:scale-110">
                <PlayCircle className="w-8 h-8 fill-current" />
              </button>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900/90 to-transparent">
              <div className="flex items-center justify-between text-white">
                <span className="font-bold">{activeModule.title}</span>
                <span className="text-sm font-medium">{activeModule.duration}</span>
              </div>
              <div className="w-full h-1 bg-white/30 rounded-full mt-3 overflow-hidden">
                <div className="h-full bg-teal-500 w-1/3" />
              </div>
            </div>
          </div>

          {/* Written Content */}
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex items-start justify-between mb-6 pb-6 border-b border-slate-100">
              <div>
                <h2 className="text-xl font-black text-slate-900 mb-2">{activeModule.title}</h2>
                <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Written Guide & Transcript
                </p>
              </div>
              {!activeModule.isCompleted && (
                <button 
                  className="px-4 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 hover:text-teal-800 rounded-xl font-bold text-sm transition-colors border border-teal-100 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </button>
              )}
            </div>
            
            <div className="prose prose-slate prose-sm max-w-none text-slate-600 leading-relaxed font-medium">
              {activeModule.content.split('\\n').map((paragraph, idx) => (
                <p key={idx} className="mb-4">
                  {paragraph.trim().startsWith('-') ? (
                    <span className="flex gap-2">
                      <span className="text-teal-600 mt-1">•</span>
                      <span>{paragraph.trim().substring(1).trim()}</span>
                    </span>
                  ) : (
                    paragraph.trim()
                  )}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
