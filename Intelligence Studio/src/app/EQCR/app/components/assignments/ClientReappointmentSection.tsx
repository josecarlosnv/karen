import { useState, useEffect } from "react";
import { CollapsibleSection } from "./CollapsibleSection";
import {
  Check,
  Edit2,
  CheckCircle2,
  TrendingUp,
  Award,
  Trash2,
} from "lucide-react";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { SearchableSelect } from "../ui/searchable-select";
import {
  clientOptions,
  partnerOptions,
} from "../../data/assignmentOptions";
import { cn } from "../ui/utils";
import { eqcrMasterList } from "../../data/eqcrData";
import { reappointHistoricApi, HistoricalAssignmentVM } from "../../API/reapointHistoricApi";
import { toast } from "sonner";
import { authApi, Claims } from "../../API/authApi";//By Isaac

interface ClientReappointmentSectionProps {
    searchQuery?: string;
  selectedType?: string;

  onFormStateChange?: (isFormOpen: boolean) => void;
  onSelectionChange?: (selectedCount: number) => void;
  onBulkReappointment?: () => void;
}

export default function ClientReappointmentSection({
  searchQuery = "",
  
  selectedType = "All",

  onFormStateChange,
  onSelectionChange,
  onBulkReappointment,
}: ClientReappointmentSectionProps) {
  const [showReappointmentForm, setShowReappointmentForm] =
    useState(false);
  const [selectedEqcr, setSelectedEqcr] = useState<any>(null);
  const [selectedAssignments, setSelectedAssignments] =
    useState<number[]>([]);
  const [isEditingEqcr, setIsEditingEqcr] = useState(false);
  const [eqcrSearchValue, setEqcrSearchValue] = useState("");
  const [validationData, setValidationData] = useState<any>(null);
  //info rial
  const [assignmentsData, setAssignmentsData] = useState<HistoricalAssignmentVM[]>([]);
  const [loadingAssignments, setLoadingAssignments] = useState(false);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    authApi.getClaims()
      .then(setUser)
      .catch(console.error);
  }, []);
 const loadAssignments = async () => {
  try {
    setLoadingAssignments(true);

    const res = await reappointHistoricApi.list();

    setAssignmentsData(res ?? []);

  } catch (err) {
    console.error("Error loading assignments", err);
    setAssignmentsData([]);
  } finally {
    setLoadingAssignments(false);
  }
};

useEffect(() => {
  loadAssignments();
}, []);
useEffect(() => {
  const handleVisibilityChange = () => {
    if (!document.hidden) {
      loadAssignments();
    }
  };

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  return () => {
    document.removeEventListener(
      "visibilitychange",
      handleVisibilityChange
    );
  };
}, []);
  // Collapsible sections state
  const [openSections, setOpenSections] = useState({
    engagementDetails: true,
    razonEqcr: true,
    reappointmentCriteria: true,
  });

  const toggleSection = (
    section: keyof typeof openSections,
  ) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };
//By Isaac
const filteredAssignments = assignmentsData.filter((r) => {
  const search = searchQuery.toLowerCase();

  const matchesSearch =
    !searchQuery.trim() ||
    (r.Entity_Name ?? "").toLowerCase().includes(search) ||
    (r.Employee_Name ?? "").toLowerCase().includes(search) ||
    (r.LeadPartner_Name ?? "").toLowerCase().includes(search) ||
    String(r.Year_Appointment ?? "").includes(search);

  const matchesType =
    selectedType === "All" ||
    r.EMT_Sector_Desc === selectedType;

  return matchesSearch && matchesType;
});
//
//rial
  const clientGroups = (() => {
    const groupMap: { [key: string]: any } = {};

    //assignmentsData.forEach((r) => {
    filteredAssignments.forEach((r) => {
      if (!r.Entity_ID) return;

      if (!groupMap[r.Entity_ID]) {
        groupMap[r.Entity_ID] = {
          id: r.Entity_ID,
          clientName: r.Entity_Name ?? "N/A",
          count: 0,
          eqcrs: [],
        };
      }
groupMap[r.Entity_ID].eqcrs.push({
  assignmentId: r.PK_EMTReapHist ?? 0,

  eqcrId: r.Employee_ID ?? 0,
  name: r.Employee_Name ?? "N/A",
  localJobLevel: r.Local_Job_Level_Name ?? "",
  type: r.EMT_Sector_Desc ?? "Audit",

  leadPartner: r.LeadPartner_Name ?? "N/A",

  emtTypePk: r.EMT_Type_PK ?? 0,

  yearOfAppointment: r.Year_Appointment
    ? String(r.Year_Appointment)
    : "N/A",

  requiresAssistant: false,
  assistantName: "",

  raw: r
});

      groupMap[r.Entity_ID].count++;
    });

    return Object.values(groupMap);
  })();

  const [formData, setFormData] = useState({
    ceacId: "",
    localClientName: "",
    engagementName: "",
    leadPartner: "",
    eqcrId: 0,
    eqcrName: "",
    partnerOrDirector: "",
    yearOfAppointment: "",
    auditYearReassessment: "",
    competenceText: "",

    coolingPeriodApplied: false,

    threatsToObjectivity: false,

    safeguardsDescription: "",

    Able_Carry_With_Objectivity_Integrity_Impartiality: false,
    razonEqcrRequired: [] as number[],
    trainingAICPA: false,
    trainingPCAOB: false,
    trainingICFR: false,
    trainingSEC: false,
    trainingIFRS: false,
    trainingUSGAAP: false,
    trainingOther: false,
    // Checkboxes
    ncImpactEvaluation: false,
    pcaobInspection: false,
    competence: false,
    noSignificantChanges: false,
    legalRegulatoryChanges: false,
    industryChanges: false,
    complexityChanges: false,
    sufficientTime: false,
    independent: false,
    objectivityIntegrityImpartiality: false,
    engagementTeamInvolved: false,
    unmitigatedThreats: false,
    noResponsibilityComponents: false,
  });

