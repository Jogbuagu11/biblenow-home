'use client';

import { Facebook, Instagram, Youtube } from 'lucide-react';

export function LandingFooter() {
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
