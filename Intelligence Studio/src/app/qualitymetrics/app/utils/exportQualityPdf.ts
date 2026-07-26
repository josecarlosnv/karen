type PdfState = 'green' | 'yellow' | 'red';

export type PdfIndicator = {
  label: string;
  scoreText: string;
  state: PdfState;
  measure?: string;
  currentPerformance?: string | null;
};

export type PdfData = {
  eyebrow: string;      // "Quality Rating"
  heading: string;      // "Overview" / "BU Leadership"
  name: string;
  meta: string;         // "Partner · México · CIM"
  photoUrl: string;     // url .jpg
  scoreLabel: string;   // "Quality Score" / "BU Score"
  scoreText: string;    // "10%"
  fy: string;           // "2026"
  indicators: PdfIndicator[];
};

const COLORS: Record<PdfState, string> = { green: '#1DA44E', yellow: '#C9A100', red: '#D42A2A' };
const esc = (s?: string | null) =>
  (s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] as string));

export function exportQualityPdf(d: PdfData) {
  const jpg = d.photoUrl;
  const JPG = jpg.endsWith('.jpg') ? jpg.slice(0, -4) + '.JPG' : jpg;
  const sinfoto = jpg.replace(/[^/]+$/, 'sinfoto.jpg');

  const rows = d.indicators
    .map(
      (i) => `
      <div class="ind" style="border-left-color:${COLORS[i.state]}">
        <div class="ind-head">
          <span class="dot" style="background:${COLORS[i.state]}"></span>
          <span class="ind-label">${esc(i.label)}</span>
          <span class="ind-score" style="color:${COLORS[i.state]}">${esc(i.scoreText)}</span>
        </div>
        ${i.measure ? `<div class="ind-measure">${esc(i.measure)}</div>` : ''}
        ${i.currentPerformance ? `<div class="ind-cp">${esc(i.currentPerformance)}</div>` : ''}
      </div>`,
    )
    .join('');

  const html = `<!doctype html><html><head><meta charset="utf-8">
  <title>${esc(d.name)} — Quality Rating</title>
  <style>
    *{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}
    body{margin:0;font-family:'Segoe UI',Arial,sans-serif;color:#0C233C}
    .page{max-width:820px;margin:0 auto;padding:40px 44px}
    .brand{display:flex;align-items:center;justify-content:space-between;border-bottom:2px solid #00338D;padding-bottom:14px}
    .kpmg{font-weight:700;letter-spacing:.5px;color:#00338D;font-size:22px}
    .eyebrow{font-size:10px;letter-spacing:3px;color:#7089a8;text-transform:uppercase}
    .heading{font-size:16px;color:#00338D;font-weight:300;letter-spacing:2px}
    .hero{display:flex;gap:24px;align-items:center;margin:26px 0;padding:22px;border:1px solid #e4ecf6;border-radius:18px;background:linear-gradient(135deg,#f4f8ff,#fff)}
    .hero img{width:112px;height:112px;border-radius:16px;object-fit:cover;border:1px solid #dce6f2}
    .name{font-size:26px;font-weight:600;color:#00338D}
    .meta{margin-top:6px;color:#54708f;font-size:13px}
    .score{margin-left:auto;text-align:center;padding:14px 24px;border-radius:16px;background:#00338D;color:#fff}
    .score .lbl{font-size:10px;letter-spacing:2px;opacity:.85}
    .score .val{font-size:42px;font-weight:300;line-height:1;margin-top:4px}
    .sec-title{font-size:12px;letter-spacing:2px;color:#1E49E2;text-transform:uppercase;margin:22px 0 12px}
    .ind{border:1px solid #e4ecf6;border-left:4px solid #ccc;border-radius:12px;padding:12px 14px;margin-bottom:8px;page-break-inside:avoid}
    .ind-head{display:flex;align-items:center;gap:8px}
    .dot{width:9px;height:9px;border-radius:50%}
    .ind-label{font-weight:600;font-size:13px;color:#00338D}
    .ind-score{margin-left:auto;font-weight:700;font-size:13px}
    .ind-measure{font-size:11px;color:#54708f;margin-top:5px}
    .ind-cp{font-size:11px;color:#3a5573;margin-top:4px;font-style:italic}
    .foot{margin-top:26px;padding-top:12px;border-top:1px solid #e4ecf6;font-size:10px;color:#8aa;display:flex;justify-content:space-between}
    @page{margin:14mm}
  </style></head>
  <body><div class="page">
    <div class="brand">
      <div class="kpmg">KPMG</div>
      <div style="text-align:right">
        <div class="eyebrow">${esc(d.eyebrow)}</div>
        <div class="heading">${esc(d.heading)}</div>
      </div>
    </div>
    <div class="hero">
      <img src="${jpg}" onerror="if(!this.dataset.f){this.dataset.f='1';this.src='${JPG}'}else{this.onerror=null;this.src='${sinfoto}'}" />
      <div><div class="name">${esc(d.name)}</div><div class="meta">${esc(d.meta)}</div></div>
      <div class="score"><div class="lbl">${esc(d.scoreLabel)}</div><div class="val">${esc(d.scoreText)}</div></div>
    </div>
    <div class="sec-title">Quality Indicators — FY ${esc(d.fy)}</div>
    ${rows}
    <div class="foot"><span>KPMG · Leadership Quality Metrics</span><span>Generado ${new Date().toLocaleDateString('es-MX')}</span></div>
  </div>
  </body></html>`;

  const iframe = document.createElement('iframe');
  Object.assign(iframe.style, {
    position: 'fixed', right: '0', bottom: '0', width: '0', height: '0', border: '0',
  });

  iframe.onload = () => {
    const win = iframe.contentWindow;
    const img = iframe.contentDocument?.querySelector('img') as HTMLImageElement | null;
    let printed = false;
    const go = () => {
      if (printed) return;
      printed = true;
      win?.focus();
      win?.print();
      setTimeout(() => iframe.remove(), 1500);
    };
    // espera a que la foto (o su fallback a sinfoto) cargue antes de imprimir
    if (img && !img.complete) {
      img.addEventListener('load', go);
      setTimeout(go, 2000); // por si la foto nunca resuelve
    } else {
      setTimeout(go, 250);
    }
  };

  iframe.srcdoc = html;
  document.body.appendChild(iframe);

}
