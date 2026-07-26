import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft,
  ChevronDown,
  Search,
  ChevronRight,
  Info,
  MoreVertical,
  FileDown,
  BarChart3,
  X,
} from 'lucide-react';

import { Button } from './ui/button';
import { Input } from './ui/input';
import { motion, AnimatePresence } from 'motion/react';

import qualityBackgroundImage from '../../imports/Image__6_.jpg';
import qualityBackgroundImage2 from '../../imports/quality-bg.jpg';

import { qualificationsApi, QmIndicator, QmQualPerson, QmQualScope } from '@qm/app/api/qualificationsApi';
import { exportQualityPdf } from '@qm/app/utils/exportQualityPdf';



const formatNumber = (value: number) =>
  Number.isInteger(value) ? value.toString() : value.toFixed(1);

const formatExact = (v: number) => String(Number(v.toFixed(2)));

const formatScore = (score: number) =>
  `${score > 0 ? '+' : ''}${formatExact(score)}%`;


// measureDescription usa '#' como separador de renglones
const measureLines = (s: string) =>
  (s ?? '').split('#').map((x) => x.trim()).filter(Boolean);

const parseCap = (raw?: string | null): number | null => {
  if (!raw) return null;
  const n = Number(raw.replace('%', '').replace(',', '.').trim());
  return Number.isNaN(n) ? null : n;
};

// cap < 0 -> [cap, 0] (penalización); cap > 0 -> [0, cap] (bono)
const clampToCap = (score: number, cap: number | null): number => {
  if (cap === null || cap === 0) return score;
  return cap < 0 ? Math.max(cap, Math.min(0, score)) : Math.min(cap, Math.max(0, score));
};

