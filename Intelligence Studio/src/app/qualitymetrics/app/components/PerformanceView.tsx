import { useNavigate } from 'react-router';
import { ArrowLeft, Settings, Shield, Users, Database, Bell, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'motion/react';

export function PerformanceView() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen">
      {/* Premium Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#0a0e1a] via-[#141b2d] to-[#0f1420]">
        <div className="absolute left-0 top-0 h-full w-1/3 overflow-hidden opacity-40">
          {[...Array(15)].map((_, i) => (
            <div
              key={`line-${i}`}
              className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#e91e8c] to-transparent"
              style={{ left: `${i * 6.67}%`, transform: 'rotate(-45deg)', transformOrigin: 'top' }}
            />
          ))}
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 overflow-hidden opacity-40">
          {[...Array(15)].map((_, i) => (
            <div
              key={`line-r-${i}`}
              className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00c9ff] to-transparent"
              style={{ right: `${i * 6.67}%`, transform: 'rotate(45deg)', transformOrigin: 'top' }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between rounded-xl border border-[#2e5bff]/20 bg-[#141b2d]/80 p-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/')}
              className="rounded-lg text-white/60 transition-all hover:bg-[#2e5bff]/20 hover:text-white"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-violet-600">
                <Settings className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg font-light text-white">System Administration</h1>
                <p className="text-xs text-white/60">Settings & Configuration</p>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-6xl"
        >
          <div className="mb-8">
            <h2 className="mb-2 text-2xl font-light text-white">Administration Dashboard</h2>
            <p className="text-sm text-white/60">Manage system settings, users, and configuration</p>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* User Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="group overflow-hidden rounded-2xl border border-[#2e5bff]/20 bg-gradient-to-br from-[#141b2d] to-[#1a2338] p-8 shadow-[0_8px_30px_rgba(46,91,255,0.15)] backdrop-blur-xl transition-all hover:shadow-[0_12px_40px_rgba(46,91,255,0.25)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-blue-500">
                <Users className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-light text-white">User Management</h3>
              <p className="mb-6 text-sm text-white/60">
                Manage partner accounts, roles, permissions, and access controls
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <div>• 127 Active Partners</div>
                <div>• 45 Directors</div>
                <div>• 8 Head of Audit</div>
              </div>
            </motion.div>

            {/* Data Management */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="group overflow-hidden rounded-2xl border border-[#2e5bff]/20 bg-gradient-to-br from-[#141b2d] to-[#1a2338] p-8 shadow-[0_8px_30px_rgba(46,91,255,0.15)] backdrop-blur-xl transition-all hover:shadow-[0_12px_40px_rgba(46,91,255,0.25)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-violet-500">
                <Database className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-light text-white">Data Management</h3>
              <p className="mb-6 text-sm text-white/60">
                Configure indicators, metrics, and evaluation parameters
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <div>• 11 Quality Indicators</div>
                <div>• 6 Mandatory Elements</div>
                <div>• FY 2025 Active Period</div>
              </div>
            </motion.div>

            {/* Security Settings */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group overflow-hidden rounded-2xl border border-[#2e5bff]/20 bg-gradient-to-br from-[#141b2d] to-[#1a2338] p-8 shadow-[0_8px_30px_rgba(46,91,255,0.15)] backdrop-blur-xl transition-all hover:shadow-[0_12px_40px_rgba(46,91,255,0.25)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500">
                <Lock className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-light text-white">Security & Access</h3>
              <p className="mb-6 text-sm text-white/60">
                Manage authentication, authorization, and audit logs
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <div>• SSO Integration</div>
                <div>• Role-based Access Control</div>
                <div>• Activity Monitoring</div>
              </div>
            </motion.div>

            {/* Notifications */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="group overflow-hidden rounded-2xl border border-[#2e5bff]/20 bg-gradient-to-br from-[#141b2d] to-[#1a2338] p-8 shadow-[0_8px_30px_rgba(46,91,255,0.15)] backdrop-blur-xl transition-all hover:shadow-[0_12px_40px_rgba(46,91,255,0.25)]"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-500">
                <Bell className="h-7 w-7 text-white" strokeWidth={2} />
              </div>
              <h3 className="mb-3 text-xl font-light text-white">Notifications & Alerts</h3>
              <p className="mb-6 text-sm text-white/60">
                Configure email alerts, reminders, and system notifications
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <div>• Deadline Reminders</div>
                <div>• Compliance Alerts</div>
                <div>• Performance Updates</div>
              </div>
            </motion.div>
          </div>

          {/* System Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 rounded-xl border border-[#2e5bff]/20 bg-[#0f1420]/60 p-6"
          >
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-white/50">System Version</div>
                <div className="text-lg font-light text-white">v2.5.1</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-white/50">Last Backup</div>
                <div className="text-lg font-light text-white">June 2, 2026</div>
              </div>
              <div>
                <div className="mb-1 text-xs uppercase tracking-wider text-white/50">Database Status</div>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-400" />
                  <span className="text-lg font-light text-white">Healthy</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
