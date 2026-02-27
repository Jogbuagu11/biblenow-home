'use client';

/**
 * Child Safety & Exploitation Policy
 *
 * Public URL: https://biblenow.io/child-safety
 * Use this in app store forms for child safety / CSAM policy.
 */

export default function ChildSafetyPage() {
  return (
    <main className="min-h-screen bg-gray-50 text-gray-900 dark:bg-dark-900 dark:text-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-biblenow-brown dark:text-biblenow-gold mb-6">
          Child Safety &amp; Exploitation Policy
        </h1>

        <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
          Last updated:{' '}
          <span className="font-medium text-gray-800 dark:text-gray-200">
            February 26, 2026
          </span>
        </p>

        <section className="space-y-4 text-sm md:text-base leading-relaxed">
          <p>
            BibleNOW is committed to providing a safe, Christ‑centered community. We maintain a
            zero‑tolerance policy for child sexual abuse material (CSAM), sexual exploitation of
            minors, grooming, or any behavior that places children at risk.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            1. Who the app is for
          </h2>
          <p>
            BibleNOW is intended for users who are at least{' '}
            <strong>13 years of age</strong>. Parents and guardians are encouraged to supervise
            any use of the app by minors and to talk with their children about online safety.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            2. Zero‑tolerance for child sexual abuse &amp; exploitation
          </h2>
          <p>
            We do not permit any content or behavior that exploits, harms, sexualizes, or
            endangers children, including but not limited to:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Child sexual abuse material (CSAM) in any form.</li>
            <li>Sexualized depictions or descriptions of minors.</li>
            <li>Grooming, solicitation, or attempts to obtain sexual content from minors.</li>
            <li>Sharing, requesting, or linking to CSAM or exploitative material.</li>
            <li>Threats, coercion, or blackmail involving minors.</li>
          </ul>
          <p>
            Content or accounts that violate this policy may be removed without notice, and we may
            permanently disable offending accounts and restrict access to BibleNOW.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            3. Reporting concerns
          </h2>
          <p>
            If you see content or behavior on BibleNOW that you believe involves child sexual
            abuse, exploitation, or grooming:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Use the in‑app reporting tools where available to flag the content or account.</li>
            <li>
              Or email us at{' '}
              <a
                href="mailto:safety@biblenow.io"
                className="text-primary-600 dark:text-primary-300 underline"
              >
                safety@biblenow.io
              </a>{' '}
              with as much detail as possible (links, usernames, screenshots).
            </li>
          </ul>
          <p>
            If you believe a child is in immediate danger, contact your local law enforcement or
            emergency services first, then notify us.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            4. Cooperation with law enforcement &amp; hotlines
          </h2>
          <p>
            We report apparent child sexual abuse material and credible threats to child safety to
            appropriate authorities and child‑protection hotlines where required or permitted by
            law. We may preserve and share account information and relevant data with law
            enforcement as part of investigations into child exploitation or abuse.
          </p>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            5. Moderation &amp; enforcement
          </h2>
          <p>
            Our team may review reported content and accounts for potential child‑safety concerns.
            When we identify or are notified of violations, we may:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Remove content that violates this policy.</li>
            <li>Suspend or permanently disable accounts.</li>
            <li>Restrict features (posting, messaging, livestreaming, etc.).</li>
            <li>Notify and cooperate with law enforcement agencies.</li>
          </ul>

          <h2 className="mt-8 text-xl font-semibold text-biblenow-brown dark:text-biblenow-gold">
            6. Protecting your family
          </h2>
          <p>
            We encourage parents and guardians to use device‑level parental controls, talk with
            their children about online safety, and regularly review how BibleNOW is being used.
            If you have questions or concerns about your child&apos;s use of BibleNOW, please
            contact us at{' '}
            <a
              href="mailto:safety@biblenow.io"
              className="text-primary-600 dark:text-primary-300 underline"
            >
              safety@biblenow.io
            </a>
            .
          </p>

          <p className="mt-8 text-sm text-gray-600 dark:text-gray-400">
            For information on how we collect and use data, please also see our{' '}
            <a
              href="https://policy.biblenow.io"
              className="text-primary-600 dark:text-primary-300 underline"
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              href="https://terms.biblenow.io"
              className="text-primary-600 dark:text-primary-300 underline"
            >
              Terms of Service
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}

