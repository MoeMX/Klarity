import { CheckCircle2, LayoutDashboard, LineChart, Table, Users, Building, FileBarChart } from 'lucide-react';

const features = [
  {
    name: 'Dashboard Builder',
    description: 'Create custom dashboards using our drag-and-drop builder, or start with an industry template.',
    icon: LayoutDashboard,
  },
  {
    name: 'KPI Library',
    description: 'Access over 100 pre-configured financial and operational KPIs mapped to industry standards.',
    icon: LineChart,
  },
  {
    name: 'CPA Client Management',
    description: 'A dedicated workspace for CPA and advisory firms to monitor multiple client portfolios at a glance.',
    icon: Users,
  },
  {
    name: 'CSV & Manual Upload',
    description: 'Clean data import workflow. Map your spreadsheet columns to our standard KPI fields easily.',
    icon: Table,
  },
  {
    name: 'White-Label Settings',
    description: 'Apply your custom agency or firm branding so your clients see your logo and colors.',
    icon: Building,
  },
  {
    name: 'Executive Reporting',
    description: 'Export beautiful PDF summaries complete with advisory notes to share in monthly reviews.',
    icon: FileBarChart,
  },
];

export default function FeaturesPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600">Powerful Platform</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Everything you need for business intelligence
          </p>
          <p className="mt-6 text-lg leading-8 text-slate-600">
            A comprehensive suite of tools designed specifically for business owners and the financial advisory firms that serve them.
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-slate-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-teal-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-slate-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
