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


export type QmHofaReportRow = {
  employeeId: string;
  name?: string | null;
  title?: string | null;
  businessUnit?: string | null;
  office?: string | null;
  buScore: number;
  indicators: QmIndicator[];
    canEdit: boolean;

};


export type QmWorkloadPerson = {
  employeeId: string;
  name?: string | null;
  title?: string | null;
  category: string;
  totalHours?: number | null;
  hoursTarget?: number | null;
  waiver?: string | null;
  complianceValidation?: number | null;
  nonClientFacingHours?: number | null;
  hoursLsqcr?: number | null;
  hoursEqcr?: number | null;
  activities?: string | null;
};

export type QmWorkload = {
  partnersDirectors: QmWorkloadPerson[];
  managers: QmWorkloadPerson[];
};

export type QmQualPerson = {
  employeeId: string;
  name?: string | null;
  title?: string | null;
  practice?: string | null;
  businessUnit?: string | null;
  office?: string | null;
};

export type QmQualScope = {
  defaultEmployeeId?: string | null;
  canSelectUsers: boolean;
  people: QmQualPerson[];
};

export type QmIndicator = {
  catIndicatorsKey: number;
  indicatorsUniqueKey: string;
  indicatorLabel: string;
  measureDescription: string;
  indicatorDescription: string;
  sourceLabel?: string | null;
  maxMeasure?: number | string | null;
  target?: number | null;
  currentPerformance?: string | null;
  message?: string | null;
  score: number;
  canEdit?: boolean;


};

export type QmQualifications = {
  employeeId: string;
  leaderDataUniqueKey: string;
  fy: string;
  canEdit: boolean;
  canEditWaiver: boolean;
  totalScore: number;
  indicators: QmIndicator[];
};

export const qualificationsApi = {
  scope: (): Promise<QmQualScope> => request(`/api/lqm/qualifications/scope`),

  hofaScope: (): Promise<QmQualScope> => request(`/api/lqm/qualifications/hofascope`),

  buPeople: (bupicEmployeeId: string): Promise<QmQualPerson[]> =>
    request(`/api/lqm/qualifications/${bupicEmployeeId}/bu-people`),

  get: (employeeId: string, set: "PyD" | "HOFA" = "PyD"): Promise<QmQualifications> =>
    request(`/api/lqm/qualifications/${employeeId}?set=${set}`),

  save: (
    employeeId: string,
    body: { indicatorsUniqueKey: string; score: number },
    set: "PyD" | "HOFA" = "PyD",
  ): Promise<{ saved: boolean }> =>
    request(`/api/lqm/qualifications/${employeeId}?set=${set}`, {
      method: "PUT",
      body: JSON.stringify(body),
    }),

  workload: (bupicEmployeeId: string): Promise<QmWorkload> =>
    request(`/api/lqm/qualifications/${bupicEmployeeId}/workload`),

  saveWaiver: (employeeId: string, waiver: "Yes" | "No"): Promise<{ saved: boolean }> =>
    request(`/api/lqm/qualifications/workload/${employeeId}/waiver`, {
      method: "PUT",
      body: JSON.stringify({ waiver }),
    }),

      hofaReport: (): Promise<QmHofaReportRow[]> =>
    request(`/api/lqm/qualifications/hofa/report`),

        pydReport: (): Promise<QmHofaReportRow[]> =>
    request(`/api/lqm/qualifications/pyd/report`),


};



