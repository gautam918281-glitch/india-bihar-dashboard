/**
 * Citizen Dashboard — progressive UI
 * Layer 1: KPI cards + sparkline
 * Layer 2: SmartArt flow
 * Layer 3: Analysis charts (location-aware)
 * Modal: meaning + indicator-specific chart
 */
let currentLocation = 'india';

/** Load indicators from backend API when CONFIG.USE_API is true */
async function loadFromAPI() {
  if (typeof CONFIG === 'undefined' || !CONFIG.USE_API) return false;
  try {
    const base = CONFIG.API_BASE.replace(/\/$/, '');
    const [indiaRes, brRes] = await Promise.all([
      fetch(base + '/api/indicators/india'),
      fetch(base + '/api/indicators/br')
    ]);
    if (!indiaRes.ok || !brRes.ok) throw new Error('API not reachable');
    const indiaData = await indiaRes.json();
    const brData = await brRes.json();

    // Convert API format → frontend INDICATORS format
    function mapIndicators(apiObj) {
      const out = {};
      const src = apiObj.indicators || {};
      for (const code of Object.keys(src)) {
        const r = src[code];
        out[code] = {
          id: code,
          name: { en: code, hi: code },  // names still from local if needed
          value: r.value != null ? String(r.value) : '—',
          previous: r.previous != null ? String(r.previous) : '—',
          change: r.change || null,
          unit: r.unit || '%',
          period: r.period || '',
          lastUpdated: r.lastUpdated || '',
          source: r.source || '',
          sourceUrl: r.sourceUrl || '',
          frequency: r.frequency || '',
          status: r.status || 'live',
          definition: (INDICATORS.india && INDICATORS.india[code] && INDICATORS.india[code].definition) || '',
          citizenWhy: (INDICATORS.india && INDICATORS.india[code] && INDICATORS.india[code].citizenWhy) || ''
        };
      }
      return out;
    }

    if (indiaData.indicators) INDICATORS.india = { ...INDICATORS.india, ...mapIndicators(indiaData) };
    if (brData.indicators) INDICATORS.br = { ...INDICATORS.br, ...mapIndicators(brData) };
    console.log('Loaded live data from API');
    return true;
  } catch (err) {
    console.warn('API load failed, using local data.js:', err.message);
    return false;
  }
}

let chartTrend = null, chartBar = null, chartInflation = null, chartDetail = null;

const SMART_FLOW = [
  { id: 'literacy', en: 'Education', hi: 'शिक्षा', icon: '📚' },
  { id: 'unemployment', en: 'Jobs', hi: 'रोज़गार', icon: '👷' },
  { id: 'poverty', en: 'Income / Poverty', hi: 'गरीबी', icon: '🏠' },
  { id: 'electricity', en: 'Facilities', hi: 'सुविधा', icon: '⚡' },
  { id: 'lifeExpectancy', en: 'Health', hi: 'स्वास्थ्य', icon: '🏥' },
  { id: 'inflation', en: 'Prices', hi: 'महँगाई', icon: '🛒' }
];

function initTheme() {
  const saved = localStorage.getItem('idcr-theme');
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  applyTheme(saved || (dark ? 'dark' : 'light'));
  document.getElementById('theme-toggle').onclick = () =>
    applyTheme(document.documentElement.classList.contains('dark') ? 'light' : 'dark');
}
function applyTheme(theme) {
  document.documentElement.classList.toggle('dark', theme === 'dark');
  localStorage.setItem('idcr-theme', theme);
  setTimeout(() => { renderCharts(); if (chartDetail) openDetailChart(window._detailKey); }, 40);
}

function fillStateSelect() {
  const sel = document.getElementById('state-select');
  if (!sel) return;
  const prev = sel.value;
  let html = '<option value="">' + t('pick_state') + '</option>';
  STATES.forEach(s => {
    html += '<option value="' + s.id + '">' + (currentLang === 'hi' ? s.hi : s.en) + '</option>';
  });
  sel.innerHTML = html;
  if (prev) sel.value = prev;
}

function placeName() {
  if (currentLocation === 'india') return t('india');
  const s = STATES.find(x => x.id === currentLocation);
  return s ? (currentLang === 'hi' ? s.hi : s.en) : currentLocation;
}

