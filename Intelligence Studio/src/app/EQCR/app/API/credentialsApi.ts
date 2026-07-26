const BASE = import.meta.env.VITE_EQCR_API_URL as string;

type vw_EMT_CredencialsType = {
    EMTCredent_PK: number;
    Employee_ID: number;
    Full_Name: string;
    Local_Job_Level_Name: string;
    Seniority_Date: Date;
    BU: string;
    Location_Name: string;
    Understanding_Responsabilities: boolean;
    AICPA: number;
    PCAOB: number;
    ICFR: number;
    SEC: number;
    IFRS: number;
    USGAA: number;
    Specific_Training: string;
    Indutry_Experience: string;
    Qualification1: string;
    Qualification2: string;
    Qualification3: string;
    NC_Evaluation: string;
    PCAOB_Inspection_Results: string;
    EMTIndepence_ID: number;
    EMTIndepence_Desc: string;
    Event_Number: number;
    Deputy: boolean;
    Deputy_Email_Address_Business: string;
    Deputy_Comment: string;
    Deputy_Date: Date;
    CPPP: boolean;
    CPPP_Email_Address_Business: string;
    CPPP_Comment: string;
    CPPP_Date: Date;
    Created: Date;
    Created_By: string;
};

 export type eqcrProfile = {
    eqcrId: number;
    name: string;
    localJobLevel: string;
    bu: string;
    seniorityDate: Date;
    understandingResponsibilities: boolean;
    standards: {
        aicpa: number;
        pcaob: number;
        icfr: number;
        sec: number;
        ifrs: number;
        usGaap: number;
        trainingCompleted: string;
        industryExperience: string;
      },
    Indutry_Experience: string;
      qpr: {
        2023: number;
        2024: number;
        2025: number;
        2026: number;
      },
      evaluation: {
        ncEvaluation: string;
        pcaobInspection: string;
        independenceComplianceID: number;
        independenceCompliance: string;
      },
      approvals: {
        deputy: boolean;
        deputyEmail: string;
        deputyComment: string;
        deputyDate: Date;
        cppp: boolean;
        cpppEmail: string;
        cpppComment: string;
        cpppDate: Date;
    },
    metaData: {
        emtCredenPk: number;
        eventNumber: number;
        created: Date;
        createdBy: number;
    }
}