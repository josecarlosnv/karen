import { useState } from "react";
import { X, Save } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface EqcrFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  eqcrData?: any;
}

export default function EqcrFormModal({ isOpen, onClose, eqcrData }: EqcrFormModalProps) {
  const [formData, setFormData] = useState({
    name: eqcrData?.name || "",
    localJobLevel: eqcrData?.localJobLevel || "",
    promotionYear: eqcrData?.promotionYear || "",
    aicpa: "",
    pcaob: "",
    icfr: "",
    sec: "",
    ifrs: "",
    usGaap: "",
    other: "",
    understandingResponsibilities: false,
    qpr2022: "",
    qpr2023: "",
    qpr2024: "",
    qpr2025: "",
    qpr2026: "",
    ncEvaluation: "",
    pcaobInspection: "",
    independenceCompliance: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("EQCR saved:", formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b bg-gradient-to-r from-[#00338D] to-[#0055B8] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">
              {eqcrData ? "Edit EQCR Profile" : "New EQCR Profile"}
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Manage partner and director credentials
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/10 rounded-lg p-1 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Partner / Director Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="mt-1.5"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="localJobLevel">Local Job Level *</Label>
                  <select
                    id="localJobLevel"
                    value={formData.localJobLevel}
                    onChange={(e) => setFormData({ ...formData, localJobLevel: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                    required
                  >
                    <option value="">Select...</option>
                    <option value="Director">Director</option>
                    <option value="Partner">Partner</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="promotionYear">Promotion Year to Partner *</Label>
                  <Input
                    id="promotionYear"
                    type="number"
                    value={formData.promotionYear}
                    onChange={(e) => setFormData({ ...formData, promotionYear: e.target.value })}
                    className="mt-1.5"
                    placeholder="e.g. 2018"
                    min="1900"
                    max="2100"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Expertise Percentages */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Expertise Areas (%)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="aicpa">AICPA (%)</Label>
                  <Input
                    id="aicpa"
                    type="number"
                    value={formData.aicpa}
                    onChange={(e) => setFormData({ ...formData, aicpa: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="pcaob">PCAOB (%)</Label>
                  <Input
                    id="pcaob"
                    type="number"
                    value={formData.pcaob}
                    onChange={(e) => setFormData({ ...formData, pcaob: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="icfr">ICFR (%)</Label>
                  <Input
                    id="icfr"
                    type="number"
                    value={formData.icfr}
                    onChange={(e) => setFormData({ ...formData, icfr: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="sec">SEC (%)</Label>
                  <Input
                    id="sec"
                    type="number"
                    value={formData.sec}
                    onChange={(e) => setFormData({ ...formData, sec: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="ifrs">IFRS (%)</Label>
                  <Input
                    id="ifrs"
                    type="number"
                    value={formData.ifrs}
                    onChange={(e) => setFormData({ ...formData, ifrs: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="usGaap">US GAAP (%)</Label>
                  <Input
                    id="usGaap"
                    type="number"
                    value={formData.usGaap}
                    onChange={(e) => setFormData({ ...formData, usGaap: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
                <div>
                  <Label htmlFor="other">Other (%)</Label>
                  <Input
                    id="other"
                    type="number"
                    value={formData.other}
                    onChange={(e) => setFormData({ ...formData, other: e.target.value })}
                    className="mt-1.5"
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Understanding Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Checkbox
                id="understandingResponsibilities"
                checked={formData.understandingResponsibilities}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, understandingResponsibilities: checked as boolean })
                }
              />
              <Label htmlFor="understandingResponsibilities" className="text-sm cursor-pointer">
                Understanding of EQCR responsibilities in performing and documenting an EQC review
              </Label>
            </div>

            {/* QPR Results */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">QPR Results</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                <div>
                  <Label htmlFor="qpr2022">2022</Label>
                  <select
                    id="qpr2022"
                    value={formData.qpr2022}
                    onChange={(e) => setFormData({ ...formData, qpr2022: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select...</option>
                    <option value="NC">NC</option>
                    <option value="CIN">CIN</option>
                    <option value="AC">C</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="qpr2023">2023</Label>
                  <select
                    id="qpr2023"
                    value={formData.qpr2023}
                    onChange={(e) => setFormData({ ...formData, qpr2023: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select...</option>
                    <option value="NC">NC</option>
                    <option value="CIN">CIN</option>
                    <option value="AC">C</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="qpr2024">2024</Label>
                  <select
                    id="qpr2024"
                    value={formData.qpr2024}
                    onChange={(e) => setFormData({ ...formData, qpr2024: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select...</option>
                    <option value="NC">NC</option>
                    <option value="CIN">CIN</option>
                    <option value="AC">C</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="qpr2025">2025</Label>
                  <select
                    id="qpr2025"
                    value={formData.qpr2025}
                    onChange={(e) => setFormData({ ...formData, qpr2025: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select...</option>
                    <option value="NC">NC</option>
                    <option value="CIN">CIN</option>
                    <option value="AC">C</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="qpr2026">2026</Label>
                  <select
                    id="qpr2026"
                    value={formData.qpr2026}
                    onChange={(e) => setFormData({ ...formData, qpr2026: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select...</option>
                    <option value="NC">NC</option>
                    <option value="CIN">CIN</option>
                    <option value="AC">C</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Evaluation Fields */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Evaluation & Compliance</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="ncEvaluation">
                    NC evaluation: nature, severity, and impact
                  </Label>
                  <textarea
                    id="ncEvaluation"
                    value={formData.ncEvaluation}
                    onChange={(e) => setFormData({ ...formData, ncEvaluation: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D] min-h-[80px]"
                    placeholder="Describe nature, severity, and impact..."
                  />
                </div>
                <div>
                  <Label htmlFor="pcaobInspection">
                    PCAOB inspection results evaluation
                  </Label>
                  <textarea
                    id="pcaobInspection"
                    value={formData.pcaobInspection}
                    onChange={(e) => setFormData({ ...formData, pcaobInspection: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D] min-h-[80px]"
                    placeholder="Describe PCAOB inspection results..."
                  />
                </div>
                <div>
                  <Label htmlFor="independenceCompliance">
                    Independence and risk compliance audit results
                  </Label>
                  <select
                    id="independenceCompliance"
                    value={formData.independenceCompliance}
                    onChange={(e) => setFormData({ ...formData, independenceCompliance: e.target.value })}
                    className="w-full mt-1.5 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#00338D]"
                  >
                    <option value="">Select result...</option>
                    <option value="Compliant">Compliant</option>
                    <option value="Minor Issues">Minor Issues</option>
                    <option value="Non-Compliant">Non-Compliant</option>
                    <option value="Under Review">Under Review</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t bg-gray-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="border-gray-300">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="bg-gradient-to-r from-[#00338D] to-[#0055B8] text-white shadow-md hover:shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}