function setLocation(loc) {
  currentLocation = loc;
  const btn = document.getElementById('btn-india');
  const sel = document.getElementById('state-select');
  if (loc === 'india') {
    btn.className = 'sm:w-48 rounded-xl border-2 border-navy-800 bg-navy-800 text-white px-4 py-3 text-left font-semibold text-sm shadow-sm';
    if (sel) sel.value = '';
  } else {
    btn.className = 'sm:w-48 rounded-xl border-2 border-slate-200 dark:border-navy-700 bg-white dark:bg-navy-900 text-slate-900 dark:text-slate-100 px-4 py-3 text-left font-semibold text-sm shadow-sm';
    if (sel) sel.value = loc;
  }
  document.getElementById('current-place').textContent = t('showing') + ' ' + placeName();
  renderKPIs();
  renderSmartArt();
  renderCompare();
  renderCharts();
}
function onStateChange(v) { setLocation(v || 'india'); }

function sparkPoints(values, w, h) {
  const nums = (values || []).filter(v => v != null && !isNaN(v));
  if (nums.length < 2) return '';
  const min = Math.min(...nums), max = Math.max(...nums);
  const span = max - min || 1;
  return values.map((v, i) => {
    if (v == null || isNaN(v)) return null;
    const x = (i / (values.length - 1)) * w;
    const y = h - ((v - min) / span) * (h - 4) - 2;
    return x.toFixed(1) + ',' + y.toFixed(1);
  }).filter(Boolean).join(' ');
}

function renderKPIs() {
  const grid = document.getElementById('kpi-grid');
  if (!grid) return;
  const data = INDICATORS[currentLocation] || {};
  grid.innerHTML = Object.keys(data).map(k => {
    const ind = data[k];
    const name = (ind.name && (ind.name[currentLang] || ind.name.en)) || k;
    const show = ind.value === '—' ? t('unavailable') : ind.value;
    const series = (typeof getChartSeries === 'function') ? getChartSeries(currentLocation, k) : null;
    let spark = '';
    if (series && series.values && series.values.filter(v => v != null).length >= 2) {
      const pts = sparkPoints(series.values, 80, 28);
      spark = '<svg class="mt-2 w-full max-w-[100px] h-7 text-navy-700 dark:text-indigo-400" viewBox="0 0 80 28" preserveAspectRatio="none"><polyline fill="none" stroke="currentColor" stroke-width="2" points="' + pts + '"/></svg>';
    }
    return (
      '<article class="kpi-card group rounded-2xl border border-slate-200/90 dark:border-navy-800 bg-white dark:bg-navy-900 p-4 cursor-pointer shadow-sm hover:shadow-md hover:border-navy-300 dark:hover:border-indigo-600 transition" ' +
      'onclick="openDetail(\'' + currentLocation + '\',\'' + k + '\')" role="button" tabindex="0">' +
      '<div class="flex justify-between gap-2">' +
      '<h3 class="font-semibold text-sm text-slate-800 dark:text-slate-100">' + name + '</h3>' +
      (ind.status === 'live'
        ? '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40">LIVE</span>'
        : '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-900/40">DEMO</span>') +
      '</div>' +
      '<div class="mt-2 text-2xl font-bold tracking-tight">' + show +
      (ind.value !== '—' && ind.unit ? ' <span class="text-sm font-medium text-slate-500">' + ind.unit + '</span>' : '') + '</div>' +
      (ind.change ? '<div class="text-xs text-slate-500 mt-0.5">' + ind.change + '</div>' : '') +
      spark +
      '<div class="mt-3 flex items-center justify-between text-[11px] text-slate-500">' +
      '<span class="truncate max-w-[70%]">' + (ind.source || '') + '</span>' +
      '<span class="text-navy-700 dark:text-indigo-400 font-medium group-hover:underline">' + t('view_details') + '</span></div></article>'
    );
  }).join('');
}

function renderSmartArt() {
  const el = document.getElementById('smartart');
  if (!el) return;
  el.innerHTML = SMART_FLOW.map((n, i) => {
    const label = currentLang === 'hi' ? n.hi : n.en;
    const arrow = i < SMART_FLOW.length - 1
      ? '<span class="text-slate-300 dark:text-navy-700 text-lg px-0.5 hidden sm:inline">→</span><span class="text-slate-300 sm:hidden w-full text-center text-xs">↓</span>'
      : '';
    return (
      '<button type="button" onclick="openDetail(currentLocation,\'' + n.id + '\')" ' +
      'class="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-700 bg-slate-50 dark:bg-navy-950/50 hover:border-saffron-500 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition text-left">' +
      '<span class="text-base">' + n.icon + '</span>' +
      '<span class="text-xs font-semibold whitespace-nowrap">' + label + '</span></button>' + arrow
    );
  }).join('');
}

