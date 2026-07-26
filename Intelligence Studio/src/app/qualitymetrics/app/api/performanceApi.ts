const BASE = import.meta.env.VITE_QM_API_URL as string;

async function request(path: string, init?: RequestInit) {
  const res = await fetch(`${BASE}${path}`, {
    credentials: "include",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    ...init,
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export type QmPerson = {
  employeeId: string;
  name?: string | null;
  title?: string | null;
  practice?: string | null;
  businessUnit?: string | null;
  office?: string | null;
  tenureYears?: number | null;
  photo?: string | null;
};

export type QmScope = {
  myEmployeeId?: string | null;
  canSelectUsers: boolean;
  scope: string;
  people: QmPerson[];
};

export type QmMetrics = {
  employeeId: string;
  fiscalYearLabel: number;
  openPD?: string | null;
  clientsGainedText?: string | null;
  clientsLostText?: string | null;
  keyActivitiesAssignments?: string | null;
  academicTeachingInstitution?: string | null;
  advancedDegreesCertifications?: string | null;
  isAdvanceCapabilitiesUsed: boolean;
  isMapJeUsed: boolean;
  isDatasnipperFssUsed: boolean;
  isKcwRolloverUsed: boolean;
};

export const performanceApi = {
  scope: (): Promise<QmScope> => request("/api/lqm/performance/scope"),
  get: (employeeId: string): Promise<QmMetrics> =>
    request(`/api/lqm/performance/${employeeId}`),
  save: (employeeId: string, body: QmMetrics): Promise<{ saved: boolean }> =>
    request(`/api/lqm/performance/${employeeId}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),
};
