const BASE = import.meta.env.VITE_EQCR_API_URL as string;

type VwEmtAssignRow = {
    EMTAssign_PK: number;
    Key_EMT: string;
    Key_EMT_PFY:  string;
    FY: number;
    EMTSSRequi_Desc: string;
    Employee_ID_EQCR: number;
    Full_Name_EQCR: string;
    Local_Job_Level_Name: string;
    BU: string;
    EMTAssignment_ID: number;
    EMTAssignment_Desc: string;
    EMTSector_ID: number;
    EMTSector_Desc: string;
    Sector_ID: number;
    Year_Appointment: number;
    EMTReason_ID: number;
    EMTReason_Desc: string;
    CEAC_ID: number;
    Entity_ID: number;
    Entity_Name: string;
    Engagement_Name: string;
    Employee_ID_LEAP: number;
    Full_Name_LEAP: string;
    Employee_ID_PICReassing: number;
    Full_Name_PICReassing: string;
    Comment_PICReassing: string;
    Competence_Capabilities: boolean;
    Criteria_A: boolean;
    Sufficient_Time: boolean;
    Local_Listed: boolean;
    US_Listed: boolean;
    Other_Country_Listed: boolean;
    Regulated_Industry: boolean;
    Been_member_engagement: boolean;
    Two_Year_Cooling: boolean;
    Criteria_B: boolean;
    Has_Threats: boolean;
    Has_Threats_Desc: string;
    PIC: boolean;
    PIC_Email_Address_Business: string;
    PIC_Comment: string;
    PIC_Date: string;
    Deputy: boolean;
    Deputy_Email_Address_Business: string;
    Deputy_Comment: string;
    Deputy_Date: string;
    CPPP: boolean;
    CPPP_Email_Address_Business: string;
    CPPP_Comment: string;
    CPPP_Date: string;
    ID_Status: number;
    Descript_Status: string;
    Created: string;
    Created_By: string;
};

export type AssignmentViewModel = {
    requiresAssistant: boolean;
    assistantName?: string;

    EMTAssign_PK: number;
    id: string;
    Key_EMT_PFY:  string;
    FY: number;
    EMTSSRequi_Desc: string;
    
    Employee_ID_EQCR: number;
    eqcrName: string;
    Local_Job_Level_Name: string;
    BU: string;
    EMTAssignment_ID: number;
    assignType: string;
    EMTSector_ID: number;
    type: string;
    Sector_ID: number;
    yearOfAppointment: string;
    EMTReason_ID: number;
    assignmentReason: string;
    ceacId: string;
    Entity_ID: number;
    entity: string;
    engagementName: string;
    Employee_ID_LEAP: number;
    leadPartner: string;
    Employee_ID_PICReassing: number;
    Full_Name_PICReassing: string;
    Comment_PICReassing: string;
    Competence_Capabilities: boolean;
    Criteria_A: boolean;
    Sufficient_Time: boolean;
    Local_Listed: boolean;
    US_Listed: boolean;
    Other_Country_Listed: boolean;
    Regulated_Industry: boolean;
    Been_member_engagement: boolean;
    Two_Year_Cooling: boolean;
    Criteria_B: boolean;
    Has_Threats: boolean;
    Has_Threats_Desc: string;
    PIC: boolean;
    PIC_Email_Address_Business: string;
    PIC_Comment: string;
    PIC_Date: string;
    Deputy: boolean;
    Deputy_Email_Address_Business: string;
    Deputy_Comment: string;
    Deputy_Date: string;
    CPPP: boolean;
    CPPP_Email_Address_Business: string;
    CPPP_Comment: string;
    CPPP_Date: string;
    ID_Status: number;
    creationDate: string;
    Created_By: string;
    status: string;
};

export const assignmentsApi = {
  async getByKey(key: string): Promise<AssignmentViewModel | null> {
    const res = await fetch(`${BASE}/vw_EMT_Assign/${key}`);

    if (!res.ok) {
      throw new Error("Error loading assignment");
    }

    const data = await res.json();

    const rows: VwEmtAssignRow[] =
      Array.isArray(data)
        ? data
        : Array.isArray(data?.objects)
        ? data.objects
        : [];

    const r = rows[0];
    if (!r) return null;

    return {
        id: String(r.Key_EMT),
        EMTAssign_PK: r.EMTAssign_PK,
        Key_EMT_PFY: r.Key_EMT_PFY,
        FY: r.FY,
        
        EMTSSRequi_Desc: r.EMTSSRequi_Desc,

        Employee_ID_EQCR: r.Employee_ID_EQCR,
        Local_Job_Level_Name: r.Local_Job_Level_Name,
        BU: r.BU,
        EMTAssignment_ID: r.EMTAssignment_ID,
        EMTSector_ID: r.EMTSector_ID,
        Sector_ID: r.Sector_ID,
        EMTReason_ID: r.EMTReason_ID,
        Entity_ID: r.Entity_ID,
        Employee_ID_LEAP: r.Employee_ID_LEAP,
        Employee_ID_PICReassing: r.Employee_ID_PICReassing,
        Full_Name_PICReassing: r.Full_Name_PICReassing,
        Comment_PICReassing: r.Comment_PICReassing,
        Competence_Capabilities: r.Competence_Capabilities,
        Criteria_A: r.Criteria_A,
        Sufficient_Time: r.Sufficient_Time,
        Local_Listed: r.Local_Listed,
        US_Listed: r.US_Listed,
        Other_Country_Listed: r.Other_Country_Listed,
        Regulated_Industry: r.Regulated_Industry,
        Been_member_engagement: r.Been_member_engagement,
        Two_Year_Cooling: r.Two_Year_Cooling,
        Criteria_B: r.Criteria_B,
        Has_Threats: r.Has_Threats,
        Has_Threats_Desc: r.Has_Threats_Desc,
        PIC: r.PIC,
        PIC_Email_Address_Business: r.PIC_Email_Address_Business,
        PIC_Comment: r.PIC_Comment,
        PIC_Date: r.PIC_Date,
        Deputy: r.Deputy,
        Deputy_Email_Address_Business: r.Deputy_Email_Address_Business,
        Deputy_Comment: r.Deputy_Comment,
        Deputy_Date: r.Deputy_Date,
        CPPP: r.CPPP,
        CPPP_Email_Address_Business: r.CPPP_Email_Address_Business,
        CPPP_Comment: r.CPPP_Comment,
        CPPP_Date: r.CPPP_Date,
        ID_Status: r.ID_Status,
        Created_By: r.Created_By,

      type: r.EMTSector_Desc ?? "Audit",

      assignType:
        r.EMTAssignment_Desc === "Reappointment"
          ? "Reappointment"
          : r.EMTAssignment_Desc === "Reassignment"
          ? "Reassigned"
          : "Assigned",

      engagementName: r.Engagement_Name,
      entity: r.Entity_Name,

      creationDate: r.Created,
      status: r.Descript_Status,

      eqcrName: r.Full_Name_EQCR,
      leadPartner: r.Full_Name_LEAP,

      yearOfAppointment: String(r.Year_Appointment),
      assignmentReason: r.EMTReason_Desc,
      ceacId: `CEAC-${r.CEAC_ID}`,

      requiresAssistant: false,
      assistantName: undefined
    };
  }
};