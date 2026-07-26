import { useState, type FormEvent, type ReactNode ,useEffect} from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { StatusBadge } from "../components/ui/StatusBadge";
import { ArrowLeft, Pencil, Send, Save, User } from "lucide-react";
import { cn } from "../components/ui/utils";
import { authApi } from "../API/authApi";
import { toast } from "sonner";

type FormType = "SOC" | "Assistant" | "ESG" | "Audit";

type FormRecord = {
  id: number;
  formType: FormType;
  entity: string;
  eqcrName: string;
  owner: string;
  creationDate: string;
  status: string;
  statusColor: string;
  hasNonComply: boolean;

  EMT_Form_PK: number;
  Full_Name: string;
  Email_Address_Business: string;
  Local_Job_Level_Name: string;
  BU: string;
  Office: string;
  Entity_Name: string;

  Key_EMT?: string;
  Employee_ID?: string;
  Entity_ID?: number;
  Year_Appointment?: number;
  Ready_to_Approve?: number;
  EMT_Type_PK?: number;
};

function CardInner({ children }: { children: ReactNode }) {
  return <div className="w-[calc(100%-180px)] mx-auto">{children}</div>;
}

function TextBlockInner({ children }: { children: ReactNode }) {
  return <div className="w-full">{children}</div>;
}

function PageHeader() {
  return (
    <div
      className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur-sm px-8 py-6"
      style={{ borderBottomColor: "rgba(30, 73, 226, 0.08)" }}
    >
      <div className="flex flex-col items-center gap-4">
        <h1
          className="text-xl font-regular text-[#1E49E2]/80"
          style={{
            letterSpacing: "0.08em",
            lineHeight: "1.2",
            textShadow: "0 1px 1px rgba(30, 73, 226, 0.08)",
          }}
        >
          Confirmations
        </h1>
      </div>
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h3
      className="text-base font-medium text-gray-900 mb-4 pb-3 border-b"
      style={{ letterSpacing: "0.02em", lineHeight: "1.3" }}
    >
      {children}
    </h3>
  );
}

function TextBlock({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`p-4 bg-gray-50 rounded-lg text-sm text-gray-700 ${className}`}>
      <TextBlockInner>{children}</TextBlockInner>
    </div>
  );
}

function OptionRow({
  id,
  checked,
  onCheckedChange,
  label,
}: {
  id: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(checked) => onCheckedChange(checked as boolean)}
      />
      <Label htmlFor={id} className="text-sm cursor-pointer">
        {label}
      </Label>
    </div>
  );
}

function TextAreaField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D] min-h-[100px]"
      />
    </div>
  );
}

function ActionButtons({
  onSave,
  onSend,
}: {
  onSave: () => void;
  onSend: () => void;
}) {
  return (
    <Card className="p-4 bg-gray-50 border border-gray-200">
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={onSave}
          variant="outline"
          className="border-[#00338D] text-[#00338D] hover:bg-blue-50"
        >
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>

        <Button
          type="button"
          onClick={onSend}
          className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md hover:shadow-lg"
        >
          <Send className="w-4 h-4 mr-2" />
          Send
        </Button>
      </div>
    </Card>
  );
}

export default function Confirmations() {
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedForm, setSelectedForm] = useState<FormRecord | null>(null);
  const [viewMode, setViewMode] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [formTypeFilter, setFormTypeFilter] = useState("");
const [forms, setForms] = useState<FormRecord[]>([]);
const [loadingForms, setLoadingForms] = useState(true);
const [user, setUser] = useState<any>(null);
const currentUser = user?.email;
useEffect(() => {
  authApi.getClaims()
    .then(setUser)
    .catch(console.error);
}, []);

