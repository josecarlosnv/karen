const BASE = import.meta.env.VITE_QM_API_URL as string;

async function request(path: string) {
  const res = await fetch(`${BASE}${path}`, { credentials: "include", mode: "cors" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type LqmAccessDto = {
  email: string;
  role?: string | null;
  bu?: string | null;
  office?: string | null;
  isBuPic: boolean;
  isHofA: boolean;
  inEmployeeGate: boolean;
  hasSecurityRow: boolean;
  isAll: boolean;
  allowed: boolean;
  canAccessPerformance: boolean;
  canAccessBuEvaluation: boolean;
  canAccessHofA: boolean;
  canAccessPartners: boolean;

};

export const securityApi = {
  me: (): Promise<LqmAccessDto> => request("/api/lqm/security/me"),
  guard: (): Promise<LqmAccessDto> => request("/api/lqm/security/guard"),
  performanceGuard: (): Promise<LqmAccessDto> => request("/api/lqm/security/performance/guard"),
  buEvaluationGuard: (): Promise<LqmAccessDto> => request("/api/lqm/security/bu-evaluation/guard"),
  hofaGuard: (): Promise<LqmAccessDto> => request("/api/lqm/security/hofa/guard"),
  partnersGuard: (): Promise<LqmAccessDto> => request("/api/lqm/security/partners/guard"),

};