export function PartnerDetail() {
  const navigate = useNavigate();
  const { id } = useParams();


  // ---- Fotos (mismo esquema que Performance) ----
  const PHOTO_BASE =
    'https://spo-global.kpmg.com/sites/MX-InteligenciadeNegociosAudit-PerformanceSociosyDirectores/Shared%20Documents/PS01%20-%20Performance%20Socios%20y%20Directores/Fotos/';
  const PLACEHOLDER_PHOTO = `${PHOTO_BASE}sinfoto.jpg`;
  const photoUrl = (employeeId?: string | null) =>
    employeeId ? `${PHOTO_BASE}${employeeId}.jpg` : PLACEHOLDER_PHOTO;
  const handlePhotoError = (e: { currentTarget: HTMLImageElement }) => {
    const img = e.currentTarget;
    if (img.src === PLACEHOLDER_PHOTO) return;          // ya es el placeholder → corta el loop
    if (img.src.endsWith('.jpg')) {                     // .jpg → prueba .JPG
      img.src = img.src.slice(0, -4) + '.JPG';
      return;
    }
    img.src = PLACEHOLDER_PHOTO;                        // .JPG también falló → sin foto
  };


  // ---- Gente según scope (yo / grupo / todos) ----
  const [people, setPeople] = useState<QmQualPerson[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [canSelectUsers, setCanSelectUsers] = useState(false);

  useEffect(() => {
    qualificationsApi
      .scope()
      .then((s: QmQualScope) => {
        setPeople(s.people);
        setCanSelectUsers(s.canSelectUsers);
        const wanted =
          id && s.people.some((p) => p.employeeId === id)
            ? id
            : (s.defaultEmployeeId ?? s.people[0]?.employeeId ?? null);
        setSelectedId(wanted);
      })
      .catch(() => setPeople([]));
  }, [id]);





  const selectedPartner =
    people.find((p) => p.employeeId === selectedId) ?? null;

  // ---- Indicadores + calificaciones del líder seleccionado ----
  const [indicators, setIndicators] = useState<QmIndicator[]>([]);
  const [originalScores, setOriginalScores] = useState<Record<string, number>>({});
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    if (!selectedId) return;
    qualificationsApi
      .get(selectedId)
      .then((q) => {
        setIndicators(q.indicators);
        setCanEdit(q.canEdit);
        const map: Record<string, number> = {};
        q.indicators.forEach((i) => (map[i.indicatorsUniqueKey] = i.score));
        setOriginalScores(map);
      })
      .catch(() => {
        setIndicators([]);
        setCanEdit(false);
        setOriginalScores({});
      });
    setIsEditMode(false);
    setExpandedCard(null);
  }, [selectedId]);

  const [showSelector, setShowSelector] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [saving, setSaving] = useState(false);

  const BASE_SCORE = 10;
  const MAX_SCORE  = 11;
  const totalScore = Math.max(
    0,
    Math.min(11, indicators.reduce((acc, i) => acc + (Number(i.score) || 0), 0)),
  );





  const updateScore = (key: string, value: string) => {
    const clean = value.replace(',', '.').trim();
    const raw = clean === '' || clean === '-' ? 0 : Number(clean);
    if (Number.isNaN(raw)) return;
    setIndicators((prev) =>
      prev.map((i) =>
        i.indicatorsUniqueKey === key
          ? { ...i, score: clampToCap(raw, parseCap(i.maxMeasure)) }
          : i,
      ),
    );
  };


  const handleSave = async () => {
    if (!selectedId) return;
    setSaving(true);
    try {
      const changed = indicators.filter(
        (i) => (originalScores[i.indicatorsUniqueKey] ?? 0) !== i.score,
      );
      for (const ind of changed) {
        await qualificationsApi.save(selectedId, {
          indicatorsUniqueKey: ind.indicatorsUniqueKey,
          score: ind.score,
        });
      }
      const map: Record<string, number> = {};
      indicators.forEach((i) => (map[i.indicatorsUniqueKey] = i.score));
      setOriginalScores(map);
      setIsEditMode(false);
    } finally {
      setSaving(false);
    }
  };

    const handleCancel = () => {
    setIndicators((prev) =>
      prev.map((i) => ({ ...i, score: originalScores[i.indicatorsUniqueKey] ?? 0 })),
    );
    setIsEditMode(false);
  };


  const filteredPartners = people.filter((partner) =>
    (partner.name ?? '').toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleExportPDF = () => {
    setShowActions(false);
    if (!selectedPartner) return;
    exportQualityPdf({
      eyebrow: 'Quality Rating',
      heading: 'Overview',
      name: selectedPartner.name ?? '—',
      meta: [selectedPartner.title, selectedPartner.office, selectedPartner.businessUnit].filter(Boolean).join(' · '),
      photoUrl: photoUrl(selectedPartner.employeeId),
      scoreLabel: 'Quality Score',
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


  const handleViewReport = () => {
    navigate('/heatmap');
    setShowActions(false);
  };

  const scoreState = (
    score: number,
    target: number,
    cap: number | null,
  ): 'green' | 'yellow' | 'red' => {
    if (cap !== null && cap < 0) {
      // penalizador: 0 (su máximo) verde; baja de 0 amarillo; -3.1 rojo
      if (score >= 0) return 'green';
      if (score <= -3.1) return 'red';
      return 'yellow';
    }
    // bono: 0 con objetivo>0 → rojo (los de objetivo 0 se quedan verdes)
    if (score <= 0) return target <= 0 ? 'green' : 'red';
    if (score >= target) return 'green';   // ← antes era target/2, ahora su máximo
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



  return (
    <div
      className="min-h-screen overflow-hidden text-[#001F5B]"
      style={{
        backgroundImage: `linear-gradient(135deg, rgba(248,251,255,0.58) 0%, rgba(255,255,255,0.55) 42%, rgba(255,255,255,0.78) 100%), url("${qualityBackgroundImage2}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="sticky top-0 z-40 border-b border-white/45 bg-white/18 backdrop-blur-[18px]">
        <div className="mx-auto max-w-7xl px-7 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/')}
                className="h-9 w-9 rounded-xl text-[#00338D] transition-all hover:bg-white/55 hover:text-[#001F5B]"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>

              <div>
                <div className="text-[11px] tracking-[0.32em] text-[#00338D]/50">
                  Quality Rating
                </div>
                <div className="text-sm font-light text-[#00338D] tracking-[0.22em]">
                  Overview
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {canEdit &&
                (isEditMode ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                      variant="ghost"
                      className="rounded-full border border-white/45 bg-white/40 px-4 py-1.5 text-xs font-normal text-[#00338D] shadow-[0_8px_24px_rgba(0,51,141,0.10)] backdrop-blur-xl transition-all hover:bg-white/65 hover:text-[#001F5B]"
                    >
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      disabled={saving}
                      variant="ghost"
                      size="icon"
                      title="Cancelar cambios"
                      className="h-8 w-8 rounded-full border border-white/45 bg-white/35 text-[#00338D]/70 shadow-[0_8px_24px_rgba(0,51,141,0.08)] backdrop-blur-xl transition-all hover:bg-[#D42A2A]/10 hover:text-[#D42A2A]"
                    >
                      <X className="h-4 w-4" strokeWidth={2} />
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditMode(true)}
                    variant="ghost"
                    className="rounded-full border border-white/45 bg-white/35 px-4 py-1.5 text-xs font-normal text-[#00338D]/80 shadow-[0_8px_24px_rgba(0,51,141,0.08)] backdrop-blur-xl transition-all hover:bg-white/60 hover:text-[#001F5B]"
                  >
                    Edit
                  </Button>
                ))}

              

              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onMouseEnter={() => setShowActions(true)}
                  onMouseLeave={() => setShowActions(false)}
                  onClick={() => setShowActions(!showActions)}
                  className="h-9 w-9 rounded-xl text-[#00338D]/65 transition-all hover:bg-white/55 hover:text-[#001F5B]"
                >
                  <MoreVertical className="h-4 w-4" strokeWidth={1.6} />
                </Button>

                <AnimatePresence>
                  {showActions && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      onMouseEnter={() => setShowActions(true)}
                      onMouseLeave={() => setShowActions(false)}
                      className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-white/25 bg-white/75 shadow-[0_18px_60px_rgba(0,31,91,0.20)] backdrop-blur-[18px]"
                    >
                      <div className="py-1">
                        <button
                          onClick={handleExportPDF}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#00338D] transition-colors hover:bg-[#00A3E0]/10"
                        >
                          <FileDown className="h-4 w-4 text-[#005EB8]" strokeWidth={1.5} />
                          <span>Export PDF</span>
                        </button>

                        <button
                          onClick={handleViewReport}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[#00338D] transition-colors hover:bg-[#00A3E0]/10"
                        >
                          <BarChart3 className="h-4 w-4 text-[#005EB8]" strokeWidth={1.5} />
                          <span>View Report</span>
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
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.42 }}
          className="relative z-30 mb-6 overflow-visible rounded-[2.25rem] border border-white/45 p-6 shadow-[0_30px_100px_rgba(0,51,141,0.24)]"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0,31,91,0.30) 0%, rgba(0,51,141,0.12) 42%, rgba(0,163,224,0.10) 100%), url("${qualityBackgroundImage}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.25),transparent_35%),linear-gradient(90deg,rgba(255,255,255,0.05),rgba(255,255,255,0.10))]" />
          <div className="absolute inset-0 rounded-[2.25rem] backdrop-blur-[2px]" />

          <div className="relative grid min-h-[220px] items-center gap-6 rounded-[1.85rem] border border-white/25 bg-white/12 p-7 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_24px_80px_rgba(0,31,91,0.22)] backdrop-blur-[18px] lg:grid-cols-[1fr_290px]">
            <div className="flex items-center gap-7">
              <div className="relative shrink-0">
                <div className="absolute -inset-2 rounded-[2rem] bg-white/12 blur-xl" />
                <img
                  src={photoUrl(selectedPartner?.employeeId)}
                  onError={handlePhotoError}
                  alt={selectedPartner?.name ?? ''}
                  className="relative h-36 w-36 rounded-[1.7rem] object-cover shadow-[0_22px_55px_rgba(0,31,91,0.28)] ring-1 ring-white/70"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="relative mb-4">
                  <button
                    onClick={() => canSelectUsers && setShowSelector(!showSelector)}
                    disabled={!canSelectUsers}
                    className="group inline-flex max-w-full items-center gap-2"
                    style={{ cursor: canSelectUsers ? 'pointer' : 'default' }}
                  >
                    <h1 className="truncate text-3xl font-light tracking-tight text-white drop-shadow-[0_2px_18px_rgba(0,0,0,0.35)] transition-colors group-hover:text-[#A7E8FF]">
                      {selectedPartner?.name ?? '—'}
                    </h1>

                    {canSelectUsers && (
                      <ChevronDown
                        className={`h-5 w-5 shrink-0 text-[#005EB8]/70 transition-all group-hover:opacity-100 ${
                          showSelector ? 'rotate-180 opacity-100' : 'opacity-0'
                        }`}
                        strokeWidth={2}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {canSelectUsers && showSelector && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-0 top-full mt-3 w-96 rounded-3xl border border-[#00338D]/12 bg-white p-4 shadow-[0_28px_70px_rgba(0,31,91,0.28)]"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="relative mb-3">
                          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#005EB8]" />
                          <Input
                            placeholder="Search partners..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-2xl border-[#00338D]/12 bg-[#F4F7FB] pl-10 text-[#00338D] placeholder:text-[#00338D]/40"
                          />
                        </div>

                        <div className="max-h-72 space-y-1 overflow-auto">
                          {filteredPartners.map((partner) => (
                            <button
                              key={partner.employeeId}
                              onClick={() => {
                                setSelectedId(partner.employeeId);
                                setShowSelector(false);
                                setSearchQuery('');
                              }}
                              className={`flex w-full items-center gap-3 rounded-2xl p-3 text-left transition-all ${
                                selectedId === partner.employeeId
                                  ? 'bg-[#00A3E0]/12 ring-1 ring-[#00A3E0]/30'
                                  : 'hover:bg-[#00338D]/[0.06]'
                              }`}
                            >
                              <img
                                src={photoUrl(partner.employeeId)}
                                onError={handlePhotoError}
                                alt={partner.name ?? ''}
                                className="h-10 w-10 rounded-xl object-cover ring-1 ring-[#00338D]/10"
                              />
                              <div className="min-w-0">
                                <div className="truncate text-sm font-medium text-[#00338D]">
                                  {partner.name}
                                </div>
                                <div className="text-xs text-[#005EB8]/70">
                                  {partner.title}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
                  <span>{selectedPartner?.title ?? ''}</span>
                  <span className="text-white/40">•</span>
                  <span>{selectedPartner?.office ?? ''}</span>
                  <span className="text-white/40">•</span>
                  <span>{selectedPartner?.businessUnit ?? ''}</span>
                </div>
              </div>
            </div>

            <div className=" text-center rounded-[1.7rem] border border-white/35 bg-white/18 p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_22px_55px_rgba(0,31,91,0.22)] backdrop-blur-[18px]">
              <div className="mb-4 text-[11px] tracking-[0.30em] text-white/70">
                Quality Score
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={totalScore}
                  initial={{ opacity: 0, y: 4, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.96 }}
                  transition={{ duration: 0.18 }}
                  className="text-6xl font-light tracking-tight text-white drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)]"
                >
                  {formatNumber(totalScore)}
                  <span className="text-3xl text-white/90">%</span>
                </motion.div>
              </AnimatePresence>

              <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-white/15">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#0C233C] via-[#00338d] to-[#1E49E2]"
                  animate={{ width: `${totalScore * 10}%` }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>
        </motion.div>

        <div className="max-h-[calc(100vh-365px)] space-y-2 overflow-y-auto pr-2">
          {indicators.map((indicator, idx) => (
            <motion.div
              key={indicator.indicatorsUniqueKey}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.22, delay: idx * 0.01 }}
              className="relative overflow-hidden rounded-[1.45rem] border border-white/25 bg-white/40 shadow-[0_14px_38px_rgba(0,51,141,0.10)] backdrop-blur-[18px]"
            >
              <div className="pointer-events-none absolute inset-0 rounded-[1.45rem] bg-[linear-gradient(135deg,rgba(255,255,255,0.45),rgba(255,255,255,0.15)_35%,transparent_60%)] opacity-70" />

              <button
                onClick={() =>
                  setExpandedCard(
                    expandedCard === indicator.catIndicatorsKey
                      ? null
                      : indicator.catIndicatorsKey,
                  )
                }
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-all hover:bg-white/15"
              >
                <div className="flex min-w-0 flex-1 items-center gap-4">
                  <div
                    className={`h-2.5 w-2.5 shrink-0 rounded-full shadow-[0_0_18px_rgba(0,163,224,0.35)] ${scoreDot(
                      indicator.score,
                      indicator.target ?? 0,
                      parseCap(indicator.maxMeasure),
                    )}`}
                  />


                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-[#00338d]">
                      {indicator.indicatorLabel}
                    </div>
                    <div className="truncate text-xs text-[#00338D]/58">
                      {indicator.message || ''}
                    </div>

                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {isEditMode && indicator.canEdit ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.16 }}
                      className="flex w-24 items-center justify-end gap-1 rounded-xl border border-white/35 bg-white/46 px-2 py-1 shadow-[0_8px_24px_rgba(0,51,141,0.10)] backdrop-blur-xl"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <input
                        type="number"
                        step="0.25"
                        value={indicator.score}
                        onChange={(e) =>
                          updateScore(indicator.indicatorsUniqueKey, e.target.value)
                        }
                        className="w-14 bg-transparent text-right text-xs font-semibold text-[#00338D] outline-none"
                      />


                      <span className="text-xs font-semibold text-[#005EB8]">%</span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={indicator.score}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.18 }}
                      className={`w-12 text-right text-xs font-semibold ${scoreTextColor(
                        indicator.score,
                        indicator.target ?? 0,
                        parseCap(indicator.maxMeasure),
                      )}`}



                    >
                      {formatScore(indicator.score)}
                    </motion.div>
                  )}

                  <ChevronRight
                    className={`h-4 w-4 text-[#00338D]/38 transition-transform ${
                      expandedCard === indicator.catIndicatorsKey ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </button>

              <AnimatePresence>
                {expandedCard === indicator.catIndicatorsKey && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="border-t border-white/55 bg-white/34"
                  >
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
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
