import { Link } from "react-router-dom";
import Button from "../components/Button";

/* Simple SVG logo - paste inline */
function Logo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <rect x="2" y="2" width="44" height="44" rx="8" fill="#1E3A8A"/>
      <path d="M14 18h20v4H14zM14 26h20v4H14z" fill="white" opacity="0.95"/>
    </svg>
  );
}

export default function LandingPage(){
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full py-4 px-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo />
          <div>
            <div className="text-lg font-semibold text-primary leading-4">SecureNotes Pro</div>
            <div className="text-xs text-gray-500 -mt-0.5">Protected note distribution</div>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <Link to="/about" className="text-sm text-gray-600 hover:text-primary">About</Link>
          <Link to="/contact" className="text-sm text-gray-600 hover:text-primary">Contact</Link>
          <Link to="/login" className="text-sm text-gray-600 hover:text-primary">User Login</Link>
          <Link to="/admin/login" className="text-sm text-primary font-medium">Admin Login</Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex-1 grid place-items-center">
        <section className="max-w-7xl w-full px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight hero-accent">
                Secure, admin-controlled <span className="text-gradient">note sharing</span>
              </h1>

              <p className="mt-4 text-lg text-gray-600 max-w-xl">
                One-way distribution for high-sensitivity content. Watermarked, audited and tightly permissioned — built for organizations that cannot tolerate leakage.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/admin/login">
                  <Button variant="primary">Get Started (Admin)</Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline">Sign in as User</Button>
                </Link>
                <a href="#features" className="self-center">
                  <Button variant="ghost">Why SecureNotes?</Button>
                </a>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 items-center text-sm text-gray-500">
                <div className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-400 inline-block" />
                  <span>End-to-end access controls</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400 inline-block" />
                  <span>Watermarked views</span>
                </div>
                <div className="inline-flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-400 inline-block" />
                  <span>Full audit trail</span>
                </div>
              </div>
            </div>

            {/* Visual / card on right */}
            <div className="lg:col-span-6 relative">
              <div className="hero-bg card p-6 lg:p-8">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Latest note</div>
                    <div className="font-semibold text-lg mt-1">Quarterly Security Update — Read Only</div>
                  </div>
                  <div className="text-sm text-gray-400">Published 2 days ago</div>
                </div>

                <div className="mt-4 text-sm text-gray-600 line-clamp-4">
                  This is a preview card to show how notes will be presented inside SecureNotes Pro. Notes are protected — the viewer overlays a dynamic watermark and prevents copy & paste where supported.
                </div>

                <div className="mt-6 flex gap-3">
                  <Button variant="outline">Preview (Demo)</Button>
                  <Button variant="ghost">Learn more</Button>
                </div>
              </div>

              {/* subtle accent element */}
              <div className="absolute -bottom-6 right-6 w-28 h-28 rounded-xl blur-xl opacity-30" style={{ background: "radial-gradient(circle at 30% 30%, #10B981, transparent 40%)" }} />
            </div>
          </div>

          {/* Features */}
          <div id="features" className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card p-5">
              <div className="text-sm font-medium text-primary">Lockdown view</div>
              <p className="mt-2 text-sm text-gray-600">Watermarks, copy-blocking, and keyboard/print protections to reduce casual leaks.</p>
            </div>

            <div className="card p-5">
              <div className="text-sm font-medium text-primary">Admin control</div>
              <p className="mt-2 text-sm text-gray-600">Create, target, and revoke access to notes. Audit everything admins and users do.</p>
            </div>

            <div className="card p-5">
              <div className="text-sm font-medium text-primary">Realtime alerts</div>
              <p className="mt-2 text-sm text-gray-600">Users get immediate notifications when new content is published — and the admin sees engagement metrics.</p>
            </div>
          </div>

        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t bg-transparent">
        <div className="max-w-7xl mx-auto py-6 px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">© {new Date().getFullYear()} SecureNotes Pro — Built for secure distribution</div>
          <div className="flex items-center gap-4 text-sm">
            <a className="text-gray-600 hover:text-primary" href="/terms">Terms</a>
            <a className="text-gray-600 hover:text-primary" href="/privacy">Privacy</a>
            <a className="text-gray-600 hover:text-primary" href="/contact">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
