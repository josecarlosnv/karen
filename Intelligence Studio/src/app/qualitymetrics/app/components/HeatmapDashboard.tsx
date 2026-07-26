import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search, ChevronDown, ChevronRight, TrendingUp, ArrowUpDown, BarChart3, Info, Save, RotateCcw, Lock, FileDown } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

import qualityBackgroundImage from '../../imports/Image__6_.jpg';
import qualityBackgroundImage2 from '../../imports/quality-bg.jpg';

import { qualificationsApi, QmHofaReportRow } from '@qm/app/api/qualificationsApi';
import { exportQualityMatrix } from '@qm/app/utils/exportQualityMatrix';

// measureDescription usa '#' como separador de renglones
const measureLines = (s: string) => (s ?? '').split('#').map((x) => x.trim()).filter(Boolean);

// exacto, sin ceros de más: 0.25 → "0.25" · 3.33 → "3.33" · 3 → "3"
const formatExact = (v: number) => String(Number(v.toFixed(2)));

const formatNumber = (v: number) => (Number.isInteger(v) ? v.toString() : v.toFixed(1));
const parseCap = (raw?: number | string | null): number | null => {
  if (raw === null || raw === undefined) return null;
  const n = Number(String(raw).replace('%', '').replace(',', '.').trim());
  return Number.isNaN(n) ? null : n;
};
const clampToCap = (score: number, cap: number | null): number => {
  if (cap === null || cap === 0) return score;
  return cap < 0 ? Math.max(cap, Math.min(0, score)) : Math.min(cap, Math.max(0, score));
};
const rowScore = (r: { indicators: { score: number }[] }) =>
  Math.max(0, Math.min(11, r.indicators.reduce((a, i) => a + (Number(i.score) || 0), 0)));

const scoreState = (score: number, target: number, cap: number | null): 'green' | 'yellow' | 'red' => {
  if (cap !== null && cap < 0) {
    if (score >= 0) return 'green';
    if (score <= -3.1) return 'red';
    return 'yellow';
  }
  if (score <= 0) return target <= 0 ? 'green' : 'red';
  if (score >= target) return 'green';   // verde solo en su máximo
  return 'yellow';
};

const stateOf = (ind: { score: number; target?: number | null; maxMeasure?: number | string | null }) =>
  scoreState(ind.score, Number(ind.target ?? 0), parseCap(ind.maxMeasure));
const dotClass = (ind: any) => {
  const s = stateOf(ind);
  return s === 'green' ? 'bg-[#1DA44E]' : s === 'yellow' ? 'bg-[#FFC000]' : 'bg-[#FF0000]';
};
const getScoreColor = (s: number) => (s >= 9 ? 'text-[#00338D]' : s >= 6.5 ? 'text-[#A66A00]' : 'text-[#C1121F]');
const getComplianceColor = (r: number) => (r >= 95 ? 'text-[#1E49E2]' : r >= 80 ? 'text-[#A66A00]' : 'text-[#C1121F]');
const isPartner = (t?: string | null) => (t ?? '').toLowerCase().includes('partner');
const isDirector = (t?: string | null) => (t ?? '').toLowerCase().includes('director');

