import { Search, Headset } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onSearch?: (query: string) => void;
  onSearchOpenChange?: (open: boolean) => void;
  isSearchActive?: boolean;
}

export default function Header({ onSearch, onSearchOpenChange, isSearchActive }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className={`border-b border-border transition-colors duration-200 sticky top-0 z-40 ${isSearchActive ? 'bg-[#E5F3FDB2]' : 'bg-card'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src="/FirstBankLogoWithElephant.svg"
              alt="FirstBank"
              className="h-8 sm:h-10 w-auto"
            />
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {!searchOpen && (
              <a
                href="#"
                className="hidden sm:inline-flex items-center text-xs font-medium text-[#002855] underline cursor-pointer"
              >
                Open a FirstBank account
              </a>
            )}

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
                  className="w-36 sm:w-64 pr-8 text-xs px-3 py-2.5 border border-[#002855] rounded-md bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#002855] focus:border-transparent transition-colors"
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) {
                      setSearchOpen(false);
                      onSearchOpenChange?.(false);
                    }
                  }}
                />
                <Search className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#002855]" />
              </div>
            ) : (
              <button
                onClick={() => {
                  setSearchOpen(true);
                  onSearchOpenChange?.(true);
                }}
                className="p-2 hover:bg-muted rounded-md transition-colors"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-[#002855]" />
              </button>
            )}

            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-black rounded-md text-xs font-medium hover:opacity-90 transition-opacity">
              <Headset className="w-3.5 h-3.5" />
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
