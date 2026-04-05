import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { SERVICES } from "@/utils/constants";
import { Check } from "lucide-react";
import type { ServiceType } from "@/types";

interface LandingPageProps {
  onSelectService: (service: ServiceType) => void;
}

export default function LandingPage({ onSelectService }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const isSearching = searchOpen || searchQuery.length > 0;

  const filteredServices = useMemo(
    () =>
      SERVICES.filter(
        (s) =>
          s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          s.actionLabel.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [searchQuery]
  );

  return (
    <AppLayout onSearch={setSearchQuery} onSearchOpenChange={setSearchOpen} isSearchActive={isSearching}>
      <div className="mb-4 sm:mb-6">
        <p className="text-xs sm:text-sm text-muted-foreground">
          Kindly select an account management service
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filteredServices.map((service) => (
          <article
            key={service.id}
            onClick={() => onSelectService(service.id)}
            className={`fb-card flex flex-col hover:bg-[#002855] hover:text-white hover:border-[#002855] transition-all duration-200 cursor-pointer group ${
              isSearching ? 'bg-white border-white' : 'bg-[#E5F3FDB2] border-[#E5F3FDB2]'
            }`}
          >
            <div className="mb-3">
              <div className="w-10 h-10 rounded-lg bg-[#0B2E4F] group-hover:bg-white/20 flex items-center justify-center flex-shrink-0 transition-colors mb-2">
                <img src={service.icon} alt="" className="w-5 h-5 brightness-0 invert" />
              </div>
              <h2 className="text-sm font-semibold text-foreground group-hover:text-white leading-tight transition-colors">
                {service.title}
              </h2>
            </div>

            <ul className="space-y-1 mb-4 flex-1">
              {service.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-xs text-muted-foreground group-hover:text-white/80 transition-colors">
                  <Check className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0 transition-colors" />
                  {req}
                </li>
              ))}
            </ul>

            <span
              className="text-sm text-[#002855] font-bold underline group-hover:text-white text-left mt-auto transition-colors cursor-pointer"
            >
              {service.actionLabel}
            </span>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
