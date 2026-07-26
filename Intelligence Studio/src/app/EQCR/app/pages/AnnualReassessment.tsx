import PageHeader from "../components/PageHeader";
import NavigationCard from "../components/NavigationCard";
import { RefreshCw, FileText, UserCog } from "lucide-react";

export default function AnnualReassessment() {
  return (
    <div>
      <PageHeader
        title="Annual Reassessment | Accreditation criteria 305B"
        description="Capture reassessment and rollforward evidence for EQCR accreditation criteria."
        breadcrumbs={[{ label: "Annual Reassessment | Accreditation criteria 305B" }]}
      />

      <div className="max-w-4xl mx-auto px-4 py-8 md:px-6 md:py-12 lg:px-8">
        <div className="space-y-4">
          <NavigationCard
            icon={RefreshCw}
            title="Rollforward"
            description="Annual EQCR reassessment with training and criteria rollforward"
            href="/annual-reassessment/rollforward"
          />

          <NavigationCard
            icon={FileText}
            title="Assurance and others not Audit or Review"
            description="Reassessment for assurance and non-audit/review engagements"
            href="/annual-reassessment/assurance-others"
          />
        </div>
      </div>
    </div>
  );
}