export function HeatmapDashboard() {
  const navigate = useNavigate();

  const PHOTO_BASE =
    'https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-PerformanceSociosyDirectores/Shared%20Documents/PS01%20-%20Performance%20Socios%20y%20Directores/Fotos/';
  const PLACEHOLDER_PHOTO = `${PHOTO_BASE}sinfoto.jpg`;
  const photoUrl = (id?: string | null) => (id ? `${PHOTO_BASE}${id}.jpg` : PLACEHOLDER_PHOTO);
  const handlePhotoError = (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    if (img.src === PLACEHOLDER_PHOTO) return;          // ya es el placeholder → corta el loop
    if (img.src.endsWith('.jpg')) {                     // .jpg → prueba .JPG
      img.src = img.src.slice(0, -4) + '.JPG';
      return;
    }
    img.src = PLACEHOLDER_PHOTO;                        // .JPG también falló → sin foto
  };


  const [rows, setRows] = useState<QmHofaReportRow[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBU, setSelectedBU] = useState<string | null>(null);
  const [selectedOffice, setSelectedOffice] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'score-high' | 'score-low' | 'attention'>('score-high');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [showMetricTotals, setShowMetricTotals] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [originalScores, setOriginalScores] = useState<Record<string, Record<string, number>>>({});
  const [showChangeDetails, setShowChangeDetails] = useState(false);
  const [frozenOrder, setFrozenOrder] = useState<string[] | null>(null);

  useEffect(() => {
    qualificationsApi.pydReport().then((data) => {
      setRows(data);
      const snap: Record<string, Record<string, number>> = {};
      data.forEach((r) => {
        snap[r.employeeId] = {};
        r.indicators.forEach((i) => { snap[r.employeeId][i.indicatorsUniqueKey] = i.score; });
      });
      setOriginalScores(snap);
    }).catch(() => setRows([]));
  }, []);


  const businessUnits = useMemo(() => Array.from(new Set(rows.map((r) => r.businessUnit).filter(Boolean) as string[])), [rows]);
  const offices = useMemo(() => Array.from(new Set(rows.map((r) => r.office).filter(Boolean) as string[])), [rows]);

  const attentionCount = (r: QmHofaReportRow) => r.indicators.filter((i) => stateOf(i) !== 'green').length;

  const scoped = useMemo(() => rows.filter((r) => {
    const mBU = !selectedBU || r.businessUnit === selectedBU;
    const mOff = !selectedOffice || r.office === selectedOffice;
    const mCat = !selectedCategory
      || (selectedCategory === 'Partner' && isPartner(r.title))
      || (selectedCategory === 'Director' && isDirector(r.title));
    return mBU && mOff && mCat;
  }), [rows, selectedBU, selectedOffice, selectedCategory]);

  const filtered = useMemo(() => {
    const f = scoped.filter((r) => (r.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()));

    // en modo edición el orden queda congelado: no brinca al cambiar un score
    if (isEditMode && frozenOrder) {
      const pos = new Map(frozenOrder.map((id, i) => [id, i] as const));
      return [...f].sort((a, b) =>
        (pos.get(a.employeeId) ?? Number.MAX_SAFE_INTEGER) - (pos.get(b.employeeId) ?? Number.MAX_SAFE_INTEGER));
    }

    return [...f].sort((a, b) => {
      if (sortBy === 'score-high') return rowScore(b) - rowScore(a);
      if (sortBy === 'score-low')  return rowScore(a) - rowScore(b);
      return attentionCount(b) - attentionCount(a);
    });
  }, [scoped, searchQuery, sortBy, isEditMode, frozenOrder]);

  const avgScore = useMemo(() => scoped.length ? (scoped.reduce((s, r) => s + rowScore(r), 0) / scoped.length).toFixed(1) : '0.0', [scoped]);
  const counts = useMemo(() => ({
    partners: scoped.filter((r) => isPartner(r.title)).length,
    directors: scoped.filter((r) => isDirector(r.title)).length,
  }), [scoped]);

  const canEdit = rows.some((r) => r.canEdit);


  const updateScore = (employeeId: string, key: string, value: string) => {
    const clean = value.replace(',', '.').trim();
    const raw = clean === '' || clean === '-' ? 0 : Number(clean);
    if (Number.isNaN(raw)) return;
    setRows((prev) => prev.map((r) => r.employeeId !== employeeId ? r : {
      ...r,
      indicators: r.indicators.map((i) => i.indicatorsUniqueKey === key
        ? { ...i, score: clampToCap(raw, parseCap(i.maxMeasure)) } : i),
    }));
  };

    // Se deriva solo: comparando rows vs originalScores
  const pendingChanges = useMemo(() => {
    const out: { employeeId: string; personName: string; key: string; label: string; oldValue: number; newValue: number }[] = [];
    rows.forEach((r) =>
      r.indicators.forEach((i) => {
        const orig = originalScores[r.employeeId]?.[i.indicatorsUniqueKey] ?? 0;
        if (orig !== i.score) {
          out.push({
            employeeId: r.employeeId, personName: r.name ?? '',
            key: i.indicatorsUniqueKey, label: i.indicatorLabel,
            oldValue: orig, newValue: i.score,
          });
        }
      }),
    );
    return out;
  }, [rows, originalScores]);

  const handleDiscard = () => {
    setRows((prev) => prev.map((r) => ({
      ...r,
      indicators: r.indicators.map((i) => ({
        ...i, score: originalScores[r.employeeId]?.[i.indicatorsUniqueKey] ?? 0,
      })),
    })));
    setShowChangeDetails(false);
    setIsEditMode(false);
    setFrozenOrder(null);        // ← al descartar, vuelve a ordenarse
  };

  const handleToggleEditMode = () => {
    if (!isEditMode) {
      setFrozenOrder(filtered.map((r) => r.employeeId));   // congela el orden actual
      setIsEditMode(true);
      return;
    }
    if (pendingChanges.length === 0) { setIsEditMode(false); setFrozenOrder(null); }
  };


  const handleSave = async () => {
    setSaving(true);
    try {
      for (const r of rows) {
        for (const i of r.indicators) {
          const orig = originalScores[r.employeeId]?.[i.indicatorsUniqueKey] ?? 0;
          if (orig !== i.score) {
            await qualificationsApi.save(r.employeeId, { indicatorsUniqueKey: i.indicatorsUniqueKey, score: i.score }, 'PyD');
          }
        }
      }
      const snap: Record<string, Record<string, number>> = {};
      rows.forEach((r) => {
        snap[r.employeeId] = {};
        r.indicators.forEach((i) => { snap[r.employeeId][i.indicatorsUniqueKey] = i.score; });
      });
      setOriginalScores(snap);
      setIsEditMode(false);
      setFrozenOrder(null);      // ← al guardar, se reordena con los valores nuevos
    } finally { setSaving(false); }
  };
  const handleExportExcel = () => {
    exportQualityMatrix(filtered, {
      filename: `Heatmap_PyD_${new Date().toISOString().slice(0, 10)}`,
      totalLabel: '2PEN',
      totalOf: (r) => rowScore(r),
    });
  };

  const metricCoverage = useMemo(() => {
    // unión de los indicadores de la gente VISIBLE (IRM trae un set distinto)
    const seen = new Map<string, string>();
    scoped.forEach((r) =>          // ← antes era rows
      r.indicators.forEach((i) => {
        if (!seen.has(i.indicatorsUniqueKey)) seen.set(i.indicatorsUniqueKey, i.indicatorLabel);
      }),
    );


    return Array.from(seen.entries()).map(([key, label]) => {
      const applicable = scoped.filter((r) => r.indicators.some((i) => i.indicatorsUniqueKey === key));
      const compliant = applicable.filter((r) => {
        const ind = r.indicators.find((i) => i.indicatorsUniqueKey === key);
        return ind && stateOf(ind) === 'green';
      }).length;
      const total = applicable.length;
      return {
        key, label,
        complianceRate: total ? Math.round((compliant / total) * 100) : 0,
        compliantCount: compliant, total,
      };
    });
  }, [rows, scoped]);

  return (
    <div className="min-h-screen overflow-hidden text-[#001F5B]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248,251,255,0.58) 0%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.78) 100%), url("${qualityBackgroundImage2}")`,
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed',
      }}>
      <header className="sticky top-0 z-40 border-b border-white/45 bg-white/18 backdrop-blur-[18px]">
        <div className="mx-auto max-w-7xl px-7 py-3">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" onClick={() => navigate('/')}
                className="h-9 w-9 rounded-xl text-[#00338D] transition-all hover:bg-white/55 hover:text-[#001F5B]">
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="text-[11px] tracking-[0.32em] text-[#00338D]/50">Quality Rating</div>
                <div className="text-sm font-light tracking-[0.22em] text-[#00338D]">Heatmap</div>
              </div>
            </div>
            <div className="flex flex-1 items-center justify-end gap-2">
              <div className="relative hidden max-w-[220px] flex-1 lg:block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00338D]/35" />
                <Input placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-9 rounded-full border border-white/45 bg-white/34 pl-10 text-xs text-[#001F5B] backdrop-blur-[18px] placeholder:text-[#00338D]/32" />
              </div>
              {[
                { v: selectedBU, set: setSelectedBU, ph: 'BU', opts: businessUnits },
                { v: selectedOffice, set: setSelectedOffice, ph: 'Office', opts: offices },
              ].map((f) => (
                <div key={f.ph} className="relative">
                  <select value={f.v || ''} onChange={(e) => f.set(e.target.value || null)}
                    className="h-9 min-w-[132px] appearance-none rounded-full border border-white/45 bg-white/35 px-4 pr-9 text-xs text-[#00338D]/80 outline-none backdrop-blur-[18px] hover:bg-white/60">
                    <option value="">{f.ph}</option>
                    {f.opts.map((o) => (<option key={o} value={o}>{o}</option>))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00338D]/45" strokeWidth={1.8} />
                </div>
              ))}
              <div className="flex h-9 items-center rounded-full border border-white/45 bg-white/34 p-1 backdrop-blur-[18px]">
                {['Partner', 'Director'].map((c) => (
                  <button key={c} onClick={() => setSelectedCategory(selectedCategory === c ? null : c)}
                    className={`rounded-full px-3 py-1 text-xs transition-all ${selectedCategory === c ? 'bg-white/80 text-[#00338D]' : 'text-[#00338D]/55 hover:text-[#00338D]'}`}>
                    {c}
                  </button>
                ))}
              </div>
              <div className="relative">
                <ArrowUpDown className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#00338D]/42" />
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                  className="h-9 min-w-[128px] appearance-none rounded-full border border-white/45 bg-white/35 py-1 pl-8 pr-8 text-xs text-[#00338D]/75 outline-none backdrop-blur-[18px] hover:bg-white/60">
                  <option value="score-high">Score ↓</option>
                  <option value="score-low">Score ↑</option>
                  <option value="attention">Attention</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00338D]/45" strokeWidth={1.8} />
              </div>
              
              <Button onClick={handleExportExcel} variant="ghost"
                className="h-9 shrink-0 rounded-full border border-white/35 bg-white/25 px-4 text-xs font-normal text-[#00338D]/70 transition-all hover:bg-white/55 hover:text-[#00338D]">
                <FileDown className="mr-1.5 h-3.5 w-3.5" />Excel
              </Button>

              {canEdit && (

                <>
                  <div className="mx-1 h-6 w-px shrink-0 bg-[#00338D]/12" aria-hidden="true" />
                  <Button onClick={handleToggleEditMode} variant="ghost"
                    className={`h-9 shrink-0 rounded-full px-4 text-xs font-normal transition-all ${
                      isEditMode
                        ? 'border border-[#1E49E2]/20 bg-white/70 text-[#00338D] shadow-[0_8px_24px_rgba(0,51,141,0.10)]'
                        : 'border border-white/35 bg-white/25 text-[#00338D]/70 hover:bg-white/55 hover:text-[#00338D]'
                    }`}>
                    {isEditMode ? 'Editing' : 'Edit'}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>


      <main className="mx-auto max-w-7xl px-7 py-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}
          className="relative mb-4 overflow-hidden rounded-[2rem] border border-white/45 px-6 py-5 shadow-[0_24px_80px_rgba(0,51,141,0.22)]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,31,91,0.38) 0%, rgba(0,51,141,0.20) 42%, rgba(0,163,224,0.12) 100%), url("${qualityBackgroundImage}")`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.18),transparent_35%)]" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
          <div className="relative grid min-h-[130px] items-center gap-5 lg:grid-cols-[1fr_360px]">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/24 bg-white/12 px-3 py-1 text-[10px] tracking-[0.24em] text-white/68 backdrop-blur-xl">Current View</span>
                <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1 text-xs tracking-[0.14em] text-white/78 backdrop-blur-xl">{counts.partners} Partners</span>
                <span className="rounded-full border border-white/22 bg-white/10 px-3 py-1 text-xs tracking-[0.14em] text-white/78 backdrop-blur-xl">{counts.directors} Directors</span>
              </div>
              <div className="text-3xl font-light tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.30)]">Partners &amp; Directors</div>
              <div className="mt-2 text-sm text-white/70">{selectedOffice || 'All Offices'} · {selectedCategory || 'Partners & Directors'}</div>
            </div>
            <div className="relative justify-self-end overflow-hidden rounded-[1.55rem] border border-white/35 bg-white/18 px-6 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_18px_55px_rgba(0,31,91,0.20)] backdrop-blur-[18px] lg:w-[360px]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.10)_45%,transparent_72%)]" />
              <div className="relative">
                <div className="mb-3 flex items-center justify-center gap-2">
                  <div className="text-[10px] tracking-[0.34em] text-white/72">Average Score</div>
                  <TrendingUp className="h-4 w-4 text-white/76" strokeWidth={1.5} />
                </div>
                <motion.div key={avgScore} initial={{ opacity: 0, y: 4, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }}
                  className="text-center text-6xl font-light tracking-tight text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.38)]">
                  {avgScore}<span className="ml-1 text-2xl text-white/88">%</span>
                </motion.div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/18">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0C233C] via-[#00338D] to-[#1E49E2]"
                    animate={{ width: `${Math.min(Number(avgScore) * 10, 100)}%` }} transition={{ duration: 0.25, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.04 }}
          className={`mb-4 overflow-visible rounded-[1.45rem] border border-white/35 bg-white/22 shadow-[0_14px_42px_rgba(0,51,141,0.11)] backdrop-blur-[18px] ${showMetricTotals ? 'p-4' : 'px-4 py-3'}`}>
          <button onClick={() => setShowMetricTotals(!showMetricTotals)} className="flex w-full items-center justify-between gap-4 text-left">
            <div className="text-[11px] tracking-[0.28em] text-[#00338D]/55">Metric Coverage</div>
            <div className="flex shrink-0 items-center gap-3">
              <div className="flex items-center gap-2 rounded-full border border-white/45 bg-white/48 px-3 py-1 text-xs font-light text-[#00338D]/70">
                <BarChart3 className="h-3.5 w-3.5 text-[#1E49E2]/70" />{metricCoverage.length} metrics
              </div>
              <ChevronDown className={`h-4 w-4 text-[#00338D]/48 transition-transform ${showMetricTotals ? 'rotate-180' : ''}`} strokeWidth={1.8} />
            </div>
          </button>
          <AnimatePresence initial={false}>
            {showMetricTotals && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-visible">
                <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                  {metricCoverage.map((m) => (
                    <div key={m.key} className="relative rounded-2xl border border-white/35 bg-white/38 px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.38)]">
                      <div className="flex items-start justify-between gap-3">
                        <div className="truncate text-xs font-medium text-[#00338D]">{m.label}</div>
                        <div className={`shrink-0 text-lg font-semibold ${getComplianceColor(m.complianceRate)}`}>{m.complianceRate}%</div>
                      </div>
                      <div className="mt-2 text-[10px] text-[#00338D]/48">{m.compliantCount}/{m.total} on track</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="space-y-3">
          {filtered.map((p, index) => (
            <motion.div key={p.employeeId} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.03 }}
              className="relative overflow-visible rounded-[1.65rem] border border-white/50 bg-white/82 shadow-[0_16px_46px_rgba(0,51,141,0.12)] backdrop-blur-[18px]">
              <div className="pointer-events-none absolute inset-0 rounded-[1.65rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.18)_38%,transparent_68%)] opacity-80" />
              <button onClick={() => setExpandedRow(expandedRow === p.employeeId ? null : p.employeeId)}
                className="relative flex w-full items-center gap-6 px-6 py-5 text-left transition-all hover:bg-white/55">
                <div className="flex min-w-0 flex-1 items-center gap-5">
                  <img src={photoUrl(p.employeeId)} onError={handlePhotoError} alt={p.name ?? ''}
                    className="h-16 w-16 rounded-2xl object-cover shadow-[0_12px_30px_rgba(0,31,91,0.16)] ring-1 ring-white/80" />
                  <div className="min-w-0">
                    <div className="truncate text-[16px] font-medium tracking-[0.14em] text-[#00338d]">{p.name}</div>
                    <div className="mt-1 text-[13px] font-light tracking-[0.1em] text-[#00338D]/60">{p.title} · {p.office} · {p.businessUnit}</div>
                  </div>
                </div>
                <div className="w-24 text-left">
                  <div className={`mt-1 text-3xl font-light tracking-tight ${getScoreColor(rowScore(p))}`}>
                    {formatNumber(rowScore(p))}<span className="text-xl text-[#1E49E2]">%</span>
                  </div>
                </div>
                <div className="hidden min-w-[210px] flex-wrap items-center justify-end gap-1.5 md:flex">
                  {p.indicators.map((ind) => (
                    <div key={ind.indicatorsUniqueKey} title={`${ind.indicatorLabel}: ${ind.score}`}
                      className={`h-2.5 w-2.5 rounded-full ${dotClass(ind)}`} />
                  ))}
                </div>
                <ChevronRight className={`h-5 w-5 text-[#00338D]/34 transition-transform ${expandedRow === p.employeeId ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {expandedRow === p.employeeId && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                    className="relative border-t border-white/55 bg-white/42 backdrop-blur-[18px]">
                    <div className="p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-sm font-medium text-[#001F5B]">Quality Indicators</h3>
                        <Button onClick={(e) => { e.stopPropagation(); navigate(`/partner/${p.employeeId}`); }}
                          variant="ghost" className="rounded-full px-4 py-2 text-xs text-[#00338D]/70 hover:bg-white/70 hover:text-[#00338D]">
                          View Full Profile
                        </Button>
                      </div>
                      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
                        {p.indicators.map((ind) => (
                          <div key={ind.indicatorsUniqueKey}
                            className={`relative rounded-2xl border p-4 backdrop-blur-[18px] transition-all duration-200 ${
                              isEditMode
                                ? ind.canEdit
                                  ? 'border-[#1E49E2]/40 bg-white/92 ring-2 ring-[#1E49E2]/20 shadow-[0_10px_32px_rgba(30,73,226,0.18)]'
                                  : 'border-white/35 bg-white/40 opacity-55'
                                : 'border-white/45 bg-white/72 shadow-[0_10px_28px_rgba(0,51,141,0.08)]'
                            }`}>
                            <div className="mb-2 flex items-center gap-2">
                              <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotClass(ind)}`} />
                              <div className="truncate text-xs font-medium text-[#00338D]/78">{ind.indicatorLabel}</div>

                              {isEditMode && !ind.canEdit && (
                                <Lock className="h-3 w-3 shrink-0 text-[#00338D]/40" strokeWidth={2} />
                              )}

                              <div className="group relative ml-auto shrink-0">

                                <Info className="h-3.5 w-3.5 cursor-help text-[#1E49E2]/55 transition-colors group-hover:text-[#1E49E2]" strokeWidth={1.7} />

                                <div className="pointer-events-none absolute bottom-full right-0 z-50 mb-2 hidden w-72 rounded-2xl border border-white/70 bg-white/96 p-4 text-left shadow-[0_18px_60px_rgba(0,31,91,0.22)] backdrop-blur-[18px] group-hover:block">
                                  <div className="mb-2.5 border-b border-[#00338D]/10 pb-2 text-xs font-semibold text-[#00338D]">
                                    {ind.indicatorLabel}
                                  </div>

                                  <div className="mb-1 flex items-center gap-1.5 text-[9px] font-medium tracking-[0.18em] text-[#005EB8]">
                                    <Info className="h-3 w-3" strokeWidth={2} />
                                    MEASUREMENT
                                  </div>
                                  <p className="mb-3 whitespace-pre-line text-[11px] leading-relaxed text-[#00338D]/70">
                                    {ind.indicatorDescription}
                                  </p>

                                  <div className="mb-1 text-[9px] font-medium tracking-[0.18em] text-[#005EB8]">
                                    IMPACT
                                  </div>
                                  <div className="rounded-xl bg-[#00338D]/[0.05] px-3 py-2">
                                    {measureLines(ind.measureDescription).map((ln, i) => (
                                      <p key={i} className="text-[11px] leading-relaxed text-[#00338D]/75">{ln}</p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {isEditMode && ind.canEdit ? (
                              <div className="flex items-center rounded-xl border border-white/60 bg-white/80 px-3 py-1.5" onClick={(e) => e.stopPropagation()}>
                                <input
                                  type="number"
                                  step="0.25"
                                  value={ind.score}
                                  onChange={(e) => updateScore(p.employeeId, ind.indicatorsUniqueKey, e.target.value)}
                                  className="w-full bg-transparent text-2xl font-light text-[#001F5B] outline-none"
                                />
                                <span className="text-lg font-light text-[#1E49E2]">%</span>
                              </div>
                            ) : (
                              <div className="text-2xl font-light text-[#001F5B]">
                                {ind.score > 0 ? '+' : ''}{formatExact(ind.score)}<span className="text-lg text-[#1E49E2]">%</span>
                              </div>

                            )}


                            {ind.currentPerformance && (
                              <div className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-[#00338D]/50">{ind.currentPerformance}</div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}

          {filtered.length === 0 && (
            <div className="rounded-[1.7rem] border border-white/40 bg-white/55 p-10 text-center text-[#00338D]/65 shadow-[0_18px_55px_rgba(0,51,141,0.10)] backdrop-blur-[18px]">
              No profiles found with the selected filters.
            </div>
          )}
        </div>
      </main>

            <AnimatePresence>
        {isEditMode && pendingChanges.length > 0 && (
          <motion.div initial={{ y: 30, opacity: 0, scale: 0.98 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: 30, opacity: 0, scale: 0.98 }} transition={{ duration: 0.22 }}
            className="fixed bottom-6 right-6 z-50 w-[420px]">
            <div className="overflow-hidden rounded-[1.45rem] border border-white/55 bg-white/86 shadow-[0_24px_80px_rgba(0,31,91,0.22)] backdrop-blur-[18px]">
              <div className="flex items-center justify-between gap-4 border-b border-white/50 px-5 py-4">
                <button onClick={() => setShowChangeDetails(!showChangeDetails)} className="min-w-0 text-left">
                  <div className="font-medium text-[#001F5B]">
                    {pendingChanges.length} pending change{pendingChanges.length !== 1 ? 's' : ''}
                  </div>
                  <div className="mt-0.5 text-xs text-[#00338D]/55">Puedes seguir editando y guardar todo al final</div>
                </button>
                <button onClick={() => setShowChangeDetails(!showChangeDetails)}
                  className="rounded-lg p-2 text-[#00338D]/45 transition-all hover:bg-white/70 hover:text-[#00338D]">
                  <ChevronDown className={`h-4 w-4 transition-transform ${showChangeDetails ? 'rotate-180' : ''}`} />
                </button>
              </div>

              <AnimatePresence initial={false}>
                {showChangeDetails && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.18 }} className="max-h-56 overflow-auto">
                    <div className="space-y-1 p-3">
                      {pendingChanges.map((c) => (
                        <div key={`${c.employeeId}-${c.key}`} className="rounded-xl border border-white/55 bg-white/62 px-3 py-2 text-xs backdrop-blur-xl">
                          <div className="truncate font-medium text-[#001F5B]">{c.personName}</div>
                          <div className="mt-1 flex items-center gap-2 text-[#00338D]/70">
                            <span className="truncate text-[#00338D]/50">{c.label}</span>
                            <span className="rounded bg-[#00338D]/10 px-2 py-0.5 line-through">{formatExact(c.oldValue)}%</span>
                            <ChevronRight className="h-3 w-3 text-[#00338D]/35" />
                            <span className="rounded bg-[#1E49E2]/10 px-2 py-0.5 font-medium text-[#1E49E2]">{formatExact(c.newValue)}%</span>

                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex items-center justify-end gap-2 border-t border-white/45 bg-white/45 px-4 py-3">
                <Button onClick={handleDiscard} variant="ghost" className="h-9 rounded-full px-4 text-xs text-[#00338D]/65 hover:bg-white/75">
                  <RotateCcw className="mr-1.5 h-3.5 w-3.5" />Discard
                </Button>
                <Button onClick={handleSave} disabled={saving} className="h-9 rounded-full bg-[#00338D] px-4 text-xs text-white hover:bg-[#002B75]">
                  <Save className="mr-1.5 h-3.5 w-3.5" />{saving ? 'Saving...' : 'Save all'}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isEditMode && pendingChanges.length === 0 && (
          <motion.div initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 24, opacity: 0 }} transition={{ duration: 0.18 }}
            className="fixed bottom-6 right-6 z-50 rounded-full border border-white/55 bg-white/78 px-4 py-2 text-xs text-[#00338D]/70 shadow-[0_18px_55px_rgba(0,31,91,0.16)] backdrop-blur-[18px]">
            Edit mode active · no pending changes
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
