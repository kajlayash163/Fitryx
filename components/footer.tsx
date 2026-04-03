import Link from 'next/link'
import { Twitter, Github, Linkedin } from 'lucide-react'
import FitryxLogo from '@/components/fitryx-logo'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-[oklch(0.09_0.010_250)]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <FitryxLogo className="w-8 h-8" />
            <span className="text-lg font-semibold text-foreground">Fitryx</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The premium platform for discovering and comparing gyms in your city.
          </p>
          <div className="flex items-center gap-3 pt-1">
            {[Twitter, Github, Linkedin].map((Icon, i) => (
              <a key={i} href="#" className="w-8 h-8 rounded-lg border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                <Icon className="w-3.5 h-3.5" />
              </a>
            ))}
          </div>
        </div>

        {/* Product links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Product</p>
          <Link href="/gyms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Gyms</Link>
          <Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compare</Link>
          <Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fitness Tools</Link>
          <Link href="/favorites" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Favorites</Link>
        </div>

        {/* Company links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Company</p>
          <span className="text-sm text-muted-foreground/50 cursor-default">About — Coming Soon</span>
          <span className="text-sm text-muted-foreground/50 cursor-default">Blog — Coming Soon</span>
          <span className="text-sm text-muted-foreground/50 cursor-default">Careers — Coming Soon</span>
        </div>

        {/* Legal links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Account</p>
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sign In</Link>
          <Link href="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Create Account</Link>
          <span className="text-sm text-muted-foreground/50 cursor-default">Privacy — Coming Soon</span>
          <span className="text-sm text-muted-foreground/50 cursor-default">Terms — Coming Soon</span>
        </div>
      </div>
      <div className="border-t border-border/40 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">© 2025 Fitryx. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">Built with precision and purpose.</p>
      </div>
    </footer>
  )
}
