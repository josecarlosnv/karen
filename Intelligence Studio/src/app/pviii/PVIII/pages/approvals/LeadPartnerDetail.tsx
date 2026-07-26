import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { Button } from "../../components/ui/button";
import { Textarea } from "../../components/ui/textarea";
import { KPICard } from "../../components/KPICard";
import { StatusChip } from "../../components/StatusChip";
import { AuditTrail, AuditEvent } from "../../components/AuditTrail";
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
  Clock,
  Users,
  TrendingUp,
  AlertCircle,
  FileText,
} from "lucide-react";
import { motion } from "motion/react";

const mockP8Data = {
  client: "MegaCorp Inc",
  submittedBy: "Sarah Johnson",
  submittedOn: "Feb 1, 2026",
  status: "submitted" as const,
  audit: {
    hours: 1850,
    fees: 380000,
    margin: 45.2,
    variance: 12.5,
  },
  specialists: {
    count: 3,
    hours: 240,
    fees: 85000,
    confirmed: 2,
    pending: 1,
  },
  entities: 5,
  totalRevenue: 465000,
  totalHours: 2090,
  exceptions: [
    {
      id: "1",
      rule: "Variance Threshold",
      description: "CY vs PY hours variance exceeds 10% threshold",
      severity: "high" as const,
      details: "Overall variance of 12.5% detected",
    },
    {
      id: "2",
      rule: "Specialist Confirmation",
      description: "Not all specialists have confirmed",
      severity: "medium" as const,
      details: "1 of 3 specialists pending confirmation",
    },
  ],
};

const auditTrail: AuditEvent[] = [
  {
    id: "1",
    action: "P8 Submitted for Approval",
    user: "Sarah Johnson",
    timestamp: "Feb 1, 2026 at 2:45 PM",
    status: "Submitted",
    comment: "Please review the updated staffing schedule and specialist requirements.",
  },
  {
    id: "2",
    action: "Draft Saved",
    user: "Sarah Johnson",
    timestamp: "Feb 1, 2026 at 11:20 AM",
    status: "Draft",
  },
  {
    id: "3",
    action: "P8 Created",
    user: "Sarah Johnson",
    timestamp: "Jan 29, 2026 at 9:15 AM",
    status: "Draft",
  },
];

export default function LeadPartnerApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [comment, setComment] = useState("");

  const handleApprove = () => {
    // Approval logic
    setShowApproveDialog(false);
    navigate("/approvals");
  };

  const handleReject = () => {
    // Rejection logic
    setShowRejectDialog(false);
    navigate("/approvals");
  };

  const hasExceptions = mockP8Data.exceptions.length > 0;

  return (
    <div className="min-h-screen bg-background pb-24 lg:pb-8">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
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
              <h1 className="text-2xl font-semibold text-slate-900 mb-1">
                {mockP8Data.client}
              </h1>
              <p className="text-sm text-slate-600">
                Submitted by {mockP8Data.submittedBy} on {mockP8Data.submittedOn}
              </p>
            </div>
            <StatusChip status={mockP8Data.status} />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* KPI Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="Total Revenue"
                value={`$${mockP8Data.totalRevenue.toLocaleString()}`}
                icon={DollarSign}
              />
              <KPICard
                title="Total Hours"
                value={mockP8Data.totalHours.toLocaleString()}
                icon={Clock}
              />
              <KPICard
                title="Specialists"
                value={mockP8Data.specialists.count}
                icon={Users}
                subtitle={`${mockP8Data.specialists.confirmed} confirmed`}
              />
              <KPICard
                title="Margin Proxy"
                value={`${mockP8Data.audit.margin}%`}
                icon={TrendingUp}
              />
            </div>
          </motion.div>

          {/* Exceptions Alert */}
          {hasExceptions && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-amber-50 border-2 border-amber-200 rounded-xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="w-6 h-6 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-2">
                    Business Rule Exceptions ({mockP8Data.exceptions.length})
                  </h3>
                  <p className="text-sm text-amber-800 mb-4">
                    This P8 requires BU Leader Partner approval after your review
                    due to the following exceptions:
                  </p>
                  <div className="space-y-3">
                    {mockP8Data.exceptions.map((exception) => (
                      <div
                        key={exception.id}
                        className="bg-white rounded-lg p-4 border border-amber-200"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-medium text-slate-900">
                            {exception.rule}
                          </h4>
                          <span
                            className={`text-xs px-2 py-0.5 rounded font-medium ${
                              exception.severity === "high"
                                ? "bg-red-100 text-red-700"
                                : "bg-amber-100 text-amber-700"
                            }`}
                          >
                            {exception.severity}
                          </span>
                        </div>
                        <p className="text-sm text-slate-700 mb-1">
                          {exception.description}
                        </p>
                        <p className="text-xs text-slate-600">{exception.details}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Valuation Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Audit Team */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                Audit Team Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Total Hours</span>
                  <span className="font-semibold text-slate-900">
                    {mockP8Data.audit.hours.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Total Fees</span>
                  <span className="font-semibold text-slate-900">
                    ${mockP8Data.audit.fees.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Margin Proxy</span>
                  <span className="font-semibold text-emerald-600">
                    {mockP8Data.audit.margin}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Hours Variance</span>
                  <span className="font-semibold text-red-600">
                    +{mockP8Data.audit.variance}%
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Specialists */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white rounded-xl border border-slate-200 p-6"
            >
              <h3 className="font-semibold text-slate-900 mb-4">
                Specialists Summary
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Total Specialists</span>
                  <span className="font-semibold text-slate-900">
                    {mockP8Data.specialists.count}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Total Hours</span>
                  <span className="font-semibold text-slate-900">
                    {mockP8Data.specialists.hours.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <span className="text-sm text-slate-600">Total Fees</span>
                  <span className="font-semibold text-slate-900">
                    ${mockP8Data.specialists.fees.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Confirmations</span>
                  <span className="font-semibold text-slate-900">
                    {mockP8Data.specialists.confirmed}/{mockP8Data.specialists.count}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Staffing & Entities Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-4">
              Additional Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm text-slate-600 mb-1">Client Entities</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {mockP8Data.entities}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Combined Hours</p>
                <p className="text-2xl font-semibold text-slate-900">
                  {mockP8Data.totalHours.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-semibold text-[#00338D]">
                  ${mockP8Data.totalRevenue.toLocaleString()}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Audit Trail */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.4 }}
            className="bg-white rounded-xl border border-slate-200 p-6"
          >
            <h3 className="font-semibold text-slate-900 mb-6">Activity History</h3>
            <AuditTrail events={auditTrail} />
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.5 }}
            className="flex items-center justify-end gap-3 pt-4"
          >
            <Button
              variant="outline"
              onClick={() => setShowRejectDialog(true)}
              className="border-red-200 text-red-700 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
            <Button onClick={() => setShowApproveDialog(true)}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </motion.div>
        </div>
      </div>

      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve P8</DialogTitle>
            <DialogDescription>
              {hasExceptions
                ? "This P8 will be forwarded to BU Leader Partner for exception review after your approval."
                : "This P8 will be marked as approved and can proceed."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-slate-900 mb-2 block">
              Comments (Optional)
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add any comments..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject P8</DialogTitle>
            <DialogDescription>
              This P8 will be returned to the preparer for revisions.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-medium text-slate-900 mb-2 block">
              Reason for Rejection *
            </label>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Please explain why this P8 is being rejected..."
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