useEffect(() => {
  if (!selectedEqcr?.raw) return;

  const r = selectedEqcr.raw;
const razones =
  r.EMT_SR_Requi_ID_Concat
    ?.split("||")
    .map(x => Number(x.trim()))
    .filter(x => !isNaN(x)) || [];

  setFormData((prev) => ({
    ...prev,
  razonEqcrRequired: razones,
    ceacId: r.CEAC_ID ?? "",
    localClientName: r.Entity_Name ?? "",
    engagementName: r.Engagement_Name ?? "",
    LeadPartner_Employee_ID: r.LeadPartner_ID ?? "",
leadPartner: r.LeadPartner_Name ?? "",
    eqcrId: r.Employee_ID ?? 0,
    eqcrName: r.Employee_Name ?? "",
    partnerOrDirector: r.Local_Job_Level_Name ?? "",

    yearOfAppointment: r.Year_Appointment
      ? String(r.Year_Appointment)
      : "",

    auditYearReassessment: r.Year_Reappointment
      ? String(r.Year_Reappointment)
      : "",



    GeneratedReap: r.GeneratedReap ?? 0,
    Employee_ID: r.Employee_ID ?? 0,
    Employee_Name: r.Employee_Name ?? "",
    Local_Job_Level_Name: r.Local_Job_Level_Name ?? "",
    BU: r.BU ?? "",
    Office: r.Office ?? "",
    Entity_ID: r.Entity_ID ?? "",
    Entity_Name: r.Entity_Name ?? "",
    Fiscal_Year_EMT: r.FY ?? 0,
    EMT_SR_Requi_ID_Concat: r.EMT_SR_Requi_ID_Concat ?? "",
    EMTSector_ID: r.EMTSector_ID ?? 0,
    EMTSector_Desciption: r.EMTSector_Desciption ?? "",
    Year_Reappointment: r.Year_Reappointment ?? 0,
    Year_Appointment: r.Year_Appointment ?? 0,
    CEAC_ID: r.CEAC_ID ?? "",
    Engagement_ID: r.Engagement_ID ?? "",
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
    Key_EMT: r.Key_EMT ?? ""
  }));
}, [selectedEqcr]);

useEffect(() => {
  if (!validationData) return;
  console.log(   "Concat:",   validationData.EMT_SR_Requi_ID_Concat  );
  const razones =   validationData.EMT_SR_Requi_ID_Concat  ?.split("||")
     .map(x => Number(x.trim()))
          .filter(x => !isNaN(x)) || [];
            console.log("Razones:", razones);
  setFormData(prev => ({
    ...prev,
razonEqcrRequired: razones,
    sufficientTime:
      validationData.Sufficient_time ?? false,

    noResponsibilityComponents:
      validationData.No_responsibility ?? false,

    unmitigatedThreats:
      validationData.Has_Threats ?? false,

    Two_Year_Cooling:
      validationData.Two_Year_Cooling ?? false,

    safeguards:
      validationData.Has_Threats_Desc ?? "",
  }));

}, [validationData]);

  useEffect(() => {
    if (onFormStateChange) {
      onFormStateChange(showReappointmentForm);
    }
  }, [showReappointmentForm, onFormStateChange]);

  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedAssignments.length);
    }
  }, [selectedAssignments, onSelectionChange]);

  const toggleAssignmentSelection = (assignmentId: number) => {
    setSelectedAssignments((prev) =>
      prev.includes(assignmentId)
        ? prev.filter((id) => id !== assignmentId)
        : [...prev, assignmentId],
    );
  };

 //cambio
  const handleEqcrReappointmentClick = (eqcr: any, client: any) => {
    setSelectedEqcr({
      ...eqcr,
      client: client.clientName,
      raw: eqcr.raw 
    });
    loadCredentialSummary(
        String(eqcr.eqcrId)
      );
    setShowReappointmentForm(true);
  };

