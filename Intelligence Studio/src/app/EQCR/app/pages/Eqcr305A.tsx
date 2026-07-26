import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../components/PageHeader";
import FormSection from "../components/FormSection";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Checkbox } from "../components/ui/checkbox";
import { Textarea } from "../components/ui/textarea";
import { ScrollArea } from "../components/ui/scroll-area";
import { InfoIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { toast } from "sonner";

export default function Eqcr305A() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    eqcrName: "",
    legalEntityName: "",
    criteriaCompliant: false,
    criteriaNonCompliant: false,
    nonComplianceExplanation: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const criteriaText = `The individual shall have the competence and capabilities to perform the Engagement Quality Control Review, including sufficient time and appropriate authority to do so and shall have:

• Professional standards: An understanding of the relevant professional standards—IFAC Code of Ethics, ISAs and ISQM 1—and relevant legal and regulatory requirements, as well as experience and authority to know how to apply them in the context of the engagement for which they will serve as EQR. In Firm Practice, an EQCR shall be a partner (or an employee at the equivalent position) with experience and authority in auditing, whether or not that partner is in the firm or an affiliated network firm. Considerations may include: the partner has not had a formal complaint upheld against them related to the conduct of engagements; no firm has found the partner to be deficient in their ability to conduct audits; and the partner has not been sanctioned by a regulator.

• KPMG Mexico's policies and procedures: An understanding of KPMG Mexico's policies and procedures, and the Code of Conduct, as well as experience in applying them in the context of the engagement for which they will serve as EQCR.

• Understanding of the Legal & Regulatory Requirements: Understanding of and the ability to apply relevant legal and regulatory requirements, as well as experience and authority in the context of the engagement for which they will serve as EQCR.

• Knowledge of the entity's Industry: An understanding of the entity's industry and the ability to apply that knowledge in the context of the engagement for which they will serve as EQCR.

• Experience of a similar nature and complexity engagements: Experience performing engagements of a similar nature and complexity through appropriate training and participation in engagements.`;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.eqcrName.trim()) {
      newErrors.eqcrName = "EQCR Name is required";
    }

    if (!formData.legalEntityName.trim()) {
      newErrors.legalEntityName = "Legal Entity Name is required";
    }

    if (!formData.criteriaCompliant && !formData.criteriaNonCompliant) {
      newErrors.criteria = "Please select one of the criteria acknowledgment options";
    }

    if (formData.criteriaNonCompliant && !formData.nonComplianceExplanation.trim()) {
      newErrors.nonComplianceExplanation = "Explanation is required when non-compliance is selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCheckboxChange = (field: "criteriaCompliant" | "criteriaNonCompliant") => {
    if (field === "criteriaCompliant") {
      setFormData({
        ...formData,
        criteriaCompliant: !formData.criteriaCompliant,
        criteriaNonCompliant: false,
        nonComplianceExplanation: "",
      });
    } else {
      setFormData({
        ...formData,
        criteriaNonCompliant: !formData.criteriaNonCompliant,
        criteriaCompliant: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      toast.success("Confirmation saved successfully");
      console.log("Form submitted:", formData);
    } else {
      toast.error("Please correct the errors in the form");
    }
  };

  return (
    <div>
      <PageHeader
        title="EQCR confirmation"
        description="Capture EQCR confirmation details and appointment criteria acknowledgment."
        breadcrumbs={[{ label: "EQCR confirmation" }]}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 md:py-8 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Basic Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="eqcrName">
                  EQCR Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="eqcrName"
                  placeholder="Enter EQCR full name"
                  value={formData.eqcrName}
                  onChange={(e) => setFormData({ ...formData, eqcrName: e.target.value })}
                  className={errors.eqcrName ? "border-red-500" : ""}
                />
                {errors.eqcrName && (
                  <p className="text-xs text-red-600">{errors.eqcrName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="legalEntityName" className="flex items-center gap-2">
                  Legal Entity Name <span className="text-red-500">*</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help inline-flex">
                          <InfoIcon className="h-4 w-4 text-gray-400" />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs">
                        <p>If an engagement subject to EQCR has several legal entities reported as one, please include the name of the overall engagement.</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </Label>
                <Input
                  id="legalEntityName"
                  placeholder="Enter legal entity name"
                  value={formData.legalEntityName}
                  onChange={(e) => setFormData({ ...formData, legalEntityName: e.target.value })}
                  className={errors.legalEntityName ? "border-red-500" : ""}
                />
                {errors.legalEntityName && (
                  <p className="text-xs text-red-600">{errors.legalEntityName}</p>
                )}
              </div>
            </div>
          </FormSection>

          <FormSection title="EQCR Appointment – Criteria A">
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <ScrollArea className="h-64">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{criteriaText}</p>
                </ScrollArea>
              </div>

              {errors.criteria && (
                <p className="text-xs text-red-600">{errors.criteria}</p>
              )}

              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="criteriaCompliant"
                    checked={formData.criteriaCompliant}
                    onCheckedChange={() => handleCheckboxChange("criteriaCompliant")}
                  />
                  <Label htmlFor="criteriaCompliant" className="text-sm font-normal cursor-pointer">
                    I confirm that I have read the EQCR Appointment-Criteria A above and I comply with the criteria
                  </Label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="criteriaNonCompliant"
                    checked={formData.criteriaNonCompliant}
                    onCheckedChange={() => handleCheckboxChange("criteriaNonCompliant")}
                  />
                  <Label htmlFor="criteriaNonCompliant" className="text-sm font-normal cursor-pointer">
                    I cannot comply with one or more items included in the EQCR Appointment-Criteria A above
                  </Label>
                </div>

                {formData.criteriaNonCompliant && (
                  <div className="ml-8 space-y-2">
                    <Label htmlFor="nonComplianceExplanation">
                      Explain non-compliance and safeguards / next steps <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="nonComplianceExplanation"
                      placeholder="Describe which items you cannot comply with and what safeguards or next steps are planned..."
                      value={formData.nonComplianceExplanation}
                      onChange={(e) =>
                        setFormData({ ...formData, nonComplianceExplanation: e.target.value })
                      }
                      rows={4}
                      className={errors.nonComplianceExplanation ? "border-red-500" : ""}
                    />
                    {errors.nonComplianceExplanation && (
                      <p className="text-xs text-red-600">{errors.nonComplianceExplanation}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </FormSection>

          <div className="flex items-center gap-3 pt-4 border-t sticky bottom-0 bg-white py-4">
            <Button type="submit" size="lg">
              Save Confirmation
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}