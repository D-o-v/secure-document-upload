import { type ReactNode } from "react";
import Header from "./Header";

interface AppLayoutProps {
  children: ReactNode;
  onSearch?: (query: string) => void;
}

export default function AppLayout({ children, onSearch }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={onSearch} />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}

function Footer() {
  const footerLinks = {
    Services: ["Account Opening", "Internet Banking", "Business Banking", "Private Banking", "Savings Account"],
    Security: ["Anti-Fraud", "Security Tips", "Secure Online", "Help Desk"],
    "Important Info": ["FirstMobile on GooglePlay", "First & Beyond", "Code of Ethics", "Agent Network"],
    Legal: ["Savings", "Terms of Use", "Privacy Policy", "Cookie Policy", "Whistleblower Policy", "International Cybersecurity Policy", "Data Protection Profile"],
  };

  return (
    <footer className="bg-secondary text-secondary-foreground mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-xs font-semibold mb-3 uppercase tracking-wider opacity-80">
                {category}
              </h3>
              <ul className="space-y-1.5">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-xs opacity-60 hover:opacity-100 transition-opacity">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-4 border-t border-secondary-foreground/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs opacity-50">
            ©2024 FirstBank of Nigeria Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs opacity-50">Powered by</span>
            <span className="text-xs font-semibold opacity-70">FirstBank</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
