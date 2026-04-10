export default function FitryxLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rounded square background with gradient */}
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2dd4bf" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id="slash-grad" x1="26" y1="8" x2="30" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="11" fill="url(#logo-grad)" />
      {/* Bold geometric F */}
      <path
        d="M12 9.5h14v5H18v3.5h6.5v5H18V31h-6V9.5Z"
        fill="#0d0d17"
        opacity="0.9"
      />
      {/* Energy slash accent */}
      <rect x="28.5" y="9" width="3" height="13" rx="1.5" fill="url(#slash-grad)" />
    </svg>
  )
}
