import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, HelpCircle } from 'lucide-react';
import { motion } from 'motion/react';

const tiers = [
  {
    name: 'Starter',
    priceId: 'starter',
    priceMonthly: 29,
    priceAnnually: 23,
    description: 'Best for solo founders, freelancers, and very small businesses that need simple financial clarity.',
    features: [
      '1 company',
      '3 users',
      '3 dashboards',
      '3 data sources',
      'CSV, Excel, or Google Sheets import',
      'Revenue dashboard',
      'Expense dashboard',
      'Profit margin tracking',
      'Basic KPI templates',
      'PDF export',
      'Monthly AI summary'
    ],
    cta: 'Get Started',
    popular: false
  },
  {
    name: 'Growth',
    priceId: 'growth',
    priceMonthly: 79,
    priceAnnually: 63,
    description: 'Best for small businesses that want to actively manage performance.',
    features: [
      'Everything in Starter, plus:',
      'Up to 3 companies or locations',
      '10 users',
      '10 dashboards',
      '10 data sources',
      'Daily or hourly refresh',
      'Budget vs. actual tracking',
      'Cash-flow snapshot',
      'Accounts receivable / payable dashboard',
      'KPI goal tracking',
      'Scheduled email reports',
      'AI financial insights',
      'Performance alerts'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Professional',
    priceId: 'professional',
    priceMonthly: 149,
    priceAnnually: 119,
    description: 'Best for growing companies that need deeper financial analysis.',
    features: [
      'Everything in Growth, plus:',
      'Up to 10 companies, departments, or locations',
      'Unlimited viewer users',
      '25 data sources',
      'Custom KPI builder',
      'Forecasting',
      'Variance analysis',
      'Department/location performance tracking',
      'Role-based permissions',
      'Branded reports',
      'Dashboard comments',
      'Priority support'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Advisor',
    priceId: 'advisor',
    priceMonthly: 299,
    priceAnnually: 239,
    description: 'Best for bookkeepers, consultants, fractional CFOs, and agencies managing multiple clients.',
    features: [
      'Everything in Professional, plus:',
      '25 client workspaces',
      'Unlimited client viewers',
      '50 data sources',
      'Client dashboard portal',
      'White-labeled reports',
      'Reusable dashboard templates',
      'Batch PDF report exports',
      'Client-specific KPI dashboards',
      'Priority onboarding',
      'Premium support'
    ],
    cta: 'Start Advisor Trial',
    popular: false
  }
];

const faqs = [
  {
    question: "Do I need technical skills to use Klarity?",
    answer: "Not at all. Klarity is designed specifically to be easier to use than complex FP&A or generic BI tools. You can get started by importing standard CSV/Excel files."
  },
  {
    question: "Can I upgrade or downgrade my plan?",
    answer: "Yes, you can change your plan at any time to match your business needs. Changes to annual plans will be prorated."
  },
  {
    question: "Is my financial data secure?",
    answer: "Absolutely. We use bank-level encryption and industry best practices to ensure your financial data is secure and private."
  }
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(true);

  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600">Pricing</h2>
          <p className="mt-2 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Financial clarity for every stage of growth
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-8 text-slate-600">
            Powerful financial dashboards without the complexity of generic BI tools. Affordable, intuitive, and ready to use.
          </p>
        </div>

        <div className="mt-8 flex justify-center items-center gap-4">
          <span className={`text-sm font-medium ${!annual ? 'text-slate-900' : 'text-slate-500'}`}>Monthly</span>
          <button
            type="button"
            className="group relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-teal-600 focus:ring-offset-2"
            role="switch"
            aria-checked={annual.toString()}
            onClick={() => setAnnual(!annual)}
          >
            <span className="sr-only">Toggle annual billing</span>
            <span aria-hidden="true" className="pointer-events-none absolute h-full w-full rounded-md bg-white"></span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute mx-auto h-4 w-9 rounded-full transition-colors duration-200 ease-in-out ${annual ? 'bg-teal-600' : 'bg-slate-200'}`}
            ></span>
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute left-0 inline-block h-5 w-5 transform rounded-full border border-slate-200 bg-white shadow ring-0 transition-transform duration-200 ease-in-out ${annual ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
          </button>
          <span className={`text-sm font-medium ${annual ? 'text-slate-900' : 'text-slate-500'}`}>
            Annually <span className="text-teal-600 ml-1">(Save 20%)</span>
          </span>
        </div>
        
        <div className="isolate mx-auto mt-12 grid max-w-md grid-cols-1 gap-y-8 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4 lg:gap-x-8">
          {tiers.map((tier, tierIdx) => (
            <motion.div
              key={tier.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: tierIdx * 0.1 }}
              className={`flex flex-col justify-between rounded-3xl p-8 xl:p-10 ${
                tier.popular ? 'bg-slate-900 text-white ring-1 ring-slate-900' : 'ring-1 ring-slate-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-x-4">
                  <h3 className={`text-lg font-semibold leading-8 ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                    {tier.name}
                  </h3>
                  {tier.popular && (
                    <p className="rounded-full bg-teal-500/10 px-2.5 py-1 text-xs font-semibold leading-5 text-teal-400">
                      Most popular
                    </p>
                  )}
                </div>
                <p className={`mt-4 text-sm leading-6 ${tier.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.description}
                </p>
                <p className="mt-6 flex items-baseline gap-x-1">
                  <span className={`text-4xl font-bold tracking-tight ${tier.popular ? 'text-white' : 'text-slate-900'}`}>
                    ${annual ? tier.priceAnnually : tier.priceMonthly}
                  </span>
                  <span className={`text-sm font-semibold leading-6 ${tier.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                    /mo
                  </span>
                </p>
                <p className={`mt-1 text-xs ${tier.popular ? 'text-slate-400' : 'text-slate-500'}`}>
                  {annual ? 'Billed annually' : 'Billed monthly'}
                </p>
                
                <a
                  href="/app"
                  className={`mt-6 block rounded-md px-3 py-2 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 w-full ${
                    tier.popular
                      ? 'bg-teal-500 text-white hover:bg-teal-400 focus-visible:outline-teal-500'
                      : 'bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-900'
                  }`}
                >
                  {tier.cta}
                </a>

                <ul className={`mt-8 space-y-3 text-sm leading-6 ${tier.popular ? 'text-slate-300' : 'text-slate-600'}`}>
                  {tier.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex gap-x-3">
                      <CheckCircle2
                        className={`h-6 w-5 flex-none ${tier.popular ? 'text-teal-400' : 'text-teal-600'}`}
                        aria-hidden="true"
                      />
                      <span className={feature.includes('Everything in') ? 'font-medium' : ''}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-slate-500">
            Need more capacity or custom integrations? <a href="#" className="font-semibold text-teal-600 hover:text-teal-500">Contact our sales team</a> for enterprise volume pricing.
          </p>
        </div>

        {/* Why Klarity Section */}
        <div className="mx-auto mt-24 max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-teal-600">Why Klarity?</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Finance intelligence, simplified.
            </p>
            <p className="mt-6 text-lg leading-8 text-slate-600">
              Generic BI tools are too raw. Traditional FP&A software is too complex. Klarity hits the perfect middle ground, giving you finance-focused dashboards that are easy to set up and impossible to misinterpret. 
            </p>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mx-auto max-w-4xl mt-24">
          <h2 className="text-2xl font-bold leading-10 tracking-tight text-slate-900 mb-8">Frequently asked questions</h2>
          <dl className="mt-10 space-y-8 divide-y divide-slate-900/10">
            {faqs.map((faq) => (
              <div key={faq.question} className="pt-8 lg:grid lg:grid-cols-12 lg:gap-8">
                <dt className="text-base font-semibold leading-7 text-slate-900 lg:col-span-5 flex items-start gap-3">
                  <HelpCircle className="w-5 h-5 text-teal-600 mt-1 flex-shrink-0" />
                  {faq.question}
                </dt>
                <dd className="mt-4 lg:col-span-7 lg:mt-0">
                  <p className="text-base leading-7 text-slate-600">{faq.answer}</p>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

