import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Company } from '../../../types';
import { Target, TrendingUp, DollarSign, Users, Award, Plus } from 'lucide-react';
import { NoClientState } from '../../../components/ui/NoClientState';
import { Modal } from '../../../components/ui/Modal';

const initialGoals = [
  {
    id: 1,
    title: "Annual Revenue Target",
    metric: "$2.5M",
    current: "$1.8M",
    progress: 72,
    icon: DollarSign,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    barColor: "bg-emerald-500",
    status: "On Track",
    milestones: [
      { id: 101, text: "Q1 Finalized Contracts", date: "Mar 31", completed: true },
      { id: 102, text: "Q2 Upsell Campaign", date: "Jun 30", completed: true },
      { id: 103, text: "Q3 Holiday Push Prep", date: "Sep 30", completed: false },
    ]
  },
  {
    id: 2,
    title: "Profit Margin",
    metric: "25%",
    current: "22%",
    progress: 88,
    icon: TrendingUp,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    barColor: "bg-indigo-500",
    status: "Slightly Behind",
    milestones: [
      { id: 201, text: "Cloud Cost Optimization", date: "Feb 28", completed: true },
      { id: 202, text: "Vendor Renegotiation", date: "May 15", completed: false },
      { id: 203, text: "Price Increase Rollout", date: "Aug 01", completed: false },
    ]
  },
  {
    id: 3,
    title: "Customer Acquisition",
    metric: "500 Users",
    current: "450 Users",
    progress: 90,
    icon: Users,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    barColor: "bg-blue-500",
    status: "On Track",
    milestones: [
      { id: 301, text: "SEO Audit Complete", date: "Jan 15", completed: true },
      { id: 302, text: "Referral Program Launch", date: "Apr 10", completed: true },
      { id: 303, text: "Enterprise Tier Launch", date: "Jul 20", completed: false },
    ]
  },
  {
    id: 4,
    title: "Market Share Growth",
    metric: "15%",
    current: "8%",
    progress: 53,
    icon: Award,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    barColor: "bg-purple-500",
    status: "Needs Attention",
    milestones: [
      { id: 401, text: "Competitor Analysis", date: "Jan 30", completed: true },
      { id: 402, text: "New Region Expansion", date: "Jun 15", completed: false },
      { id: 403, text: "Partnership Announcement", date: "Nov 01", completed: false },
    ]
  }
];

export default function GoalsPage() {
  const { activeCompany } = useOutletContext<{ activeCompany: Company }>();
  const [goals, setGoals] = useState(initialGoals);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '', metric: '', current: '', progress: 0
  });

  if (!activeCompany) return <NoClientState />;

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    setGoals([...goals, {
      id: Date.now(),
      title: newGoal.title,
      metric: newGoal.metric,
      current: newGoal.current,
      progress: newGoal.progress,
      icon: Target,
      color: "text-slate-600",
      bgColor: "bg-slate-50",
      barColor: "bg-slate-500",
      status: "On Track",
      milestones: []
    }]);
    setNewGoal({ title: '', metric: '', current: '', progress: 0 });
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-1 flex items-center gap-2">
            <Target className="w-8 h-8 text-teal-600" />
            Strategic Goals
          </h1>
          <p className="text-sm font-medium text-slate-500">Tracking KPIs and objectives for {activeCompany.name}</p>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {goals.map((goal) => (
          <div key={goal.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col group hover:border-teal-200 transition-colors">
            <div className="flex items-center justify-between mx-1 mb-4">
               <div className="flex items-center gap-3">
                 <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${goal.bgColor} ${goal.color}`}>
                   <goal.icon className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="text-lg font-bold text-slate-900">{goal.title}</h3>
                   <p className="text-sm text-slate-500 font-medium">Target: {goal.metric}</p>
                 </div>
               </div>
               <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                 goal.status === 'On Track' ? 'bg-emerald-50 text-emerald-700' :
                 goal.status === 'Slightly Behind' ? 'bg-amber-50 text-amber-700' :
                 'bg-rose-50 text-rose-700'
               }`}>
                 {goal.status}
               </span>
            </div>

            <div className="mt-4 flex-grow flex flex-col">
              <div className="flex justify-between text-sm font-bold mb-2">
                <span className="text-slate-900">{goal.current}</span>
                <span className={goal.color}>{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-6">
                <div 
                  className={`h-3 rounded-full ${goal.barColor} transition-all duration-1000 ease-out`}
                  style={{ width: `${goal.progress}%` }}
                ></div>
              </div>

              <div className="space-y-3 mt-auto">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sub-Milestones</h4>
                {goal.milestones.map((milestone) => (
                  <label key={milestone.id} className="flex items-start gap-3 p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors group">
                    <div className="relative flex items-start pt-0.5">
                      <input 
                        type="checkbox" 
                        defaultChecked={milestone.completed}
                        className={`w-4 h-4 mt-0.5 rounded border-slate-300 text-${goal.color.split('-')[1]}-600 focus:ring-${goal.color.split('-')[1]}-500 cursor-pointer`}
                      />
                    </div>
                    <div className="flex-1 flex justify-between items-center">
                      <span className={`text-sm font-medium transition-colors ${milestone.completed ? 'text-slate-400 line-through' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {milestone.text}
                      </span>
                      <span className={`text-xs ml-2 py-0.5 px-2 rounded-md ${milestone.completed ? 'bg-slate-100 text-slate-400' : 'bg-slate-100 text-slate-500 font-medium'}`}>
                        {milestone.date}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Add New Goal">
        <form onSubmit={handleAddGoal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Goal Title</label>
              <input required type="text" value={newGoal.title} onChange={e => setNewGoal({...newGoal, title: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. Annual Revenue Target" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Target Metric</label>
              <input required type="text" value={newGoal.metric} onChange={e => setNewGoal({...newGoal, metric: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. $2.5M" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Current Progress</label>
              <input required type="text" value={newGoal.current} onChange={e => setNewGoal({...newGoal, current: e.target.value})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. $1.8M" />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Progress Percentage (%)</label>
              <input required type="number" min="0" max="100" value={newGoal.progress} onChange={e => setNewGoal({...newGoal, progress: parseInt(e.target.value) || 0})} className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none" placeholder="e.g. 72" />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-teal-600 text-white text-sm font-medium rounded-lg hover:bg-teal-700 transition-colors">Add Goal</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
