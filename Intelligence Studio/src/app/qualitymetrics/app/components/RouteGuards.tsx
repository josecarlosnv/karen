import { NoAccess } from "./NoAccess";
import { useAppGuard, usePerformanceGuard, useBuEvaluationGuard, useHofaGuard, usePartnersGuard } from "@qm/app/hooks/useSecurityGuard";

function Gate({
  allowed,
  children,
  message,
  showBackButton = true,        // 👈 nuevo
}: {
  allowed: boolean | null;
  children: React.ReactNode;
  message?: string;
  showBackButton?: boolean;     // 👈 nuevo
}) {
  if (allowed === null) return <div className="min-h-screen bg-navy-950" />;
  if (!allowed) return <NoAccess message={message} showBackButton={showBackButton} />;
  return <>{children}</>;
}

export const AppGuard = ({ children }: { children: React.ReactNode }) => (
  <Gate
    allowed={useAppGuard()}
    showBackButton={false}      // 👈 sin botón: no hay a dónde volver
    message="No cuentas con acceso a Leadership Quality Metrics. Esta herramienta es solo para Partners y Directores de Audit o Nacional."
  >
    {children}
  </Gate>
);


export const PerformanceGuard = ({ children }: { children: React.ReactNode }) => (
  <Gate
    allowed={usePerformanceGuard()}
    message="Solo Partners y Directores de Audit o Nacional pueden acceder a Performance Evaluation."
  >
    {children}
  </Gate>
);

export const BuEvaluationGuard = ({ children }: { children: React.ReactNode }) => (
  <Gate
    allowed={useBuEvaluationGuard()}
    message="Esta sección está reservada para los BU PICs. No cuentas con ese permiso."
  >
    {children}
  </Gate>
);

export const HofaGuard = ({ children }: { children: React.ReactNode }) => (
  <Gate
    allowed={useHofaGuard()}
    message="Esta sección está reservada para BU PICs. No cuentas con ese permiso."
  >
    {children}
  </Gate>
);

export const PartnersGuard = ({ children }: { children: React.ReactNode }) => (
  <Gate
    allowed={usePartnersGuard()}
    message="Esta sección está reservada para BU PICs y Head of Audit. No cuentas con ese permiso."
  >
    {children}
  </Gate>
);