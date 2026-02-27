'use client';

import { useState } from 'react';
import { Book, Gamepad, Menu, Sparkles, Users, Video, X, Facebook, Instagram, Youtube } from 'lucide-react';

/** Use canonical app URL when set (e.g. production HTTPS) so auth links are correct. */
function authHref() {
  const base = typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL.trim()
    ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '')
    : '';
  return base ? base + '/auth' : '/auth';
}

function LandingNavLink({ href, children }: { href?: string; children: React.ReactNode }) {
  if (href) {
    return (
      <a
        href={href}
        className="px-3 py-2 rounded-md text-sm font-medium text-biblenow-brown hover:bg-biblenow-beige/60 transition-colors"
      >
        {children}
      </a>
    );
  }

  return (
    <span className="px-3 py-2 rounded-md text-sm font-medium text-biblenow-brown/60 cursor-default">
      {children}
    </span>
  );
}

function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white/90 backdrop-blur border-b border-biblenow-brown/10 fixed top-0 left-0 right-0 z-50">
      <div className="container-main py-3">
        <div className="flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <span className="font-extrabold tracking-tight text-xl text-biblenow-brown">BibleNOW</span>
            <span className="hidden sm:inline text-xs font-semibold px-2 py-1 rounded-full bg-biblenow-beige text-biblenow-brown">
              biblenow.io
            </span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            <LandingNavLink>Read</LandingNavLink>
            <LandingNavLink>Social</LandingNavLink>
            <LandingNavLink href="https://live.biblenow.io">Live</LandingNavLink>
            <LandingNavLink>Learn</LandingNavLink>
            <LandingNavLink>Play</LandingNavLink>

            <div className="ml-4 flex items-center gap-2">
              <a
                href={authHref()}
                className="px-4 py-2 rounded-lg text-sm font-semibold border border-biblenow-brown/30 text-biblenow-brown hover:bg-biblenow-beige/60 transition-colors"
              >
                Sign In
              </a>
              <a
                href={authHref()}
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-biblenow-gold text-white hover:bg-biblenow-gold/90 transition-colors shadow-sm"
              >
                Sign Up
              </a>
              <a
                href="/app"
                className="px-4 py-2 rounded-lg text-sm font-semibold bg-biblenow-brown text-white hover:bg-biblenow-brown/90 transition-colors"
                title="Open the BibleNOW web app"
              >
                Open App
              </a>
            </div>
          </div>

          <div className="md:hidden flex items-center">
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="p-2 rounded-md text-biblenow-brown hover:bg-biblenow-beige/60 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden pt-4 pb-2 animate-fade-in">
            <div className="flex flex-col gap-2">
              <LandingNavLink>Read</LandingNavLink>
              <LandingNavLink>Social</LandingNavLink>
              <LandingNavLink href="https://live.biblenow.io">Live</LandingNavLink>
              <LandingNavLink>Learn</LandingNavLink>
              <LandingNavLink>Play</LandingNavLink>

              <div className="pt-3 grid grid-cols-1 gap-2">
                <a
                  href={authHref()}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold border border-biblenow-brown/30 text-biblenow-brown hover:bg-biblenow-beige/60 transition-colors"
                >
                  Sign In
                </a>
                <a
                  href={authHref()}
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold bg-biblenow-gold text-white hover:bg-biblenow-gold/90 transition-colors"
                >
                  Sign Up
                </a>
                <a
                  href="/app"
                  className="w-full text-center px-4 py-2 rounded-lg text-sm font-semibold bg-biblenow-brown text-white hover:bg-biblenow-brown/90 transition-colors"
                >
                  Open App
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}

function LandingHero() {
  const scrollToApps = () => {
    const el = document.getElementById('apps-section');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="pt-28 pb-16 px-4 bg-gradient-to-br from-biblenow-beige to-white">
      <div className="container-main text-center">
        <div className="bg-white rounded-2xl shadow-lg border border-biblenow-brown/10 p-6 md:p-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-biblenow-brown mb-6 drop-shadow-sm">
            The Future of Online Community for Believers
          </h1>

          <p className="text-lg md:text-xl text-biblenow-brown/80 max-w-2xl mx-auto mb-8">
            A new way for believers to connect and edify. Hear scripture. Read scripture. Share scripture.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL.trim() ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '') + '/auth' : '/auth'}
              className="rounded-lg px-8 py-4 font-semibold bg-biblenow-gold text-white hover:bg-biblenow-gold/90 transition-colors shadow-md"
            >
              Sign Up Now
            </a>
            <button
              type="button"
              onClick={scrollToApps}
              className="rounded-lg px-8 py-4 font-semibold bg-white border border-biblenow-brown/30 text-biblenow-brown hover:bg-biblenow-brown hover:text-white transition-colors shadow-md"
            >
              Explore BibleNOW Apps
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function AppCard({
  title,
  description,
  icon,
  cta,
  href,
  disabled,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  cta: string;
  href?: string;
  disabled?: boolean;
}) {
  const inner = (
    <div
      className={[
        'rounded-2xl border shadow-sm p-6 h-full flex flex-col',
        disabled ? 'opacity-70' : 'hover:shadow-md',
        'transition-shadow bg-white border-biblenow-brown/10',
      ].join(' ')}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-biblenow-brown mb-2">{title}</h3>
      <p className="text-biblenow-brown/70 mb-5 flex-1">{description}</p>
      {href && !disabled ? (
        <a
          href={href}
          className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold bg-biblenow-brown text-white hover:bg-biblenow-brown/90 transition-colors"
        >
          {cta}
        </a>
      ) : (
        <span className="inline-flex items-center justify-center rounded-lg px-4 py-2 font-semibold bg-gray-400 text-white cursor-not-allowed">
          {cta}
        </span>
      )}
    </div>
  );

  return inner;
}

