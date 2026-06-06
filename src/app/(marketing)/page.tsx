import { Link } from 'react-router-dom';
import { platformConfig } from '../../config/platformConfig';
import { ArrowRight, CheckCircle2, ChevronRight, BarChart, TrendingUp, PieChart, LineChart } from 'lucide-react';
import { motion } from 'motion/react';

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 pb-32">
        <div className="absolute inset-0 bg-slate-50 -z-10" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl"
          >
            <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl mb-6">
              Simple KPI Dashboards for <span className="text-teal-600">Business Owners</span> and <span className="text-slate-600">Advisory Teams</span>
            </h1>
            <p className="text-lg leading-8 text-slate-600 mb-10">
              Turn financial and operational data into clear, visual dashboards your clients and leadership teams can understand in minutes. Built for CPA advisory, bookkeeping, fractional CFO, and small business reporting.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/pricing" className="rounded-full bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-sm hover:focus:outline-none hover:bg-slate-800 transition-all flex items-center gap-2">
                Request a Demo <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/app" className="rounded-full bg-white px-8 py-3.5 text-base font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50 transition-all">
                View Dashboard Examples
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature section */}
      <section className="py-24 bg-white sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl sm:text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-teal-600">Klarity over Complexity</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Business intelligence without the complicated setup.</p>
            <p className="mt-6 text-lg leading-8 text-slate-600">We replace spreadsheet confusion with clean KPI reporting. Reusable templates, client management, and clear numbers.</p>
          </div>
          
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  title: 'Multi-Client Management',
                  description: 'Perfect for CPA & Bookkeeping firms. Manage all your client dashboards from one central workspace.',
                  icon: BarChart
                },
                {
                  title: 'Industry Templates',
                  description: 'Start with ready-made dashboard templates for real estate, creative agencies, medical offices, and more.',
                  icon: TrendingUp
                },
                {
                  title: 'Executive Summaries',
                  description: 'Auto-generated plain-english insights. Let the dashboard tell you exactly what the numbers mean.',
                  icon: LineChart
                }
              ].map((feature) => (
                <div key={feature.title} className="flex flex-col bg-slate-50 rounded-2xl p-8 ring-1 ring-slate-200">
                  <dt className="flex items-center gap-x-3 text-lg font-semibold leading-7 text-slate-900">
                    <feature.icon className="h-6 w-6 flex-none text-teal-600" aria-hidden="true" />
                    {feature.title}
                  </dt>
                  <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-slate-600">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* CPA Firm Use Case */}
      <section className="py-24 bg-slate-900 text-white sm:py-32">
         <div className="mx-auto max-w-7xl px-6 lg:px-8 flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/2">
              <h2 className="text-base font-semibold leading-7 text-teal-400">For CPA & Advisory Firms</h2>
              <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Elevate your advisory services.</p>
              <p className="mt-6 text-lg leading-8 text-slate-300">Package and sell dashboard reporting. Give your clients a clear view of their business health, prepare better for advisory meetings, and monitor portfolio risk with a dedicated client health scorecard.</p>
              
              <ul className="mt-8 space-y-4">
                {['Create reusable dashboard packages', 'White-label with your firm branding', 'Client health scores (Healthy to Critical)'].map(item => (
                  <li key={item} className="flex gap-x-3 text-slate-300">
                    <CheckCircle2 className="h-6 w-6flex-none text-teal-400" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:w-1/2 bg-slate-800 rounded-xl p-8 border border-slate-700 shadow-2xl">
               <div className="flex items-center justify-between mb-6 pb-6 border-b border-slate-700">
                 <div>
                   <h3 className="font-semibold text-lg">Client Health Overview</h3>
                   <span className="text-slate-400 text-sm">Firm Dashboard</span>
                 </div>
               </div>
               <div className="space-y-4">
                 {[ 
                   { name: 'Apex Solutions Group', score: 'Healthy', color: 'bg-green-500' },
                   { name: 'Vanguard Medical', score: 'Watch', color: 'bg-amber-500' },
                   { name: 'Precision Construction', score: 'Critical', color: 'bg-red-500' },
                 ].map(client => (
                   <div key={client.name} className="flex justify-between items-center bg-slate-700/50 p-4 rounded-lg">
                     <span className="font-medium text-slate-200">{client.name}</span>
                     <div className="flex items-center gap-2">
                       <span className="text-sm text-slate-400">{client.score}</span>
                       <div className={`h-2.5 w-2.5 rounded-full ${client.color}`} />
                     </div>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-teal-600 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="mx-auto max-w-2xl text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to turn your reports into visual insights?
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-teal-100">
            Start building your dashboard library today. Perfect for businesses and advisory firms.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link to="/pricing" className="rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-teal-900 shadow-sm hover:bg-slate-50 transition-colors">
              Request a Demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
