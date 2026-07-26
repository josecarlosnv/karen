export type ApprovalStatus =
    | "Review Pending"
    | "Pending Approves"
    | "LEAP Approved"
    | "PIC Approved"
    | "HofA Approved"
    | "BUPP Approved"
    | "BUPP & HofA Approved";

  /*
    | "pending-bu-leader"
  | "pending-approval"
  | "approved";
  */

export type LeadPartnerApproval = {
    id: string;
    client: string;
    partner: string;
    manager: string;
    projectType: "Current" | "Contingent" | string;
    fiscalYear: string;
    status: ApprovalStatus;
    requiresAdditionalReview: number;
    //new 
    approveLvlNeededDescription: string;
    BU: string;
    netRevenue: number;
    hours: number;
    valuation: number;
    avgFee: number;
};
/*
export type PICApproval = {
    id: string;
    client: string;
    partner: string;
    manager: string;
    projectType: "Current" | "Contingent" | string;
    fiscalYear: string;
    status: ApprovalStatus;
    requiresAdditionalReview: boolean;
    //new 
    approveLvlNeededDescription: string;
    BU: string;
    netRevenue: number;
    hours: number;
    valuation: number;
    avgFee: number;
};

export type HofAAndBUPPApproval = {
    id: string;
    client: string;
    partner: string;
    manager: string;
    projectType: "Current" | "Contingent" | string;
    fiscalYear: string;
    status: ApprovalStatus;
    requiresAdditionalReview: boolean;
    //new 
    approveLvlNeededDescription: string;
    BU: string;
    netRevenue: number;
    hours: number;
    valuation: number;
    avgFee: number;
};
*/