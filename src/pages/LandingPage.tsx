import { useState, useMemo } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { SERVICES } from "@/utils/constants";
import {
  Repeat,
  TrendingUp,
  MapPin,
  Calendar,
  RefreshCw,
  Mail,
  FileText,
  Phone,
  Shield,
  CheckCircle2,
} from "lucide-react";
import type { ServiceType } from "@/types";

const ICON_MAP: Record<string, React.ReactNode> = {
  repeat: <Repeat className="w-6 h-6" />,
  "trending-up": <TrendingUp className="w-6 h-6" />,
  "map-pin": <MapPin className="w-6 h-6" />,
  calendar: <Calendar className="w-6 h-6" />,
  "refresh-cw": <RefreshCw className="w-6 h-6" />,
  mail: <Mail className="w-6 h-6" />,
  "file-text": <FileText className="w-6 h-6" />,
  phone: <Phone className="w-6 h-6" />,
  shield: <Shield className="w-6 h-6" />,
};

interface LandingPageProps {
  onSelectService: (service: ServiceType) => void;
}

export default function LandingPage({ onSelectService }: LandingPageProps) {
  const [searchQuery, setSearchQuery] = useState("");

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
    <AppLayout onSearch={setSearchQuery}>
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          Kindly select an account management service
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <article
            key={service.id}
            className="fb-card flex flex-col hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-secondary-foreground flex-shrink-0">
                {ICON_MAP[service.icon]}
              </div>
              <h2 className="text-sm font-semibold text-foreground leading-tight pt-1">
                {service.title}
              </h2>
            </div>

            <ul className="space-y-1 mb-4 flex-1">
              {service.requirements.map((req) => (
                <li key={req} className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                  {req}
                </li>
              ))}
            </ul>

            <button
              onClick={() => onSelectService(service.id)}
              className="fb-link text-left text-xs mt-auto"
            >
              {service.actionLabel}
            </button>
          </article>
        ))}
      </div>
    </AppLayout>
  );
}
