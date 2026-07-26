import { useEffect, useState } from "react";
import { securityApi, LqmAccessDto } from "@qm/app/api/securityApi";

// Acceso general + datos del usuario (para mostrar/ocultar UI)
export function useSecurityAccess() {
  const [data, setData] = useState<LqmAccessDto | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    securityApi.me()
      .then(setData)
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);
  return { access: data, loading };
}

// Portones por sección: null = cargando, true/false = resultado
function useGuard(fn: () => Promise<unknown>) {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    fn().then(() => setAllowed(true)).catch(() => setAllowed(false));
  }, []);
  return allowed;
}

export const useAppGuard          = () => useGuard(securityApi.guard);
export const usePerformanceGuard  = () => useGuard(securityApi.performanceGuard);
export const useBuEvaluationGuard = () => useGuard(securityApi.buEvaluationGuard);
export const useHofaGuard = () => useGuard(securityApi.hofaGuard);
export const usePartnersGuard = () => useGuard(securityApi.partnersGuard);