function renderCompare() {
  const body = document.getElementById('compare-body');
  if (!body) return;
  const keys = ['literacy', 'inflation', 'unemployment', 'poverty'];
  body.innerHTML = keys.map(k => {
    const a = INDICATORS.india && INDICATORS.india[k];
    const b = INDICATORS[currentLocation] && INDICATORS[currentLocation][k];
    if (!a) return '';
    const label = (a.name && (a.name[currentLang] || a.name.en)) || k;
    const iv = a.value === '—' ? '—' : a.value + (a.unit ? ' ' + a.unit : '');
    const sv = currentLocation === 'india' ? '—' : (b && b.value !== '—' ? b.value + (b.unit ? ' ' + b.unit : '') : '—');
    return '<tr class="border-t border-slate-100 dark:border-navy-800"><td class="px-4 py-2.5 font-medium text-xs sm:text-sm">' + label +
      '</td><td class="px-4 py-2.5 text-xs sm:text-sm">' + iv + '</td><td class="px-4 py-2.5 text-xs sm:text-sm">' + sv + '</td></tr>';
  }).join('');
}

function colors() {
  const dark = document.documentElement.classList.contains('dark');
  return {
    text: dark ? '#e2e8f0' : '#334155',
    grid: dark ? 'rgba(148,163,184,0.12)' : 'rgba(148,163,184,0.22)',
    navy: '#4338ca',
    orange: '#ea580c'
  };
}
function kill(c) { if (c) try { c.destroy(); } catch (e) {} }

function renderCharts() {
  if (typeof Chart === 'undefined') return;
  const c = colors();
  const loc = currentLocation;

  let trendKey = 'literacy';
  let series = getChartSeries(loc, 'literacy');
  if (!series.values || series.values.every(v => v == null)) {
    series = getChartSeries('india', 'literacy');
  }
  const t1 = document.getElementById('chart1-title');
  if (t1) t1.textContent = (currentLang === 'hi' ? 'साक्षरता रुझान — ' : 'Literacy trend — ') + placeName();

  kill(chartTrend);
  const ctx1 = document.getElementById('chart-trend');
  if (ctx1) {
    chartTrend = new Chart(ctx1, {
      type: 'line',
      data: {
        labels: series.labels,
        datasets: [{
          data: series.values,
          borderColor: c.navy,
          backgroundColor: 'rgba(67,56,202,0.1)',
          fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: c.navy
        }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false }, tooltip: { callbacks: { label: x => x.parsed.y != null ? x.parsed.y + (series.unit ? ' ' + series.unit : '') : 'N/A' } } },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 10 } } },
          y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 10 } } }
        }
      }
    });
  }

  const keys = ['literacy', 'poverty', 'unemployment', 'inflation'];
  const labels = [], iv = [], sv = [];
  keys.forEach(k => {
    const a = INDICATORS.india && INDICATORS.india[k];
    const b = INDICATORS[loc] && INDICATORS[loc][k];
    if (!a) return;
    labels.push((a.name && (a.name[currentLang] || a.name.en)) || k);
    iv.push(a.value === '—' ? null : parseFloat(a.value));
    sv.push(loc === 'india' || !b || b.value === '—' ? null : parseFloat(b.value));
  });
  kill(chartBar);
  const ctx2 = document.getElementById('chart-bar');
  if (ctx2) {
    chartBar = new Chart(ctx2, {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: currentLang === 'hi' ? 'भारत' : 'India', data: iv, backgroundColor: 'rgba(67,56,202,0.8)', borderRadius: 6 },
          { label: loc === 'india' ? (currentLang === 'hi' ? 'राज्य चुनें' : 'Select state') : placeName(), data: sv, backgroundColor: 'rgba(234,88,12,0.8)', borderRadius: 6 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { position: 'bottom', labels: { color: c.text, boxWidth: 10, font: { size: 10 } } } },
        scales: {
          x: { grid: { display: false }, ticks: { color: c.text, font: { size: 9 } } },
          y: { grid: { color: c.grid }, ticks: { color: c.text, font: { size: 10 } }, beginAtZero: true }
        }
      }
    });
  }

  const inf = getChartSeries('india', 'inflation');
  const t3 = document.getElementById('chart3-title');
  if (t3) t3.textContent = currentLang === 'hi' ? 'भारत — महँगाई (राष्ट्रीय संदर्भ)' : 'India — Inflation (national reference)';
  kill(chartInflation);
  const ctx3 = document.getElementById('chart-inflation');
  if (ctx3) {
    chartInflation = new Chart(ctx3, {
      type: 'line',
      data: {
        labels: inf.labels,
        datasets: [{ data: inf.values, borderColor: c.orange, backgroundColor: 'rgba(234,88,12,0.1)', fill: true, tension: 0.35, pointRadius: 3 }]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: c.grid }, ticks: { color: c.text } },
          y: { grid: { color: c.grid }, ticks: { color: c.text } }
        }
      }
    });
  }
}

