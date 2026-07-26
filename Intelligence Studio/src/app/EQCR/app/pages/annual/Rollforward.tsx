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

export default function Rollforward() {
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
    // Training
    trainingAICPA: false,
    trainingPCAOB: false,
    trainingICFR: false,
    trainingSEC: false,
    trainingIFRS: false,
    trainingUSGAAP: false,
    trainingOther: false,
    trainingOtherText: "",
    // Years
    year2021: false,
    year2022: false,
    year2023: false,
    year2024: false,
    year2025: false,
    // Criteria
    ncEvaluation: false,
    pcaobInspection: false,
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
    toast.success("Rollforward saved successfully");
    console.log("Rollforward submitted:", formData);
  };

  return (
    <div>
      <PageHeader
        title="Rollforward"
        description="Annual EQCR reassessment with training and criteria rollforward."
        breadcrumbs={[
          { label: "Annual Reassessment", href: "/annual-reassessment" },
          { label: "Rollforward" },
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

          <FormSection title="Cumple con: Specific EQCR training">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingAICPA"
                  checked={formData.trainingAICPA}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingAICPA: checked as boolean })
                  }
                />
                <Label htmlFor="trainingAICPA" className="text-sm font-normal cursor-pointer">
                  AICPA
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingPCAOB"
                  checked={formData.trainingPCAOB}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingPCAOB: checked as boolean })
                  }
                />
                <Label htmlFor="trainingPCAOB" className="text-sm font-normal cursor-pointer">
                  PCAOB
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingICFR"
                  checked={formData.trainingICFR}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingICFR: checked as boolean })
                  }
                />
                <Label htmlFor="trainingICFR" className="text-sm font-normal cursor-pointer">
                  ICFR
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingSEC"
                  checked={formData.trainingSEC}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingSEC: checked as boolean })
                  }
                />
                <Label htmlFor="trainingSEC" className="text-sm font-normal cursor-pointer">
                  SEC
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingIFRS"
                  checked={formData.trainingIFRS}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingIFRS: checked as boolean })
                  }
                />
                <Label htmlFor="trainingIFRS" className="text-sm font-normal cursor-pointer">
                  IFRS
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingUSGAAP"
                  checked={formData.trainingUSGAAP}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingUSGAAP: checked as boolean })
                  }
                />
                <Label htmlFor="trainingUSGAAP" className="text-sm font-normal cursor-pointer">
                  USGAAP
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="trainingOther"
                  checked={formData.trainingOther}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, trainingOther: checked as boolean })
                  }
                />
                <Label htmlFor="trainingOther" className="text-sm font-normal cursor-pointer">
                  Other
                </Label>
              </div>
            </div>

            {formData.trainingOther && (
              <div className="space-y-2 mt-4">
                <Label htmlFor="trainingOtherText">Specify Other Training</Label>
                <Input
                  id="trainingOtherText"
                  placeholder="Describe other training..."
                  value={formData.trainingOtherText}
                  onChange={(e) => setFormData({ ...formData, trainingOtherText: e.target.value })}
                />
              </div>
            )}

            <div className="mt-6">
              <Label className="mb-3 block">Years</Label>
              <div className="grid grid-cols-5 gap-4">
                {[2021, 2022, 2023, 2024, 2025].map((year) => {
                  const fieldName = `year${year}` as keyof typeof formData;
                  return (
                    <div key={year} className="flex items-start space-x-3">
                      <Checkbox
                        id={fieldName}
                        checked={formData[fieldName] as boolean}
                        onCheckedChange={(checked) =>
                          setFormData({ ...formData, [fieldName]: checked as boolean })
                        }
                      />
                      <Label htmlFor={fieldName} className="text-sm font-normal cursor-pointer">
                        {year}
                      </Label>
                    </div>
                  );
                })}
              </div>
            </div>
          </FormSection>

          <FormSection title="Reassessment Criteria">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="ncEvaluation"
                  checked={formData.ncEvaluation}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, ncEvaluation: checked as boolean })
                  }
                />
                <Label htmlFor="ncEvaluation" className="text-sm font-normal cursor-pointer">
                  For NC evaluation of the nature, severity and impact of rating
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="pcaobInspection"
                  checked={formData.pcaobInspection}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, pcaobInspection: checked as boolean })
                  }
                />
                <Label htmlFor="pcaobInspection" className="text-sm font-normal cursor-pointer">
                  PCAOB Inspection results and evaluation of the nature, severity and impact rating
                </Label>
              </div>

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
                  There have been no significant changes in the nature of the engagement since initial appointment
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
                  There have been changes in Legal & Regulatory requirements applicable to the engagement?
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
                  There have been changes in the entity's Industry?
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
                  There have been changes in the Complexity of the engagement?
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
                  id="objectivityIntegrityImpartiality"
                  checked={formData.objectivityIntegrityImpartiality}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, objectivityIntegrityImpartiality: checked as boolean })
                  }
                />
                <Label htmlFor="objectivityIntegrityImpartiality" className="text-sm font-normal cursor-pointer">
                  Be able to carry out the role with objectivity, integrity and impartiality?
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
                  Has been a member of the engagement team or have any other involvement in the engagement?
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
                  Has threats to his/her objectivity that have not been eliminated or reduced to an acceptable level?
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
                  Shall not have responsibility for the audit/review of any reporting entity's components, employee benefit plans or related entities
                </Label>
              </div>
            </div>
          </FormSection>

          <div className="flex items-center gap-3 pt-4 border-t sticky bottom-0 bg-white py-4">
            <Button type="submit" size="lg">
              Save Rollforward
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