export default function FitryxLogo({ className = 'w-8 h-8' }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Rounded hex background */}
      <rect width="40" height="40" rx="10" fill="currentColor" className="text-primary" />
      {/* F letterform — bold geometric */}
      <path
        d="M13 10h14v4.5H18.5v4h7v4.5h-7V30H13V10Z"
        fill="currentColor"
        className="text-primary-foreground"
      />
      {/* Accent bar — energy slash */}
      <rect x="28" y="10" width="3.5" height="12" rx="1.75" fill="currentColor" className="text-primary-foreground" opacity="0.6" />
    </svg>
  )
}
