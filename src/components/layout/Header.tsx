import { Search, HelpCircle } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold text-foreground">
                First<span className="text-primary">Bank</span>
              </span>
              <span className="text-primary text-lg">🏦</span>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <a
              href="#"
              className="fb-link hidden sm:inline-flex items-center text-xs"
            >
              Open a FirstBank account
            </a>

            {searchOpen ? (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch?.(e.target.value);
                  }}
                  className="fb-input w-48 sm:w-64 pr-8 text-xs"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) setSearchOpen(false);
                  }}
                />
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
            )}

            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-xs font-medium hover:opacity-90 transition-opacity">
              <HelpCircle className="w-3.5 h-3.5" />
              Help
            </button>
          </div>
        </div>
      </div>

      {/* Portal banner */}
      <div className="fb-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <h1 className="text-sm font-semibold tracking-wide">
            Account Management Portal
          </h1>
        </div>
      </div>
    </header>
  );
}
