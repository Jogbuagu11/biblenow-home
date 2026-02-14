import type { Metadata } from 'next';
import Image from 'next/image';
import styles from './endstream.module.css';

export const metadata: Metadata = {
  title: 'Stream Ended • BibleNOW',
  description: 'Your livestream has ended. Although the livestream has ended, our journey continues.',
  robots: { index: false, follow: false },
};

export default function EndStreamPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-biblenow-brown text-white isolate">
      {/* Floating circles background */}
      <div className="pointer-events-none absolute inset-0 z-[1] opacity-80">
        <div className={`${styles.bubble} ${styles.bubble1}`} />
        <div className={`${styles.bubble} ${styles.bubble2}`} />
        <div className={`${styles.bubble} ${styles.bubble3}`} />
        <div className={`${styles.bubble} ${styles.bubble4}`} />
        <div className={`${styles.bubble} ${styles.bubble5}`} />
        <div className={`${styles.bubble} ${styles.bubble6}`} />
        <div className={`${styles.bubble} ${styles.bubble7}`} />
        <div className={`${styles.bubble} ${styles.bubble8}`} />
      </div>

      {/* Warm gradients + subtle vignette */}
      <div className="pointer-events-none absolute inset-0 z-[0]">
        <div className="absolute -top-40 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(212,175,55,0.22),rgba(212,175,55,0.04)_55%,transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-48 left-10 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(229,45,39,0.10),rgba(229,45,39,0.02)_55%,transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(255,255,255,0.06),transparent_45%)]" />
        <div className="absolute inset-0 shadow-[inset_0_0_160px_rgba(0,0,0,0.55)]" />
      </div>

      {/* Brand */}
      <header className="absolute left-6 top-6 z-[40]">
        <a
          href="/"
          className="group inline-flex items-center transition hover:opacity-90"
          aria-label="Go to BibleNOW home"
        >
          <Image
            src="/roundlogo.png"
            alt="BibleNOW"
            priority
            className="h-11 w-11 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.30)]"
          />
          <span className="sr-only">BibleNOW</span>
        </a>
      </header>

      {/* Center content */}
      <div className="relative z-[10] mx-auto flex min-h-screen max-w-3xl items-center px-6 py-16">
        <div className="w-full text-center">
          <div className="mx-auto mb-8 h-[1px] w-24 bg-gradient-to-r from-transparent via-biblenow-gold to-transparent" />

          <h1 className="text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
            <span className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Your Stream has ended.
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-pretty text-base text-white/80 sm:text-lg">
            Although the livestream has ended, our journey continues.
          </p>

          <blockquote className="mx-auto mt-10 max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 text-left shadow-[0_0_60px_rgba(212,175,55,0.14)] backdrop-blur">
            <p className="text-pretty text-lg leading-relaxed text-white/90 sm:text-xl">
              “The Lord will watch over your coming and going both now and forevermore.”
            </p>
            <footer className="mt-4 text-sm font-semibold text-biblenow-gold">
              Psalm 121:8
            </footer>
          </blockquote>

          <p className="mx-auto mt-10 max-w-xl text-sm text-white/60">
            You can safely close this page.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-biblenow-gold px-5 py-2.5 text-sm font-bold text-black shadow-[0_10px_40px_rgba(212,175,55,0.20)] transition hover:brightness-95"
            >
              Back to BibleNOW
            </a>
            <a
              href="/app"
              className="inline-flex items-center justify-center rounded-xl border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white/90 backdrop-blur transition hover:bg-white/10"
            >
              Open the app
            </a>
          </div>

          <div className="mx-auto mt-10 h-[1px] w-24 bg-gradient-to-r from-transparent via-biblenow-gold to-transparent" />
        </div>
      </div>

      {/* Floating emojis (always on top) */}
      <div className="pointer-events-none fixed inset-0 z-[999]">
        <span className={`${styles.emoji} ${styles.emoji1}`} aria-hidden="true">
          ❤️
        </span>
        <span className={`${styles.emoji} ${styles.emoji2}`} aria-hidden="true">
          😊
        </span>
        <span className={`${styles.emoji} ${styles.emoji3}`} aria-hidden="true">
          🙏
        </span>
        <span className={`${styles.emoji} ${styles.emoji4}`} aria-hidden="true">
          💛
        </span>
        <span className={`${styles.emoji} ${styles.emoji5}`} aria-hidden="true">
          🙂
        </span>
      </div>
    </main>
  );
}

