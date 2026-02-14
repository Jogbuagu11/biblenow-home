'use client';

const currentYear = new Date().getFullYear();

export default function AuthFooter() {
  return (
    <footer className="mt-auto py-8 px-4 bg-biblenow-brown-dark border-t border-biblenow-gold/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <img src="/favicon.png" alt="BibleNOW Logo" className="h-16 mb-4" />
            <p className="text-biblenow-beige/70 text-sm">Experience Scripture Online Like Never Before.</p>
          </div>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li><a href="https://read.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Read</a></li>
              <li><a href="https://live.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Live</a></li>
              <li><a href="https://learn.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Learn</a></li>
              <li><a href="https://social.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Social</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <ul className="space-y-2">
              <li><a href="https://about.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">About Us</a></li>
              <li><a href="https://contact.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Contact</a></li>
              <li><a href="https://donate.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Support Our Mission</a></li>
              <li><a href="https://faq.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <ul className="space-y-2 mb-6">
              <li><a href="https://policy.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Privacy Policy</a></li>
              <li><a href="https://terms.biblenow.io" className="text-biblenow-beige/70 hover:text-biblenow-gold transition-colors">Terms of Service</a></li>
            </ul>
            <div className="flex space-x-4">
              <a href="https://facebook.com/biblenow" aria-label="Facebook" className="text-biblenow-gold hover:text-biblenow-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
              </a>
              <a href="https://twitter.com/biblenow" aria-label="Twitter" className="text-biblenow-gold hover:text-biblenow-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" /></svg>
              </a>
              <a href="https://instagram.com/biblenow" aria-label="Instagram" className="text-biblenow-gold hover:text-biblenow-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
              </a>
              <a href="https://youtube.com/biblenow" aria-label="YouTube" className="text-biblenow-gold hover:text-biblenow-gold-light">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" /><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" /></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="border-t border-biblenow-gold/20 mt-8 pt-6 text-center">
          <p className="text-biblenow-beige/50 text-sm">© {currentYear} BibleNOW. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