function openDetailChart(key) {
  if (!key || typeof Chart === 'undefined') return;
  const c = colors();
  let series = getChartSeries(currentLocation, key);
  if (!series.values || series.values.every(v => v == null)) series = getChartSeries('india', key);
  kill(chartDetail);
  const ctx = document.getElementById('chart-detail');
  if (!ctx) return;
  const has = series.values && series.values.some(v => v != null);
  chartDetail = new Chart(ctx, {
    type: 'line',
    data: {
      labels: has ? series.labels : ['—'],
      datasets: [{
        data: has ? series.values : [null],
        borderColor: c.navy,
        backgroundColor: 'rgba(67,56,202,0.1)',
        fill: true, tension: 0.35, pointRadius: 4
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        title: has ? undefined : { display: true, text: currentLang === 'hi' ? 'इस राज्य के लिए श्रृंखला जल्द' : 'Series when data connected', font: { size: 11 } }
      },
      scales: {
        x: { grid: { color: c.grid }, ticks: { color: c.text } },
        y: { grid: { color: c.grid }, ticks: { color: c.text } }
      }
    }
  });
}

function openDetail(loc, key) {
  const ind = INDICATORS[loc] && INDICATORS[loc][key];
  if (!ind) return;
  window._detailKey = key;
  const name = (ind.name && (ind.name[currentLang] || ind.name.en)) || key;
  document.getElementById('modal-title').textContent = name;
  document.getElementById('modal-body').innerHTML =
    (ind.status === 'live'
      ? '<div class="text-[10px] font-bold text-emerald-700 bg-emerald-50 dark:bg-emerald-950/40 inline-block px-2 py-0.5 rounded">LIVE — Official data</div>'
      : '<div class="text-[10px] font-bold text-amber-700 bg-amber-50 dark:bg-amber-950/40 inline-block px-2 py-0.5 rounded">' + t('demo_notice') + '</div>') +
    '<div class="grid grid-cols-2 gap-3 pt-1">' +
    '<div><div class="text-[11px] text-slate-500">Current</div><div class="text-2xl font-bold">' + ind.value + ' <span class="text-sm font-medium text-slate-500">' + (ind.unit || '') + '</span></div></div>' +
    '<div><div class="text-[11px] text-slate-500">' + t('previous') + '</div><div class="text-xl font-semibold">' + (ind.previous || '—') + '</div></div></div>' +
    '<p class="text-xs text-slate-500"><strong>' + t('period') + ':</strong> ' + ind.period + ' · <strong>' + t('source') + ':</strong> ' + ind.source + '</p>' +
    '<div class="rounded-lg bg-slate-50 dark:bg-navy-950/40 p-3"><h4 class="font-semibold text-xs mb-1">' + t('what_means') + '</h4><p class="text-sm leading-relaxed">' + ind.definition + '</p></div>' +
    '<div class="rounded-lg bg-indigo-50 dark:bg-indigo-950/20 p-3"><h4 class="font-semibold text-xs mb-1">' + t('why_care') + '</h4><p class="text-sm leading-relaxed">' + ind.citizenWhy + '</p></div>' +
    '<a class="text-xs text-navy-700 dark:text-indigo-400 underline" href="' + ind.sourceUrl + '" target="_blank" rel="noopener">' + t('official_source') + ': ' + ind.source + '</a>';
  const m = document.getElementById('detail-modal');
  m.classList.remove('hidden'); m.classList.add('flex');
  setTimeout(() => openDetailChart(key), 30);
}
function closeModal() {
  const m = document.getElementById('detail-modal');
  m.classList.add('hidden'); m.classList.remove('flex');
  kill(chartDetail); chartDetail = null;
}
document.getElementById('detail-modal')?.addEventListener('click', e => { if (e.target.id === 'detail-modal') closeModal(); });

function renderAll() {
  fillStateSelect();
  document.getElementById('current-place').textContent = t('showing') + ' ' + placeName();
  renderKPIs();
  renderSmartArt();
  renderCompare();
  renderCharts();
}

document.addEventListener('DOMContentLoaded', async () => {
  initTheme();
  setLang(localStorage.getItem('idcr-lang') || 'hi');
  await loadFromAPI();   // try backend first, fallback to data.js
  renderAll();
  setLocation('india');
});
