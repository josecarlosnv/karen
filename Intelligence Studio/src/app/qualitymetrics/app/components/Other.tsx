import { useNavigate } from 'react-router';
import { ArrowLeft, TrendingUp } from 'lucide-react';
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
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-500">
                <TrendingUp className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <h1 className="text-lg font-light text-white">Performance Evaluation</h1>
                <p className="text-xs text-white/60">Financial & Business Metrics</p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-4xl"
        >
          <div className="overflow-hidden rounded-2xl border border-[#2e5bff]/20 bg-gradient-to-br from-[#141b2d] to-[#1a2338] p-16 text-center shadow-[0_8px_30px_rgba(46,91,255,0.15)] backdrop-blur-xl">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-500 shadow-lg shadow-indigo-500/30">
              <TrendingUp className="h-10 w-10 text-white" strokeWidth={2} />
            </div>

            <h2 className="mb-4 text-3xl font-light text-white">Performance Module</h2>
            <p className="mb-8 text-lg text-white/60">
              The Performance Evaluation system is currently under development and will be available in Q3 2026.
            </p>

            <div className="mx-auto max-w-2xl space-y-4 rounded-xl border border-[#2e5bff]/20 bg-[#0f1420]/60 p-8 text-left">
              <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-white/80">
                Planned Features
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/70">Financial targets & revenue growth tracking</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/70">Client portfolio expansion metrics</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/70">Strategic partnerships & business wins</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/70">Performance benchmarking & analytics</span>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-indigo-400" />
                  <span className="text-sm text-white/70">Individual and team KPI dashboards</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <Button
                onClick={() => navigate('/')}
                className="rounded-lg border border-[#2e5bff]/30 bg-[#2e5bff] px-6 py-3 text-sm font-light text-white transition-all hover:bg-[#2e5bff]/90 hover:shadow-[0_4px_20px_rgba(46,91,255,0.4)]"
              >
                Back to Dashboard
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