const normalize = (text: string) =>
  text.toLowerCase().replace(/\s+/g, " ").trim();

  const handleInternalBulkReappointment = () => {
    console.log(
      "Initiating bulk reappointment for assignments:",
      selectedAssignments,
    );
    if (onBulkReappointment) {
      onBulkReappointment();
    }
    toast.success("Reappointment initiated", {
  description: `${selectedAssignments.length} assignment(s) selected`,
});
    setSelectedAssignments([]);
  };

  const handleSubmitReappointment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Reappointment submitted:", {
      eqcr: selectedEqcr,
      ...formData,
    });
    setShowReappointmentForm(false);
    setSelectedEqcr(null);
  };

  const handleSaveReappointment = async () => {
  try {
    const previousKeyEMT =
      selectedEqcr?.raw?.Key_EMT;

    const basicPayload = {
      Key_EMT_PFY: previousKeyEMT,

      Fiscal_Year_EMT: formData.Fiscal_Year_EMT,

      Employee_ID:
        formData.Employee_ID,

      Year_Appointment: Number(
        formData.yearOfAppointment
      ),

      Year_Reappointment: Number(
        formData.auditYearReassessment
      ),

      EMT_Type_PK:
        selectedEqcr?.raw?.EMT_Type_PK ?? 2,

      EMT_Reason_ID: 5,

      CEAC_ID: formData.CEAC_ID,

      Engagement_Name:
        formData.Engagement_Name,

      Entity_ID: String(
        formData.Entity_ID
      ),

      LeadPartner_Employee_ID:
        formData.LeadPartner_Employee_ID,

      Ready_to_Approve: false,

      Created_By: user?.email,
    };
console.log("Lead Partner Debug", {
  leadPartnerId: formData.LeadPartner_Employee_ID,
  leadPartnerName: formData.LeadPartner_Name,
});

console.log("basicPayload", basicPayload);
    const basicResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          basicPayload
        ),
      }
    );

    if (!basicResponse.ok) {
      throw new Error(
        "Error saving Basic Information"
      );
    }

    const basicResult =
      await basicResponse.json();

    const generatedKeyEMT =
      basicResult.Key_EMT;

    const validationPayload = {
  Key_EMT: generatedKeyEMT,

  EMT_SR_Requi_ID_Concat:
    formData.razonEqcrRequired.join(","),

  Competence_To_Perform:
    formData.competenceText,

  Changes_Nature:
    formData.noSignificantChanges,

  Changes_Legal_Regulatory:
    formData.legalRegulatoryChanges,

  Changes_Industry:
    formData.industryChanges,

  Changes_Complexity:
    formData.complexityChanges,

  Sufficient_Time:
    formData.sufficientTime,

  Able_Carry_With_Objectivity_Integrity_Impartiality:
    formData.objectivityIntegrityImpartiality,

  Member_of_the_engagement:
    formData.engagementTeamInvolved,

  Cooling_Off_Applied:
    formData.coolingPeriodApplied,

  Has_Threats:
    formData.threatsToObjectivity,

  Has_Threats_Desc:
    formData.safeguardsDescription,

  No_responsibility:
    formData.noResponsibilityComponents,

  Created_By:
    user?.email,
};

    const validationResponse = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify(
          validationPayload
        ),
      }
    );

    if (!validationResponse.ok) {
      throw new Error(
        "Error saving Validation Criteria"
      );
    }

    toast.success(
      "Reappointment draft saved successfully"
    );

    await loadAssignments();

    setShowReappointmentForm(false);
    setSelectedEqcr(null);
  } catch (error) {
    console.error(error);

    toast.error(
      "Error submitting reappointment"
    );
  }
};
 const handleSaveAndSubmitReappointment =
  async () => {
    try {
      const previousKeyEMT =
        selectedEqcr?.raw?.Key_EMT;

      const basicPayload = {
        Key_EMT_PFY:
          previousKeyEMT,

        Fiscal_Year_EMT: formData.Fiscal_Year_EMT,

        Employee_ID:
          formData.Employee_ID,

        Year_Appointment: Number(
          formData.yearOfAppointment
        ),

        Year_Reappointment: Number(
          formData.auditYearReassessment
        ),

        EMT_Type_PK:
          selectedEqcr?.raw
            ?.EMT_Type_PK ?? 2,

        EMT_Reason_ID: 5,

        CEAC_ID:
          formData.CEAC_ID,

        Engagement_Name:
          formData.Engagement_Name,

        Entity_ID: String(
          formData.Entity_ID
        ),

        LeadPartner_Employee_ID:
          formData.LeadPartner_Employee_ID,

        Ready_to_Approve: true,

        Created_By:
          user?.email,
      };

      const basicResponse =
        await fetch(
          `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsBasicInformation`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              basicPayload
            ),
          }
        );

      if (!basicResponse.ok) {
        throw new Error(
          "Error saving Basic Information"
        );
      }

      const basicResult =
        await basicResponse.json();

      const generatedKeyEMT =
        basicResult.Key_EMT;

      
        const validationPayload = {
          Key_EMT: generatedKeyEMT,

          EMT_SR_Requi_ID_Concat:
            formData.razonEqcrRequired.join(","),

          Competence_To_Perform:
            formData.competenceText,

          Changes_Nature:
            formData.noSignificantChanges,

          Changes_Legal_Regulatory:
            formData.legalRegulatoryChanges,

          Changes_Industry:
            formData.industryChanges,

          Changes_Complexity:
            formData.complexityChanges,

          Sufficient_Time:
            formData.sufficientTime,

          Able_Carry_With_Objectivity_Integrity_Impartiality:
            formData.objectivityIntegrityImpartiality,

          Member_of_the_engagement:
            formData.engagementTeamInvolved,

          Cooling_Off_Applied:
            formData.coolingPeriodApplied,

          Has_Threats:
            formData.threatsToObjectivity,

          Has_Threats_Desc:
            formData.safeguardsDescription,

          No_responsibility:
            formData.noResponsibilityComponents,

          Created_By:
            user?.email,
        };

      const validationResponse =
        await fetch(
          `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_AssignmetsValidationCriteria`,
          {
            method: "POST",
            credentials:
              "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              validationPayload
            ),
          }
        );

      if (
        !validationResponse.ok
      ) {
        throw new Error(
          "Error saving Validation Criteria"
        );
      }
     
      toast.success(
        "Reappointment submitted successfully"
      );

      await loadAssignments();

      setShowReappointmentForm(
        false
      );

      setSelectedEqcr(null);
    } catch (error) {
      console.error(error);

      toast.error(
        "Error submitting reappointment"
      );
    }
  };

  const handleDeleteAssignment = (
    e: React.MouseEvent,
    assignmentId: number,
    eqcrName: string,
  ) => {
    e.stopPropagation(); // Prevent card click
   toast.warning("Delete assignment?", {
  description: eqcrName,
  action: {
    label: "Delete",
    onClick: () => {
      console.log(`Deleting assignment ${assignmentId}`);

      toast.success("Assignment deleted", {
        description: eqcrName,
      });
    },
  },
});
  };
