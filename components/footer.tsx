import Link from 'next/link'
import { Dumbbell, Twitter, Github, Linkedin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-border/40 bg-[oklch(0.09_0.010_250)]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="md:col-span-1 flex flex-col gap-4">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary-foreground" />
            </div>
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

        {/* Links */}
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Product</p>
          {['Gyms', 'Compare', 'Pricing', 'Reviews'].map(l => (
            <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Company</p>
          {['About', 'Blog', 'Careers', 'Press'].map(l => (
            <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
        <div className="flex flex-col gap-3">
          <p className="text-xs font-semibold text-foreground uppercase tracking-widest">Legal</p>
          {['Privacy', 'Terms', 'Cookies', 'Contact'].map(l => (
            <a key={l} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l}</a>
          ))}
        </div>
      </div>
      <div className="border-t border-border/40 px-6 py-5 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">© 2025 Fitryx. All rights reserved.</p>
        <p className="text-xs text-muted-foreground">Built with precision and purpose.</p>
      </div>
    </footer>
  )
}
