import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, ChevronDown, Search, ChevronRight, Info, MoreVertical,
  FileDown, BarChart3, AlertCircle, Check, X, Loader2,

} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

import qualityBackgroundImage from '../../imports/Image__6_.jpg';
import qualityBackgroundImage2 from '../../imports/quality-bg.jpg';
import { exportQualityPdf } from '@qm/app/utils/exportQualityPdf';

import {
  qualificationsApi, QmIndicator, QmQualPerson, QmQualScope,
  QmWorkload, QmWorkloadPerson,
} from '@qm/app/api/qualificationsApi';

const formatNumber = (v: number) =>
  Number.isInteger(v) ? v.toString() : v.toFixed(1);
const formatExact = (v: number) => String(Number(v.toFixed(2)));
const formatScore = (s: number) => `${s > 0 ? '+' : ''}${formatExact(s)}%`;

const measureLines = (s: string) =>
  (s ?? '').split('#').map((x) => x.trim()).filter(Boolean);

const parseCap = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw.replace('%', '').replace(',', '.').trim());
  return Number.isNaN(n) ? null : n;
};
const clampToCap = (score: number, cap: number | null): number => {
  if (cap === null || cap === 0) return score;
  return cap < 0 ? Math.max(cap, Math.min(0, score)) : Math.min(cap, Math.max(0, score));
};

const scoreState = (score: number, target: number, cap: number | null): 'green' | 'yellow' | 'red' => {
  if (cap !== null && cap < 0) {
    if (score >= 0) return 'green';
    if (score <= -3.1) return 'red';
    return 'yellow';
  }
  if (score <= 0) return target <= 0 ? 'green' : 'red';
  if (score >= target) return 'green';
  return 'yellow';
};
const scoreDot = (score: number, target: number, cap: number | null) => {
  const s = scoreState(score, target, cap);
  return s === 'green' ? 'bg-[#1DA44E]' : s === 'yellow' ? 'bg-[#FFC000]' : 'bg-[#FF0000]';
};
const scoreTextColor = (score: number, target: number, cap: number | null) => {
  const s = scoreState(score, target, cap);
  return s === 'green' ? 'text-[#1DA44E]' : s === 'yellow' ? 'text-[#A66A00]' : 'text-[#FF0000]';
};

const num = (v?: number | null) => Number(v ?? 0);
const isYes = (w?: string | null) => (w ?? '').trim().toLowerCase() === 'yes';
type CvState = 'meets' | 'waivable' | 'waived' | 'none';
const cvState = (p: QmWorkloadPerson): CvState => {
  const cv = cvNum(p);
  if (cv == null) return 'none';
  if (cv === 2) return 'waivable';
  if (cv === 3 && isYes(p.waiver)) return 'waived';
  return 'meets';
};

const cvNum = (p: QmWorkloadPerson): number | null =>
  p.complianceValidation == null || `${p.complianceValidation}`.trim() === ''
    ? null
    : Number(p.complianceValidation);

const statusText = (p: QmWorkloadPerson): string => {
  const st = cvState(p);
  if (st === 'waived')   return 'Approved waiver - leadership role';   // cv = 3 por waiver
  if (st === 'meets')    return 'Compliant';                           // cv = 1 (o 3 natural)
  if (st === 'waivable') return 'Not compliant';                       // cv = 2
  return '';                                                           // sin dato
};



