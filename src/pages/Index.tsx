import { useState, lazy, Suspense } from "react";
import type { ServiceType } from "@/types";
import Loader from "@/components/ui/Loader";

const LandingPage = lazy(() => import("@/pages/LandingPage"));
const IDUpdateFlow = lazy(() => import("@/pages/IDUpdateFlow"));
const AccountUpgradeFlow = lazy(() => import("@/pages/AccountUpgradeFlow"));

export default function Index() {
  const [activeService, setActiveService] = useState<ServiceType | null>(null);

  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader text="Loading..." size="lg" /></div>}>
      {activeService === "identity-document" ? (
        <IDUpdateFlow onBack={() => setActiveService(null)} />
      ) : activeService === "account-upgrade" ? (
        <AccountUpgradeFlow onBack={() => setActiveService(null)} />
      ) : (
        <LandingPage onSelectService={setActiveService} />
      )}
    </Suspense>
  );
}
