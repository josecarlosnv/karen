import { http } from "./http";

type VwEmtActivesRow = {
  Key_EMT: string;
  EMTAssignment_ID: number;
  EMTAssignment_Desc: string;
  Employee_ID_EQCR: number;
  Full_Name_EQCR: string;
  Engagement_Name: string;
  Entity_Name: string;
  EMTSector_Desc: string;
  ID_Status: number;
  Descript_Status: string;
  Created: string;
};

export type AssignmentApprovalItem = {
  id: number;
  type: string;
  assignType: string;
  engagementName: string;
  engagementType: string;
  entity: string;
  creationDate: string;
  eqcrId: number;
  eqcrName: string;
  deputyStatus: string | null;
  cpppStatus: string | null;
  status : string | null;
  history: any[];
};

const STATUS_MAP: Record<number, {
  status: string;
  deputyStatus: string | null;
  cpppStatus: string | null;
}> = {
  1: {
    status: "CPPP Approved",
    deputyStatus: "approved",
    cpppStatus: "approved"
  },
  2: {
    status: "Pending Approval",
    deputyStatus: "approved",
    cpppStatus: null
  },
  3: {
    status: "Pending Approval",
    deputyStatus: null,
    cpppStatus: null
  },
  4: {
    status: "Pending Approval",
    deputyStatus: null,
    cpppStatus: null
  },
  5: {
    status: "Pending Approval",
    deputyStatus: null,
    cpppStatus: null
  },
  6: {
    status: "Pending Approval",
    deputyStatus: null,
    cpppStatus: null
  }
};

// const API_BASE_URL = "http://localhost:3000/api";
const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export const approvalsAssignmentsApi = {
  async list(): Promise<AssignmentApprovalItem[]> {
    const response = await fetch(`${BASE}/vw_EMT_Actives`, {
      method: "GET",
      credentials: "include", 
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();

    const rows: VwEmtActivesRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    
    return rows
      // ✅ FILTRO CORRECTO (IMPORTANTE)
      .filter(r => r.ID_Status !== 1) // 👈 ESTE ERA EL BUG PRINCIPAL
      .map(r => {
        const status = STATUS_MAP[r.ID_Status] ?? {
          status: "Pending Approval",
          deputyStatus: null,
          cpppStatus: null
        };
        return {
          id: r.EMTAssignment_ID,

          type:
            r.EMTAssignment_Desc === "Assistant"
              ? "Assistant"
              : "Assignment",

          assignType:
            r.EMTAssignment_Desc === "Reappointment"
              ? "Reappointment"
              : "New",

          engagementName: r.Engagement_Name,
          engagementType: r.EMTSector_Desc ?? "Audit",
          entity: r.Entity_Name,
          creationDate: r.Created,
          eqcrId: r.Employee_ID_EQCR,
          eqcrName: r.Full_Name_EQCR,
          status: status.status,
          deputyStatus: status.deputyStatus,
          cpppStatus: status.cpppStatus,
          history: []
        };
      });
  }
};

const STATUS_FROM_DB = (deputy: any, cppp: any) => {
  return {
    deputyStatus: deputy === 1 ? "approved"
      : deputy === 0 ? "rejected"
      : null,

    cpppStatus: cppp === 1 ? "approved"
      : cppp === 0 ? "rejected"
      : null,
  };
};

export type NewEqcrApprovalItem = {
  id: number;
  name: string;
  office: string;
  bu: string;
  locationName: string;
  createdDate: string;
  localJobLevel: string;
  promotionYear: string | number;
  deputyStatus: string | null;
  cpppStatus: string | null;

  history: any[];

  expertise: {
    aicpa: number;
    pcaob: number;
    icfr: number;
    sec: number;
    ifrs: number;
    usGaap: number;
  };
};

export const approvalsNewEqcrApi = {
  async list(): Promise<NewEqcrApprovalItem[]> {
    const res = await fetch(`${BASE}/vw_EMT_Credencials`,{
      method: "GET",
      credentials: "omit",
    });

    if (!res.ok) {
      throw new Error("Error loading EQCR data");
    }

    const data = await res.json();

    const rows =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    return rows.map((r: any) => {
      const status = STATUS_FROM_DB(r.Deputy, r.CPPP);

      return {
        id: r.EMTCredent_PK,

        name: r.Full_Name,
        localJobLevel: r.Local_Job_Level_Name,
        bu: r.BU,
        office: r.Location_Name, 
        promotionYear: r.Seniority_Date,
        createdDate: r.Created,

        deputyStatus: status.deputyStatus,
        cpppStatus: status.cpppStatus,

        history: [], // futuro

        expertise: {
          aicpa: r.AICPA ?? 0,
          pcaob: r.PCAOB ?? 0,
          icfr: r.ICFR ?? 0,
          sec: r.SEC ?? 0,
          ifrs: r.IFRS ?? 0,
          usGaap: r.USGAA ?? 0
        }
      };
    });
  }
};