export function HeadOfAuditView() {
  const navigate = useNavigate();
  const { id: routeId } = useParams();     // ← agrega esta línea


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

  // Fotos de GERENTES (métrica 116) — carpeta distinta (PVIII/Scorefy)
  const MGR_PHOTO_BASE =
    'https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-AppPVIII/Shared%20Documents/PS03%20-%20Scorefy/Recursos/FotosAudit/';
  // en esta carpeta las fotos van SIN los primeros 2 dígitos del ID (52015958 → 015958)
  const mgrPhotoUrl = (id?: string | null) => {
    const clean = (id ?? '').trim();
    if (clean.length < 3) return PLACEHOLDER_PHOTO;
    return `${MGR_PHOTO_BASE}${clean.slice(2)}.jpg`;
  };
  const handleMgrPhotoError = (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    if (img.src === PLACEHOLDER_PHOTO) return;            // cae al sinfoto de socios (ese sí existe)
    if (img.src.endsWith('.jpg')) { img.src = img.src.slice(0, -4) + '.JPG'; return; }
    img.src = PLACEHOLDER_PHOTO;
  };





  const [people, setPeople] = useState<QmQualPerson[]>([]);
  const [selectedLeaderId, setSelectedLeaderId] = useState<string | null>(null);
  const [canSelectUsers, setCanSelectUsers] = useState(false);

  useEffect(() => {
    qualificationsApi.hofaScope()
      .then((s: QmQualScope) => {
        setPeople(s.people);
        setCanSelectUsers(s.canSelectUsers);
        const wanted =
          routeId && s.people.some((p) => p.employeeId === routeId)
            ? routeId
            : (s.defaultEmployeeId ?? s.people[0]?.employeeId ?? null);
        setSelectedLeaderId(wanted);
      })
      .catch(() => setPeople([]));
  }, [routeId]);


  const selectedLeader = people.find((p) => p.employeeId === selectedLeaderId) ?? null;

  const [indicators, setIndicators] = useState<QmIndicator[]>([]);
  const [originalScores, setOriginalScores] = useState<Record<string, number>>({});
  const [canEdit, setCanEdit] = useState(false);
    const [canEditWaiver, setCanEditWaiver] = useState(false);
  const [workload, setWorkload] = useState<QmWorkload>({ partnersDirectors: [], managers: [] });

  useEffect(() => {
    if (!selectedLeaderId) return;
    qualificationsApi.get(selectedLeaderId, 'HOFA')
      .then((q) => {
        setIndicators(q.indicators);
        setCanEdit(q.canEdit);
        setCanEditWaiver(q.canEditWaiver);
        const map: Record<string, number> = {};
        q.indicators.forEach((i) => (map[i.indicatorsUniqueKey] = i.score));
        setOriginalScores(map);
      })
      .catch(() => { setIndicators([]); setCanEdit(false); setOriginalScores({}); });

    qualificationsApi.workload(selectedLeaderId)
      .then(setWorkload)
      .catch(() => setWorkload({ partnersDirectors: [], managers: [] }));

    setIsEditMode(false);
    setExpandedCard(null);
  }, [selectedLeaderId]);

  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [saving, setSaving] = useState(false);
    const [waiverSavingId, setWaiverSavingId] = useState<string | null>(null);
  const [waiverSavedId, setWaiverSavedId] = useState<string | null>(null);

  const [workloadSearchQuery, setWorkloadSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const rawSum = indicators.reduce((a, i) => a + (Number(i.score) || 0), 0);
  const perfectSum = indicators.reduce((a, i) => {
    const cap = parseCap(i.maxMeasure);
    return a + (cap && cap > 0 ? cap : 0);
  }, 0);
  const totalScore = perfectSum > 0 ? Math.max(0, Math.min(10, (rawSum / perfectSum) * 10)) : 0;

  const updateScore = (key: string, value: string) => {
    const clean = value.replace(',', '.').trim();
    const raw = clean === '' || clean === '-' ? 0 : Number(clean);
    if (Number.isNaN(raw)) return;
    setIndicators((prev) =>
      prev.map((i) => (i.indicatorsUniqueKey === key
        ? { ...i, score: clampToCap(raw, parseCap(i.maxMeasure)) } : i)));
  };

  const handleSave = async () => {
    if (!selectedLeaderId) return;
    setSaving(true);
    try {
      const changed = indicators.filter((i) => (originalScores[i.indicatorsUniqueKey] ?? 0) !== i.score);
      for (const ind of changed) {
        await qualificationsApi.save(selectedLeaderId,
          { indicatorsUniqueKey: ind.indicatorsUniqueKey, score: ind.score }, 'HOFA');
      }
      const map: Record<string, number> = {};
      indicators.forEach((i) => (map[i.indicatorsUniqueKey] = i.score));
      setOriginalScores(map);
      setIsEditMode(false);
    } finally { setSaving(false); }
  };

    const handleCancel = () => {
    setIndicators((prev) =>
      prev.map((i) => ({ ...i, score: originalScores[i.indicatorsUniqueKey] ?? 0 })),
    );
    setIsEditMode(false);
  };


  const applyWaiverLocal = (employeeId: string, waiver: string, cv: number | null) => {
    setWorkload((prev) => ({
      partnersDirectors: prev.partnersDirectors.map((p) =>
        p.employeeId === employeeId ? { ...p, waiver, complianceValidation: cv } : p),
      managers: prev.managers.map((p) =>
        p.employeeId === employeeId ? { ...p, waiver, complianceValidation: cv } : p),
    }));
  };

  const toggleWaiver = async (person: QmWorkloadPerson) => {
    if (!canEditWaiver || waiverSavingId) return;
    const st = cvState(person);
    if (st === 'meets' || st === 'none') return;   // ya cumple / sin dato: bloqueado

    const next = st === 'waivable' ? 'Yes' : 'No';
    const prevWaiver = person.waiver ?? 'No';
    const prevCv = person.complianceValidation ?? null;
    const nextCv = next === 'Yes' ? 3 : 2;

    applyWaiverLocal(person.employeeId, next, nextCv);
    setWaiverSavingId(person.employeeId);
    try {
      await qualificationsApi.saveWaiver(person.employeeId, next);
      setWaiverSavedId(person.employeeId);
      setTimeout(() => setWaiverSavedId((id) => (id === person.employeeId ? null : id)), 1500);
      // el score de 115/116 se calcula en backend → refréscalo para ver moverse el semáforo
      if (selectedLeaderId) {
        qualificationsApi.get(selectedLeaderId, 'HOFA')
          .then((q) => setIndicators(q.indicators))
          .catch(() => {});
      }
    } catch {
      applyWaiverLocal(person.employeeId, prevWaiver, prevCv);   // si falla, revierte
    } finally {
      setWaiverSavingId(null);
    }
  };



  const filteredLeaders = people.filter((p) =>
    (p.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()));

  const handleExportPDF = () => {
    setShowActions(false);
    if (!selectedLeader) return;
    exportQualityPdf({
      eyebrow: 'Quality Rating',
      heading: 'BU Leadership',
      name: selectedLeader.name ?? '—',
      meta: [selectedLeader.title, selectedLeader.businessUnit, selectedLeader.office].filter(Boolean).join(' · '),
      photoUrl: photoUrl(selectedLeader.employeeId),
      scoreLabel: 'BU Score',
      scoreText: `${formatNumber(totalScore)}%`,
      fy: '2026',
      indicators: indicators.map((i) => ({
        label: i.indicatorLabel,
        scoreText: formatScore(i.score),
        state: scoreState(i.score, i.target ?? 0, parseCap(i.maxMeasure)),
        measure: measureLines(i.measureDescription).join(' · '),
        currentPerformance: i.currentPerformance,
      })),
    });
  };
  const handleViewReport = () => { navigate('/hofa-report'); setShowActions(false); };

  const renderWorkload = (list: QmWorkloadPerson[], subtitle: string, isPd: boolean) => {
    // 115 (Socios/Directores) y 116 (Gerentes) tienen categorías distintas
    const categories = isPd ? ['Partner', 'Director'] : ['Senior Manager', 'Manager'];

    // el filtro es un state compartido: si no aplica a esta lista, se comporta como "All"
    const activeCat = categories.includes(selectedCategory) ? selectedCategory : 'All';

    const filtered = list.filter((p) => {
      const s = (p.name ?? '').toLowerCase().includes(workloadSearchQuery.toLowerCase());
      const c = activeCat === 'All' || p.category === activeCat;
      return s && c;
    });

    // Compliance sale de complianceValidation (1 y 3 cumplen · 2 no · null no cuenta),
    // igual que el % con el que el backend calcula el score de la métrica.
    const evaluated = list.filter((p) => cvNum(p) != null);
    const summary = {
      compliance: evaluated.length
        ? Math.round(evaluated.filter((p) => cvNum(p) === 1 || cvNum(p) === 3).length / evaluated.length * 100)
        : 0,
      below: evaluated.filter((p) => cvNum(p) === 2).length,

      waivers: list.filter((p) => isYes(p.waiver)).length,
    };


    return (
      <div className="p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="text-sm font-medium text-[#001F5B]">Workload Details</div>
            <div className="text-xs text-[#00338D]/52">{subtitle}</div>
          </div>
          <AlertCircle className="h-4 w-4 text-[#00338D]/40" strokeWidth={1.5} />
        </div>

        <div className="mb-5 grid gap-4 md:grid-cols-3">
          {[
            ['Compliance', `${summary.compliance}%`],
            ['Below', summary.below],
            ['Waivers', summary.waivers],

            // ['Review', summary.review],   ← oculto por ahora
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/45 bg-white/72 p-4 shadow-[0_10px_28px_rgba(0,51,141,0.08)] backdrop-blur-[18px]">
              <div className="mb-1 text-[11px] tracking-[0.18em] text-[#00338D]/52">{label}</div>
              <div className="text-2xl font-light text-[#001F5B]">{value}</div>
            </div>
          ))}
        </div>

        <div className="mb-5 flex flex-wrap items-center gap-3">
          <div className="relative min-w-[220px] flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00338D]/35" />
            <Input placeholder="Search by name..." value={workloadSearchQuery}
              onChange={(e) => setWorkloadSearchQuery(e.target.value)}
              className="h-9 rounded-full border border-white/45 bg-white/50 pl-10 text-xs text-[#001F5B] backdrop-blur-[18px] placeholder:text-[#00338D]/32" />
          </div>
          <div className="relative">
            <select value={activeCat} onChange={(e) => setSelectedCategory(e.target.value)}
              className="h-9 min-w-[140px] appearance-none rounded-full border border-white/45 bg-white/38 px-4 pr-9 text-xs text-[#00338D]/78 outline-none backdrop-blur-[18px]">
              <option value="All">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#00338D]/45" strokeWidth={1.8} />
          </div>
        </div>

        <div className="max-h-96 space-y-2 overflow-auto pr-1">
          {filtered.map((person) => {
            const st = cvState(person);
            const contributes = st === 'meets' || st === 'waived';   // solo cv 1 o 3 aportan
            return (
              <div key={person.employeeId}
                className="flex items-center gap-4 rounded-2xl border border-white/45 bg-white/76 p-4 shadow-[0_10px_28px_rgba(0,51,141,0.08)] backdrop-blur-[18px]">
                <img src={isPd ? photoUrl(person.employeeId) : mgrPhotoUrl(person.employeeId)}
                  onError={isPd ? handlePhotoError : handleMgrPhotoError} alt={person.name ?? ''}
                  className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/80" />
                <div className="min-w-0 flex-1">
                  <div className="truncate font-medium text-[#00338D]">{person.name}</div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#00338D]/58">
                    <span>{person.category}</span>
                    <span>·</span>
                    <span>{num(person.totalHours).toLocaleString()} hours</span>
                    <span>·</span>
                    <span>Target {num(person.hoursTarget).toLocaleString()}</span>
                  </div>
                  {statusText(person) && (
                    <div className="mt-1 text-xs text-[#00338D]/62">{statusText(person)}</div>
                  )}
                </div>

                {/* aporte a la métrica: solo si cumple (cv 1 o waiver) */}
                <div className="w-12 shrink-0 text-right text-sm font-medium text-[#00338D]/75">
                  {contributes ? '0.5%' : ''}
                </div>

                {(() => {
                  const saving = waiverSavingId === person.employeeId;
                  const saved = waiverSavedId === person.employeeId;

                  // Ya cumple (cv 1 o 3 natural) o sin dato → el waiver no aplica: se ve "Waiver: No" pero bloqueado
                  if (st === 'meets' || st === 'none') {
                    return (
                      <div
                        title={st === 'meets'
                          ? 'Ya cumple con la métrica — no requiere waiver'
                          : 'Sin datos de cumplimiento'}
                        className="flex cursor-not-allowed select-none items-center gap-1 rounded-full border border-white/40 bg-white/40 px-3 py-1.5 text-xs font-medium text-[#00338D]/38">
                        <X className="h-3 w-3" /> Waiver: No
                      </div>
                    );
                  }

                  const waived = st === 'waived';
                  if (!canEditWaiver) {
                    return (
                      <div className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                        waived ? 'border-[#1DA44E]/18 bg-[#1DA44E]/10 text-[#087443]'
                               : 'border-[#FFC000]/25 bg-[#FFC000]/10 text-[#A66A00]'}`}>
                        Waiver: {waived ? 'Yes' : 'No'}
                      </div>
                    );
                  }

                  return (
                    <button onClick={() => toggleWaiver(person)} disabled={saving}
                      className={`flex items-center gap-1 rounded-full border px-3 py-1.5 text-xs font-medium transition-all disabled:opacity-70 ${
                        saved
                          ? 'border-[#1DA44E]/30 bg-[#1DA44E]/15 text-[#087443]'
                          : waived
                            ? 'border-[#1DA44E]/18 bg-[#1DA44E]/10 text-[#087443] hover:bg-[#1DA44E]/16'
                            : 'border-[#FFC000]/25 bg-[#FFC000]/10 text-[#A66A00] hover:bg-[#FFC000]/16'
                      }`}>
                      {saving ? (
                        <><Loader2 className="h-3 w-3 animate-spin" /> Guardando…</>
                      ) : saved ? (
                        <><Check className="h-3 w-3" /> Guardado</>
                      ) : waived ? (
                        <><Check className="h-3 w-3" /> Waiver: Yes</>
                      ) : (
                        <><X className="h-3 w-3" /> Waiver: No</>
                      )}
                    </button>
                  );
                })()}

              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="rounded-2xl border border-white/45 bg-white/60 p-6 text-center text-sm text-[#00338D]/55">
              Sin datos para esta BU.
            </div>
          )}
        </div>
      </div>
    );
  };


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
                <div className="text-sm font-light tracking-[0.22em] text-[#00338D]">Leadership</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {canEdit && (isEditMode ? (
                <>
                  <Button onClick={handleSave} disabled={saving} variant="ghost"
                    className="h-9 rounded-full border border-white/45 bg-white/70 px-4 text-xs font-normal text-[#00338D] shadow-[0_8px_24px_rgba(0,51,141,0.10)]">
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                  <Button onClick={handleCancel} disabled={saving} variant="ghost" size="icon" title="Cancelar cambios"
                    className="h-8 w-8 rounded-full border border-white/45 bg-white/35 text-[#00338D]/70 backdrop-blur-xl transition-all hover:bg-[#D42A2A]/10 hover:text-[#D42A2A]">
                    <X className="h-4 w-4" strokeWidth={2} />
                  </Button>
                </>
              ) : (

                <Button onClick={() => setIsEditMode(true)} variant="ghost"
                  className="h-9 rounded-full border border-white/35 bg-white/25 px-4 text-xs font-normal text-[#00338D]/70 hover:bg-white/55 hover:text-[#00338D]">
                  Edit
                </Button>
              ))}
              <div className="relative">
                <Button variant="ghost" size="icon"
                  onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
                  onClick={() => setShowActions(!showActions)}
                  className="h-9 w-9 rounded-xl text-[#00338D]/65 transition-all hover:bg-white/55 hover:text-[#001F5B]">
                  <MoreVertical className="h-4 w-4" strokeWidth={1.6} />
                </Button>
                <AnimatePresence>
                  {showActions && (
                    <motion.div initial={{ opacity: 0, y: -8, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }} transition={{ duration: 0.15 }}
                      onMouseEnter={() => setShowActions(true)} onMouseLeave={() => setShowActions(false)}
                      className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/25 bg-white/75 shadow-[0_18px_60px_rgba(0,31,91,0.20)] backdrop-blur-[18px]">
                      <div className="py-1">
                        <button onClick={handleExportPDF}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#00338D] transition-colors hover:bg-[#00A3E0]/10">
                          <FileDown className="h-4 w-4 text-[#005EB8]" strokeWidth={1.5} /><span>Download PDF</span>
                        </button>
                        <button onClick={handleViewReport}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#00338D] transition-colors hover:bg-[#00A3E0]/10">
                          <BarChart3 className="h-4 w-4 text-[#005EB8]" strokeWidth={1.5} /><span>View Report</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-7 py-7">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.42 }}
          className="relative z-30 mb-6 overflow-visible rounded-[2.25rem] border border-white/45 p-6 shadow-[0_30px_100px_rgba(0,51,141,0.24)]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,31,91,0.32) 0%, rgba(0,51,141,0.14) 45%, rgba(0,163,224,0.10) 100%), url("${qualityBackgroundImage}")`,
            backgroundSize: 'cover', backgroundPosition: 'center',
          }}>
          <div className="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.22),transparent_35%)]" />
          <div className="absolute inset-0 rounded-[2.25rem] backdrop-blur-[2px]" />
          <div className="relative grid min-h-[150px] items-center gap-6 rounded-[1.85rem] border border-white/25 bg-white/12 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_80px_rgba(0,31,91,0.22)] backdrop-blur-[18px] lg:grid-cols-[1fr_340px]">
            <div className="flex items-center gap-5">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-[2rem] bg-white/12 blur-xl" />
                <img src={photoUrl(selectedLeader?.employeeId)} onError={handlePhotoError} alt={selectedLeader?.name ?? ''}
                  className="relative h-24 w-24 rounded-[1.7rem] object-cover shadow-[0_22px_55px_rgba(0,31,91,0.28)] ring-1 ring-white/70" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="relative mb-4">
                  <button onClick={() => canSelectUsers && setShowSelector(!showSelector)} disabled={!canSelectUsers}
                    className="group inline-flex max-w-full items-center gap-2"
                    style={{ cursor: canSelectUsers ? 'pointer' : 'default' }}>
                    <h1 className="truncate text-2xl font-light tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] transition-colors group-hover:text-[#A7E8FF]">
                      {selectedLeader?.name ?? '—'}
                    </h1>
                    {canSelectUsers && (
                      <ChevronDown className={`h-5 w-5 shrink-0 text-white/70 transition-all group-hover:opacity-100 ${showSelector ? 'rotate-180 opacity-100' : 'opacity-0'}`} strokeWidth={2} />
                    )}
                  </button>
                  <AnimatePresence>
                    {canSelectUsers && showSelector && (
                      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-3 w-96 rounded-3xl border border-[#00338D]/12 bg-white p-4 shadow-[0_28px_70px_rgba(0,31,91,0.28)]" style={{ zIndex: 1000 }}>
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#005EB8]" />
                          <Input placeholder="Search BU PICs..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-2xl border-[#00338D]/12 bg-[#F4F7FB] pl-10 text-[#00338D] placeholder:text-[#00338D]/40" />
                        </div>
                        <div className="max-h-72 space-y-1 overflow-auto">
                          {filteredLeaders.map((leader) => (
                            <button key={leader.employeeId}
                              onClick={() => { setSelectedLeaderId(leader.employeeId); setShowSelector(false); setSearchQuery(''); }}
                              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                                selectedLeaderId === leader.employeeId
                                  ? 'bg-[#00A3E0]/12 ring-1 ring-[#00A3E0]/30'
                                  : 'hover:bg-[#00338D]/[0.06]'
                              }`}
>
                              <img src={photoUrl(leader.employeeId)} onError={handlePhotoError} alt={leader.name ?? ''}
                                className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#00338D]/10" />
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[#00338D]">{leader.name}</div>
                                <div className="text-xs text-[#005EB8]/70">{leader.title} · {leader.businessUnit}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-base text-white/82">
                  <span>{selectedLeader?.title ?? ''}</span><span className="text-white/38">•</span>
                  <span>{selectedLeader?.businessUnit ?? ''}</span><span className="text-white/38">•</span>
                  <span>{selectedLeader?.office ?? ''}</span>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[1.65rem] border border-white/35 bg-white/18 px-6 py-6 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.42),0_18px_55px_rgba(0,31,91,0.20)] backdrop-blur-[18px]">
              <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.10)_45%,transparent_72%)]" />
              <div className="relative">
                <div className="mb-3 text-[11px] tracking-[0.34em] text-white/72">BU Score</div>
                <AnimatePresence mode="wait">
                  <motion.div key={totalScore} initial={{ opacity: 0, y: 4, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.18 }}
                    className="text-5xl font-light tracking-tight text-white drop-shadow-[0_2px_22px_rgba(0,0,0,0.38)]">
                    {formatNumber(totalScore)}<span className="ml-1 text-3xl text-white/88">%</span>
                  </motion.div>
                </AnimatePresence>
                <div className="mx-auto mt-5 h-2.5 w-[86%] overflow-hidden rounded-full bg-white/18">
                  <motion.div className="h-full rounded-full bg-gradient-to-r from-[#0C233C] via-[#00338D] to-[#1E49E2]"
                    animate={{ width: `${totalScore * 10}%` }} transition={{ duration: 0.25, ease: 'easeOut' }} />
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="space-y-3">
          {indicators.map((indicator) => {
            const isPdWorkload = indicator.indicatorsUniqueKey.startsWith('115-');
            const isMgrWorkload = indicator.indicatorsUniqueKey.startsWith('116-');
            const isWorkload = isPdWorkload || isMgrWorkload;
            const target = indicator.target ?? 0;
            const cap = parseCap(indicator.maxMeasure);
            return (
              <motion.div key={indicator.indicatorsUniqueKey} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}
                className="relative overflow-hidden rounded-[1.55rem] border border-white/50 bg-white/40 shadow-[0_16px_46px_rgba(0,51,141,0.12)] backdrop-blur-[18px]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.72),rgba(255,255,255,0.18)_38%,transparent_68%)] opacity-80" />
                <button onClick={() => setExpandedCard(expandedCard === indicator.catIndicatorsKey ? null : indicator.catIndicatorsKey)}
                  className="relative flex w-full items-center justify-between gap-5 px-6 py-5 text-left transition-all hover:bg-white/55">
                  <div className="flex min-w-0 flex-1 items-center gap-4">
                    <div className={`h-2.5 w-2.5 shrink-0 rounded-full ${scoreDot(indicator.score, target, cap)}`} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-medium text-[#00338D]">{indicator.indicatorLabel}</div>
                      <div className="truncate text-xs text-[#00338D]/58">
                        {indicator.message || ''}
                      </div>
                    </div>

                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {isEditMode && indicator.canEdit ? (
                      <div className="flex w-24 items-center justify-end gap-1 rounded-xl border border-white/55 bg-white/60 px-2 py-1 backdrop-blur-xl" onClick={(e) => e.stopPropagation()}>
                        <input type="number" step="0.25"
                          value={indicator.score}
                          onChange={(e) => updateScore(indicator.indicatorsUniqueKey, e.target.value)}
                          className="w-14 bg-transparent text-right text-xs font-semibold text-[#00338D] outline-none" />

                        <span className="text-xs font-semibold text-[#1E49E2]">%</span>
                      </div>
                    ) : (
                      <div className={`w-14 text-right text-sm font-semibold ${scoreTextColor(indicator.score, target, cap)}`}>{formatScore(indicator.score)}</div>
                    )}
                    <ChevronRight className={`h-5 w-5 text-[#00338D]/34 transition-transform ${expandedCard === indicator.catIndicatorsKey ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                <AnimatePresence>
                  {expandedCard === indicator.catIndicatorsKey && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}
                      className="relative border-t border-white/55 bg-white/42 backdrop-blur-[18px]">
                      {isWorkload ? (
                        renderWorkload(
                          isPdWorkload ? workload.partnersDirectors : workload.managers,
                          isPdWorkload ? 'Partners & Directors' : 'Managers',
                          isPdWorkload,
                        )

                      ) : (
                        <div className="grid gap-4 p-5 text-sm text-[#001F5B]/75">
                          <div>
                            <div className="mb-1 flex items-center gap-2 text-[11px] tracking-[0.24em] text-[#005EB8]">
                              <Info className="h-3.5 w-3.5" />
                              Measurement
                            </div>
                            <p className="leading-relaxed whitespace-pre-line">
                              {indicator.indicatorDescription}
                            </p>
                          </div>

                          {indicator.currentPerformance && (
                            <div>
                              <div className="mb-1 text-[11px] tracking-[0.24em] text-[#00338D]/45">
                                Current Performance
                              </div>
                              <p className="leading-relaxed">
                                {indicator.currentPerformance}
                              </p>
                            </div>
                          )}

                          <div className="rounded-2xl border border-white/35 bg-white/36 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] backdrop-blur-xl">
                            <div className="mb-1 text-[11px] tracking-[0.24em] text-[#005EB8]">
                              Impact
                            </div>
                            {measureLines(indicator.measureDescription).map((ln, i) => (
                              <p key={i} className="leading-relaxed text-[#001F5B]/75">
                                {ln}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}

                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