function LandingApps() {
  return (
    <section id="apps-section" className="py-16 px-4 bg-white">
      <div className="container-main">
        <h2 className="text-3xl md:text-4xl font-extrabold text-center text-biblenow-brown mb-12">
          BibleNOW Apps
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          <AppCard
            title="Live"
            description="Experience live worship and sermons from churches around the world"
            icon={<Video className="h-10 w-10 text-biblenow-gold" />}
            cta="Open Live"
            href="https://live.biblenow.io"
          />
          <AppCard
            title="Social"
            description="Connect with other believers in a faith-focused community"
            icon={<Users className="h-10 w-10 text-gray-400" />}
            cta="Coming Soon"
            disabled
          />
          <AppCard
            title="Read"
            description="Study the Bible with powerful tools and commentaries"
            icon={<Book className="h-10 w-10 text-gray-400" />}
            cta="Coming Soon"
            disabled
          />
          <AppCard
            title="Learn"
            description="Access Bible courses, studies, and educational resources"
            icon={<Sparkles className="h-10 w-10 text-gray-400" />}
            cta="Coming Soon"
            disabled
          />
          <AppCard
            title="Play"
            description="Enjoy faith-based games and interactive activities"
            icon={<Gamepad className="h-10 w-10 text-gray-400" />}
            cta="Coming Soon"
            disabled
          />
        </div>
      </div>
    </section>
  );
}

function LandingCTA() {
  return (
    <section className="bg-biblenow-beige text-biblenow-brown py-16 px-4">
      <div className="container-main text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Transform Your Digital Life!</h2>
        <p className="text-lg md:text-xl max-w-3xl mx-auto mb-8 text-biblenow-brown/80">
          Join thousands of believers who are deepening their faith, finding community, and experiencing God&apos;s
          presence like never before
        </p>
        <a
          href={typeof process.env.NEXT_PUBLIC_APP_URL === 'string' && process.env.NEXT_PUBLIC_APP_URL.trim() ? process.env.NEXT_PUBLIC_APP_URL.trim().replace(/\/+$/, '') + '/auth' : '/auth'}
          className="bg-biblenow-gold text-white rounded-lg px-8 py-4 font-semibold hover:bg-biblenow-gold/90 transition-colors shadow-md inline-block"
        >
          Sign Up Now
        </a>
      </div>
    </section>
  );
}

function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-biblenow-brown text-white py-12 px-4">
      <div className="container-main">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-extrabold text-xl mb-4">BibleNOW</h3>
            <p className="text-white/80">A new way for believers to connect and edify through scripture.</p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">BibleNOW Apps</h4>
            <ul className="space-y-2 text-white/80">
              <li className="opacity-70 cursor-default">Read</li>
              <li className="opacity-70 cursor-default">Social</li>
              <li>
                <a href="https://live.biblenow.io" className="hover:text-biblenow-gold transition-colors">
                  Live
                </a>
              </li>
              <li className="opacity-70 cursor-default">Learn</li>
              <li className="opacity-70 cursor-default">Play</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">About</h4>
            <ul className="space-y-2 text-white/80">
              <li>
                <a
                  href="https://about.biblenow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biblenow-gold transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="https://contact.biblenow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biblenow-gold transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="https://give.biblenow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biblenow-gold transition-colors"
                >
                  Support
                </a>
              </li>
              <li>
                <a
                  href="https://faq.biblenow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biblenow-gold transition-colors"
                >
                  F.A.Q.&apos;s
                </a>
              </li>
              <li>
                <a
                  href="https://help.biblenow.io"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-biblenow-gold transition-colors"
                >
                  Help Center
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-4">Download Our App</h4>
            <p className="text-white/80 mb-4">
              Experience BibleNOW on your mobile device. Download our app today!
            </p>

            <div className="flex items-center gap-5 mt-4">
              <a
                href="https://www.facebook.com/biblenow.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-biblenow-gold transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.instagram.com/biblenow.io"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-biblenow-gold transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/Biblenowio"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-biblenow-gold transition-colors"
                aria-label="X"
              >
                {/* lucide "X" icon name collides with close icon; use a simple text mark */}
                <span className="font-extrabold text-lg leading-none">X</span>
              </a>
              <a
                href="https://www.youtube.com/channel/UCsHHy4aSdzRnbAj1P7ffmbw"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-biblenow-gold transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/20 text-center text-white/60">
          <p>© {year} BibleNOW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export function LandingHome() {
  return (
    <div className="min-h-screen flex flex-col">
      <LandingNavbar />
      <main className="flex-grow">
        <LandingHero />
        <LandingApps />
        <div className="container-main">
          <div className="h-px my-8 bg-biblenow-brown/20" />
        </div>
        <LandingCTA />
      </main>
      <LandingFooter />
    </div>
  );
}

