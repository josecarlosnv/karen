import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { KPICard } from "../../components/KPICard";
import { StatusChip } from "../../components/StatusChip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  DollarSign,
  AlertCircle,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

const mockExceptionData = {
  client: "MegaCorp Inc",
  submittedBy: "Sarah Johnson",
  approvedBy: "John Smith (Lead Partner)",
  submittedOn: "Feb 2, 2026",
  status: "exception" as const,
  totalRevenue: 465000,
  totalHours: 2090,
  margin: 45.2,
  variance: 12.5,
  specialistsConfirmed: 2,
  specialistsTotal: 3,
  exceptions: [
    {
      id: "1",
      rule: "Variance Threshold",
      description: "CY vs PY hours variance exceeds 10% threshold",
      severity: "high" as const,
      impact: "Overall variance of 12.5% indicates significant scope change",
      recommendation: "Review staffing plan with client before approval",
    },
    {
      id: "2",
      rule: "Specialist Confirmation",
      description: "Not all specialists have confirmed",
      severity: "medium" as const,
      impact: "1 of 3 specialists pending confirmation may affect delivery",
      recommendation: "Ensure specialist availability before final approval",
    },
  ],
  leadPartnerComment:
    "Variance is justified due to expanded scope for new regulatory requirements. Recommend approval pending BU review.",
};

export default function BULeaderApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [comment, setComment] = useState("");

  const handleApprove = () => {
    setShowApproveDialog(false);
    navigate("/approvals");
  };

  const handleReject = () => {
    setShowRejectDialog(false);
    navigate("/approvals");
  };

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-amber-50 border-b-2 border-amber-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/approvals")}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Approvals
          </Button>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <AlertCircle className="w-6 h-6 text-amber-600" />
                <h1 className="text-2xl font-semibold text-slate-900">
                  BU Leader Exception Review
                </h1>
              </div>
              <h2 className="text-xl text-slate-700 mb-1">
                {mockExceptionData.client}
              </h2>
              <p className="text-sm text-slate-600">
                Submitted by {mockExceptionData.submittedBy} • Approved by{" "}
                {mockExceptionData.approvedBy}
              </p>
            </div>
            <StatusChip status={mockExceptionData.status} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Essential KPIs Only */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                value={`$${mockExceptionData.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
              />
              <KPICard
                title="Hours Variance"
                value={`+${mockExceptionData.variance}%`}
                icon={AlertCircle}
                subtitle="Exceeds 10% threshold"
                className="border-2 border-amber-200"
              />
              <KPICard
                title="Margin Proxy"
                value={`${mockExceptionData.margin}%`}
                icon={TrendingUp}
              />
              <KPICard
                title="Specialist Status"
                value={`${mockExceptionData.specialistsConfirmed}/${mockExceptionData.specialistsTotal}`}
                icon={Users}
                subtitle="Confirmed"
              />
            </div>
          </motion.div>

          {/* Exceptions - Focus Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white rounded-xl border-2 border-amber-200 p-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Business Rule Exceptions ({mockExceptionData.exceptions.length})
                </h3>
                <p className="text-sm text-slate-600">
                  Review these exceptions before approving
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {mockExceptionData.exceptions.map((exception) => (
                <div
                  key={exception.id}
                  className="bg-amber-50 rounded-lg p-6 border border-amber-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-1">
                        {exception.rule}
                      </h4>
                      <p className="text-sm text-slate-700">
                        {exception.description}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        exception.severity === "high"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {exception.severity.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 pt-3 border-t border-amber-200">
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Impact Assessment:
                      </p>
                      <p className="text-sm text-slate-600">{exception.impact}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-1">
                        Recommendation:
                      </p>
                      <p className="text-sm text-slate-600">
                        {exception.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Lead Partner Comment */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-3">
              Lead Partner Comments
            </h3>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-slate-700">
                {mockExceptionData.leadPartnerComment}
              </p>
              <p className="text-xs text-slate-600 mt-2">
                — {mockExceptionData.approvedBy}
              </p>
            </div>
          </motion.div>

          {/* Simplified Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-4">
              High-Level Summary
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Client Entities:</span>
                  <span className="text-sm font-medium text-slate-900">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Hours:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {mockExceptionData.totalHours.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Audit Team Fees:</span>
                  <span className="text-sm font-medium text-slate-900">$380,000</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Specialists:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {mockExceptionData.specialistsTotal}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Specialist Fees:</span>
                  <span className="text-sm font-medium text-slate-900">$85,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Total Revenue:</span>
                  <span className="text-sm font-semibold text-[#00338D]">
                    ${mockExceptionData.totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Decision Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border border-slate-200 p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-2">
              BU Leader Decision Required
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              As BU Leader, you are responsible for reviewing and approving P8s
              with business rule exceptions.
            </p>
            <div className="flex items-center justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(true)}
                className="border-red-200 text-red-700 hover:bg-red-50"
              >
                <XCircle className="w-4 h-4 mr-2" />
                Reject
              </Button>
              <Button onClick={() => setShowApproveDialog(true)} size="lg">
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve Exception
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Exception P8</DialogTitle>
            <DialogDescription>
              By approving, you acknowledge the business rule exceptions and authorize
              this P8 to proceed.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-slate-900 mb-2 block">
              BU Leader Comments (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any comments about this exception approval..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve Exception
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Exception P8</DialogTitle>
            <DialogDescription>
              This P8 will be returned to the Lead Partner and preparer for revision.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-slate-900 mb-2 block">
              Reason for Rejection *
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please explain why this exception cannot be approved..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={!comment.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
