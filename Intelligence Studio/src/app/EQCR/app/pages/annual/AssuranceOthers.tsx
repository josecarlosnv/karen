import { useState } from "react";
import { useNavigate } from "react-router";
import PageHeader from "../../components/PageHeader";
import FormSection from "../../components/FormSection";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { toast } from "sonner";

export default function AssuranceOthers() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    ceacId: "",
    clientName: "",
    engagementName: "",
    leadPartner: "",
    eqcrName: "",
    role: "",
    appointmentDate: "",
    reassessmentYear: "",
    competence: false,
    noSignificantChanges: false,
    legalRegChanges: false,
    industryChanges: false,
    complexityChanges: false,
    sufficientTime: false,
    independent: false,
    objectivityIntegrityImpartiality: false,
    engagementTeamMember: false,
    threats: false,
    noComponentResponsibility: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Assurance and others saved successfully");
    console.log("Assurance submitted:", formData);
  };

  return (
    <div>
      <PageHeader
        title="Assurance and others not Audit or Review"
        description="Reassessment for assurance and non-audit/review engagements."
        breadcrumbs={[
          { label: "Annual Reassessment", href: "/annual-reassessment" },
          { label: "Assurance and others" },
        ]}
      />

      <div className="max-w-5xl mx-auto px-6 py-8 lg:px-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormSection title="Engagement Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Label htmlFor="leadPartner">Lead Partner</Label>
                <Input
                  id="leadPartner"
                  placeholder="Enter lead partner name"
                  value={formData.leadPartner}
                  onChange={(e) => setFormData({ ...formData, leadPartner: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="eqcrName">Nombre EQCR asignado</Label>
                <Input
                  id="eqcrName"
                  placeholder="Enter EQCR name"
                  value={formData.eqcrName}
                  onChange={(e) => setFormData({ ...formData, eqcrName: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Partner or Director?</Label>
                <Select value={formData.role} onValueChange={(val) => setFormData({ ...formData, role: val })}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Partner">Partner</SelectItem>
                    <SelectItem value="Director">Director</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="appointmentDate">Year (Date) of Appointment as EQCR on the engagement</Label>
                <select
                  id="appointmentDate"
                  value={formData.appointmentDate}
                  onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value=""></option>
                  {Array.from({ length: 31 }, (_, i) => 2000 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reassessmentYear">Audit Year of Reassessment</Label>
                <select
                  id="reassessmentYear"
                  value={formData.reassessmentYear}
                  onChange={(e) => setFormData({ ...formData, reassessmentYear: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-[13px] shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value=""></option>
                  {Array.from({ length: 31 }, (_, i) => 2000 + i).map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
          </FormSection>

          <FormSection title="Criteria Items">
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
                  Competence and capabilities to perform the Engagement Quality Review for the engagement
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="noSignificantChanges"
                  checked={formData.noSignificantChanges}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, noSignificantChanges: checked as boolean })
                  }
                />
                <Label htmlFor="noSignificantChanges" className="text-sm font-normal cursor-pointer">
                  No significant changes in engagement nature since initial appointment
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="legalRegChanges"
                  checked={formData.legalRegChanges}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, legalRegChanges: checked as boolean })
                  }
                />
                <Label htmlFor="legalRegChanges" className="text-sm font-normal cursor-pointer">
                  Changes in Legal & Regulatory requirements?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="industryChanges"
                  checked={formData.industryChanges}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, industryChanges: checked as boolean })
                  }
                />
                <Label htmlFor="industryChanges" className="text-sm font-normal cursor-pointer">
                  Changes in Industry?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="complexityChanges"
                  checked={formData.complexityChanges}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, complexityChanges: checked as boolean })
                  }
                />
                <Label htmlFor="complexityChanges" className="text-sm font-normal cursor-pointer">
                  Changes in Complexity?
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
                  Has sufficient time?
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
                  Independent?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="objectivityIntegrityImpartiality"
                  checked={formData.objectivityIntegrityImpartiality}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, objectivityIntegrityImpartiality: checked as boolean })
                  }
                />
                <Label htmlFor="objectivityIntegrityImpartiality" className="text-sm font-normal cursor-pointer">
                  Able to carry out role with objectivity/integrity/impartiality?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="engagementTeamMember"
                  checked={formData.engagementTeamMember}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, engagementTeamMember: checked as boolean })
                  }
                />
                <Label htmlFor="engagementTeamMember" className="text-sm font-normal cursor-pointer">
                  Member of engagement team or other involvement?
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
                  Threats not eliminated/reduced?
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="noComponentResponsibility"
                  checked={formData.noComponentResponsibility}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, noComponentResponsibility: checked as boolean })
                  }
                />
                <Label htmlFor="noComponentResponsibility" className="text-sm font-normal cursor-pointer">
                  Shall not have responsibility for components/benefit plans/related entities
                </Label>
              </div>
            </div>
          </FormSection>

          <div className="flex items-center gap-3 pt-4 border-t sticky bottom-0 bg-white py-4">
            <Button type="submit" size="lg">
              Save
            </Button>
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/annual-reassessment")}
            >
              Back
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}