interface FiscalYear {
  EMT_Years_ID: number;
  Is_CFY: boolean | null;
  Is_PFY: boolean | null;
  Is_Current: boolean;
}

const [fiscalYears, setFiscalYears] = useState<FiscalYear[]>([]);
useEffect(() => {
  const loadFiscalYears = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_dim_Years`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading fiscal years");
      }

      const data = await response.json();

      console.log("Fiscal Years", data);

      setFiscalYears(data);
    } catch (error) {
      console.error("Error loading fiscal years", error);
    }
  };

  loadFiscalYears();
}, []);

const [credentials, setCredentials] =
  useState<any>(null);
  const loadCredentialSummary = async (
  employeeId: string
) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/getCredentialSummaryByEmployeeId/${employeeId}`,
      {
        credentials: "include",
      }
    );

    if (!response.ok) {
      throw new Error(
        "Error loading credential summary"
      );
    }

    const data = await response.json();

    console.log(
      "Credential Summary",
      data
    );

    setCredentials(data);

  } catch (error) {
    console.error(error);
  }
};
interface EQCRCredential {
  EMT_CredentGen_PK: number;
  EMT_Credent_PK: number;
  Employee_ID: string;
  Full_Name: string;
  Local_Job_Level_Name: string;
}

const [eqcrList, setEqcrList] = useState<EQCRCredential[]>([]);
const [loadingEqcr, setLoadingEqcr] = useState(false);
useEffect(() => {
  const loadEQCRs = async () => {
    try {
      setLoadingEqcr(true);

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_CredentialsGenerated/getCredentialsEQCR`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Error loading EQCR credentials");
      }

      const data = await response.json();

      setEqcrList(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingEqcr(false);
    }
  };

  loadEQCRs();
}, []);

  if (showReappointmentForm && selectedEqcr) {
    // Mock credentials data based on EQCR ID
    const standards = credentials
  ? [
      {
        name: "AICPA",
        value: credentials.AICPA,
      },
      {
        name: "PCAOB",
        value: credentials.PCAOB,
      },
      {
        name: "IFRS",
        value: credentials.IFRS,
      },
      {
        name: "US GAAP",
        value: credentials.USGAAP,
      },
    ]
  : [];

    const getQprColor = (rating: string) => {
  switch (rating) {
    case "NC":
      return "bg-green-100 text-green-700 border-green-200";
    case "CIN":
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    case "AC":
      return "bg-blue-100 text-blue-700 border-blue-200";
    default:
      return "bg-gray-100 text-gray-500 border-gray-200";
  }
};

    const handleEqcrNameClick = () => {
      setIsEditingEqcr(true);
      setEqcrSearchValue(formData.eqcrName);
    };

    const handleEqcrSelect = (selectedValue: string) => {
  const eqcr = eqcrList.find(
    (e) =>
      e.EMT_Credent_PK.toString() === selectedValue
  );

  if (eqcr) {
    setFormData((prev) => ({
      ...prev,
      eqcrId: Number(eqcr.Employee_ID),
      eqcrName: eqcr.Full_Name,
      partnerOrDirector:
        eqcr.Local_Job_Level_Name,
    }));

    loadCredentialSummary(
      eqcr.Employee_ID
    );

    setIsEditingEqcr(false);
  }
};


    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with inline editable EQCR name */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-baseline gap-3 mb-1">
              {isEditingEqcr ? (
                <div className="flex items-center gap-2">
                  <SearchableSelect
  value={formData.eqcrId?.toString()}
  onChange={(value) =>
    handleEqcrSelect(String(value))
  }
  options={eqcrList.map((e) => ({
    value: e.EMT_Credent_PK.toString(),
    label: e.Full_Name,
  }))}
  placeholder={
    loadingEqcr
      ? "Loading EQCRs..."
      : "Search EQCR..."
  }
/>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsEditingEqcr(false)}
                  >
                    <Check className="w-4 h-4" />
                  </Button>
                </div>
              ) : (
                <>
                  <h2
                    className="text-2xl font-semibold text-gray-900 cursor-pointer hover:text-[#00338D] transition-colors group inline-flex items-center gap-2"
                    style={{
                      letterSpacing: "0.01em",
                      lineHeight: "1.25",
                    }}
                    onClick={handleEqcrNameClick}//para hacer editable el seleccionador de EQCR
                  >
                    {formData.eqcrName}
                    <Edit2 className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h2>
                  <span className="text-sm text-[#00338D]">
                    {credentials?.Local_Job_Level_Name ??
                      formData.partnerOrDirector}
                    {" • "}
                    {credentials?.Years_In_Role ?? 0}
                    {" yrs"}
                  </span>
                </>
              )}
            </div>
            <p
              className="text-sm text-gray-600 mt-1"
              style={{
                letterSpacing: "0.01em",
                lineHeight: "1.45",
              }}
            >
              {selectedEqcr.type} Engagement •{" "}
              {selectedEqcr.client}
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={() => {
              setShowReappointmentForm(false);
              setSelectedEqcr(null);
              setIsEditingEqcr(false);
            }}
            className="text-gray-600 hover:text-gray-900"
          >
            Back
          </Button>
        </div>

        {/* EQCR Credentials Summary - Compact inline section */}
        <div className="py-5 px-6 bg-white rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-4">
            {/* Compliance Status */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                Compliance
              </p>
              <div className="space-y-1 text-xs text-gray-700">
                <div className="flex items-center justify-between">
                  <span>Independence</span>
                  <span className="font-medium text-green-700">
                    {credentials?.Indepence_Desc || "N/A"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Ethics</span>
                  <span className="font-medium text-green-700">
                    Completed
                  </span>
                </div>
              </div>
            </div>

            {/* QPR Results */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                QPR Results
              </p>
              <div className="flex gap-2">
  {[
    {
      year: "2023",
      rating: credentials?.QPR1,
    },
    {
      year: "2024",
      rating: credentials?.QPR2,
    },
    {
      year: "2025",
      rating: credentials?.QPR3,
    },
  ].map(({ year, rating }) => (
    <div key={year} className="text-center">
      <p className="text-xs text-gray-700 font-normal mb-1">
        {year}
      </p>

      <span
        className={`px-2 py-0.5 rounded text-xs font-medium border ${getQprColor(
          rating
        )}`}
      >
        {rating ?? "N/A"}
      </span>
    </div>
  ))}
</div>
            </div>

            {/* Standards & Framework */}
            <div>
              <p className="text-xs font-medium text-[#00338D] capitalize tracking-wide mb-2">
                Standards
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1">
                {standards.map((standard)=> (
                  <div
                    key={standard.name}
                    className="flex items-center justify-between text-xs"
                  >
                    <span className="text-gray-600">
                      {standard.name}
                    </span>
                    <span className="font-semibold text-[#00338D]">
{standard.value ?? "0"}
                      </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* View full credentials link */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="text-xs text-[#00338D] hover:text-[#0055B8] font-medium transition-colors"
            >
              View full credentials →
            </button>
          </div>
        </div>

        {/* Form Section - Single column */}
        <form
          onSubmit={handleSubmitReappointment}
          className="space-y-6"
        >
          {/* 1. Engagement Details */}
          <CollapsibleSection
            title="Engagement Details"
            isOpen={openSections.engagementDetails}
            onToggle={() => toggleSection("engagementDetails")}
          >
              <div className="space-y-4">
                {/* Assignment Type and Assistant Status */}
                <div className="flex items-center gap-4 pb-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#00338D]">
                      Assignment Type:
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
                      {selectedEqcr.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#00338D]">
                      {selectedEqcr.requiresAssistant
                        ? "Assistant:"
                        : "Assistant Required:"}
                    </span>
                    <span className="text-xs font-normal text-gray-900">
                      {selectedEqcr.requiresAssistant
                        ? selectedEqcr.assistantName
                        : "No"}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ceacId" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">CEAC ID</Label>
                    <Input
                      id="ceacId"
                      value={formData.ceacId}
                      readOnly
                     
                      className="mt-1.5 h-9 text-[13px] font-normal text-[#1F2937]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="localClientName" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                      Local Client Name
                    </Label>
                   
                    <Input
  id="localClientName"
  value={formData.localClientName}
  readOnly
/>
                  </div>
                  <div>
                    <Label htmlFor="engagementName" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                      Engagement Name
                    </Label>
                    <Input
                      id="engagementName"
                      value={formData.engagementName}
                      readOnly
                      className="mt-1.5 h-9 text-[13px] font-normal text-[#1F2937]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="leadPartner" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                      Lead Partner
                    </Label>
                    
                    <Input
  id="leadPartner"
  value={formData.leadPartner}
  readOnly
/>
                  </div>

                  <div>
                    <Label htmlFor="yearOfAppointment" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                      Year of Appointment as EQCR
                    </Label>
                    
<Input
  id="yearOfAppointment"
  value={formData.yearOfAppointment}
  readOnly
/>

                  </div>
                  <div>
                    <Label htmlFor="auditYearReassessment" className="text-[11px] font-semibold text-[#00338d] capitalize tracking-[0.12em]">
                      Audit Year of Reassessment
                    </Label>
                     <select
                          id="yearOfAppointment"
                          value={formData.yearOfAppointment}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              yearOfAppointment: e.target.value,
                            })
                          }

                        className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[12px] font-normal text-[#1F2937] shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option value=""></option>
                       {fiscalYears.map((year) => (
                          <option
                            key={year.EMT_Years_ID}
                            value={year.EMT_Years_ID}
                          >
                            {year.EMT_Years_ID}
                          </option>
                        ))}
                      </select>     
                  </div>
                </div>

                {/* Evaluation Section (only for Audit type) */}
              </div>
          </CollapsibleSection>

          {/* 2. Razon EQCR Required (Audit Only) */}
          {/* 2. Razon EQCR Required (Audit Only) */}
          {selectedEqcr.type === "Audit" && (
  <CollapsibleSection
    title="Assignment Reason"
    isOpen={openSections.razonEqcr}
    onToggle={() => toggleSection("razonEqcr")}
  >
    <div className="space-y-2">

      {[
        "Required by applicable law, regulation or professional standards? (i.e. CUAE , others)",
        "The is engagement considered to be High risk, unless exempted by the Risk Management Partner",
        "Otherwise required by functional or member firm guidance?",
        "Audit engagements for entities that engage in High Risk Industries/Activities. (High Risk Industries/Activities are listed in the OA Alert)",
        "Audits of FS of a listed entity and any related review(s) of interim financial information",
        "Audits of financial statements of a non-listed entity with a high public profile and any related review(s) of interim financial information",
        "The engagement is considered to be high risk as designated in CEAC, unless exempted by the risk management partner",
        "Engagements, including reviews of interim financial information, that require an EQCR review under local laws or regulations",
      ].map((reason, index) => {
        const reasonId = index + 1;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-2"
          >
            <Checkbox
              id={`razon-reapp-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFormData({
                    ...formData,
                    razonEqcrRequired: [
                      ...formData.razonEqcrRequired,
                      reasonId,
                    ],
                  });
                } else {
                  setFormData({
                    ...formData,
                    razonEqcrRequired:
                      formData.razonEqcrRequired.filter(
                        (r) => r !== reasonId
                      ),
                  });
                }
              }}
            />
            <Label
              htmlFor={`razon-reapp-${reasonId}`}
              className="text-[11px] font-normal cursor-pointer text-gray-900"
            >
              {reason}
            </Label>
          </div>
        );
      })}

      <div className="pt-3 pb-1">
        <p className="text-xs font-semibold text-[#00338D]">
          Other engagements, including reviews of interim financial
          information, as designated by the RMP, CPPP or country head of audit:
        </p>
      </div>

      {[
        "Statutory Audit (under ISA 700's) when the component is a substantial role subsidiary, according with SEC rule, for the audit of the consolidated financial statements under PCAOB",
        "All Non for-Profit Entities",
        "SOFOMES and any other entity performing operations similar to banking and insurance entities with related parties or third parties when the LAEP is not a partner of financial services segment",
      ].map((reason, index) => {
        const reasonId = index + 9;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-2"
          >
            <Checkbox
              id={`razon-reapp-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFormData({
                    ...formData,
                    razonEqcrRequired: [
                      ...formData.razonEqcrRequired,
                      reasonId,
                    ],
                  });
                } else {
                  setFormData({
                    ...formData,
                    razonEqcrRequired:
                      formData.razonEqcrRequired.filter(
                        (r) => r !== reasonId
                      ),
                  });
                }
              }}
            />
            <Label
              htmlFor={`razon-reapp-${reasonId}`}
              className="text-[11px] font-normal cursor-pointer text-gray-900"
            >
              {reason}
            </Label>
          </div>
        );
      })}

      <div className="py-2">
        <div className="border-t border-gray-300" />
      </div>

      {[
        "Any time an opinion under PCAOB standards is issued, including the following: all audits, all reviews of interim financial information, all attestation engagements, audits or interim reviews performed by component auditors where the auditor's report or interim report is issued to a non-KPMG group auditor Note 2",
        "Audits of internal control over financial reporting (ICFR)",
        "Audits conducted in accordance with AICPA standards where our report is included in an SEC periodic filing, an entity's exempt offering, the first franchise offering document of a new or existing client that requires the firm's consent",
      ].map((reason, index) => {
        const reasonId = index + 12;

        return (
          <div
            key={reasonId}
            className="flex items-start gap-2"
          >
            <Checkbox
              id={`razon-reapp-${reasonId}`}
              checked={formData.razonEqcrRequired.includes(reasonId)}
              onCheckedChange={(checked) => {
                if (checked) {
                  setFormData({
                    ...formData,
                    razonEqcrRequired: [
                      ...formData.razonEqcrRequired,
                      reasonId,
                    ],
                  });
                } else {
                  setFormData({
                    ...formData,
                    razonEqcrRequired:
                      formData.razonEqcrRequired.filter(
                        (r) => r !== reasonId
                      ),
                  });
                }
              }}
            />
            <Label
              htmlFor={`razon-reapp-${reasonId}`}
              className="text-[11px] font-normal cursor-pointer text-gray-900"
            >
              {reason}
            </Label>
          </div>
        );
      })}
    </div>
  </CollapsibleSection>
)}

          {/* 3. Reappointment Criteria */}
          <CollapsibleSection
            title="Validation Criteria"
            isOpen={openSections.reappointmentCriteria}
            onToggle={() => toggleSection("reappointmentCriteria")}
          >
              <div className="grid grid-cols-1 gap-y-3">

                {/* Competence text input */}
                <div>
                  <Label
                    htmlFor="competenceText"
                    className="text-[11px] font-normal text-gray-900"
                  >
                    Competence and capabilities to perform the Engagement Quality Review for the engagement
                  </Label>
                  <Input
                    id="competenceText"
                    value={formData.competenceText}
                    onChange={(e) =>
                      setFormData({ ...formData, competenceText: e.target.value })
                    }
                    className="mt-1.5 h-9 text-[11px] font-normal text-gray-900"
                  />
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="noSignificantChanges"
                    checked={formData.noSignificantChanges}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, noSignificantChanges: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="noSignificantChanges"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    There have been no significant changes in the nature of the engagement that have occurred since the time of initial appointment
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="legalRegulatoryChanges"
                    checked={formData.legalRegulatoryChanges}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, legalRegulatoryChanges: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="legalRegulatoryChanges"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    There have been changes in the Legal &amp; Regulatory requirements applicable to the engagement?
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="industryChanges"
                    checked={formData.industryChanges}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, industryChanges: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="industryChanges"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    There have been changes in the entity&apos;s Industry?
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="complexityChanges"
                    checked={formData.complexityChanges}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, complexityChanges: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="complexityChanges"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    There have been changes in the Complexity of the engagement?
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="sufficientTime"
                    checked={formData.sufficientTime}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, sufficientTime: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="sufficientTime"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    Has sufficient time to carry out the EQC review?
                  </Label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="objectivityIntegrityImpartiality"
                    checked={formData.objectivityIntegrityImpartiality}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, objectivityIntegrityImpartiality: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="objectivityIntegrityImpartiality"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    Be able to carry out the role with objectivity, integrity and impartiality?
                  </Label>
                </div>

                {/* Engagement team involvement + conditional sub-item */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="engagementTeamInvolved"
                    checked={formData.engagementTeamInvolved}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, engagementTeamInvolved: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="engagementTeamInvolved"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    Has been a member of the engagement team or had any other involvement in the engagement?
                  </Label>
                </div>

                {formData.engagementTeamInvolved && (
                  <div className="flex items-start gap-2 ml-6">
                    <Checkbox
                      id="coolingPeriodApplied"
                      checked={formData.coolingPeriodApplied}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, coolingPeriodApplied: checked as boolean })
                      }
                      className="mt-0.5"
                    />
                    <Label
                      htmlFor="coolingPeriodApplied"
                      className="text-[11px] font-normal cursor-pointer text-gray-900"
                    >
                      If the candidate was part of the engagement team, the 2 year cooling period was applied?
                    </Label>
                  </div>
                )}

                {/* Threats to objectivity + conditional safeguards input */}
                <div className="flex items-start gap-2">
                  <Checkbox
                    id="threatsToObjectivity"
                    checked={formData.threatsToObjectivity}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, threatsToObjectivity: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="threatsToObjectivity"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    Has threats to his/her objectivity?
                  </Label>
                </div>

                {formData.threatsToObjectivity && (
                  <div className="ml-6">
                    <Label
                      htmlFor="safeguardsDescription"
                      className="text-[11px] font-normal text-gray-900"
                    >
                      If yes, document the safeguards put in place
                    </Label>
                    <Input
                      id="safeguardsDescription"
                      value={formData.safeguardsDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, safeguardsDescription: e.target.value })
                      }
                      className="mt-1.5 h-9 text-[11px] font-normal text-gray-900"
                    />
                  </div>
                )}

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="noResponsibilityComponents"
                    checked={formData.noResponsibilityComponents}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, noResponsibilityComponents: checked as boolean })
                    }
                    className="mt-0.5"
                  />
                  <Label
                    htmlFor="noResponsibilityComponents"
                    className="text-[11px] font-normal cursor-pointer text-gray-900"
                  >
                    Shall not have responsibility for the audit/review of any reporting entity&apos;s components, employee benefit plans or related entities
                  </Label>
                </div>

              </div>
          </CollapsibleSection>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-8 mt-8 border-t border-gray-200">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setShowReappointmentForm(false);
                setSelectedEqcr(null);
                setIsEditingEqcr(false);
              }}
              className="text-sm font-normal text-gray-600 hover:text-gray-900"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveReappointment}
              className="text-sm font-normal border-gray-300 text-gray-900 hover:bg-gray-50"
            >
              Save Draft
            </Button>
            <Button
              type="button"
              onClick={handleSaveAndSubmitReappointment}
              className="text-sm font-normal bg-[#00338D] text-white hover:bg-[#0055B8]"
            >
              <Check className="w-4 h-4 mr-1.5" />
              Submit
            </Button>
          </div>
        </form>
      </div>
    );
  }

  // Flat list view - grouped by client
  return (
    <div className="space-y-6">
      {/* Assignments List - Flat with Section Headers */}
      {clientGroups.map((client) => (
        <div key={client.id} className="space-y-3">
          {/* Minimal Group Header */}
          <div className="flex items-baseline gap-2 px-1">
            <h3
              className="text-[13px] font-light text-[#0C233C]"
              style={{ letterSpacing: "0.02em" }}
            >
              {client.clientName}
            </h3>
            <span className="text-xs text-[#666666]/80 font-normal tracking-[0.03em]">
              {client.count} assignment
              {client.count !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Assignment Cards - Flat List */}
          <div className="space-y-2">
            {client.eqcrs.map((eqcr) => (
              <div
                key={eqcr.assignmentId}
                onClick={() =>
                  handleEqcrReappointmentClick(eqcr, client)
                }
                className={cn(
                  "relative p-4 bg-white rounded-lg border border-gray-200/60 transition-all cursor-pointer group",
                  "hover:border-[#1E49E2] hover:shadow-sm hover:bg-gray-50/50",
                  selectedAssignments.includes(
                    eqcr.assignmentId,
                  ) && "bg-blue-50/30",
                )}
              >
               
                {/* Main Content */}
                <div className="flex items-start gap-4 pr-10">
                  {/* Checkbox - Far Left */}
                  <div
                    className="pt-0.5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Checkbox
                      id={`assignment-${eqcr.assignmentId}`}
                      checked={selectedAssignments.includes(
                        eqcr.assignmentId,
                      )}
                      onCheckedChange={() =>
                        toggleAssignmentSelection(
                          eqcr.assignmentId,
                        )
                      }
                    />
                  </div>

                  {/* Assignment Info */}
                  <div className="flex-1 space-y-2">
                    {/* Primary: EQCR Name */}
                    <div>
                      <h4
                        className="text-[16px] font-medium
                  text-[#00338d]
                  group-hover:text-[#1E49E2]
                  transition-colors"
                        style={{
                          letterSpacing: "0.01em",
                          lineHeight: "1.3",
                        }}
                      >
                        {eqcr.name}
                      </h4>
                      {/* Secondary: Job Level + Type inline */}

                      <p
                        className="text-sm mt-0.5"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        <span className="text-gray-500">
                          {eqcr.localJobLevel}
                        </span>

                        <span className="mx-2 text-[#00266A]/80 font-medium">
                          •
                        </span>

                        <span className="text-[#1E49E2] font-medium">
                          {eqcr.type}
                        </span>
                      </p>
                    </div>

                    {/* Metadata Row */}

                    <div className="flex items-center gap-2 text-xs mt-0.5">
                      <span
                        className="text-gray-700"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        {eqcr.leadPartner}
                      </span>

                      <span className="mx-1 text-gray-300 opacity-50">
                        •
                      </span>

                      <span
                        className="text-[#6B8EFF]"
                        style={{ letterSpacing: "0.01em" }}
                      >
                        Appointed {eqcr.yearOfAppointment}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
