import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../../components/PageHeader";
import FormSection from "../../components/FormSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { Textarea } from "../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

export default function EqReview307() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    candidateName: "",
    role: "",
    ceacId: "",
    clientName: "",
    engagementName: "",
    eqcrName: "",
    competence: false,
    sufficientTime: false,
    professionalStandards: false,
    legalRegulatory: false,
    kpmgPolicies: false,
    understandingResponsibilities: false,
    industryKnowledge: false,
    experience: "",
    engagementTeamMember: false,
    independent: false,
    objectivity: false,
    integrity: false,
    impartiality: false,
    threats: false,
    safeguards: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (formData.threats && !formData.safeguards.trim()) {
      newErrors.safeguards = "Safeguards description is required when threats are identified";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleExport = () => {
    toast.success("Exporting summary...");
    console.log("Export EQ Review 307 data:", formData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      toast.success("EQCR Assistant Review saved successfully");
      console.log("EQ Review 307 submitted:", formData);
    } else {
      toast.error("Please correct the errors in the form");
    }
  };

  return (
    <div>
      <PageHeader
        title="EQ Review 307"
        description="EQCR Assistant assignment and evaluation criteria."
        breadcrumbs={[
          { label: "EQ Review 307" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Assistant Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="candidateName">
                  Nombre Socio/Director | Sr Manager candidato a EQCR assistant
                </Label>
                <Input
                  id="candidateName"
                  placeholder="Enter candidate name"
                  value={formData.candidateName}
                  onChange={(e) => setFormData({ ...formData, candidateName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Partner, Director, Sr Manager</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                    <SelectItem value="Sr Manager">Sr Manager</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ceacId">CEAC ID</Label>
                <Input
                  id="ceacId"
                  placeholder="Enter CEAC ID"
                  value={formData.ceacId}
                  onChange={(e) => setFormData({ ...formData, ceacId: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clientName">Local Client Name</Label>
                <Input
                  id="clientName"
                  placeholder="Enter client name"
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="engagementName">Engagement Name</Label>
                <Input
                  id="engagementName"
                  placeholder="Enter engagement name"
                  value={formData.engagementName}
                  onChange={(e) => setFormData({ ...formData, engagementName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eqcrName">Nombre Socio/Director EQCR</Label>
                <Input
                  id="eqcrName"
                  placeholder="Enter EQCR name"
                  value={formData.eqcrName}
                  onChange={(e) => setFormData({ ...formData, eqcrName: e.target.value })}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Competence & Standards">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="competence"
                  checked={formData.competence}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, competence: checked as boolean })
                  }
                />
                <Label htmlFor="competence" className="text-sm font-normal cursor-pointer">
                  Competence and capabilities to perform the duties to be assigned
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="sufficientTime"
                  checked={formData.sufficientTime}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, sufficientTime: checked as boolean })
                  }
                />
                <Label htmlFor="sufficientTime" className="text-sm font-normal cursor-pointer">
                  Has sufficient time to carry out the EQC review?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="professionalStandards"
                  checked={formData.professionalStandards}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, professionalStandards: checked as boolean })
                  }
                />
                <Label htmlFor="professionalStandards" className="text-sm font-normal cursor-pointer">
                  Professional standards
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="legalRegulatory"
                  checked={formData.legalRegulatory}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, legalRegulatory: checked as boolean })
                  }
                />
                <Label htmlFor="legalRegulatory" className="text-sm font-normal cursor-pointer">
                  Legal & Regulatory requirements
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="kpmgPolicies"
                  checked={formData.kpmgPolicies}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, kpmgPolicies: checked as boolean })
                  }
                />
                <Label htmlFor="kpmgPolicies" className="text-sm font-normal cursor-pointer">
                  KPMG Mexico's policies and procedures
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="understandingResponsibilities"
                  checked={formData.understandingResponsibilities}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, understandingResponsibilities: checked as boolean })
                  }
                />
                <Label htmlFor="understandingResponsibilities" className="text-sm font-normal cursor-pointer">
                  Understanding of the responsibilities of EQCR assistant
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="industryKnowledge"
                  checked={formData.industryKnowledge}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, industryKnowledge: checked as boolean })
                  }
                />
                <Label htmlFor="industryKnowledge" className="text-sm font-normal cursor-pointer">
                  Knowledge of the entity's Industry
                </Label>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">
                  Experience of a similar nature and complexity engagements / expertise relevant
                </Label>
                <Textarea
                  id="experience"
                  placeholder="Describe relevant experience and expertise..."
                  value={formData.experience}
                  onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
          </FormSection>

          <FormSection title="Independence & Objectivity">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="engagementTeamMember"
                  checked={formData.engagementTeamMember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, engagementTeamMember: checked as boolean })
                  }
                />
                <Label htmlFor="engagementTeamMember" className="text-sm font-normal cursor-pointer">
                  Is a member of the engagement team or have any other involvement in the engagement?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="independent"
                  checked={formData.independent}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, independent: checked as boolean })
                  }
                />
                <Label htmlFor="independent" className="text-sm font-normal cursor-pointer">
                  Be independent from the entity?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="objectivity"
                  checked={formData.objectivity}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, objectivity: checked as boolean })
                  }
                />
                <Label htmlFor="objectivity" className="text-sm font-normal cursor-pointer">
                  Has objectivity?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="integrity"
                  checked={formData.integrity}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, integrity: checked as boolean })
                  }
                />
                <Label htmlFor="integrity" className="text-sm font-normal cursor-pointer">
                  Has integrity?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="impartiality"
                  checked={formData.impartiality}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, impartiality: checked as boolean })
                  }
                />
                <Label htmlFor="impartiality" className="text-sm font-normal cursor-pointer">
                  Has impartiality?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="threats"
                  checked={formData.threats}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, threats: checked as boolean })
                  }
                />
                <Label htmlFor="threats" className="text-sm font-normal cursor-pointer">
                  Has threats to his/her objectivity?
                </Label>
              </div>

              {formData.threats && (
                <div className="ml-8 space-y-2">
                  <Label htmlFor="safeguards">
                    Document safeguards put in place <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="safeguards"
                    placeholder="Document the safeguards implemented to address threats..."
                    value={formData.safeguards}
                    onChange={(e) => setFormData({ ...formData, safeguards: e.target.value })}
                    rows={4}
                    className={errors.safeguards ? "border-red-500" : ""}
                  />
                  {errors.safeguards && (
                    <p className="text-xs text-red-600">{errors.safeguards}</p>
                  )}
                </div>
              )}
            </div>
          </FormSection>

          <div className="flex items-center gap-3 pt-4 border-t sticky bottom-0 bg-white py-4">
            <Button type="submit" size="lg">
              Save EQCR Assistant Review
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}