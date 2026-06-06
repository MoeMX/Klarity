export function KlarityLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="100" height="100" rx="24" fill="#0B1120" />
      
      <g stroke="#1E293B" strokeWidth="1.5">
        <line x1="30" y1="20" x2="30" y2="80" />
        <line x1="50" y1="20" x2="50" y2="80" />
        <line x1="70" y1="20" x2="70" y2="80" />
        
        <line x1="20" y1="30" x2="80" y2="30" />
        <line x1="20" y1="50" x2="80" y2="50" />
        <line x1="20" y1="70" x2="80" y2="70" />
      </g>

      <defs>
        <linearGradient id="leg-grad" x1="40" y1="50" x2="70" y2="75" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0EA5E9" />
          <stop offset="100%" stopColor="#4ADE80" />
        </linearGradient>
      </defs>

      {/* Top Right Arm */}
      <path d="M40 50 L70 25" stroke="#22D3EE" strokeWidth="14" strokeLinecap="round" />
      <circle cx="70" cy="25" r="7" fill="#38BDF8" />

      {/* Bottom Right Arm */}
      <path d="M40 50 L70 75" stroke="url(#leg-grad)" strokeWidth="14" strokeLinecap="round" />
      <circle cx="70" cy="75" r="7" fill="#86EFAC" />

      {/* Vertical Spine */}
      <path d="M36 26 L36 74" stroke="#F8FAFC" strokeWidth="14" strokeLinecap="round" />
      
      {/* Center Joint */}
      <circle cx="36" cy="50" r="7" fill="#F8FAFC" />
    </svg>
  );
}
