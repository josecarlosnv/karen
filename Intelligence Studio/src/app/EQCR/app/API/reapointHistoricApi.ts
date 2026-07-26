const BASE = import.meta.env.VITE_EQCR_API_URL as string;

export type VwEmtReappointHistoricRow = {
  GeneratedReap: number;
  Employee_ID: number;
  Employee_Name: string;
  Local_Job_Level_Name: string;
  BU: string;
  Office: string;
  Entity_ID: string;
  Entity_Name: string;
  FY: number;
  EMT_SSRequi_Desc: string;
  EMT_Sector_ID: number;
  EMT_Sector_Desc: string;
  Year_Reappointment: number;
  Year_Appointment: number;
  CEAC_ID: string;
  Engagement_ID: number;
  Engagement_Name: string;
  LeadPartner_ID: number;
  LeadPartner_Name: string;
  Changes_Nature_Engament: boolean;
  Local_Listed: boolean;
  US_Listed: boolean;
  Other_Country_Listed: boolean;
  Regulated_Industry: boolean;
  Two_Year_Cooling: boolean;
  Has_Threats: boolean;
  PK_EMTReapHist: number;
  Key_EMT: string;
  EMT_SSRequi_ID_Concat: string;
  EMT_Type_PK: number;
};

export type HistoricalAssignmentVM = {
  id: string;
  eqcrId: number;
  name: string;
  localJobLevel: string;
  client: string;
  type: string;
EMT_SSRequi_ID_Concat: string;
  GeneratedReap: number;
  Employee_ID: number;
  Employee_Name: string;
  Local_Job_Level_Name: string;
  BU: string;
  Office: string;
  Entity_ID: string;
  Entity_Name: string;
  FY: number;
  EMT_SSRequi_Desc: string;
  EMT_Sector_ID: number;
  EMT_Sector_Desc: string;
  Year_Reappointment: number;
  Year_Appointment: number;
  CEAC_ID: string;
  Engagement_ID: number;
  Engagement_Name: string;
  LeadPartner_ID: number;
  LeadPartner_Name: string;
  Changes_Nature_Engament: boolean;
  Local_Listed: boolean;
  US_Listed: boolean;
  Other_Country_Listed: boolean;
  Regulated_Industry: boolean;
  Two_Year_Cooling: boolean;
  Has_Threats: boolean;
  PK_EMTReapHist: number;
  Key_EMT: string;
  EMT_Type_PK: number;
};

export const reappointHistoricApi = {
  async list(): Promise<HistoricalAssignmentVM[]> {
    const res = await fetch(`${BASE}/EMT_tbl_ReappointHistoric`,
        {
          credentials: "include",
        }
    );

    if (!res.ok) {
      throw new Error("Error loading reappointment history");
    }

    const data = await res.json();

    const rows: VwEmtReappointHistoricRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];
    return rows.map((r) => ({
      id: r.Key_EMT?.toString() ?? "",
      eqcrId: r.Employee_ID ?? 0,
      name: r.Employee_Name ?? "",
      localJobLevel: r.Local_Job_Level_Name ?? "",
      client: r.Entity_Name ?? "",
      type: r.EMT_Sector_Desc ?? "Audit",
EMT_SSRequi_ID_Concat:
  r.EMT_SSRequi_ID_Concat ?? "",
      GeneratedReap: r.GeneratedReap ?? 0,
      Employee_ID: r.Employee_ID ?? 0,
      Employee_Name: r.Employee_Name ?? "",
      Local_Job_Level_Name: r.Local_Job_Level_Name ?? "",
      BU: r.BU ?? "",
      Office: r.Office ?? "",
      Entity_ID: r.Entity_ID ?? "",
      Entity_Name: r.Entity_Name ?? "",
      FY: r.FY ?? 0,
      EMT_SSRequi_Desc: r.EMT_SSRequi_Desc ?? 0,
      EMT_Sector_ID: r.EMT_Sector_ID ?? 0,
      EMT_Sector_Desc: r.EMT_Sector_Desc ?? "",
      Year_Reappointment: r.Year_Reappointment ?? 0,
      Year_Appointment: r.Year_Appointment ?? 0,
      CEAC_ID: r.CEAC_ID ?? "",
      Engagement_ID: r.Engagement_ID ?? 0,
      Engagement_Name: r.Engagement_Name ?? "",
      LeadPartner_ID: r.LeadPartner_ID ?? 0,
      LeadPartner_Name: r.LeadPartner_Name ?? "",
      Changes_Nature_Engament: r.Changes_Nature_Engament ?? false,
      Local_Listed: r.Local_Listed ?? false,
      US_Listed: r.US_Listed ?? false,
      Other_Country_Listed: r.Other_Country_Listed ?? false,
      Regulated_Industry: r.Regulated_Industry ?? false,
      Two_Year_Cooling: r.Two_Year_Cooling ?? false,
      Has_Threats: r.Has_Threats ?? false,
      PK_EMTReapHist: r.PK_EMTReapHist ?? 0,
      Key_EMT: r.Key_EMT ?? "",
      EMT_Type_PK: r.EMT_Type_PK ?? 0,
        }));
  }
};