const [fiscalYears, setFiscalYears] = useState<any[]>([]);
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

      setFiscalYears(data);
    } catch (error) {
      console.error("Error loading fiscal years", error);
    }
  };

  loadFiscalYears();
}, []);
useEffect(() => {
  const loadForms = async () => {
    try {
      setLoadingForms(true);

      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Error loading forms"
        );
      }

      const data = await response.json();

      const mappedForms = data.map(
        (item: any) => ({
          id: item.EMT_Form_PK,

          Full_Name: item.Full_Name,
          Email_Address_Business: item.Email_Address_Business,
          Local_Job_Level_Name: item.Local_Job_Level_Name,
          BU: item.BU,
          Office: item.Office,
          Entity_Name: item.Entity_Name,

          formType:
            item.EMT_Type_PK === 1
              ? "Audit"
              : item.EMT_Type_PK === 2
              ? "ESG"
              : item.EMT_Type_PK === 3
              ? "SOC"
              : "Assistant",

          entity: item.Entity_Name,
          eqcrName: item.Full_Name,
          owner: item.Created_By,
          creationDate:
            item.Created
              ?.split("T")[0],

          status:
            item.Ready_to_Approve
              ? "Completed"
              : "Pending",

          statusColor:
            item.Ready_to_Approve
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700",

          hasNonComply: false,
          Key_EMT: item.Key_EMT,
          Employee_ID: item.Employee_ID,
          Entity_ID: item.Entity_ID,
          Year_Appointment: item.Year_Appointment,
          Ready_to_Approve: item.Ready_to_Approve ? 1: 0,
          EMT_Type_PK: item.EMT_Type_PK,
          EMT_Form_PK: item.EMT_Form_PK,
          Created_By: user?.email,
        })
      );

      setForms(mappedForms);

    } catch (error) {
      console.error(
        "Error loading forms",
        error
      );
    } finally {
      setLoadingForms(false);
    }
  };

  loadForms();
}, []);
const email = user?.email;
  const pageBackground = {
    backgroundColor: "#f4f7fb",
    backgroundImage: `
      radial-gradient(900px 400px at 0% 20%, rgba(30, 73, 226, 0.10), transparent 70%),
      radial-gradient(800px 350px at 100% 60%, rgba(114, 19, 234, 0.08), transparent 70%),
      radial-gradient(700px 300px at 50% 100%, rgba(0, 51, 141, 0.06), transparent 70%),

      repeating-linear-gradient(
        110deg,
        rgba(0, 51, 141, 0.035) 0px,
        rgba(0, 51, 141, 0.035) 2px,
        transparent 2px,
        transparent 50px
      ),

      linear-gradient(180deg, #f8faff 0%, #eef3ff 100%)
    `,
    backgroundRepeat: "no-repeat, no-repeat, no-repeat, repeat, no-repeat",
    backgroundSize: "auto, auto, auto, auto, auto",
  };

  const handleCardClick = (form: FormRecord) => {
    setSelectedForm(form);
    setViewMode(true);
  };

  const handleBack = () => {
    setSelectedForm(null);
    setViewMode(true);
  };

  const handleEdit = () => {
    setViewMode(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", selectedForm);
    setSelectedForm(null);
    setViewMode(true);
  };

  if (selectedForm) {
const canEdit =
  selectedForm.owner === user?.email &&
  selectedForm.status === "Pending";


    return (
      <div className="min-h-screen overflow-x-hidden relative" style={pageBackground}>
        <PageHeader />

        <div className="px-8 py-8 relative z-10">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={handleBack} className="border-gray-300">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>

              <div>
                <h2
                  className="text-2xl font-semibold text-gray-900"
                  style={{ letterSpacing: "0.01em", lineHeight: "1.25" }}
                >
                  {selectedForm.formType} Confirmation
                  {viewMode && (
                    <span className="text-base text-gray-500 ml-3 font-normal">
                      (View Mode)
                    </span>
                  )}
                </h2>

                <p
                  className="text-sm text-gray-600 mt-1"
                  style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}
                >
                  {selectedForm.entity} • {selectedForm.eqcrName}
                </p>
              </div>
            </div>
            
            {/*<div>{selectedForm.Ready_to_Approve? "finish": "nonfinish"}</div>*/}
            {/*<div> {selectedForm.EMT_Type_PK} | {user?.email} | {user?.roles}</div>*/}

           {selectedForm.Ready_to_Approve !== 1 && (
              <Button
                onClick={handleEdit}
                className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white hover:opacity-90"
              >
                <Pencil className="w-4 h-4 mr-2" />
                Edit
              </Button>
            )}
            
          </div>

          {selectedForm.formType === "SOC" && (
            <SOCForm
              onSubmit={handleSubmit}
              form={selectedForm}
              viewMode={viewMode}
              fiscalYears={fiscalYears}
            />
          )}

          {selectedForm.formType === "Assistant" && (
            <AssistantForm onSubmit={handleSubmit} form={selectedForm} viewMode={viewMode} />
          )}

          {selectedForm.formType === "ESG" && (
            <EQCRForm onSubmit={handleSubmit} form={selectedForm} viewMode={viewMode} formType="ESG" />
          )}

          {selectedForm.formType === "Audit" && (
            <EQCRForm onSubmit={handleSubmit} form={selectedForm} viewMode={viewMode} formType="Audit" />
          )}
        </div>
      </div>
    );
  }

  const filteredForms = forms.filter((form) => {
    if (
      searchQuery &&
      !form.formType.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !form.entity.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !form.eqcrName.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    if (formTypeFilter && form.formType !== formTypeFilter) {
      return false;
    }

    if (statusFilter && form.status !== statusFilter) {
      return false;
    }

    return true;
  });

  return (
      <div className="min-h-screen overflow-x-hidden relative" style={pageBackground}>
        <PageHeader />

      <div className="px-8 py-8 relative z-10">
        <div className="mb-6 py-2.5 px-4 bg-[#A5B6F3]/50 rounded-lg border border-gray-200/50">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Search confirmations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 max-w-xs px-3 py-1.5 border border-gray-300/60 rounded-md text-sm font-normal bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/30 focus:border-[#00338D]/30"
            />

            <select
              value={formTypeFilter}
              onChange={(e) => setFormTypeFilter(e.target.value)}
              className="px-2.5 py-1.5 border border-gray-200/60 rounded-md text-xs font-normal text-gray-600 bg-white focus:outline-none focus:ring-1 focus:ring-[#00338D]/20 focus:border-[#00338D]/20 appearance-none cursor-pointer"
              style={{
                paddingRight: "1.75rem",
                backgroundImage:
                  'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23666\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpolyline points=\'6 9 12 15 18 9\'%3E%3C/polyline%3E%3C/svg%3E")',
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.5rem center",
                backgroundSize: "12px",
              }}
            >
              <option value="">All Types</option>
              <option value="SOC">SOC</option>
              <option value="Assistant">Assistant</option>
              <option value="ESG">ESG</option>
              <option value="Audit">Audit</option>
            </select>

            <div className="inline-flex items-center gap-1 p-0.5 bg-white rounded-md border border-gray-200/60">
              <button
                onClick={() => setStatusFilter("")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === ""
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                All
              </button>

              <button
                onClick={() => setStatusFilter("Pending")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === "Pending"
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Pending
              </button>

              <button
                onClick={() => setStatusFilter("Completed")}
                className={cn(
                  "px-2.5 py-1 rounded-sm text-xs font-normal transition-all",
                  statusFilter === "Completed"
                    ? "bg-blue-50 text-[#00338D]"
                    : "text-gray-500 hover:text-gray-700",
                )}
              >
                Completed
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {filteredForms.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p className="text-sm" style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}>
                {searchQuery || formTypeFilter || statusFilter
                  ? "No confirmations match your filters"
                  : "No confirmation forms found"}
              </p>

              <p className="text-xs mt-2" style={{ letterSpacing: "0.01em", lineHeight: "1.45" }}>
                {searchQuery || formTypeFilter || statusFilter
                  ? "Try adjusting your search or filter criteria"
                  : "Forms will appear here when available"}
              </p>
            </div>
          ) : (
            filteredForms.map((form) => (
              <div
                key={form.id}
                onClick={() => handleCardClick(form)}
                className="relative p-4 bg-white rounded-xl border border-[#E4ECFF] hover:border-[#1E49E2] hover:shadow-md hover:bg-white transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div>
                      <h4
                        className="text-[16px] font-medium text-[#00338d] group-hover:text-[#1E49E2] transition-colors"
                        style={{ letterSpacing: "0.01em", lineHeight: "1.3" }}
                      >
                        {form.formType} Confirmation
                      </h4>

                      {form.hasNonComply && (
                        <p className="text-sm mt-0.5 text-[#5A6B8A]">Non-Compliance</p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="text-[#00266A]/80 font-medium">{form.entity}</span>
                      <span className="text-[#C7D2E5]">•</span>
                      <span className="text-[#7B8CA8]">{form.eqcrName}</span>
                      <span className="text-[#C7D2E5]">•</span>
                      <span className="text-[#7B8CA8]">{form.creationDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <StatusBadge status={form.status} variant="blue" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function SOCForm({
  onSubmit,
  form,
  viewMode = false,
  fiscalYears,
}: {
  onSubmit: (e: FormEvent) => void;
  form: FormRecord;
  viewMode?: boolean;
  fiscalYears: any[];
}) {
  const [savedForm, setSavedForm] = useState<any>(null);
  useEffect(() => {
  if (!form.Key_EMT) return;

  const loadForm = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form/${form.Key_EMT}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      setSavedForm(data);

    } catch (error) {
      console.error(error);
    }
  };

  loadForm();
}, [form.Key_EMT]);
  const [formData, setFormData] = useState({
    EMT_Type_PK: form.EMT_Type_PK,
    EMT_Form_PK: form.EMT_Form_PK,
    Full_Name: form.Full_Name,
    Email_Address_Business: form.Email_Address_Business,
    Local_Job_Level_Name: form.Local_Job_Level_Name,
    BU: form.BU,
    Office: form.Office,
    Entity_Name: form.Entity_Name,
    Employee_ID: form.Employee_ID,
    Year_Appointment: form.Year_Appointment,
    Entity_ID: form.Entity_ID,
    eqcrName: form.eqcrName,
    legalEntityName: form.entity,
    engagementName: "",
    yearOfAppointment:  form.Year_Appointment?.toString() ?? "",
    criteriaAComply: false,
    criteriaANonComply: form.hasNonComply || false,
    criteriaAExplanation: form.hasNonComply ? "Pending verification of required training completion." : "",
    criteriaBComply: false,
    criteriaBNonComply: false,
    criteriaBExplanation: "",
    performanceComply: false,
    performanceNonComply: form.hasNonComply || false,
    performanceExplanation: form.hasNonComply ? "Additional documentation required for certain judgments." : "",
    documentationComply: false,
    documentationNonComply: false,
    requireAssistant: false,
    noAssistant: false,
  });
  useEffect(() => {
  if (!savedForm) return;

  setFormData(prev => ({
    ...prev,
    EMT_Type_PK: savedForm.EMT_Type_PK,


    criteriaAComply:
      savedForm.Criteria_A === true,

    criteriaANonComply:
      savedForm.Criteria_A === false,

    criteriaAExplanation:
      savedForm.Criteria_A_Comments ?? "",

    criteriaBComply:
      savedForm.Criteria_B === true,

    criteriaBNonComply:
      savedForm.Criteria_B === false,

    criteriaBExplanation:
      savedForm.Criteria_B_Comments ?? "",

    performanceComply:
      savedForm.Perfomance_Requirements === true,

    performanceNonComply:
      savedForm.Perfomance_Requirements === false,

    performanceExplanation:
      savedForm.Perfomance_Requirements_Comments ?? "",

    documentationComply:
      savedForm.Documentation_Requirements === true,

    documentationNonComply:
      savedForm.Documentation_Requirements === false,

    requireAssistant:
      savedForm.Assistant === true,

    noAssistant:
      savedForm.Assistant === false,
  }));

}, [savedForm]);
const submitConfirmation = async (
  readyToApprove: boolean
) => {
  try {
    const payload = {
      Key_EMT: form.Key_EMT,

      Criteria_A:
        formData.criteriaAComply
          ? true
          : formData.criteriaANonComply
          ? false
          : null,

      Criteria_A_Comments:
        formData.criteriaAExplanation,

      Criteria_B:
        formData.criteriaBComply
          ? true
          : formData.criteriaBNonComply
          ? false
          : null,

      Criteria_B_Comments:
        formData.criteriaBExplanation,

      Perfomance_Requirements:
        formData.performanceComply
          ? true
          : formData.performanceNonComply
          ? false
          : null,

      Perfomance_Requirements_Comments:
        formData.performanceExplanation,

      Documentation_Requirements:
        formData.documentationComply
          ? true
          : formData.documentationNonComply
          ? false
          : null,

      Documentation_Requirements_Comments: null,

      Assistant:
        formData.requireAssistant
          ? true
          : formData.noAssistant
          ? false
          : null,

      Conduct_Requirements: null,
      Conduct_Requirements_Comments: null,

      Ready_to_Approve: readyToApprove,
      EMT_Type_PK: formData.EMT_Type_PK,
      EMT_Form_PK: formData.EMT_Form_PK,
      Full_Name: formData.Full_Name,
      Email_Address_Business: formData.Email_Address_Business,
      Local_Job_Level_Name: formData.Local_Job_Level_Name,
      BU: formData.BU,
      Office: formData.Office,
      Entity_Name: formData.Entity_ID,
      Employee_ID: formData.Employee_ID,
      Year_Appointment: formData.Year_Appointment,
      Entity_ID: formData.Entity_ID,
    };

    console.log("SOC Payload:", payload);

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(errorText);
      throw new Error("Error saving SOC confirmation");
    }

    if (readyToApprove) {
      toast.success(
        "Confirmation submitted successfully."
      );
    } else {
      toast.success(
        "Draft saved successfully."
      );
    }

    window.location.reload();

  } catch (error) {
    console.error(error);

    toast.error(
      "An error occurred while processing the confirmation."
    );
  }
};
  return (
    <form onSubmit={onSubmit} className="space-y-6 w-[calc(100%-96px)] mx-auto">
      <fieldset disabled={viewMode}>
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <CardInner>
            <p className="text-sm text-[#00338D]">
              This confirmation must be completed for each engagement in which you are assigned as EQCR.
            </p>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>Basic Information</SectionTitle>

            <div className="space-y-4">
              <div>
                <Label htmlFor="soc-eqcrName">EQCR Name</Label>
                <Input
                  id="soc-eqcrName"
                  value={formData.eqcrName}
                 //onChange={(e) => setFormData({ ...formData, eqcrName: e.target.value })}
                 readOnly
                  className="mt-1.5 bg-white ext-[#1F2937]"
                />
              </div>

              <div>
                <Label htmlFor="soc-legalEntityName">Legal Entity Name</Label>
                <p className="text-sm text-gray-600 mt-1">
                  If an engagement subject to EQCR includes multiple legal entities reported as one, include the name of
                  the overall engagement.
                </p>

                <Input
                  id="soc-legalEntityName"
                  value={formData.legalEntityName}
                  //onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  readOnly
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="soc-yearOfAppointment">
                  EQCR Reviewer Year of Appointment as EQCR on the Engagement
                </Label>

                <select
                  id="soc-yearOfAppointment"
                  value={formData.yearOfAppointment}
                  disabled
                  onChange={(e) => setFormData({ ...formData, yearOfAppointment: e.target.value })}
                  className="mt-1.5 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value=""></option>
                  {fiscalYears.map((fy) => (
                    <option
                      key={fy.EMT_FY_ID}
                      value={fy.EMT_FY_Desc}
                    >
                      {fy.EMT_FY_Desc}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Appointment Criteria A</SectionTitle>

            <div className="space-y-4">
              <TextBlock className="space-y-2">
                <p>
                  The individual must have the competence and capability to perform the Engagement Quality Control
                  Review, including sufficient technical skills and:
                </p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>Understanding of relevant professional standards</li>
                  <li>Understanding of relevant firm policies and procedures</li>
                  <li>Understanding of applicable legal and regulatory requirements</li>
                  <li>Knowledge of the entity's industry</li>
                  <li>Experience with engagements of similar nature and complexity</li>
                  <li>Sufficient time to perform the review, evidenced by workload review</li>
                </ul>
              </TextBlock>

              <OptionRow
                id="soc-criteriaAComply"
                checked={formData.criteriaAComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaAComply: checked, criteriaANonComply: false })
                }
                label="I confirm that I have read EQCR Appointment Criteria A and comply with the criteria."
              />

              <OptionRow
                id="soc-criteriaANonComply"
                checked={formData.criteriaANonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaANonComply: checked, criteriaAComply: false })
                }
                label="I cannot comply with one or more items in EQCR Appointment Criteria A."
              />

              {formData.criteriaANonComply && (
                <TextAreaField
                  id="soc-criteriaAExplanation"
                  label="If you cannot comply with EQCR Appointment Criteria A, explain why:"
                  value={formData.criteriaAExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaAExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Appointment Criteria B</SectionTitle>

            <div className="space-y-4">
              <TextBlock className="space-y-2">
                <p>
                  The individual is appointed as EQCR in compliance with ethical and independence requirements and can
                  perform the role with objectivity, integrity, and impartiality. The individual must not:
                </p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>Be a member of the engagement team or otherwise involved</li>
                  <li>Have served as Engagement Partner in either of the previous two years (or longer if required)</li>
                  <li>Be subject to unresolved threats to objectivity or independence</li>
                </ul>
              </TextBlock>

              <OptionRow
                id="soc-criteriaBComply"
                checked={formData.criteriaBComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBComply: checked, criteriaBNonComply: false })
                }
                label="I confirm that I have read EQCR Appointment Criteria B and comply with the criteria."
              />

              <OptionRow
                id="soc-criteriaBNonComply"
                checked={formData.criteriaBNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBNonComply: checked, criteriaBComply: false })
                }
                label="I cannot comply with one or more items in EQCR Appointment Criteria B."
              />

              {formData.criteriaBNonComply && (
                <TextAreaField
                  id="soc-criteriaBExplanation"
                  label="If you cannot comply with EQCR Appointment Criteria B, explain why:"
                  value={formData.criteriaBExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaBExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Performance Requirements</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  Perform the Engagement Quality Control Review in accordance with the Procedure: Performance and
                  Documentation of the Engagement Quality Control Review, including any supplemental firm requirements,
                  as set out in section 10.4.2 of the GQ&RMM, at appropriate points during the engagement to support an
                  objective evaluation of significant judgments and conclusions.
                </p>
              </TextBlock>

              <OptionRow
                id="soc-performanceComply"
                checked={formData.performanceComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, performanceComply: checked, performanceNonComply: false })
                }
                label="I confirm that I have read the EQCR Performance Requirements in section 10.4.2 of the GQ&RMM and will perform all required procedures."
              />

              <OptionRow
                id="soc-performanceNonComply"
                checked={formData.performanceNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, performanceNonComply: checked, performanceComply: false })
                }
                label="I cannot comply with the EQCR Performance Requirements in section 10.4.2 of the GQ&RMM."
              />

              {formData.performanceNonComply && (
                <TextAreaField
                  id="soc-performanceExplanation"
                  label="If you cannot comply with the EQCR Performance Requirements, explain why:"
                  value={formData.performanceExplanation}
                  onChange={(value) => setFormData({ ...formData, performanceExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Documentation Requirements</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  Documentation of the Engagement Quality Control Review must comply with the Procedure: Performance and
                  Documentation of the Engagement Quality Control Review, including any supplemental firm requirements,
                  as set out in section 10.4.2 of the GQ&RMM, and be included with the engagement documentation.
                </p>
              </TextBlock>

              <OptionRow
                id="soc-documentationComply"
                checked={formData.documentationComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, documentationComply: checked, documentationNonComply: false })
                }
                label="I confirm that I have read the EQCR Documentation Requirements in section 10.4.2 of the GQ&RMM and will comply."
              />

              <OptionRow
                id="soc-documentationNonComply"
                checked={formData.documentationNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, documentationNonComply: checked, documentationComply: false })
                }
                label="I cannot comply with the EQCR Documentation Requirements in section 10.4.2 of the GQ&RMM."
              />
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Assistant</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  The EQCR is responsible for determining the nature, timing, and extent of direction and supervision of
                  any EQCR Assistants and for reviewing their work.
                </p>
              </TextBlock>

              <OptionRow
                id="soc-requireAssistant"
                checked={formData.requireAssistant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requireAssistant: checked, noAssistant: false })
                }
                label="I require an EQCR Assistant and understand my responsibility to direct and review their work."
              />

              <OptionRow
                id="soc-noAssistant"
                checked={formData.noAssistant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, noAssistant: checked, requireAssistant: false })
                }
                label="I do not require an EQCR Assistant."
              />
            </div>
          </CardInner>
        </Card>
      </fieldset>

     {/*{!viewMode && <ActionButtons />}*/}
     {!viewMode && (
  <ActionButtons
    onSave={() => submitConfirmation(false)}
    onSend={() => submitConfirmation(true)}
  />
)}
    </form>
  );
}

function AssistantForm({
  onSubmit,
  form,
  viewMode = false,
}: {
  onSubmit: (e: FormEvent) => void;
  form: FormRecord;
  viewMode?: boolean;
}) {
  const [formData, setFormData] = useState({
    eqcrAssistantName: form.eqcrName,
    legalEntityName: form.entity,
    criteriaAComply: false,
    criteriaANonComply: false,
    criteriaAExplanation: "",
    criteriaBComply: false,
    criteriaBNonComply: false,
    criteriaBExplanation: "",
    conductNonComply: false,
    conductComply: false,
    conductExplanation: "",
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6 w-[calc(100%-96px)] mx-auto">
      <fieldset disabled={viewMode}>
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <CardInner>
            <p className="text-sm text-[#00338D]">
              This confirmation must be made for each engagement in which you are assigned as EQCR Assistant, understood
              by engagement legal entity or the entity for which a report is issued (Appointment and Conduct of
              Engagement Quality Control Review Assistants / Audits or Reviews of Historical Financial Information).
            </p>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>Basic Information</SectionTitle>

            <div className="space-y-4">
              <div>
                <Label htmlFor="assistant-eqcrAssistantName">EQCR Assistant Name</Label>
                <Input
                  id="assistant-eqcrAssistantName"
                  value={formData.eqcrAssistantName}
                  onChange={(e) => setFormData({ ...formData, eqcrAssistantName: e.target.value })}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="assistant-legalEntityName">Legal Entity Name</Label>
                <p className="text-sm text-gray-600 mt-1">
                  If an engagement subject to EQCR has several legal entities reported as one, please include the name of
                  the overall engagement:
                </p>

                <Input
                  id="assistant-legalEntityName"
                  value={formData.legalEntityName}
                  onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Assistant Appointment Criteria A</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <ul className="list-disc ml-5 space-y-1">
                  <li>Sufficient time to perform the appointed duties;</li>
                  <li>
                    An understanding of professional standards, applicable legal and regulatory requirements, and the
                    member firm's policies and procedures relevant to the engagement, and completion of all training
                    identified as mandatory by the member firm;
                  </li>
                  <li>An understanding of the responsibilities of the Engagement Quality Control Review Assistant;</li>
                  <li>Knowledge of the entity's industry;</li>
                  <li>
                    Experience on engagements of a similar nature and complexity relevant to the duties to be assigned on
                    the engagement; and
                  </li>
                  <li>Expertise relevant to the duties to be assigned on the engagement, if applicable.</li>
                </ul>
              </TextBlock>

              <OptionRow
                id="assistant-criteriaAComply"
                checked={formData.criteriaAComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaAComply: checked, criteriaANonComply: false })
                }
                label="I confirm that I have read EQCR Assistant Criteria A above and I comply with the criteria."
              />

              <OptionRow
                id="assistant-criteriaANonComply"
                checked={formData.criteriaANonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaANonComply: checked, criteriaAComply: false })
                }
                label="I cannot comply with one or more items included in EQCR Assistant Criteria A above."
              />

              {formData.criteriaANonComply && (
                <TextAreaField
                  id="assistant-criteriaAExplanation"
                  label="If you respond that you cannot comply with EQCR Assistant Appointment Criteria A above, please explain why:"
                  value={formData.criteriaAExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaAExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>Eligibility Criteria for an EQCR Assistant (Criteria B)</SectionTitle>

            <div className="space-y-4">
              <TextBlock className="space-y-2">
                <p>
                  The individual shall be appointed in compliance with relevant ethical and independence requirements
                  and, if applicable, laws and regulations, and shall be able to carry out the role with objectivity,
                  integrity, and impartiality. The individual shall not:
                </p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>Be a member of the engagement team;</li>
                  <li>
                    Be subject to other considerations that would threaten the individual's objectivity if acting as
                    Engagement Quality Control Review Assistant for the engagement;
                  </li>
                  <li>
                    Have relationships with the engagement team that may include shared engagements with the Engagement
                    Partner, performance management assignments, or other chain-of-command relationships.
                  </li>
                </ul>
              </TextBlock>

              <OptionRow
                id="assistant-criteriaBComply"
                checked={formData.criteriaBComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBComply: checked, criteriaBNonComply: false })
                }
                label="I confirm that I have read EQCR Assistant Criteria B above and I comply with the criteria."
              />

              <OptionRow
                id="assistant-criteriaBNonComply"
                checked={formData.criteriaBNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBNonComply: checked, criteriaBComply: false })
                }
                label="I cannot comply with one or more items included in EQCR Assistant Criteria B above."
              />

              {formData.criteriaBNonComply && (
                <TextAreaField
                  id="assistant-criteriaBExplanation"
                  label="If you respond that you cannot comply with EQCR Assistant Appointment Criteria B above, please explain why:"
                  value={formData.criteriaBExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaBExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Assistant Conduct Requirements</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  The Engagement Quality Control Review Assistant shall comply with relevant ethical and independence
                  requirements and, if applicable, laws and regulations, and shall carry out the role on the engagement
                  with objectivity and integrity confirmations above. To maintain his/her objectivity, the Engagement
                  Quality Control Review Assistant shall not:
                </p>
              </TextBlock>

              <OptionRow
                id="assistant-conductNonComply"
                checked={formData.conductNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, conductNonComply: checked, conductComply: false })
                }
                label="I cannot comply with the EQCR Assistant Conduct Requirement."
              />

              <OptionRow
                id="assistant-conductComply"
                checked={formData.conductComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, conductComply: checked, conductNonComply: false })
                }
                label="I confirm that I have read the EQCR Assistant Conduct Requirement and I comply with it."
              />

              {formData.conductNonComply && (
                <TextAreaField
                  id="assistant-conductExplanation"
                  label="If you respond that you cannot comply with the EQCR Assistant Conduct Requirement above, please explain why:"
                  value={formData.conductExplanation}
                  onChange={(value) => setFormData({ ...formData, conductExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>
      </fieldset>

      {!viewMode && <ActionButtons />}
    </form>
  );
}

function EQCRForm({
  onSubmit,
  form,
  viewMode = false,
  formType,
}: {
  onSubmit: (e: FormEvent) => void;
  form: FormRecord;
  viewMode?: boolean;
  formType: "ESG" | "Audit";
}) {
  const [savedForm, setSavedForm] = useState<any>(null);
  useEffect(() => {
  if (!form.Key_EMT) return;

  const loadForm = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form/${form.Key_EMT}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) return;

      const data = await response.json();

      setSavedForm(data);

    } catch (error) {
      console.error(error);
    }
  };

  loadForm();
}, [form.Key_EMT]);
  const [formData, setFormData] = useState({
    eqcrName: form.eqcrName,
    legalEntityName: form.entity,
    criteriaAComply: false,
    criteriaANonComply: formType === "Audit" ? form.hasNonComply || false : false,
    criteriaAExplanation:
      formType === "Audit" && form.hasNonComply
        ? "Industry experience in healthcare sector requires additional validation."
        : "",
    criteriaBComply: false,
    criteriaBNonComply: formType === "ESG" ? form.hasNonComply || false : false,
    criteriaBExplanation:
      formType === "ESG" && form.hasNonComply
        ? "Workload review indicates limited availability during peak engagement period."
        : "",
    performanceComply: false,
    performanceNonComply: false,
    performanceExplanation: "",
    documentationComply: false,
    documentationNonComply: form.hasNonComply || false,
    documentationExplanation: form.hasNonComply
      ? formType === "Audit"
        ? "Some engagement documentation awaiting final review completion."
        : "Certain documentation templates need to be updated to current version."
      : "",
    requireAssistant: false,
    noAssistant: false,
    EMT_Type_PK: form.EMT_Type_PK,
    EMT_Form_PK: form.EMT_Form_PK,
    Full_Name: form.Full_Name,
    Email_Address_Business: form.Email_Address_Business,
    Local_Job_Level_Name: form.Local_Job_Level_Name,
    BU: form.BU,
    Office: form.Office,
    Entity_Name: form.Entity_Name,
    Employee_ID: form.Employee_ID,
    Year_Appointment: form.Year_Appointment,
    Entity_ID: form.Entity_ID,
  });
  useEffect(() => {
  if (!savedForm) return;

  setFormData(prev => ({
    ...prev,

    criteriaAComply:
      savedForm.Criteria_A === true,

    criteriaANonComply:
      savedForm.Criteria_A === false,

    criteriaAExplanation:
      savedForm.Criteria_A_Comments ?? "",

    criteriaBComply:
      savedForm.Criteria_B === true,

    criteriaBNonComply:
      savedForm.Criteria_B === false,

    criteriaBExplanation:
      savedForm.Criteria_B_Comments ?? "",

    performanceComply:
      savedForm.Perfomance_Requirements === true,

    performanceNonComply:
      savedForm.Perfomance_Requirements === false,

    performanceExplanation:
      savedForm.Perfomance_Requirements_Comments ?? "",

    documentationComply:
      savedForm.Documentation_Requirements === true,

    documentationNonComply:
      savedForm.Documentation_Requirements === false,

    documentationExplanation:
      savedForm.Documentation_Requirements_Comments ?? "",

    requireAssistant:
      savedForm.Assistant === true,

    noAssistant:
      savedForm.Assistant === false,
      EMT_Type_PK: savedForm.EMT_Type_PK,


  }));

}, [savedForm]);
//funcion para enviar el payload
const [user, setUser] = useState<any>(null);
const currentUser = user?.email;
useEffect(() => {
  authApi.getClaims()
    .then(setUser)
    .catch(console.error);
}, []);
const submitConfirmation = async (
  readyToApprove: boolean
) => {
  try {

    const payload = {
      Key_EMT: form.Key_EMT,

      Criteria_A:
        formData.criteriaAComply
          ? true
          : formData.criteriaANonComply
          ? false
          : null,

      Criteria_A_Comments:
        formData.criteriaAExplanation,

      Criteria_B:
        formData.criteriaBComply
          ? true
          : formData.criteriaBNonComply
          ? false
          : null,

      Criteria_B_Comments:
        formData.criteriaBExplanation,

      Perfomance_Requirements:
        formData.performanceComply
          ? true
          : formData.performanceNonComply
          ? false
          : null,

      Perfomance_Requirements_Comments:
        formData.performanceExplanation,

      Documentation_Requirements:
        formData.documentationComply
          ? true
          : formData.documentationNonComply
          ? false
          : null,

      Documentation_Requirements_Comments:
        formData.documentationExplanation,

      Assistant:
        formData.requireAssistant
          ? true
          : formData.noAssistant
          ? false
          : null,

      Conduct_Requirements: null,
      Conduct_Requirements_Comments: null,

      Ready_to_Approve: readyToApprove,
      EMT_Type_PK: formData.EMT_Type_PK,
      Full_Name: formData.Full_Name,
      Email_Address_Business: formData.Email_Address_Business,
      Local_Job_Level_Name: formData.Local_Job_Level_Name,
      BU: formData.BU,
      Office: formData.Office,
      Entity_Name: formData.Entity_Name,
      Employee_ID: formData.Employee_ID,
      Year_Appointment: formData.Year_Appointment,
      Entity_ID: formData.Entity_ID,
      Created_By: currentUser,
    };

    const response = await fetch(
      `${import.meta.env.VITE_EQCR_API_URL}/EMT_tbl_Form`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error("Error saving confirmation");
    }
 if (readyToApprove) {     toast.success(
       "Confirmation submitted successfully." );   
      } else { 
        toast.success("Draft saved successfully.");}  
        window.location.reload();
    console.log(
      readyToApprove
        ? "Confirmation sent"
        : "Draft saved"
    );

  } catch (error) {
    console.error(error);
    toast.error( "An error occurred while processing the confirmation.");
  }
};


  return (
    <form onSubmit={onSubmit} className="space-y-6 w-[calc(100%-96px)] mx-auto">
      <fieldset disabled={viewMode}>
        <Card className="p-6 bg-blue-50 border border-blue-200">
          <CardInner>
            <p className="text-sm text-[#00338D]">
              This confirmation must be made for each {formType} engagement in which you are assigned as EQCR.
            </p>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>Basic Information</SectionTitle>

            <div className="space-y-4">
              <div>
                <Label htmlFor={`${formType}-eqcrName`}>EQCR Name</Label>
                <Input
                  id={`${formType}-eqcrName`}
                  value={formData.eqcrName}
                  //onChange={(e) => setFormData({ ...formData, eqcrName: e.target.value })}
                  readOnly
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor={`${formType}-legalEntityName`}>Legal Entity Name</Label>
                <p className="text-sm text-gray-600 mt-1">
                  If an engagement subject to EQCR has several legal entities reported as one, please include the name of
                  the overall engagement:
                </p>

                <Input
                  id={`${formType}-legalEntityName`}
                  value={formData.legalEntityName}
                  //onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  readOnly
                  className="mt-1.5"
                />
              </div>
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Appointment Criteria A</SectionTitle>

            <div className="space-y-4">
              <TextBlock className="space-y-2">
                <p>
                  The individual shall have the competence and capabilities to perform the Engagement Quality Control
                  Review for the engagement. This includes having sufficient technical skills relevant to the role of
                  Engagement Quality Control Review for the engagement, and having:
                </p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>An understanding of professional standards relevant to the engagement;</li>
                  <li>An understanding of the member firm's policies and procedures relevant to the engagement;</li>
                  <li>An understanding of legal and regulatory requirements applicable to the engagement;</li>
                  <li>Knowledge of the entity industry;</li>
                  <li>An understanding of and experience relevant to engagements of a similar nature and complexity;</li>
                  <li>
                    Sufficient time available to perform the Engagement Quality Control Review for the engagement, as
                    evidenced in the workload review for the individual.
                  </li>
                </ul>
              </TextBlock>

              <OptionRow
                id={`${formType}-criteriaAComply`}
                checked={formData.criteriaAComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaAComply: checked, criteriaANonComply: false })
                }
                label="I confirm that I have read the EQCR Appointment Criteria A above and I comply with the criteria."
              />

              <OptionRow
                id={`${formType}-criteriaANonComply`}
                checked={formData.criteriaANonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaANonComply: checked, criteriaAComply: false })
                }
                label="I cannot comply with one or more items included in the EQCR Appointment Criteria A above."
              />

              {formData.criteriaANonComply && (
                <TextAreaField
                  id={`${formType}-criteriaAExplanation`}
                  label="If you respond that you cannot comply with the EQCR Appointment Criteria A above, please explain why:"
                  value={formData.criteriaAExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaAExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Appointment Criteria B</SectionTitle>

            <div className="space-y-4">
              <TextBlock className="space-y-2">
                <p>
                  The individual is appointed as Engagement Quality Control Review for the engagement in compliance with
                  relevant ethical and independence requirements, laws and regulations, and shall be able to carry out the
                  role with objectivity, integrity and impartiality. The individual shall not:
                </p>

                <ul className="list-disc ml-5 space-y-1">
                  <li>Be a member of the engagement team or have any other involvement in the engagement;</li>
                  <li>
                    {formType === "Audit"
                      ? "Have served in any of the following roles: engagement partner, a component engagement partner or other audit partner of a component, another audit partner to whom the engagement partner delegated responsibilities in the audit engagement, in either of the previous two financial years (or longer if required by relevant ethical or independence requirements);"
                      : "Have served as the Engagement Partner in either of the previous two years, or longer period if required by relevant ethical or independence requirements;"}
                  </li>
                  <li>
                    Be otherwise subject to threats to objectivity or independence that have not been eliminated or
                    reduced to an acceptable level.
                  </li>
                </ul>
              </TextBlock>

              <OptionRow
                id={`${formType}-criteriaBComply`}
                checked={formData.criteriaBComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBComply: checked, criteriaBNonComply: false })
                }
                label="I confirm that I have read the EQCR Appointment Criteria B above and I comply with the criteria."
              />

              <OptionRow
                id={`${formType}-criteriaBNonComply`}
                checked={formData.criteriaBNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, criteriaBNonComply: checked, criteriaBComply: false })
                }
                label="I cannot comply with one or more items included in the EQCR Appointment Criteria B above."
              />

              {formData.criteriaBNonComply && (
                <TextAreaField
                  id={`${formType}-criteriaBExplanation`}
                  label="If you respond that you cannot comply with the EQCR Appointment Criteria B above, please explain why:"
                  value={formData.criteriaBExplanation}
                  onChange={(value) => setFormData({ ...formData, criteriaBExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Performance Requirements</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  Perform the Engagement Quality Control Review in compliance with the Procedure: Performance and
                  Documentation of the Engagement Quality Control Review (and any supplemental functional and/or member
                  firm requirements) set out in section 10.4.2 Requirements of the Engagement Quality Control Review and
                  Responsibilities of the Engagement Quality Control Review of the GQ&RMM, at appropriate points in time
                  during the engagement to provide an appropriate basis for an objective evaluation of the significant
                  judgments made by the engagement team and the conclusions reached thereon.
                </p>
              </TextBlock>

              <OptionRow
                id={`${formType}-performanceComply`}
                checked={formData.performanceComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, performanceComply: checked, performanceNonComply: false })
                }
                label="I confirm that I have read the EQCR Performance Requirements set out in section 10.4.2 of GQ&RMM and I will perform all the procedures listed during my review."
              />

              <OptionRow
                id={`${formType}-performanceNonComply`}
                checked={formData.performanceNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, performanceNonComply: checked, performanceComply: false })
                }
                label="I cannot comply with the EQCR Performance Requirements and perform the procedures set out in section 10.4.2 of GQ&RMM."
              />

              {formData.performanceNonComply && (
                <TextAreaField
                  id={`${formType}-performanceExplanation`}
                  label="If you respond that you cannot comply with the EQCR Performance Requirements above, please explain why:"
                  value={formData.performanceExplanation}
                  onChange={(value) => setFormData({ ...formData, performanceExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Documentation Requirements</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  Documentation of the Engagement Quality Control Review shall be in compliance with the Procedure:
                  Performance and Documentation of the Engagement Quality Control Review (and any supplemental functional
                  and/or member firm requirements) set out in section 10.4.2 Requirements of the Engagement Quality
                  Control Review and Responsibilities of the Engagement Quality Control Review of the GQ&RMM, and such
                  documentation shall be included with the engagement documentation.
                </p>
              </TextBlock>

              <OptionRow
                id={`${formType}-documentationComply`}
                checked={formData.documentationComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, documentationComply: checked, documentationNonComply: false })
                }
                label="I confirm that I have read the EQCR Documentation Requirements set out in section 10.4.2 of GQ&RMM and I will comply with them."
              />

              <OptionRow
                id={`${formType}-documentationNonComply`}
                checked={formData.documentationNonComply}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, documentationNonComply: checked, documentationComply: false })
                }
                label="I cannot comply with the EQCR Documentation Requirements set out in section 10.4.2 of GQ&RMM."
              />

              {formData.documentationNonComply && (
                <TextAreaField
                  id={`${formType}-documentationExplanation`}
                  label="If you respond that you cannot comply with the EQCR Documentation Requirements above, please explain why:"
                  value={formData.documentationExplanation}
                  onChange={(value) => setFormData({ ...formData, documentationExplanation: value })}
                />
              )}
            </div>
          </CardInner>
        </Card>

        <Card className="p-6 bg-white border border-gray-200 shadow-sm">
          <CardInner>
            <SectionTitle>EQCR Assistant</SectionTitle>

            <div className="space-y-4">
              <TextBlock>
                <p>
                  The Engagement Quality Control Review shall be responsible for determining the nature, timing and
                  extent of the direction and supervision of any Engagement Quality Control Review Assistants who assist
                  in the Engagement Quality Control Review and the review of their work.
                </p>
              </TextBlock>

              <OptionRow
                id={`${formType}-requireAssistant`}
                checked={formData.requireAssistant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, requireAssistant: checked, noAssistant: false })
                }
                label="I require an EQCR Assistant appointment, so I confirm I understand my responsibility to determine and review his/her work."
              />

              <OptionRow
                id={`${formType}-noAssistant`}
                checked={formData.noAssistant}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, noAssistant: checked, requireAssistant: false })
                }
                label="I do not require an EQCR Assistant appointment."
              />
            </div>
          </CardInner>
        </Card>
      </fieldset>

{!viewMode && (
  <ActionButtons
    onSave={() => submitConfirmation(false)}
    onSend={() => submitConfirmation(true)}
  />
)}
    </form>
  );
}