/* =============================================================
   dash-interactions.js
   Componentes: drawer, modal, toast, tooltip, mockAction.
   Data mock e handlers específicos por seção do recycler.html.
   Vanilla ES5+ compatível. Bilíngue via <span lang="pt|en">.
   ============================================================= */
(function () {
  'use strict';

  /* ---------------- helpers ---------------- */
  function el(html) {
    var t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function bi(pt, en) {
    return '<span lang="pt">' + pt + '</span><span lang="en">' + en + '</span>';
  }
  function pickText(pt, en) {
    var lang = document.documentElement.getAttribute('data-app-lang') || 'en';
    return lang === 'pt' ? pt : en;
  }
  function delayMs() { return 800 + Math.floor(Math.random() * 700); }

  /* ---------------- overlay + host containers ---------------- */
  var overlay = el('<div class="dash-overlay" aria-hidden="true"></div>');
  var toasts = el('<div class="dash-toasts" aria-live="polite" aria-atomic="true"></div>');
  document.addEventListener('DOMContentLoaded', function () {
    document.body.appendChild(overlay);
    document.body.appendChild(toasts);
    overlay.addEventListener('click', closeAll);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll();
    });
    bootstrap();
  });

  function openOverlay() {
    overlay.classList.add('on');
    document.body.classList.add('dash-lock');
  }
  function closeOverlay() {
    overlay.classList.remove('on');
    document.body.classList.remove('dash-lock');
  }

  /* ---------------- DRAWER ---------------- */
  var currentDrawer = null;
  function openDrawer(cfg) {
    closeAll();
    var d = el(
      '<aside class="dash-drawer" role="dialog" aria-modal="true">' +
        '<div class="dash-drawer-head">' +
          '<div>' +
            (cfg.eyebrow ? '<span class="dash-drawer-eyebrow">' + cfg.eyebrow + '</span>' : '') +
            '<h3>' + cfg.title + '</h3>' +
            (cfg.subtitle ? '<p>' + cfg.subtitle + '</p>' : '') +
          '</div>' +
          '<button type="button" class="dash-close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="dash-drawer-body"></div>' +
        (cfg.footer ? '<div class="dash-drawer-foot"></div>' : '') +
      '</aside>'
    );
    d.querySelector('.dash-drawer-body').innerHTML = cfg.body || '';
    if (cfg.footer) d.querySelector('.dash-drawer-foot').innerHTML = cfg.footer;
    d.querySelector('.dash-close').addEventListener('click', closeAll);
    document.body.appendChild(d);
    openOverlay();
    requestAnimationFrame(function () { d.classList.add('on'); });
    currentDrawer = d;
    if (cfg.onOpen) cfg.onOpen(d);
  }
  function closeDrawer() {
    if (!currentDrawer) return;
    currentDrawer.classList.remove('on');
    var toRemove = currentDrawer;
    currentDrawer = null;
    setTimeout(function () { if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove); }, 300);
  }

  /* ---------------- MODAL ---------------- */
  var currentModal = null;
  function openModal(cfg) {
    closeAll();
    var m = el(
      '<div class="dash-modal" role="dialog" aria-modal="true">' +
        '<div class="dash-modal-head">' +
          '<div>' +
            '<h3>' + cfg.title + '</h3>' +
            (cfg.subtitle ? '<p>' + cfg.subtitle + '</p>' : '') +
          '</div>' +
          '<button type="button" class="dash-close" aria-label="Close">×</button>' +
        '</div>' +
        '<div class="dash-modal-body"></div>' +
        (cfg.footer ? '<div class="dash-modal-foot"></div>' : '') +
      '</div>'
    );
    m.querySelector('.dash-modal-body').innerHTML = cfg.body || '';
    if (cfg.footer) m.querySelector('.dash-modal-foot').innerHTML = cfg.footer;
    m.querySelector('.dash-close').addEventListener('click', closeAll);
    document.body.appendChild(m);
    openOverlay();
    requestAnimationFrame(function () { m.classList.add('on'); });
    currentModal = m;
    if (cfg.onOpen) cfg.onOpen(m);
  }
  function closeModal() {
    if (!currentModal) return;
    currentModal.classList.remove('on');
    var toRemove = currentModal;
    currentModal = null;
    setTimeout(function () { if (toRemove.parentNode) toRemove.parentNode.removeChild(toRemove); }, 240);
  }

  function closeAll() {
    closeDrawer();
    closeModal();
    closeOverlay();
  }

  /* ---------------- TOAST ---------------- */
  function toast(cfg) {
    var variant = cfg.variant || 'ok';
    var icon = variant === 'ok' ? '✓' : (variant === 'warn' ? '!' : '×');
    var t = el(
      '<div class="dash-toast ' + (variant === 'ok' ? '' : variant) + '">' +
        '<div class="ti">' + icon + '</div>' +
        '<div>' +
          '<strong>' + cfg.title + '</strong>' +
          (cfg.msg ? '<span>' + cfg.msg + '</span>' : '') +
        '</div>' +
      '</div>'
    );
    toasts.appendChild(t);
    requestAnimationFrame(function () { t.classList.add('on'); });
    setTimeout(function () {
      t.classList.remove('on');
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 220);
    }, cfg.hold || 3400);
  }

  /* ---------------- MOCK ACTION (delay + spinner) ---------------- */
  function mockAction(triggerBtn, onDone) {
    if (!triggerBtn) return;
    var originalHTML = triggerBtn.innerHTML;
    triggerBtn.disabled = true;
    triggerBtn.innerHTML =
      '<span class="dash-spin" aria-hidden="true"></span>' +
      '<span>' + bi('Processando…', 'Processing…') + '</span>';
    setTimeout(function () {
      triggerBtn.disabled = false;
      triggerBtn.innerHTML = originalHTML;
      if (onDone) onDone();
    }, delayMs());
  }

  /* ---------------- TOOLTIP (hover) ---------------- */
  var tipEl = null;
  function ensureTip() {
    if (!tipEl) {
      tipEl = el('<div class="dash-tip" role="tooltip"></div>');
      document.body.appendChild(tipEl);
    }
    return tipEl;
  }
  function showTip(html, e) {
    var t = ensureTip();
    t.innerHTML = html;
    t.classList.add('on');
    positionTip(e);
  }
  function moveTip(e) {
    if (tipEl && tipEl.classList.contains('on')) positionTip(e);
  }
  function hideTip() {
    if (tipEl) tipEl.classList.remove('on');
  }
  function positionTip(e) {
    var t = tipEl;
    if (!t) return;
    var pad = 14;
    var x = e.clientX + pad;
    var y = e.clientY + pad;
    var w = t.offsetWidth || 220;
    var h = t.offsetHeight || 60;
    if (x + w > window.innerWidth - 8) x = e.clientX - w - pad;
    if (y + h > window.innerHeight - 8) y = e.clientY - h - pad;
    t.style.left = x + 'px';
    t.style.top = y + 'px';
  }

  /* =============================================================
     MOCK DATA
     ============================================================= */
  var MASSIDS = {
    '451': {
      id: 'MS-…451', full: 'MS-2026-06-451',
      resin: 'Clear PET', color: '#c8d5e0', mass: '1,025 kg', postCons: '78%',
      status: 'minted', statusPt: 'Mintado', statusEn: 'Minted',
      generator: 'Athens Hotels & F&B pool',
      hauler: 'HelleniLog Ltd',
      completedAt: '15 Jun 2026 · 14:22',
      hash: 'sha256:9f2a4b8c…c41e',
      dpp: 'DPP-GR-2026-000451',
      events: [
        { ts: '11 Jun 2026 · 08:14', title: bi('Coletado no gerador','Collected at generator'), note: bi('Waste transfer note emitida','Waste transfer note issued'), state: 'ok' },
        { ts: '11 Jun 2026 · 09:02', title: bi('Pesagem inicial','Initial weighing'), note: 'gross 1,080 kg · tare 55 kg · net 1,025 kg', state: 'ok' },
        { ts: '12 Jun 2026 · 07:45', title: bi('Recepção na planta','Reception at plant'), note: bi('Confirmação assinada','Signed confirmation'), state: 'ok' },
        { ts: '13 Jun 2026 · 11:20', title: bi('Sorting + composição','Sorting + composition'), note: 'clear PET · 6% out-throw', state: 'ok' },
        { ts: '15 Jun 2026 · 14:22', title: bi('MassID mintado + DPP ancorado','MassID minted + DPP anchored'), note: 'sha256:9f2a4b8c…c41e', state: 'ok' }
      ],
      docs: [
        { name: 'Waste transfer note', ok: 'ok', ref: 'WTN-451-EL' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-HELL-2026' },
        { name: 'Reception confirmation', ok: 'ok', ref: 'RC-451' }
      ]
    },
    '452': {
      id: 'MS-…452', full: 'MS-2026-06-452',
      resin: 'Light-blue PET', color: '#a9c3e0', mass: '880 kg', postCons: '69%',
      status: 'minted', statusPt: 'Mintado', statusEn: 'Minted',
      generator: 'Crete Coastal collector',
      hauler: 'HelleniLog Ltd',
      completedAt: '10 Jun 2026 · 16:11',
      hash: 'sha256:5d1a9f4b…7e02',
      dpp: 'DPP-GR-2026-000452',
      events: [
        { ts: '07 Jun 2026 · 09:00', title: bi('Coletado no gerador','Collected at generator'), note: 'Crete Coastal', state: 'ok' },
        { ts: '07 Jun 2026 · 10:30', title: bi('Pesagem inicial','Initial weighing'), note: 'net 880 kg', state: 'ok' },
        { ts: '09 Jun 2026 · 08:15', title: bi('Recepção na planta','Reception at plant'), note: bi('Annex VII + confirmação assinada','Annex VII + signed confirmation'), state: 'ok' },
        { ts: '10 Jun 2026 · 16:11', title: bi('Mintado','Minted'), note: 'sha256:5d1a9f4b…7e02', state: 'ok' }
      ],
      docs: [
        { name: 'Annex VII', ok: 'ok', ref: 'A7-452' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-HELL-2026' },
        { name: 'Reception confirmation', ok: 'ok', ref: 'RC-452' }
      ]
    },
    '453': {
      id: 'MS-…453', full: 'MS-2026-06-453',
      resin: 'Mixed PET', color: '#c4a9c9', mass: '640 kg', postCons: '55%',
      status: 'flag', statusPt: 'Flag · documento', statusEn: 'Flag · document',
      generator: 'Thessaloniki MRF',
      hauler: 'HelleniLog Ltd',
      completedAt: null,
      hash: null,
      dpp: null,
      events: [
        { ts: '11 Jun 2026 · 07:30', title: bi('Coletado','Collected'), note: 'Thessaloniki', state: 'ok' },
        { ts: '11 Jun 2026 · 09:12', title: bi('Pesagem inicial','Initial weighing'), note: 'net 640 kg', state: 'ok' },
        { ts: '14 Jun 2026 · 13:45', title: bi('Recepção +3 dias — gap de balsa','Reception +3 days — ferry gap'), note: bi('Regra EU-16 sinaliza gap temporal','Rule EU-16 flags temporal gap'), state: 'pending' },
        { ts: '—', title: bi('Aguardando doc de gap justificado','Awaiting gap justification doc'), note: bi('Anexar Annex VII rev + reason','Attach Annex VII rev + reason'), state: 'blocked' }
      ],
      docs: [
        { name: 'Annex VII', ok: 'ok', ref: 'A7-453' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-HELL-2026' },
        { name: bi('Justificativa de gap','Gap justification'), ok: 'err', ref: bi('faltando','missing') }
      ]
    },
    '454': {
      id: 'MS-…454', full: 'MS-2026-06-454',
      resin: 'Green PET', color: '#b5cbb2', mass: '510 kg', postCons: '62%',
      status: 'draft', statusPt: 'Rascunho', statusEn: 'Draft',
      generator: 'Bari import (IT)',
      hauler: 'BariExpress Srl',
      completedAt: null,
      hash: null,
      dpp: null,
      events: [
        { ts: '13 Jun 2026 · 10:00', title: bi('Coletado — cross-border','Collected — cross-border'), note: 'Bari, IT', state: 'ok' },
        { ts: '13 Jun 2026 · 11:30', title: bi('Licença de transportador presente','Carrier licence present'), note: 'BariExpress · CL válida', state: 'ok' },
        { ts: '—', title: bi('Confirmação de recepção pendente','Reception confirmation pending'), note: bi('WSR Art. 15 · 2 dias úteis','WSR Art. 15 · 2 working days'), state: 'blocked' }
      ],
      docs: [
        { name: 'Annex VII', ok: 'ok', ref: 'A7-454-IT' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-BARI' },
        { name: bi('Confirmação de recepção','Reception confirmation'), ok: 'err', ref: bi('pendente','pending') }
      ]
    }
  };

  var SHIPMENTS = {
    'sh-451': {
      route: 'Athens MRF → plant', massid: '451',
      status: 'on', statusPt: 'Completo', statusEn: 'Complete',
      duration: bi('1 dia','1 day'),
      timeline: [
        { ts: '11 Jun · 08:14', title: bi('Coletado no gerador','Collected at generator'), note: 'Athens MRF', state: 'ok' },
        { ts: '11 Jun · 09:02', title: bi('WTN emitido','WTN issued'), note: bi('Nota de transferência assinada','Transfer note signed'), state: 'ok' },
        { ts: '12 Jun · 07:45', title: bi('Recepção na planta','Plant reception'), note: bi('Confirmação assinada','Signed confirmation'), state: 'ok' }
      ],
      docs: [
        { name: bi('Nota de transferência','Waste transfer note'), ok: 'ok', ref: 'WTN-451' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-HELL' },
        { name: bi('Confirmação de recepção','Reception confirmation'), ok: 'ok', ref: 'RC-451' }
      ]
    },
    'sh-453': {
      route: 'Thessaloniki → plant', massid: '453',
      status: 'late', statusPt: 'Recepção atrasada 3 dias', statusEn: 'Reception late 3 days',
      duration: bi('3 dias','3 days'),
      timeline: [
        { ts: '11 Jun', title: bi('Coletado','Collected'), note: 'Thessaloniki', state: 'ok' },
        { ts: '14 Jun', title: bi('Chegada — gap de balsa +2 dias','Arrival — ferry gap +2 days'), note: bi('EU-16 sinaliza gap temporal','EU-16 flags temporal gap'), state: 'pending' },
        { ts: '—', title: bi('Justificativa pendente','Justification pending'), note: bi('Anexar doc de gap','Attach gap doc'), state: 'blocked' }
      ],
      docs: [
        { name: bi('Nota de transferência','Waste transfer note'), ok: 'ok', ref: 'WTN-453' },
        { name: bi('Justificativa de gap','Gap justification'), ok: 'err', ref: bi('faltando','missing') }
      ]
    },
    'sh-452': {
      route: 'Crete Coastal → plant', massid: '452',
      status: 'on', statusPt: 'Completo', statusEn: 'Complete',
      duration: bi('1 dia','1 day'),
      timeline: [
        { ts: '07 Jun', title: bi('Coletado','Collected'), note: 'Crete Coastal', state: 'ok' },
        { ts: '08 Jun', title: 'Annex VII', note: bi('Manifest assinado','Signed manifest'), state: 'ok' },
        { ts: '09 Jun', title: bi('Recepção','Reception'), note: bi('Confirmação recebida','Confirmation received'), state: 'ok' }
      ],
      docs: [
        { name: 'Annex VII', ok: 'ok', ref: 'A7-452' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-HELL' },
        { name: bi('Confirmação de recepção','Reception confirmation'), ok: 'ok', ref: 'RC-452' }
      ]
    },
    'sh-454': {
      route: 'Bari import (IT) → plant', massid: '454',
      status: 'stuck', statusPt: 'Retido · gap de doc', statusEn: 'Held · doc gap',
      duration: bi('em espera','on hold'),
      timeline: [
        { ts: '13 Jun · 10:00', title: bi('Coletado — cross-border','Collected — cross-border'), note: 'Bari, IT', state: 'ok' },
        { ts: '13 Jun · 11:30', title: bi('Licença de transportador presente','Carrier licence present'), note: 'BariExpress', state: 'ok' },
        { ts: '—', title: bi('Confirmação de recepção pendente','Reception confirmation pending'), note: bi('WSR Art. 15 · 2 dias úteis','WSR Art. 15 · 2 working days'), state: 'blocked' }
      ],
      docs: [
        { name: 'Annex VII', ok: 'ok', ref: 'A7-454' },
        { name: 'Carrier licence', ok: 'ok', ref: 'CL-BARI' },
        { name: bi('Confirmação de recepção','Reception confirmation'), ok: 'err', ref: bi('pendente','pending') }
      ]
    }
  };

  var NODES = {
    'generator': {
      role: bi('Gerador','Generator'), name: 'Athens Hotels & F&B pool',
      country: bi('Grécia','Greece'),
      docsStatus: 'ok', kycStatus: 'ok',
      docs: [ { n: bi('Declaração de resíduos','Waste declaration'), ok: 'ok' }, { n: 'KYB', ok: 'ok' } ],
      lastMassIds: ['MS-…451','MS-…449','MS-…446'],
      note: bi('Fornecedor de long-standing · 68 lotes históricos.','Long-standing supplier · 68 historical batches.')
    },
    'bin': {
      role: bi('Custódia de bin','Bin Custodian'), name: 'Athens MRF',
      country: bi('Grécia','Greece'),
      docsStatus: 'ok', kycStatus: 'ok',
      docs: [ { n: bi('Notas de transferência','Transfer notes'), ok: 'ok' }, { n: bi('Licença de operação','Operating permit'), ok: 'ok' } ],
      lastMassIds: ['MS-…451','MS-…448'],
      note: bi('Consolidador principal · 42% do volume entrante.','Main consolidator · 42% of inbound volume.')
    },
    'hauler': {
      role: bi('Transporte','Hauler'), name: 'HelleniLog Ltd',
      country: bi('Grécia','Greece'),
      docsStatus: 'warn', kycStatus: 'ok',
      docs: [ { n: bi('Licença de transportador — vence 14 jul','Carrier licence — expires 14 Jul'), ok: 'warn' }, { n: 'KYB', ok: 'ok' } ],
      lastMassIds: ['MS-…451','MS-…452','MS-…453'],
      note: bi('Renovação de licença crítica em 4 dias.','Licence renewal critical in 4 days.')
    },
    'processor': {
      role: bi('Processador','Processor'), name: 'Ionian Sort Co.',
      country: bi('Grécia','Greece'),
      docsStatus: 'err', kycStatus: 'err',
      docs: [ { n: bi('Licença de operação','Operating permit'), ok: 'err' }, { n: bi('Relatório de sorting','Sorting report'), ok: 'err' }, { n: 'KYB', ok: 'err' } ],
      lastMassIds: [],
      note: bi('Novo · adicionado há 2 dias. Lotes bloqueados até coleta de docs (RC-06).','New · added 2 days ago. Batches blocked until doc collection (RC-06).')
    },
    'you': {
      role: bi('Reciclador (você)','Recycler (you)'), name: 'Aegean PET Recycling',
      country: bi('Grécia','Greece'),
      docsStatus: 'ok', kycStatus: 'ok',
      docs: [ { n: bi('Licença de recycler','Recycler permit'), ok: 'ok' }, { n: 'RecyClass licence', ok: 'ok' } ],
      lastMassIds: ['MS-…454','MS-…453','MS-…452','MS-…451'],
      note: bi('Você. Verificado · pack de auditoria montado por lote.','You. Verified · audit pack auto-assembled per batch.')
    },
    'buyer': {
      role: bi('Comprador','Buyer'), name: 'EuroPreform S.A.',
      country: bi('Grécia','Greece'),
      docsStatus: 'err', kycStatus: 'err',
      docs: [ { n: bi('Declaração de compra','Purchase declaration'), ok: 'err' }, { n: bi('Uso final','End-use statement'), ok: 'err' } ],
      lastMassIds: ['MS-…451','MS-…448','MS-…439'],
      note: bi('Convite pendente. Sem KYC · docs de compra em falta.','Invite pending. No KYC · purchase docs missing.')
    }
  };

  var LEVELS = {
    'L1': {
      title: 'L1 · ' + bi('por lote (bulk)','per bulk batch'),
      claim: bi('Claim por bulk','Bulk-level claim'),
      unlocks: bi('Compradores que aceitam certificação de origem, sem granularidade por saída.','Buyers that accept origin-level certification, no per-output granularity.'),
      buyerFit: bi('Comprador industrial não-alimentício.','Non-food industrial buyer.'),
      restrictions: bi('Não permite claim por-saída em DPP; média genérica de planta.','No per-output DPP claim; generic plant average.')
    },
    'L2': {
      title: 'L2 · ' + bi('por saída (você)','per-output (you)'),
      claim: bi('Claim por saída — cada flake carrega taxa própria','Per-output claim — each flake carries its own figure'),
      unlocks: bi('DPP com % pós-consumo verificada lote-a-lote · elegível PPWR premium.','DPP with per-batch verified post-consumer % · PPWR premium eligible.'),
      buyerFit: bi('Brand owners food-grade · conversores PPWR.','Food-grade brand owners · PPWR converters.'),
      restrictions: bi('Exige bay-emptying entre trocas e log completo por saída.','Requires bay-emptying between switches and complete per-output logging.')
    },
    'L3': {
      title: 'L3 · ' + bi('média mensal do processo','monthly process average'),
      claim: bi('Média mensal agregada por polímero','Monthly aggregated average per polymer'),
      unlocks: bi('Reporting corporativo · relatórios ESG anuais.','Corporate reporting · annual ESG statements.'),
      buyerFit: bi('Comprador de commodity + relatoria ESG.','Commodity buyer + ESG reporting.'),
      restrictions: bi('Não permite claim por lote; brand owners não pagam premium.','No per-batch claim; brand owners won\'t pay premium.')
    }
  };

  var CAL_EVENTS = {
    'annex-vii': {
      title: bi('Annex VII aceito em papel','Annex VII accepted on paper'),
      date: bi('Agora até 31 dez 2026','Now until 31 Dec 2026'),
      body: bi(
        'Durante o período de transição, WSR 2024/1157 permite Annex VII em papel para movimentos cross-border. Depois, obrigatório DIWASS digital. Sua rota de Bari (MS-…454) já está preparada com Annex VII digital — sem cutover pra planejar.',
        'During the transition window, WSR 2024/1157 permits Annex VII on paper for cross-border movements. After that, DIWASS digital mandatory. Your Bari lane (MS-…454) already runs digital Annex VII — no cutover to plan.'
      )
    },
    'b3011': {
      title: bi('B3011 export para não-OCDE banido','B3011 export to non-OECD banned'),
      date: '21 Nov 2026',
      body: bi(
        'Streams residuais classificados como B3011 (mistos de plástico) não podem ser exportados para não-OCDE. Se você tem saída residual de flake colorido baixo grade que hoje vai pra fora da OCDE, precisa redirecionar rota agora. Impacta linha de subprodutos no RC-03.',
        'Residual streams classified as B3011 (mixed plastics) cannot be exported to non-OECD. If your low-grade coloured flake residual currently goes non-OECD, redirect route now. Affects the by-products line in RC-03.'
      )
    },
    'diwass': {
      title: bi('DIWASS digital-only para cross-border','DIWASS digital-only for cross-border'),
      date: '1 Jan 2027',
      body: bi(
        'Todos movimentos cross-border precisam estar totalmente DIWASS-loggados. Papel deixa de valer. Sua rota Bari precisa migrar completamente. Impactrakr já emite Annex VII digital pronto pra DIWASS — mudança é config, não rewrite.',
        'All cross-border movements must be fully DIWASS-logged. Paper no longer valid. Your Bari lane must migrate fully. Impactrakr already emits DIWASS-ready digital Annex VII — the change is configuration, not rewrite.'
      )
    },
    'preconsent': {
      title: bi('Deadline de instalação pré-consentida','Pre-consented facility deadline'),
      date: '21 May 2029',
      body: bi(
        'Envios só para instalações de recuperação pré-consentidas. Cada nó do seu ecossistema (bin custodian, processor) precisa estar na lista pré-consentida. Cadastro deve começar agora — burocracia leva 12-18 meses.',
        'Shipments only to pre-consented recovery facilities. Every node in your ecosystem (bin custodian, processor) must be on the pre-consented list. Registration should start now — bureaucracy takes 12-18 months.'
      )
    }
  };

  /* =============================================================
     BOOTSTRAP: wire up tudo depois de DOM ready
     ============================================================= */
  function bootstrap() {
    // recycler.html handlers (no-op quando os seletores não existem)
    wireStakeholderButtons();
    wireMassIdRows();
    wireShipments();
    wireActOn();
    wireKpis();
    wireNodes();
    wireDppQr();
    wireLevels();
    wireBuyerCards();
    wireVerifyHead();
    wireHealthRing();
    wireCalendar();
    wireTooltips();

    // auditor.html handlers (no-op quando não está no auditor)
    wireAuLive();
    wireAuKpis();
    wireAuTriage();
    wireAuExceptions();
    wireAuRules();
    wireAuChecklist();
    wireAuPack();
    wireAuCrossClient();
    wireAuTooltips();

    // benchmark.html handlers (no-op quando não está no benchmark)
    wireBnScore();
    wireBnHeadline();
    wireBnKpiCards();
    wireBnLeaderboard();
    wireBnExtras();
    wireBnTooltips();
  }

  /* ---------- Bloco A: 3 botões críticos ---------- */
  function wireStakeholderButtons() {
    // HelleniLog Renew, Ionian Collect, EuroPreform Invite
    var rows = document.querySelectorAll('#ecosystem tbody tr');
    if (!rows || !rows.length) return;
    rows.forEach(function (tr) {
      var btn = tr.querySelector('.rc-fixbtn');
      if (!btn) return;
      var name = (tr.querySelector('.client') || {}).textContent || '';
      var kind;
      if (/HelleniLog/i.test(name)) kind = 'renewHauler';
      else if (/Ionian/i.test(name)) kind = 'collectProcessor';
      else if (/EuroPreform/i.test(name)) kind = 'inviteBuyer';
      else kind = 'generic';
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openStakeholderAction(kind, btn, tr);
      });
    });
  }

  function openStakeholderAction(kind, btn, row) {
    if (kind === 'renewHauler') {
      openModal({
        title: bi('Solicitar renovação de licença','Request licence renewal'),
        subtitle: bi('HelleniLog Ltd · licença de transportador','HelleniLog Ltd · carrier licence'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Contexto','Context') + '</div>' +
            '<div class="dash-kv"><span class="k">' + bi('Documento','Document') + '</span><span class="v">' + bi('Licença de transportador','Carrier licence') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Válida até','Valid until') + '</span><span class="v" style="color: var(--warning);">14 Jul 2026 · ' + bi('em 4 dias','in 4 days') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Lotes potencialmente afetados','Potentially affected batches') + '</span><span class="v">3 (MS-…451, 452, 453)</span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Preview da mensagem','Message preview') + '</div>' +
            '<div class="dash-note"><strong>' + bi('Para:','To:') + '</strong> compliance@hellenilog.gr<br><strong>' + bi('Assunto:','Subject:') + '</strong> ' + bi('Renovação de licença de transportador — aviso Impactrakr','Carrier licence renewal — Impactrakr notice') + '<br><br>' +
              bi('Sua licença de transportador vence em 14 jul 2026. Para manter continuidade nos lotes em rota, favor enviar a licença renovada até 12 jul via portal Impactrakr.','Your carrier licence expires on 14 Jul 2026. To keep your in-transit batches valid, please upload the renewed licence by 12 Jul via the Impactrakr portal.') +
            '</div>' +
          '</div>',
        footer:
          '<button type="button" class="dash-btn" data-cancel>' + bi('Cancelar','Cancel') + '</button>' +
          '<button type="button" class="dash-btn primary" data-send>' + bi('Enviar solicitação','Send request') + '</button>'
      });
      wireCancel();
      var send = currentModal.querySelector('[data-send]');
      send.addEventListener('click', function () {
        mockAction(send, function () {
          closeAll();
          toast({
            title: bi('Solicitação enviada','Request sent'),
            msg: bi('HelleniLog recebeu o pedido de renovação · SLA 48h','HelleniLog received the renewal request · 48h SLA')
          });
          if (row) markRowPending(row, bi('Renovação solicitada','Renewal requested'));
        });
      });
    }
    else if (kind === 'collectProcessor') {
      openDrawer({
        eyebrow: bi('Coleta de documentos · novo processador','Doc collection · new processor'),
        title: 'Ionian Sort Co.',
        subtitle: bi('Nó adicionado há 2 dias. Sem KYC nem docs de operação. Lotes que passam por ele bloqueados até completar RC-06.','Node added 2 days ago. No KYC, no operating docs. Batches through it blocked until RC-06 satisfied.'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Checklist RC-06','RC-06 checklist') + '</div>' +
            docItem(bi('KYB · dados de empresa','KYB · company data'), 'err', bi('pendente','pending')) +
            docItem(bi('Licença de operação','Operating permit'), 'err', bi('pendente','pending')) +
            docItem(bi('Relatório de sorting (últimos 3 meses)','Sorting report (last 3 months)'), 'err', bi('pendente','pending')) +
            docItem(bi('Certificação RecyClass ou EuCertPlast','RecyClass or EuCertPlast certification'), 'err', bi('pendente','pending')) +
            docItem(bi('Comprovante de endereço','Address proof'), 'err', bi('pendente','pending')) +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Impacto agora','Impact right now') + '</div>' +
            '<div class="dash-note warn"><strong>' + bi('Bloqueio ativo','Active block') + ':</strong> ' + bi('nenhum lote com Ionian Sort pode ser mintado. RC-06 exige certificação do processador upstream.','no MassID routed via Ionian Sort can be minted. RC-06 requires the upstream processor to be certified.') + '</div>' +
          '</div>',
        footer:
          '<button type="button" class="dash-btn" data-cancel>' + bi('Cancelar','Cancel') + '</button>' +
          '<button type="button" class="dash-btn accent" data-send>' + bi('Enviar coleta de docs','Send doc collection') + '</button>'
      });
      wireCancel();
      var sendBtn = currentDrawer.querySelector('[data-send]');
      sendBtn.addEventListener('click', function () {
        mockAction(sendBtn, function () {
          closeAll();
          toast({
            title: bi('Coleta enviada','Collection sent'),
            msg: bi('Ionian recebeu link com 5 documentos · SLA 5 dias','Ionian got the link with 5 documents · 5-day SLA')
          });
          if (row) markRowPending(row, bi('Coleta enviada','Collection sent'));
        });
      });
    }
    else if (kind === 'inviteBuyer') {
      openModal({
        title: bi('Convidar comprador para verificação','Invite buyer to verification'),
        subtitle: 'EuroPreform S.A.',
        body:
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Comprador','Buyer') + '</div>' +
            '<div class="dash-kv"><span class="k">' + bi('Nome','Name') + '</span><span class="v">EuroPreform S.A.</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Papel','Role') + '</span><span class="v">' + bi('Conversor','Converter') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Volume 6m','6m volume') + '</span><span class="v">14.2 t</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Status atual','Current status') + '</span><span class="v" style="color: var(--block);">' + bi('Docs em falta','Docs missing') + '</span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('O que será solicitado','What will be requested') + '</div>' +
            docItem(bi('Declaração de compra','Purchase declaration'), 'err', bi('a solicitar','to request')) +
            docItem(bi('Uso final do material','Material end-use'), 'err', bi('a solicitar','to request')) +
            docItem(bi('KYC básico','Basic KYC'), 'err', bi('a solicitar','to request')) +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-note">' + bi('Ao aceitar, EuroPreform ganha acesso ao histórico DPP dos lotes já comprados (14.2 t · 8 lotes) e valida com 1-click no portal público.','Once accepted, EuroPreform gets DPP access for already-purchased batches (14.2 t · 8 batches) and validates them in 1-click on the public portal.') + '</div>' +
          '</div>',
        footer:
          '<button type="button" class="dash-btn" data-cancel>' + bi('Cancelar','Cancel') + '</button>' +
          '<button type="button" class="dash-btn primary" data-send>' + bi('Enviar convite','Send invite') + '</button>'
      });
      wireCancel();
      var s = currentModal.querySelector('[data-send]');
      s.addEventListener('click', function () {
        mockAction(s, function () {
          closeAll();
          toast({
            title: bi('Convite enviado','Invite sent'),
            msg: bi('EuroPreform recebeu convite + 3 solicitações de docs','EuroPreform got the invite + 3 doc requests')
          });
          if (row) markRowPending(row, bi('Convite enviado','Invite sent'));
        });
      });
    }
  }

  function docItem(name, state, ref) {
    return '<div class="dash-doc"><div class="di ' + state + '">' + (state === 'ok' ? '✓' : (state === 'warn' ? '!' : '×')) + '</div><div class="dn">' + name + '</div><div class="dm">' + ref + '</div></div>';
  }
  function markRowPending(tr, labelHtml) {
    var btn = tr.querySelector('.rc-fixbtn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span lang="pt">Enviado ✓</span><span lang="en">Sent ✓</span>';
      btn.style.opacity = '0.75';
      btn.style.background = 'oklch(94% 0.05 150)';
      btn.style.borderColor = 'oklch(88% 0.05 150)';
      btn.style.color = 'var(--accent-strong)';
    }
    var pill = tr.querySelector('.rc-st-pill');
    if (pill) {
      pill.className = 'rc-st-pill rc-stp-part';
      pill.innerHTML = labelHtml || '<span lang="pt">Aguardando</span><span lang="en">Awaiting</span>';
    }
  }
  function wireCancel() {
    var host = currentModal || currentDrawer;
    if (!host) return;
    var c = host.querySelector('[data-cancel]');
    if (c) c.addEventListener('click', closeAll);
  }

  /* ---------- Bloco A: MassID rows ---------- */
  function wireMassIdRows() {
    var table = document.querySelector('#massids .rc-table tbody');
    if (!table) return;
    var rows = table.querySelectorAll('tr');
    rows.forEach(function (tr) {
      var mid = tr.querySelector('.mid');
      if (!mid) return;
      var key = (mid.textContent.match(/(\d{3})$/) || [])[1];
      if (!key || !MASSIDS[key]) return;
      tr.setAttribute('data-dash-open', 'massid-' + key);
      tr.addEventListener('click', function () { openMassIdDrawer(key); });
    });
  }
  function openMassIdDrawer(key) {
    var m = MASSIDS[key];
    if (!m) return;
    var eventsHtml = '<div class="dash-timeline">';
    m.events.forEach(function (ev) {
      eventsHtml += '<div class="dash-tstep ' + (ev.state === 'ok' ? '' : ev.state) + '"><b>' + ev.title + '</b><span class="ts">' + ev.ts + '</span><span class="note">' + ev.note + '</span></div>';
    });
    eventsHtml += '</div>';
    var docsHtml = '';
    m.docs.forEach(function (d) { docsHtml += docItem(d.name, d.ok, d.ref); });
    openDrawer({
      eyebrow: bi('Lote · MassID','Batch · MassID'),
      title: m.full,
      subtitle: m.resin + ' · ' + m.mass + ' · ' + bi('pós-consumo','post-consumer') + ' ' + m.postCons,
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Ficha do lote','Batch card') + '</div>' +
          '<div class="dash-kv"><span class="k">Status</span><span class="v">' + (m.status === 'minted' ? '<span style="color:var(--accent-strong);">✓ ' + bi(m.statusPt, m.statusEn) + '</span>' : (m.status === 'flag' ? '<span style="color:var(--warning);">' + bi(m.statusPt, m.statusEn) + '</span>' : '<span style="color:var(--ink-soft);">' + bi(m.statusPt, m.statusEn) + '</span>')) + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Gerador de origem','Origin generator') + '</span><span class="v">' + m.generator + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Transportador','Hauler') + '</span><span class="v">' + m.hauler + '</span></div>' +
          (m.completedAt ? '<div class="dash-kv"><span class="k">' + bi('Concluído em','Completed at') + '</span><span class="v mono">' + m.completedAt + '</span></div>' : '') +
          (m.hash ? '<div class="dash-kv"><span class="k">Hash</span><span class="v mono">' + m.hash + '</span></div>' : '') +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Cadeia de eventos','Event chain') + '</div>' +
          eventsHtml +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Documentos anexos','Attached documents') + '</div>' +
          docsHtml +
        '</div>',
      footer:
        (m.dpp
          ? '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
            '<button type="button" class="dash-btn primary" data-open-dpp>' + bi('Abrir DPP','Open DPP') + '</button>'
          : '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
            '<button type="button" class="dash-btn accent" data-fix>' + bi('Resolver pendência','Resolve pending') + '</button>')
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var openDpp = currentDrawer.querySelector('[data-open-dpp]');
    if (openDpp) openDpp.addEventListener('click', function () {
      closeAll();
      setTimeout(function () {
        var dpp = document.getElementById('dpp');
        if (dpp) {
          dpp.scrollIntoView({ behavior: 'smooth', block: 'start' });
          dpp.style.transition = 'box-shadow 800ms';
          dpp.style.boxShadow = '0 0 0 3px oklch(60% 0.16 150 / 0.35)';
          setTimeout(function () { dpp.style.boxShadow = ''; }, 1800);
        }
      }, 320);
    });
    var fix = currentDrawer.querySelector('[data-fix]');
    if (fix) fix.addEventListener('click', function () {
      mockAction(fix, function () {
        closeAll();
        toast({
          title: bi('Notificação enviada','Notification sent'),
          msg: bi('Time interno alertado sobre a pendência do lote','Internal team notified about the batch pending')
        });
      });
    });
  }

  /* ---------- Bloco A: Shipments ---------- */
  function wireShipments() {
    var ships = document.querySelectorAll('#movements .rc-ship');
    ships.forEach(function (s, i) {
      var key;
      var txt = s.textContent;
      if (/451/.test(txt)) key = 'sh-451';
      else if (/453/.test(txt)) key = 'sh-453';
      else if (/452/.test(txt)) key = 'sh-452';
      else if (/Bari/i.test(txt)) key = 'sh-454';
      else return;
      s.setAttribute('data-dash-open', key);
      s.style.cursor = 'pointer';
      s.style.borderRadius = 'var(--r-sm)';
      s.style.padding = '0.75rem 0.6rem';
      s.style.margin = '0 -0.6rem';
      s.addEventListener('click', function () { openShipmentDrawer(key); });
    });
  }
  function openShipmentDrawer(key) {
    var sh = SHIPMENTS[key];
    if (!sh) return;
    var eventsHtml = '<div class="dash-timeline">';
    sh.timeline.forEach(function (ev) {
      eventsHtml += '<div class="dash-tstep ' + (ev.state === 'ok' ? '' : ev.state) + '"><b>' + ev.title + '</b><span class="ts">' + ev.ts + '</span><span class="note">' + ev.note + '</span></div>';
    });
    eventsHtml += '</div>';
    var docsHtml = '';
    sh.docs.forEach(function (d) { docsHtml += docItem(d.name, d.ok, d.ref); });
    var statusColor = sh.status === 'on' ? 'var(--accent-strong)' : (sh.status === 'late' ? 'var(--warning)' : 'var(--block)');
    openDrawer({
      eyebrow: bi('Movimentação','Movement'),
      title: sh.route,
      subtitle: 'MassID MS-…' + sh.massid + ' · ' + bi('duração','duration') + ': ' + sh.duration,
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">Status</span><span class="v" style="color:' + statusColor + ';">' + bi(sh.statusPt, sh.statusEn) + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Timeline','Timeline') + '</div>' +
          eventsHtml +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Documentos WSR','WSR documents') + '</div>' +
          docsHtml +
        '</div>',
      footer: (sh.status !== 'on')
        ? '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
          '<button type="button" class="dash-btn accent" data-resolve>' + bi('Solicitar resolução','Request resolution') + '</button>'
        : '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var res = currentDrawer.querySelector('[data-resolve]');
    if (res) res.addEventListener('click', function () {
      mockAction(res, function () {
        closeAll();
        toast({
          title: bi('Solicitação de resolução enviada','Resolution request sent'),
          msg: bi('Envolvidos alertados · pendência priorizada','Stakeholders notified · flagged as priority')
        });
      });
    });
  }

  /* ---------- Bloco A: What to act on ---------- */
  function wireActOn() {
    var alerts = document.querySelectorAll('#act .rc-alert');
    var meta = [
      { k: 'share',   title: bi('Compartilhar link de verificação on-chain','Share on-chain verification link'), copy: 'https://carrot.eco/verify/DPP-GR-2026-000451' },
      { k: 'bari',    title: bi('Fechar gap de recepção do import Bari','Close reception gap on Bari import'),  copy: null },
      { k: 'l2',      title: bi('Vender claim pós-consumo L2','Sell post-consumer L2 claim'),                     copy: 'https://carrot.eco/verify/DPP-GR-2026-000451' },
      { k: 'outthrw', title: bi('Corte fora-de-escopo em Thessaloniki','Cut Thessaloniki out-throw'),             copy: null }
    ];
    alerts.forEach(function (al, i) {
      var info = meta[i] || meta[0];
      al.setAttribute('data-dash-open', 'act-' + info.k);
      al.addEventListener('click', function () { openActOn(info, al); });
    });
  }
  function openActOn(info, source) {
    var strong = source.querySelector('strong');
    var span = source.querySelector('span:not(.ic)');
    var head = strong ? strong.innerHTML : info.title;
    var desc = span ? span.innerHTML : '';
    openDrawer({
      eyebrow: bi('O que fazer a seguir','What to act on'),
      title: head,
      subtitle: desc,
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Por que agora','Why now') + '</div>' +
          '<div class="dash-note">' + explainAct(info.k) + '</div>' +
        '</div>' +
        (info.copy
          ? '<div class="dash-section">' +
              '<div class="dash-section-lab">' + bi('Link público (Carrot Network)','Public link (Carrot Network)') + '</div>' +
              '<button type="button" class="dash-copybtn" data-copy="' + info.copy + '">' +
                '<strong>' + bi('Copiar','Copy') + '</strong>' +
                '<span>' + info.copy + '</span>' +
              '</button>' +
            '</div>'
          : ''),
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        (info.k === 'bari'
          ? '<button type="button" class="dash-btn accent" data-goship>' + bi('Ver movimentação Bari','View Bari shipment') + '</button>'
          : (info.k === 'outthrw'
            ? '<button type="button" class="dash-btn accent" data-goint>' + bi('Ver intake','View intake') + '</button>'
            : ''))
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var copy = currentDrawer.querySelector('[data-copy]');
    if (copy) copy.addEventListener('click', function () {
      var url = copy.getAttribute('data-copy');
      if (navigator.clipboard) navigator.clipboard.writeText(url);
      toast({
        title: bi('Link copiado','Link copied'),
        msg: bi('Cole em email, chat ou proposta para compradores','Paste in email, chat or proposal for buyers')
      });
    });
    var goShip = currentDrawer.querySelector('[data-goship]');
    if (goShip) goShip.addEventListener('click', function () {
      closeAll();
      setTimeout(function () { openShipmentDrawer('sh-454'); }, 320);
    });
    var goInt = currentDrawer.querySelector('[data-goint]');
    if (goInt) goInt.addEventListener('click', function () {
      closeAll();
      setTimeout(function () {
        var t = document.getElementById('intake');
        if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 320);
    });
  }
  function explainAct(k) {
    if (k === 'share') return bi('Toda vez que um comprador confirma seu claim on-chain, o custo dele de duvidar cai a zero. Este link é público, sem login, e mostra 78% pós-consumo + L2 verificados. É o argumento mais barato pra manter preço em negociação.','Every time a buyer confirms your claim on-chain, their cost of doubting drops to zero. This link is public, no login, showing 78% post-consumer + L2 verified. Cheapest argument to hold price in negotiation.');
    if (k === 'bari') return bi('Enquanto Art. 15 (2 dias úteis) não é confirmado, o lote fica retido. Além disso, RC-06 exige que o fornecedor Italiano tenha RecyClass/EuCertPlast. Resolver os dois destrava 510 kg + garante que a rota não venha a virar dor de cabeça no auditor.','Until Art. 15 (2 working days) is confirmed, the batch stays held. On top of that, RC-06 requires the Italian supplier to hold RecyClass/EuCertPlast. Clearing both unlocks 510 kg + prevents the lane from becoming an audit pain.');
    if (k === 'l2') return bi('L2 por-saída é o único claim que brand owners de food-grade pagam premium. Cada DPP que sai com essa credencial vale 20-30% mais que o mesmo material em L3. Só o argumento comercial já paga a plataforma.','L2 per-output is the only claim food-grade brand owners will pay premium for. Every DPP with that credential is worth 20-30% more than the same material at L3. The commercial argument alone pays for the platform.');
    if (k === 'outthrw') return bi('Cada 1% de out-throw a mais em Thessaloniki é 1.8 t/mês de material que você pagou para receber e não pode vender. Sobe também linha de solid waste no RC-03, degradando reconciliação. Ação: revisar contrato com o coletor, exigir pré-sorting no origem.','Every extra 1% of out-throw in Thessaloniki is 1.8 t/month of material you paid to receive and can\'t sell. Also inflates the solid waste line in RC-03, degrading reconciliation. Action: revisit collector contract, require pre-sorting at source.');
    return '';
  }

  /* ---------- Bloco B: KPI cards ---------- */
  function wireKpis() {
    var kpis = document.querySelectorAll('.rc-kpis .rc-kpi');
    var meta = [
      { title: bi('Massa processada — 30 dias','Mass processed — 30 days'),
        eyebrow: bi('KPI · massa','KPI · mass'),
        body: kpiMassBody() },
      { title: bi('Rendimento de saída (mass balance)','Output yield (mass balance)'),
        eyebrow: bi('KPI · yield','KPI · yield'),
        body: kpiYieldBody() },
      { title: bi('Conteúdo pós-consumo verificado','Verified post-consumer content'),
        eyebrow: bi('KPI · RC-04','KPI · RC-04'),
        body: kpiPCBody() },
      { title: bi('Nível de rastreabilidade','Traceability level'),
        eyebrow: bi('KPI · RC-05','KPI · RC-05'),
        body: kpiLevelBody() }
    ];
    kpis.forEach(function (k, i) {
      k.setAttribute('data-dash-open', 'kpi-' + i);
      k.addEventListener('click', function () {
        openDrawer({ eyebrow: meta[i].eyebrow, title: meta[i].title, body: meta[i].body,
          footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' });
        var close = currentDrawer.querySelector('[data-close]');
        if (close) close.addEventListener('click', closeAll);
      });
    });
  }
  function kpiMassBody() {
    return '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Composição do valor','Value breakdown') + '</div>' +
      '<div class="dash-kv"><span class="k">' + bi('Total processado (30d)','Total processed (30d)') + '</span><span class="v">182.0 t</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('MassIDs mintados','Minted MassIDs') + '</span><span class="v">128</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('MassIDs em rascunho','Draft MassIDs') + '</span><span class="v">6</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('MassIDs bloqueados','Blocked MassIDs') + '</span><span class="v" style="color:var(--warning);">2</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Média diária','Daily average') + '</span><span class="v">6.1 t</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Mês anterior','Previous month') + '</span><span class="v">168.5 t</span></div>' +
      '<div class="dash-kv"><span class="k">Delta</span><span class="v" style="color:var(--accent-strong);">+8.0%</span></div>' +
    '</div>' +
    '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Fonte de dados','Data source') + '</div>' +
      '<div class="dash-note">' + bi('Somatório do <strong>MassID.eligibleKg</strong> em janela rolante de 30 dias, filtrado por status = MINTED ou DRAFT. Fonte canônica: engine de validação, sincronizada em tempo real com escalas certificadas.','Sum of <strong>MassID.eligibleKg</strong> over a rolling 30-day window, filtered by status = MINTED or DRAFT. Canonical source: validation engine, synced real-time with certified scales.') + '</div>' +
    '</div>';
  }
  function kpiYieldBody() {
    return '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Reconciliação mensal (RC-03)','Monthly reconciliation (RC-03)') + '</div>' +
      '<div class="dash-kv"><span class="k">Input</span><span class="v">182.0 t</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Output (flake vendável)','Output (sellable flake)') + '</span><span class="v" style="color:var(--accent-strong);">143.4 t · 79%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Additives','Additives') + '</span><span class="v">2.1 t · 1.2%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Solid waste','Solid waste') + '</span><span class="v" style="color:var(--warning);">27.3 t · 15%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('By-products','By-products') + '</span><span class="v">13.4 t · 7.4%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Gap não explicado','Unexplained gap') + '</span><span class="v" style="color:var(--accent-strong);">−4.2 kg · dentro da tolerância</span></div>' +
    '</div>' +
    '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Trajetória (6 meses)','Trajectory (6 months)') + '</div>' +
      '<div class="dash-kv"><span class="k">Jan</span><span class="v">73.5%</span></div>' +
      '<div class="dash-kv"><span class="k">Feb</span><span class="v">74.8%</span></div>' +
      '<div class="dash-kv"><span class="k">Mar</span><span class="v">76.1%</span></div>' +
      '<div class="dash-kv"><span class="k">Apr</span><span class="v">76.9%</span></div>' +
      '<div class="dash-kv"><span class="k">May</span><span class="v">77.1%</span></div>' +
      '<div class="dash-kv"><span class="k">Jun</span><span class="v" style="color:var(--accent-strong);">79.0%</span></div>' +
    '</div>';
  }
  function kpiPCBody() {
    return '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Split RC-04','RC-04 split') + '</div>' +
      '<div class="dash-kv"><span class="k">' + bi('Pós-consumo','Post-consumer') + '</span><span class="v" style="color:var(--accent-strong);">71%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Pré-consumo','Pre-consumer') + '</span><span class="v">23%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Virgem + aditivos','Virgin + additives') + '</span><span class="v">6%</span></div>' +
    '</div>' +
    '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Contexto regulatório','Regulatory context') + '</div>' +
      '<div class="dash-note"><strong>PPWR:</strong> ' + bi('mandatory 30% pós-consumo em food-grade a partir de 2028. Você já opera com 71% verificado. Isso é vantagem competitiva de 5+ anos, e argumento de preço direto.','30% post-consumer mandatory in food-grade from 2028. You already run at 71% verified. That\'s a 5+ year competitive lead, and a direct pricing argument.') + '</div>' +
    '</div>';
  }
  function kpiLevelBody() {
    return '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('Seu nível','Your level') + '</div>' +
      '<div class="dash-kv"><span class="k">' + bi('Nível atual','Current level') + '</span><span class="v" style="color:var(--accent-strong);">L2 · ' + bi('por saída','per-output') + '</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('% dos lotes com claim L2','% batches with L2 claim') + '</span><span class="v">100%</span></div>' +
      '<div class="dash-kv"><span class="k">' + bi('Bay switches sem doc','Bay switches missing doc') + '</span><span class="v" style="color:var(--warning);">1 · 14 Jun</span></div>' +
    '</div>' +
    '<div class="dash-section">' +
      '<div class="dash-section-lab">' + bi('O que L2 destrava','What L2 unlocks') + '</div>' +
      '<div class="dash-note">' + bi('Cada lote carrega sua taxa verificada de pós-consumo. Isso permite claim comercial por lote em DPP, elegível para premium PPWR em food-grade. Um concorrente L3 (média mensal) não consegue esse argumento.','Each batch carries its own verified post-consumer figure. Enables per-batch commercial claim in DPP, eligible for PPWR food-grade premium. An L3 competitor (monthly average) can\'t make that argument.') + '</div>' +
    '</div>';
  }

  /* ---------- Bloco B: Chain nodes ---------- */
  function wireNodes() {
    var nodes = document.querySelectorAll('#ecosystem .rc-chain .rc-node');
    var keys = ['generator','bin','hauler','processor','you','buyer'];
    nodes.forEach(function (n, i) {
      n.setAttribute('data-dash-open', 'node-' + keys[i]);
      n.addEventListener('click', function () { openNodeDrawer(keys[i]); });
    });
  }
  function openNodeDrawer(key) {
    var n = NODES[key];
    if (!n) return;
    var docs = '';
    n.docs.forEach(function (d) { docs += docItem(d.n, d.ok, ''); });
    var recent = n.lastMassIds.length
      ? n.lastMassIds.map(function (m) { return '<span class="rc-tag rc-you" style="margin-right:0.3rem;">' + m + '</span>'; }).join('')
      : '<span style="color:var(--ink-faint); font-size:0.8125rem;">' + bi('Nenhum lote ainda','No batches yet') + '</span>';
    openDrawer({
      eyebrow: n.role,
      title: n.name,
      subtitle: n.country,
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Status','Status') + '</div>' +
          '<div class="dash-kv"><span class="k">' + bi('Documentos','Documents') + '</span><span class="v" style="color:' + (n.docsStatus === 'ok' ? 'var(--accent-strong)' : (n.docsStatus === 'warn' ? 'var(--warning)' : 'var(--block)')) + ';">' + (n.docsStatus === 'ok' ? bi('Completo','Complete') : (n.docsStatus === 'warn' ? bi('Vencendo','Expiring') : bi('Em falta','Missing'))) + '</span></div>' +
          '<div class="dash-kv"><span class="k">KYC/KYB</span><span class="v" style="color:' + (n.kycStatus === 'ok' ? 'var(--accent-strong)' : 'var(--block)') + ';">' + (n.kycStatus === 'ok' ? bi('Verificado','Verified') : bi('Pendente','Pending')) + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Documentos','Documents') + '</div>' +
          docs +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Últimos lotes','Recent batches') + '</div>' +
          recent +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-note">' + n.note + '</div>' +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Bloco B: DPP QR + Verify head ---------- */
  function wireDppQr() {
    var qr = document.querySelector('#dpp .rc-qr');
    if (!qr) return;
    qr.setAttribute('data-dash-modal', 'dpp-public');
    qr.setAttribute('title', pickText('Ver a página pública que o comprador vê', 'View the public page the buyer sees'));
    qr.addEventListener('click', openPublicDpp);
  }
  function wireVerifyHead() {
    var head = document.querySelector('#buyer-view .rc-verify-head');
    if (!head) return;
    head.setAttribute('data-dash-modal', 'verify');
    head.addEventListener('click', openPublicDpp);
  }
  function openPublicDpp() {
    openModal({
      title: bi('Verificação pública · carrot.eco','Public verification · carrot.eco'),
      subtitle: bi('Isto é o que um conversor ou brand owner vê ao escanear o QR do DPP','This is what a converter or brand owner sees when scanning the DPP QR'),
      body:
        '<div class="dash-preview-card">' +
          '<h4>DPP-GR-2026-000451 · clear rPET flake</h4>' +
          '<div class="pc-sub">' + bi('Aegean PET Recycling · verificado on-chain','Aegean PET Recycling · verified on-chain') + '</div>' +
          '<div class="pc-hash">sha256:9f2a…c41e · block 62,184,097 · 15 Jun 2026</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">' + bi('Conteúdo pós-consumo','Post-consumer content') + '</span><span class="v" style="color:var(--accent-strong);">78% ✓</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Nível de rastreabilidade','Traceability level') + '</span><span class="v">L2 · per-output ✓</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Origem','Origin') + '</span><span class="v">' + bi('Grécia · coleta verificada','Greece · collection verified') + ' ✓</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Compliance','Compliance') + '</span><span class="v">WSR + RecyClass valid ✓</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Massa (kg)','Mass (kg)') + '</span><span class="v">1,025 kg</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Resina','Resin') + '</span><span class="v">PET · clear</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-note"><strong>' + bi('Público','Public') + ':</strong> ' + bi('sem login, sem cookie, sem dado do comprador. Prova pura, à prova de adulteração. Identidades de fornecedores e preço ficam criptografados.','no login, no cookie, no buyer data. Pure tamper-proof proof. Supplier identities and pricing stay encrypted.') + '</div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-cancel>' + bi('Fechar','Close') + '</button>' +
        '<button type="button" class="dash-btn primary" data-share>' + bi('Copiar link público','Copy public link') + '</button>'
    });
    wireCancel();
    var s = currentModal.querySelector('[data-share]');
    if (s) s.addEventListener('click', function () {
      mockAction(s, function () {
        if (navigator.clipboard) navigator.clipboard.writeText('https://carrot.eco/verify/DPP-GR-2026-000451');
        toast({
          title: bi('Link copiado','Link copied'),
          msg: 'https://carrot.eco/verify/DPP-GR-2026-000451'
        });
      });
    });
  }

  /* ---------- Bloco B: Levels L1/L2/L3 ---------- */
  function wireLevels() {
    var levels = document.querySelectorAll('#level .rc-lvl');
    var keys = ['L1','L2','L3'];
    levels.forEach(function (lv, i) {
      lv.setAttribute('data-dash-open', 'level-' + keys[i]);
      lv.addEventListener('click', function () { openLevelDrawer(keys[i]); });
    });
  }
  function openLevelDrawer(key) {
    var lv = LEVELS[key];
    if (!lv) return;
    openDrawer({
      eyebrow: bi('Nível de rastreabilidade · RC-05','Traceability level · RC-05'),
      title: lv.title,
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Claim comercial','Commercial claim') + '</div>' +
          '<div class="dash-note">' + lv.claim + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('O que destrava','What it unlocks') + '</div>' +
          '<div class="dash-note">' + lv.unlocks + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Comprador que combina','Matching buyer') + '</div>' +
          '<div class="dash-note">' + lv.buyerFit + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Restrições','Restrictions') + '</div>' +
          '<div class="dash-note warn">' + lv.restrictions + '</div>' +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Bloco B: Buyer cards ---------- */
  function wireBuyerCards() {
    var cards = document.querySelectorAll('#buyer-history .rc-buyer');
    cards.forEach(function (c, i) {
      c.setAttribute('data-dash-open', 'buyer-' + i);
      c.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        openBuyerDrawer(c, i);
      });
    });
  }
  function openBuyerDrawer(card, idx) {
    var name = (card.querySelector('.bnm strong') || {}).textContent || 'Buyer';
    var sub = (card.querySelector('.bnm span') || {}).innerHTML || '';
    var tot = (card.querySelector('.tot') || {}).textContent || '';
    var due = /reorder|Recompra/i.test(card.textContent);
    openDrawer({
      eyebrow: bi('Comprador','Buyer'),
      title: name,
      subtitle: sub,
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">' + bi('Volume 6m','6m volume') + '</span><span class="v">' + tot + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Status KYC','KYC status') + '</span><span class="v" style="color:var(--accent-strong);">' + bi('Verificado','Verified') + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Pronto para recompra','Ready to reorder') + '</span><span class="v" style="color:' + (due ? 'oklch(45% 0.12 265)' : 'var(--ink-soft)') + ';">' + (due ? bi('Sim · vencido há 20 dias','Yes · 20 days overdue') : bi('Não agora','Not now')) + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Sugestão de oferta','Suggested offer') + '</div>' +
          '<div class="dash-note">' + bi('Baseado no histórico deste comprador, oferecer DPP-GR-2026-000451 (clear rPET · 78% pós-cons · 1,025 kg) é o casamento mais direto. Preço sugerido: prêmio de L2 verified sobre média EU.','Based on this buyer\'s history, offering DPP-GR-2026-000451 (clear rPET · 78% post-cons · 1,025 kg) is the tightest match. Suggested price: L2-verified premium over EU average.') + '</div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        (due ? '<button type="button" class="dash-btn primary" data-offer>' + bi('Enviar oferta','Send offer') + '</button>' : '')
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var offer = currentDrawer.querySelector('[data-offer]');
    if (offer) offer.addEventListener('click', function () {
      mockAction(offer, function () {
        closeAll();
        toast({
          title: bi('Oferta enviada','Offer sent'),
          msg: bi('DPP-GR-2026-000451 anexado · comprador notificado','DPP-GR-2026-000451 attached · buyer notified')
        });
      });
    });
  }

  /* ---------- Bloco C: Calendar events ---------- */
  function wireCalendar() {
    var rows = document.querySelectorAll('#calendar .rc-cal-row');
    var keys = ['annex-vii','b3011','diwass','preconsent'];
    rows.forEach(function (r, i) {
      r.setAttribute('data-dash-open', 'cal-' + keys[i]);
      r.addEventListener('click', function () { openCalEvent(keys[i]); });
    });
  }
  function openCalEvent(key) {
    var ev = CAL_EVENTS[key];
    if (!ev) return;
    openDrawer({
      eyebrow: bi('Calendário regulatório · WSR','Regulatory calendar · WSR'),
      title: ev.title,
      subtitle: ev.date,
      body:
        '<div class="dash-section">' +
          '<div class="dash-note">' + ev.body + '</div>' +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var c = currentDrawer.querySelector('[data-close]');
    if (c) c.addEventListener('click', closeAll);
  }

  /* ---------- Bloco C: Health ring hover ---------- */
  function wireHealthRing() {
    var ring = document.querySelector('#health .rc-ring');
    if (!ring) return;
    ring.setAttribute('data-dash-hover', '1');
    ring.addEventListener('mouseenter', function (e) {
      showTip(
        '<span class="tip-num">91%</span>' +
        '<strong>126 ' + bi('passando','passing') + ' · 2 ' + bi('em observação','watch') + ' · 1 ' + bi('a resolver','to resolve') + '</strong><br>' +
        bi('Pendências: RC-02 (licença HelleniLog vence 14 jul), RC-06 (Ionian sem docs), MS-…453 (gap doc).','Pending: RC-02 (HelleniLog licence expires 14 Jul), RC-06 (Ionian missing docs), MS-…453 (doc gap).')
      , e);
    });
    ring.addEventListener('mousemove', moveTip);
    ring.addEventListener('mouseleave', hideTip);
  }

  /* ---------- Bloco C: Tooltips em barras ---------- */
  function wireTooltips() {
    // RC-03 reconciliation rows
    var reconRows = document.querySelectorAll('#volume .rc-recon-row');
    var reconInfo = [
      { pt: 'Entrada bruta', en: 'Gross input', v: '182.0 t', pct: '100%' },
      { pt: 'Saída vendável (flake)', en: 'Sellable output (flake)', v: '143.4 t', pct: '79%' },
      { pt: 'Aditivos', en: 'Additives', v: '2.1 t', pct: '1.2%' },
      { pt: 'Resíduos sólidos', en: 'Solid wastes', v: '27.3 t', pct: '15%' },
      { pt: 'Subprodutos', en: 'By-products', v: '13.4 t', pct: '7.4%' }
    ];
    reconRows.forEach(function (r, i) {
      var info = reconInfo[i];
      if (!info) return;
      var track = r.querySelector('.track');
      if (!track) return;
      track.addEventListener('mouseenter', function (e) {
        showTip('<span class="tip-num">' + info.v + '</span><strong>' + bi(info.pt, info.en) + '</strong><br>' + info.pct + ' ' + bi('do input','of input'), e);
      });
      track.addEventListener('mousemove', moveTip);
      track.addEventListener('mouseleave', hideTip);
    });

    // RC-04 split
    var split = document.querySelector('#content .rc-split');
    if (split) {
      var segs = split.querySelectorAll('i');
      var meta = [
        { pt: 'Pós-consumo — RC-04 verificado', en: 'Post-consumer — RC-04 verified', v: '71%', extra: bi('Fração de maior valor sob PPWR','Higher-value fraction under PPWR') },
        { pt: 'Pré-consumo', en: 'Pre-consumer', v: '23%', extra: bi('Aceito, sem premium','Accepted, no premium') },
        { pt: 'Virgem + aditivos', en: 'Virgin + additives', v: '6%', extra: bi('Compõe o denominador do split','Part of split denominator') }
      ];
      segs.forEach(function (i, ix) {
        var m = meta[ix];
        if (!m) return;
        i.addEventListener('mouseenter', function (e) {
          showTip('<span class="tip-num">' + m.v + '</span><strong>' + bi(m.pt, m.en) + '</strong><br>' + m.extra, e);
        });
        i.addEventListener('mousemove', moveTip);
        i.addEventListener('mouseleave', hideTip);
      });
    }

    // Intake stack
    var stack = document.querySelector('#intake .rc-stack');
    if (stack) {
      var items = stack.querySelectorAll('i');
      var im = [
        { name: 'Clear PET', v: '48%' },
        { name: 'Light-blue PET', v: '17%' },
        { name: 'Green PET', v: '11%' },
        { name: bi('Mixed / opaco','Mixed / opaque'), v: '8%' },
        { name: bi('Tampas & rótulos','Caps & labels') + ' (PE/PP)', v: '9%' },
        { name: bi('Fora de escopo (non-PET)','Out-throw (non-PET)'), v: '7%' }
      ];
      items.forEach(function (it, ix) {
        var m = im[ix];
        if (!m) return;
        it.addEventListener('mouseenter', function (e) {
          showTip('<span class="tip-num">' + m.v + '</span><strong>' + m.name + '</strong>', e);
        });
        it.addEventListener('mousemove', moveTip);
        it.addEventListener('mouseleave', hideTip);
      });
    }

    // Chain nodes badges tooltip
    var badges = document.querySelectorAll('#ecosystem .rc-node .badge');
    badges.forEach(function (b) {
      b.addEventListener('mouseenter', function (e) {
        var txt = b.textContent.trim();
        var extra = '';
        if (/OK|Verified/i.test(txt)) extra = bi('Todos os docs e KYC em dia.','All docs and KYC in order.');
        else if (/Expiring|Vencendo/i.test(txt)) extra = bi('Renovação necessária nos próximos 30 dias.','Renewal required in next 30 days.');
        else if (/New|Novo/i.test(txt)) extra = bi('Sem KYC nem docs. Lotes bloqueados até completar RC-06.','No KYC or docs. Batches blocked until RC-06 complete.');
        else if (/Missing|falta/i.test(txt)) extra = bi('Docs de compra e uso final ausentes.','Purchase and end-use docs missing.');
        showTip('<strong>' + txt + '</strong><br>' + extra, e);
      });
      b.addEventListener('mousemove', moveTip);
      b.addEventListener('mouseleave', hideTip);
    });
  }

  /* =============================================================
     AUDITOR DASHBOARD · data + handlers
     ============================================================= */
  var AU_CLIENTS = {
    'adriatic': {
      name: 'Adriatic Polymers',
      loc: 'PET · Rijeka, HR',
      status: 'red', statusPt: 'Precisa revisão', statusEn: 'Needs review',
      passrate: 86,
      openItems: 3,
      nextCert: '12 Aug 2026',
      severity: 'HIGH',
      caseSummary: bi(
        'Reciclador com 3 exceções abertas críticas concentradas em RC-03 (reconciliação de volume). Mass balance drift de 2.1% em MS-…318 sem explicação. Certificação vence em 43 dias, precisa fechar o caso antes.',
        'Recycler with 3 open critical exceptions clustered on RC-03 (volume reconciliation). Mass balance drift of 2.1% on MS-…318 unexplained. Certification expires in 43 days — case must close before.'
      ),
      openExceptions: [
        { rule: 'RC-03', title: bi('Mass balance drift 2.1% em MS-…318','Mass balance drift 2.1% on MS-…318'), age: '12 min', severity: 'red' },
        { rule: 'RC-02', title: bi('Throughput 12m em 96% da licença','12m throughput at 96% of permit'), age: '2 d', severity: 'amber' },
        { rule: 'EU-25', title: bi('Sub-load fora do range em WeighEvent MS-…317','Sub-load out of range on WeighEvent MS-…317'), age: '4 d', severity: 'amber' }
      ],
      recentMassIds: [ 'MS-…318 · 1,240 kg · flag RC-03', 'MS-…317 · 980 kg · flag EU-25', 'MS-…316 · 1,050 kg · minted' ]
    },
    'aegean': {
      name: 'Aegean PET Recycling',
      loc: 'PET · Patras, GR',
      status: 'amber', statusPt: 'Observação', statusEn: 'Watch',
      passrate: 96,
      openItems: 2,
      nextCert: '03 Sep 2026',
      severity: 'MED',
      caseSummary: bi(
        'Reciclador em observação. 2 pendências de documentação: confirmação de recepção do import Bari (WSR Art. 15) e KYC do novo processador Ionian Sort (RC-06).',
        'Recycler on watch. 2 documentation items: Bari import reception confirmation (WSR Art. 15) and KYC for the new processor Ionian Sort (RC-06).'
      ),
      openExceptions: [
        { rule: 'WSR Art. 15', title: bi('Confirmação de recepção >2 dias úteis em MS-…454','Reception confirmation >2 working days on MS-…454'), age: '5 h', severity: 'amber' },
        { rule: 'RC-06', title: bi('Ionian Sort sem cert. RecyClass/EuCertPlast','Ionian Sort missing RecyClass/EuCertPlast cert'), age: '2 d', severity: 'amber' }
      ],
      recentMassIds: [ 'MS-…454 · 510 kg · held', 'MS-…453 · 640 kg · flag doc', 'MS-…452 · 880 kg · minted', 'MS-…451 · 1,025 kg · minted' ]
    },
    'iberia': {
      name: 'Iberia Recikla',
      loc: 'HDPE/PET · Valencia, ES',
      status: 'amber', statusPt: 'Observação', statusEn: 'Watch',
      passrate: 94,
      openItems: 2,
      nextCert: '20 Sep 2026',
      severity: 'MED',
      caseSummary: bi(
        'Cliente com dependência de subcontratado não certificado. RC-06 falha para lotes roteados via "Sud-Est Sorting" (sem prova RecyClass/EuCertPlast). Precisa remediar antes que afete pipeline de certificação.',
        'Client depends on uncertified subcontractor. RC-06 fails for batches routed via "Sud-Est Sorting" (no RecyClass/EuCertPlast proof). Must remediate before it hits the certification pipeline.'
      ),
      openExceptions: [
        { rule: 'RC-06', title: bi('Subcontratado Sud-Est Sorting sem cert','Subcontractor Sud-Est Sorting uncertified'), age: '3 h', severity: 'amber' },
        { rule: 'DOC', title: bi('Licença Sud-Est Sorting não anexada','Sud-Est Sorting permit not attached'), age: '1 d', severity: 'amber' }
      ],
      recentMassIds: [ 'MS-…612 · 780 kg · flag RC-06', 'MS-…611 · 920 kg · minted', 'MS-…610 · 1,150 kg · minted' ]
    },
    'nordic': {
      name: 'Nordic Repro',
      loc: 'PP · Malmö, SE',
      status: 'green', statusPt: 'Limpo', statusEn: 'Clean',
      passrate: 100,
      openItems: 0,
      nextCert: '28 Sep 2026',
      severity: 'LOW',
      caseSummary: bi(
        'Cliente exemplar. Pass rate 100% nas 6 regras RC + 133 regras EU/PURE. Zero exceções abertas em 6 meses. Cadeia intacta.',
        'Model client. 100% pass rate on all 6 RC rules + 133 EU/PURE rules. Zero open exceptions in 6 months. Chain intact.'
      ),
      openExceptions: [],
      recentMassIds: [ 'MS-…512 · 1,340 kg · minted 4 min', 'MS-…511 · 1,200 kg · minted 1h', 'MS-…510 · 1,180 kg · minted 3h' ]
    }
  };

  var AU_EXCEPTIONS = [
    {
      key: 'exc-drift', severity: 'red',
      title: bi('Desvio de mass balance — Adriatic Polymers','Mass-balance drift — Adriatic Polymers'),
      body: bi('Saída excede entrada em 2,1% em MS-…318 · reconciliação RC-03 falha · inexplicado.','Output exceeds input by 2.1% on MS-…318 · RC-03 reconciliation fails · unexplained.'),
      client: 'adriatic', rule: 'RC-03', massid: 'MS-…318',
      remediation: bi('Auditar WeighEvents entre pickup e output batch. Confirmar calibração de balança. Se persistir, exigir explicação em campo do operador.','Audit WeighEvents between pickup and output batch. Confirm scale calibration. If persists, request operator field explanation.')
    },
    {
      key: 'exc-double', severity: 'red',
      title: bi('Possível duplo uso cross-client','Possible double-count across clients'),
      body: bi('MassID MS-2026-000451 referenciado por dois detentores de certificado. Só a visão cross-client captura isso.','MassID MS-2026-000451 referenced by two certificate holders. Only cross-client view catches this.'),
      client: null, rule: 'RC-04', massid: 'MS-2026-000451',
      remediation: bi('Suspender emissão de crédito. Contactar os dois holders. Cadeia de custódia primária vence — verificar hash chain de origem.','Suspend credit issuance. Contact both holders. Primary chain of custody prevails — verify origin hash chain.')
    },
    {
      key: 'exc-rc06', severity: 'amber',
      title: bi('Subcontratado não certificado — Iberia Recikla','Subcontractor not certified — Iberia Recikla'),
      body: bi('RC-06: lote roteado para instalação sem prova RecyClass/EuCertPlast no arquivo.','RC-06: batch routed to a facility with no RecyClass/EuCertPlast proof on file.'),
      client: 'iberia', rule: 'RC-06', massid: 'MS-…612',
      remediation: bi('Solicitar certificação do subcontratado Sud-Est Sorting. Se não regularizar em 15 dias, remover da cadeia de custódia elegível.','Request Sud-Est Sorting certification. If not resolved in 15 days, remove from eligible chain of custody.')
    },
    {
      key: 'exc-art15', severity: 'amber',
      title: bi('Confirmação de recepção em atraso — Aegean PET','Reception confirmation overdue — Aegean PET'),
      body: bi('Art. 15 (WSR): >2 dias úteis desde a chegada no cross-border MS-…454.','Art. 15 (WSR): >2 working days since arrival on cross-border MS-…454.'),
      client: 'aegean', rule: 'WSR Art. 15', massid: 'MS-…454',
      remediation: bi('Confirmar recepção pelo reciclador ou emitir justificativa. Sem resolução em 24h, elevar para exceção RED.','Confirm reception by recycler or issue justification. Unless resolved in 24h, escalate to RED exception.')
    }
  ];

  var AU_RULES = {
    'RC-01': { title: bi('Licença de resíduos válida','Valid waste permit'), pass: 24, fail: 0, failing: [], desc: bi('Verificado em toda ingestão de MassID.','Verified at every MassID ingestion.') },
    'RC-02': { title: bi('Dentro da capacidade licenciada','Within permitted throughput'), pass: 23, fail: 1, failing: ['adriatic'], desc: bi('Rolling 12 meses. Adriatic está em 96% da licença — próximo do teto.','Rolling 12 months. Adriatic sitting at 96% of permit — near ceiling.') },
    'RC-03': { title: bi('Reconciliação de volume','Volume reconciliation'), pass: 23, fail: 1, failing: ['adriatic'], desc: bi('5 categorias reconciliadas mensalmente. Adriatic com drift 2.1% em jun/26.','5 categories reconciled monthly. Adriatic showing 2.1% drift for Jun/26.') },
    'RC-04': { title: bi('Split pré/pós-consumo documentado','Pre/post-consumer split documented'), pass: 24, fail: 0, failing: [], desc: bi('Todos os 24 recicladores registram split verificado por lote.','All 24 recyclers log verified per-batch split.') },
    'RC-05': { title: bi('Nível de rastreabilidade ↔ claim','Traceability level ↔ claim'), pass: 24, fail: 0, failing: [], desc: bi('Cada claim comercial mapeia ao nível L1/L2/L3 correspondente.','Every commercial claim maps to the corresponding L1/L2/L3 level.') },
    'RC-06': { title: bi('Subcontratados certificados','Subcontractors certified'), pass: 22, fail: 2, failing: ['iberia','adriatic'], desc: bi('Iberia com Sud-Est Sorting sem cert; Adriatic com Balkan Reprocess pendente.','Iberia uses Sud-Est Sorting without cert; Adriatic has Balkan Reprocess pending.') }
  };

  var AU_CHECKLIST = [
    { rule: 'RC-01', label: bi('Licença de resíduos válida & cobre país da planta','Waste permit valid & covers site country'), state: 'auto-done', src: bi('verificado da licença enviada, em dia','verified from uploaded permit, in date') },
    { rule: 'RC-02', label: bi('Throughput dos últimos 12 meses dentro da licença','12-month throughput within license'), state: 'auto-done', src: bi('computado dos inputs MassID','computed from MassID inputs') },
    { rule: 'RC-03', label: bi('Reconciliar a discrepância de 2,1% de mass balance','Reconcile the 2.1% mass-balance discrepancy'), state: 'field-err', src: bi('flagado — exige explicação do operador em campo','flagged — requires operator explanation on site') },
    { rule: 'RC-04', label: bi('Evidência do split de conteúdo reciclado presente','Recycled-content split evidence present'), state: 'auto-done', src: bi('pré/pós documentado por lote','pre/post documented per batch') },
    { rule: 'RC-05', label: bi('Separação física de bay & esvaziamento','Physical bay separation & bay-emptying'), state: 'field-pending', src: bi('confirmar no chão de fábrica pra claims L2','confirm on the floor for L2 claims') },
    { rule: 'HK', label: bi('Housekeeping & qualidade de input','Housekeeping & input quality'), state: 'field-pending', src: bi('visual — não sensível remotamente','visual — not sensable remotely') }
  ];

  var AU_CROSS = [
    { icon: '⇄', title: bi('Detecção cross-client de duplo uso','Cross-client double-count detection'),
      example: bi('MS-2026-000451 apareceu em Aegean PET (holder primário) e Nordic Repro (holder proposto).','MS-2026-000451 appeared in Aegean PET (primary holder) and Nordic Repro (proposed holder).'),
      value: bi('Impede que duas certificações reivindiquem o mesmo material. Só a plataforma vê a rede toda.','Prevents two certifications from claiming the same material. Only the platform sees the whole network.') },
    { icon: '⚠', title: bi('Propagação de risco por fornecedor compartilhado','Shared-supplier risk propagation'),
      example: bi('HelleniLog Ltd (hauler) supre 3 dos 24 clientes. Se a licença dele cair, 3 exceções amanhecem juntas.','HelleniLog Ltd (hauler) supplies 3 of the 24 clients. If its licence lapses, 3 exceptions surface at once.'),
      value: bi('Alerta preventivo antes que a exceção afete múltiplos clientes.','Preventive alert before the exception hits multiple clients.') },
    { icon: '↗', title: bi('Score de prontidão regulatória','Regulatory-readiness scoring'),
      example: bi('PPWR 2028 · 30% post-consumer food-grade obrigatório. 6 dos 24 clientes ainda em 22%.','PPWR 2028 · 30% post-consumer food-grade mandatory. 6 of the 24 clients still at 22%.'),
      value: bi('Vira pipeline de consultoria pra Kiwa. Cada cliente vale ~€22k de remediation ticket.','Turns into consulting pipeline for Kiwa. Each client worth ~€22k remediation ticket.') },
    { icon: '◉', title: bi('Cross-sell por gap de cobertura','Coverage-gap cross-sell'),
      example: bi('Nordic Repro certifica planta Malmö mas tem planta Göteborg (mesmo fluxo) sem certificação.','Nordic Repro certifies Malmö plant but has Göteborg plant (same flow) uncertified.'),
      value: bi('Expansão pré-qualificada. Evidência da planta mãe reduz onboarding do irmão em 60%.','Pre-qualified expansion. Parent plant evidence cuts sibling onboarding by 60%.') }
  ];

  /* ---------- Auditor: Live cells ---------- */
  function wireAuLive() {
    var live = document.getElementById('live');
    if (!live) return;
    var cells = live.querySelectorAll('.au-live-cell');
    var meta = [
      { title: bi('MassIDs verificados este mês','MassIDs verified this month'),
        body: bi('21,400 MassIDs mintados nos últimos 30 dias no portfolio. Média por cliente ativo: 892. Todos hash-anchored SHA-256.','21,400 MassIDs minted in the last 30 days across the portfolio. Average per active client: 892. All SHA-256 hash-anchored.'),
        kv: [ ['Adriatic', '2,140'], ['Aegean PET', '1,820'], ['Iberia Recikla', '2,010'], ['Nordic Repro', '1,940'], [bi('20 outros','20 others'), '13,490'] ] },
      { title: bi('Verificados hoje','Verified today'),
        body: bi('184 MassIDs entraram no engine hoje até 15:47. Pico de 22 no bloco 10:00-11:00. Nenhum falhou hash check.','184 MassIDs entered the engine today until 15:47. Peak of 22 in the 10:00-11:00 block. Zero hash check failures.'),
        kv: [ ['06:00-10:00', '38'], ['10:00-14:00', '92'], ['14:00-16:00', '54'] ] },
      { title: bi('Aguardando revisão','Awaiting review'),
        body: bi('12 MassIDs em fila. Todos passaram o engine mas estão marcados como FLAG (não BLOCK). SLA interno de triagem: 4h.','12 MassIDs queued. All passed the engine but marked FLAG (not BLOCK). Internal triage SLA: 4h.'),
        kv: [ ['Adriatic', '3'], ['Aegean PET', '2'], ['Iberia Recikla', '2'], [bi('outros','others'), '5'] ] },
      { title: bi('Flagados — precisam de você','Flagged — need you'),
        body: bi('3 exceções BLOCK sem resolução. Cada uma bloqueia emissão de crédito até revisão do auditor.','3 BLOCK exceptions unresolved. Each blocks credit issuance until auditor review.'),
        kv: [ [bi('Adriatic RC-03','Adriatic RC-03'), '12 min'], [bi('MS-…451 duplo','MS-…451 double'), '1 h'], [bi('Iberia RC-06','Iberia RC-06'), '3 h'] ] }
    ];
    cells.forEach(function (c, i) {
      c.setAttribute('data-dash-open', 'au-live-' + i);
      c.style.cursor = 'pointer';
      c.addEventListener('click', function () {
        openDrawer({
          eyebrow: bi('Portfolio live','Portfolio live'),
          title: meta[i].title,
          body:
            '<div class="dash-section"><div class="dash-note">' + meta[i].body + '</div></div>' +
            '<div class="dash-section"><div class="dash-section-lab">' + bi('Distribuição','Breakdown') + '</div>' +
            meta[i].kv.map(function (r) { return '<div class="dash-kv"><span class="k">' + r[0] + '</span><span class="v">' + r[1] + '</span></div>'; }).join('') +
            '</div>',
          footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
        });
        var close = currentDrawer.querySelector('[data-close]');
        if (close) close.addEventListener('click', closeAll);
      });
    });
    // Side "last event" card
    var side = live.querySelector('.au-live-side');
    if (side) {
      side.setAttribute('data-dash-open', 'au-live-last');
      side.style.cursor = 'pointer';
      side.addEventListener('click', function () {
        openDrawer({
          eyebrow: bi('Último evento','Last event'),
          title: 'MS-2026-000512 · Nordic Repro',
          subtitle: bi('Ancorado 4 min atrás · passing todas as 139 regras','Anchored 4 min ago · passing all 139 rules'),
          body:
            '<div class="dash-section">' +
              '<div class="dash-kv"><span class="k">MassID</span><span class="v mono">MS-2026-000512</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Cliente','Client') + '</span><span class="v">Nordic Repro</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Polímero','Polymer') + '</span><span class="v">PP · natural</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Massa','Mass') + '</span><span class="v">1,340 kg</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Regras aprovadas','Rules passed') + '</span><span class="v" style="color:var(--accent-strong);">139 / 139 ✓</span></div>' +
              '<div class="dash-kv"><span class="k">Hash</span><span class="v mono">sha256:8c14…2f01</span></div>' +
              '<div class="dash-kv"><span class="k">Block</span><span class="v mono">62,184,097</span></div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-note">' + bi('Nordic Repro é o cliente mais limpo do portfolio. Pass rate 100% em 6 meses. Este MS-2026-000512 é o 512º MassID desse cliente no ano.','Nordic Repro is the cleanest client in the portfolio. 100% pass rate over 6 months. This MS-2026-000512 is the 512th MassID for this client this year.') + '</div>' +
            '</div>',
          footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
        });
        var c2 = currentDrawer.querySelector('[data-close]');
        if (c2) c2.addEventListener('click', closeAll);
      });
    }
  }

  /* ---------- Auditor: KPIs ---------- */
  function wireAuKpis() {
    var kpis = document.querySelectorAll('.au-kpis .au-kpi');
    if (!kpis.length) return;
    var meta = [
      { title: bi('Clientes certificados','Certified clients'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">' + bi('Total ativos','Total active') + '</span><span class="v">24</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Adicionados no trimestre','Added this quarter') + '</span><span class="v" style="color:var(--accent-strong);">+3</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Renovações vencendo em 90d','Renewals due in 90d') + '</span><span class="v" style="color:var(--warning);">4</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Pipeline de onboarding','Onboarding pipeline') + '</span><span class="v">7</span></div>' +
          '</div>' +
          '<div class="dash-section"><div class="dash-note">' + bi('Crescimento consistente. Cada cliente novo aumenta o efeito de rede das intel cross-client.','Consistent growth. Each new client compounds the network effect of cross-client intel.') + '</div></div>' },
      { title: bi('Clientes limpos & prontos para auditoria','Clients clean & audit-ready'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">' + bi('Verdes (light-touch)','Green (light-touch)') + '</span><span class="v" style="color:var(--accent-strong);">20 / 24</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Observação (amber)','Watch (amber)') + '</span><span class="v" style="color:var(--warning);">3 / 24</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Precisa revisão (red)','Needs review (red)') + '</span><span class="v" style="color:var(--block);">1 / 24</span></div>' +
          '</div>' +
          '<div class="dash-section"><div class="dash-note">' + bi('83% do portfolio pode ser certificado em modo light-touch. Isso é multiplicador direto da margem operacional da Kiwa.','83% of the portfolio can be certified in light-touch mode. Direct multiplier on Kiwa\'s operating margin.') + '</div></div>' },
      { title: bi('Exceções abertas','Open exceptions'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">Total</span><span class="v" style="color:var(--block);">7</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('BLOCK (severidade RED)','BLOCK (RED severity)') + '</span><span class="v" style="color:var(--block);">3</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('FLAG (severidade AMBER)','FLAG (AMBER severity)') + '</span><span class="v" style="color:var(--warning);">4</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Distribuídas por','Distributed across') + '</span><span class="v">4 ' + bi('clientes','clients') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Média de idade','Average age') + '</span><span class="v">1.8 ' + bi('dias','days') + '</span></div>' +
          '</div>' +
          '<div class="dash-section"><div class="dash-note">' + bi('SLA interno de triagem: 4h. 5 das 7 estão dentro do SLA.','Internal triage SLA: 4h. 5 of the 7 are within SLA.') + '</div></div>' },
      { title: bi('Tempo médio de prep de auditoria','Avg audit prep time'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">' + bi('Prep médio (auto)','Average prep (auto)') + '</span><span class="v">2h</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Benchmark manual','Manual benchmark') + '</span><span class="v" style="color:var(--ink-faint);">~40h</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Economia por auditoria','Savings per audit') + '</span><span class="v" style="color:var(--accent-strong);">~38h · 95%</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Auditorias/mês','Audits per month') + '</span><span class="v">18</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Horas liberadas/mês','Hours freed per month') + '</span><span class="v" style="color:var(--accent-strong);">~684h</span></div>' +
          '</div>' +
          '<div class="dash-section"><div class="dash-note">' + bi('Cada hora liberada da equipe sênior vira hora de auditoria adicional ou nova certificação. Isso paga a plataforma diretamente.','Every hour of senior time freed becomes an additional audit hour or new certification. Direct platform payback.') + '</div></div>' }
    ];
    kpis.forEach(function (k, i) {
      k.setAttribute('data-dash-open', 'au-kpi-' + i);
      k.style.cursor = 'pointer';
      k.style.transition = 'transform 160ms, box-shadow 160ms, border-color 160ms';
      k.addEventListener('mouseenter', function () {
        k.style.transform = 'translateY(-2px)';
        k.style.boxShadow = '0 6px 18px oklch(15% 0.03 220 / 0.08)';
        k.style.borderColor = 'var(--accent)';
      });
      k.addEventListener('mouseleave', function () {
        k.style.transform = ''; k.style.boxShadow = ''; k.style.borderColor = '';
      });
      k.addEventListener('click', function () {
        openDrawer({
          eyebrow: bi('KPI · portfolio','KPI · portfolio'),
          title: meta[i].title,
          body: meta[i].body,
          footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
        });
        var close = currentDrawer.querySelector('[data-close]');
        if (close) close.addEventListener('click', closeAll);
      });
    });
  }

  /* ---------- Auditor: Client triage ---------- */
  function wireAuTriage() {
    var rows = document.querySelectorAll('#triage .au-triage-row');
    if (!rows.length) return;
    var keys = ['adriatic', 'aegean', 'iberia', 'nordic', 'others'];
    rows.forEach(function (row, i) {
      var key = keys[i];
      row.setAttribute('data-dash-open', 'au-client-' + key);
      var btn = row.querySelector('.au-btn');
      // Clicar na row (fora do botao) abre profile
      row.addEventListener('click', function (e) {
        if (e.target.closest('button')) return;
        if (key === 'others') openAuOthersDrawer();
        else openAuClientProfile(key);
      });
      // Click no botão dispara ação específica
      if (btn) {
        btn.addEventListener('click', function (e) {
          e.stopPropagation();
          if (key === 'adriatic') openAuOpenCase();
          else if (key === 'aegean' || key === 'iberia') openAuReview(key);
          else if (key === 'nordic') openAuLightTouch();
          else openAuOthersDrawer();
        });
      }
    });
  }

  function openAuClientProfile(key) {
    var c = AU_CLIENTS[key];
    if (!c) return;
    var color = c.status === 'red' ? 'var(--block)' : (c.status === 'amber' ? 'var(--warning)' : 'var(--accent-strong)');
    var excHtml = c.openExceptions.length
      ? c.openExceptions.map(function (e) {
          var sc = e.severity === 'red' ? 'var(--block)' : 'var(--warning)';
          return '<div class="dash-kv"><span class="k"><strong style="color:' + sc + ';">' + e.rule + '</strong> · ' + e.title + '</span><span class="v mono">' + e.age + '</span></div>';
        }).join('')
      : '<div class="dash-note" style="background:oklch(96% 0.03 150);">' + bi('Sem exceções abertas · portfolio limpo','No open exceptions · clean portfolio') + '</div>';
    openDrawer({
      eyebrow: bi('Perfil de cliente · portfolio','Client profile · portfolio'),
      title: c.name,
      subtitle: c.loc,
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">Status</span><span class="v" style="color:' + color + ';">' + bi(c.statusPt, c.statusEn) + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Pass rate','Pass rate') + '</span><span class="v">' + c.passrate + '%</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Itens abertos','Open items') + '</span><span class="v">' + c.openItems + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Próxima certificação','Next certification') + '</span><span class="v mono">' + c.nextCert + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Severidade','Severity') + '</span><span class="v">' + c.severity + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Sumário do caso','Case summary') + '</div>' +
          '<div class="dash-note">' + c.caseSummary + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Exceções abertas','Open exceptions') + '</div>' +
          excHtml +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('MassIDs recentes','Recent MassIDs') + '</div>' +
          c.recentMassIds.map(function (m) { return '<div class="dash-kv"><span class="k">' + m + '</span><span class="v"></span></div>'; }).join('') +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        (c.status !== 'green' ? '<button type="button" class="dash-btn primary" data-schedule>' + bi('Agendar revisão','Schedule review') + '</button>' : '')
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var sc = currentDrawer.querySelector('[data-schedule]');
    if (sc) sc.addEventListener('click', function () {
      mockAction(sc, function () {
        closeAll();
        toast({ title: bi('Revisão agendada','Review scheduled'), msg: c.name + ' · ' + bi('próxima janela disponível','next available window') });
      });
    });
  }

  function openAuOpenCase() {
    var c = AU_CLIENTS['adriatic'];
    openModal({
      title: bi('Abrir caso · Adriatic Polymers','Open case · Adriatic Polymers'),
      subtitle: bi('3 exceções críticas · cert vence em 43 dias','3 critical exceptions · cert expires in 43 days'),
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Diagnóstico','Diagnosis') + '</div>' +
          '<div class="dash-note">' + c.caseSummary + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Ações propostas','Proposed actions') + '</div>' +
          '<div class="dash-kv"><span class="k">1 · ' + bi('Auditar calibração de balanças','Audit scale calibration') + '</span><span class="v mono">RC-03</span></div>' +
          '<div class="dash-kv"><span class="k">2 · ' + bi('Solicitar explicação operador em campo','Request field operator explanation') + '</span><span class="v mono">RC-03</span></div>' +
          '<div class="dash-kv"><span class="k">3 · ' + bi('Solicitar plano de capacidade RC-02','Request RC-02 capacity plan') + '</span><span class="v mono">RC-02</span></div>' +
          '<div class="dash-kv"><span class="k">4 · ' + bi('Anexar evidência calibração EU-25','Attach EU-25 calibration evidence') + '</span><span class="v mono">EU-25</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Prazo sugerido','Suggested SLA') + '</div>' +
          '<div class="dash-note warn"><strong>' + bi('7 dias','7 days') + '</strong> ' + bi('para primeira resposta · 15 dias para plano de remediação.','for first response · 15 days for remediation plan.') + '</div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-cancel>' + bi('Cancelar','Cancel') + '</button>' +
        '<button type="button" class="dash-btn primary" data-assign>' + bi('Abrir caso & atribuir auditor','Open case & assign auditor') + '</button>'
    });
    wireCancel();
    var ass = currentModal.querySelector('[data-assign]');
    ass.addEventListener('click', function () {
      mockAction(ass, function () {
        closeAll();
        toast({ title: bi('Caso aberto','Case opened'), msg: bi('Adriatic Polymers · auditor sênior atribuído · notificação enviada','Adriatic Polymers · senior auditor assigned · notification sent') });
      });
    });
  }

  function openAuReview(key) {
    var c = AU_CLIENTS[key];
    openDrawer({
      eyebrow: bi('Revisar cliente','Review client'),
      title: c.name,
      subtitle: bi('Observação · ','Watch · ') + c.openItems + ' ' + bi('pendências','items'),
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Pass rate breakdown','Pass rate breakdown') + '</div>' +
          '<div class="dash-kv"><span class="k">RC-01 · ' + bi('Licença','Permit') + '</span><span class="v" style="color:var(--accent-strong);">✓ pass</span></div>' +
          '<div class="dash-kv"><span class="k">RC-02 · ' + bi('Throughput','Throughput') + '</span><span class="v" style="color:var(--accent-strong);">✓ pass</span></div>' +
          '<div class="dash-kv"><span class="k">RC-03 · ' + bi('Reconciliação','Reconciliation') + '</span><span class="v" style="color:var(--accent-strong);">✓ pass</span></div>' +
          '<div class="dash-kv"><span class="k">RC-04 · ' + bi('Split PC/PPC','PC/PPC split') + '</span><span class="v" style="color:var(--accent-strong);">✓ pass</span></div>' +
          '<div class="dash-kv"><span class="k">RC-05 · ' + bi('Traceability','Traceability') + '</span><span class="v" style="color:var(--accent-strong);">✓ pass</span></div>' +
          '<div class="dash-kv"><span class="k">RC-06 · ' + bi('Subcontratados','Subcontractors') + '</span><span class="v" style="color:' + (key === 'iberia' ? 'var(--warning);">! flag' : 'var(--accent-strong);">✓ pass') + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Pendências a revisar','Items to review') + '</div>' +
          c.openExceptions.map(function (e) {
            var sc = e.severity === 'red' ? 'var(--block)' : 'var(--warning)';
            return '<div class="dash-note ' + (e.severity === 'red' ? '' : 'warn') + '"><strong style="color:' + sc + ';">' + e.rule + '</strong> · ' + e.title + '</div>';
          }).join('<div style="height:0.4rem;"></div>') +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        '<button type="button" class="dash-btn primary" data-schedule>' + bi('Agendar revisão','Schedule review') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var sc = currentDrawer.querySelector('[data-schedule]');
    if (sc) sc.addEventListener('click', function () {
      mockAction(sc, function () {
        closeAll();
        toast({ title: bi('Revisão agendada','Review scheduled'), msg: c.name + ' · ' + bi('convite enviado ao cliente','invite sent to client') });
      });
    });
  }

  function openAuLightTouch() {
    var c = AU_CLIENTS['nordic'];
    openDrawer({
      eyebrow: bi('Protocolo light-touch','Light-touch protocol'),
      title: c.name,
      subtitle: bi('Cliente limpo · pass rate 100% · zero exceções','Clean client · 100% pass rate · zero exceptions'),
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Elegibilidade','Eligibility') + '</div>' +
          '<div class="dash-kv"><span class="k">' + bi('Pass rate 6 meses','6-month pass rate') + '</span><span class="v" style="color:var(--accent-strong);">100%</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Exceções em 6 meses','Exceptions in 6 months') + '</span><span class="v" style="color:var(--accent-strong);">0</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Integridade da cadeia','Chain integrity') + '</span><span class="v" style="color:var(--accent-strong);">' + bi('intacta','intact') + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Elegível light-touch?','Light-touch eligible?') + '</span><span class="v" style="color:var(--accent-strong);">' + bi('Sim','Yes') + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Protocolo light-touch','Light-touch protocol') + '</div>' +
          '<div class="dash-note">' + bi('Auditoria reduzida: check remoto de docs (2h), amostra de 10% dos MassIDs, visita presencial reduzida a 1 dia (vs 3 padrão). Economia estimada: 22h de auditor sênior por certificação.','Reduced audit: remote doc check (2h), 10% MassID sample, in-person visit cut to 1 day (vs standard 3). Estimated savings: 22h of senior auditor time per certification.') + '</div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        '<button type="button" class="dash-btn accent" data-confirm>' + bi('Confirmar light-touch','Confirm light-touch') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var cf = currentDrawer.querySelector('[data-confirm]');
    if (cf) cf.addEventListener('click', function () {
      mockAction(cf, function () {
        closeAll();
        toast({ title: bi('Light-touch confirmado','Light-touch confirmed'), msg: bi('Nordic Repro · protocolo reduzido aplicado à próxima certificação','Nordic Repro · reduced protocol applied to next certification') });
      });
    });
  }

  function openAuOthersDrawer() {
    var others = [
      ['Balticare Recycling', 'PE · Riga, LV', 100, 'green', 0],
      ['Danube Repro', 'PET · Budapest, HU', 100, 'green', 0],
      ['Andalucía Verde', 'HDPE · Sevilla, ES', 100, 'green', 0],
      ['Rhine Circular', 'PP · Düsseldorf, DE', 99, 'green', 1],
      ['Aegean Fibres', 'PET · Athens, GR', 100, 'green', 0],
      ['Baltic Poly', 'PS · Vilnius, LT', 100, 'green', 0],
      ['Loire Recycle', 'PET · Nantes, FR', 100, 'green', 0],
      ['Trilomo Recikla', 'HDPE · Porto, PT', 100, 'green', 0],
      ['Alpine Repro', 'PP · Innsbruck, AT', 100, 'green', 0],
      ['Bavaria Circular', 'PET · Munich, DE', 100, 'green', 0],
      ['Céltica Recycle', 'PS · Cork, IE', 100, 'green', 0],
      ['Nordkap Repro', 'PET · Tromsø, NO', 99, 'amber', 1],
      ['Iberia North', 'HDPE · Bilbao, ES', 100, 'green', 0],
      ['Alentejo Verde', 'PP · Évora, PT', 100, 'green', 0],
      ['Balearic Poly', 'PET · Palma, ES', 100, 'green', 0],
      ['Rhône Circular', 'PE · Lyon, FR', 100, 'green', 0],
      ['Toscana Repro', 'PP · Florence, IT', 100, 'green', 0],
      ['Emilia Poly', 'PET · Bologna, IT', 100, 'green', 0],
      ['Öresund Recycle', 'HDPE · Copenhagen, DK', 100, 'green', 0],
      ['Wallonia Verde', 'PS · Liège, BE', 100, 'green', 0]
    ];
    var rows = others.map(function (r) {
      var col = r[3] === 'green' ? 'var(--accent-strong)' : 'var(--warning)';
      return '<div class="dash-kv"><span class="k">' + r[0] + ' · <em style="color:var(--ink-faint); font-style:normal;">' + r[1] + '</em></span><span class="v" style="color:' + col + ';">' + r[2] + '%' + (r[4] > 0 ? ' · ' + r[4] + ' ' + bi('pend','item') : '') + '</span></div>';
    }).join('');
    openDrawer({
      eyebrow: bi('Portfolio · 20 outros clientes','Portfolio · 20 more clients'),
      title: bi('Clientes de baixo risco','Low-risk clients'),
      subtitle: bi('19 limpos · 1 em observação · pass rate portfolio 99%','19 clean · 1 on watch · portfolio pass rate 99%'),
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Lista completa','Full list') + '</div>' +
          rows +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-note">' + bi('Todos elegíveis a light-touch. Nordkap Repro entrou em observação por 1 pendência RC-06 nas últimas 48h.','All eligible for light-touch. Nordkap Repro entered watch due to 1 RC-06 item in last 48h.') + '</div>' +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Auditor: Exceptions feed ---------- */
  function wireAuExceptions() {
    var items = document.querySelectorAll('#exceptions .au-exc');
    if (!items.length) return;
    items.forEach(function (it, i) {
      var exc = AU_EXCEPTIONS[i];
      if (!exc) return;
      it.setAttribute('data-dash-open', 'au-exc-' + exc.key);
      it.style.cursor = 'pointer';
      it.style.transition = 'background 160ms';
      it.addEventListener('mouseenter', function () { it.style.background = 'var(--surface-raised)'; });
      it.addEventListener('mouseleave', function () { it.style.background = ''; });
      it.addEventListener('click', function () { openAuException(exc); });
    });
  }
  function openAuException(exc) {
    var sc = exc.severity === 'red' ? 'var(--block)' : 'var(--warning)';
    openDrawer({
      eyebrow: bi('Exceção · ','Exception · ') + '<strong style="color:' + sc + ';">' + exc.rule + '</strong>',
      title: exc.title,
      subtitle: exc.body,
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">' + bi('Severidade','Severity') + '</span><span class="v" style="color:' + sc + ';">' + (exc.severity === 'red' ? 'BLOCK · RED' : 'FLAG · AMBER') + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Regra afetada','Rule affected') + '</span><span class="v mono">' + exc.rule + '</span></div>' +
          '<div class="dash-kv"><span class="k">MassID</span><span class="v mono">' + exc.massid + '</span></div>' +
          (exc.client ? '<div class="dash-kv"><span class="k">' + bi('Cliente','Client') + '</span><span class="v">' + AU_CLIENTS[exc.client].name + '</span></div>' : '') +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Remediação proposta','Proposed remediation') + '</div>' +
          '<div class="dash-note ' + (exc.severity === 'red' ? '' : 'warn') + '">' + exc.remediation + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Evidência hash-ancorada','Hash-anchored evidence') + '</div>' +
          '<div class="dash-kv"><span class="k">' + bi('Cadeia','Chain') + '</span><span class="v mono">sha256:9f2a…c41e</span></div>' +
          '<div class="dash-kv"><span class="k">Block</span><span class="v mono">62,184,097</span></div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        (exc.client ? '<button type="button" class="dash-btn" data-goclient>' + bi('Ver cliente','View client') + '</button>' : '') +
        '<button type="button" class="dash-btn primary" data-remediate>' + bi('Iniciar remediação','Start remediation') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var go = currentDrawer.querySelector('[data-goclient]');
    if (go) go.addEventListener('click', function () { closeAll(); setTimeout(function () { openAuClientProfile(exc.client); }, 320); });
    var rem = currentDrawer.querySelector('[data-remediate]');
    if (rem) rem.addEventListener('click', function () {
      mockAction(rem, function () {
        closeAll();
        toast({ title: bi('Remediação iniciada','Remediation started'), msg: bi('Notificação enviada ao cliente · SLA 7 dias','Client notified · 7-day SLA') });
      });
    });
  }

  /* ---------- Auditor: RC-01..06 breakdown ---------- */
  function wireAuRules() {
    var rows = document.querySelectorAll('#rule-compliance .au-rc-row');
    if (!rows.length) return;
    rows.forEach(function (row) {
      var id = (row.querySelector('.id') || {}).textContent;
      if (!id || !AU_RULES[id]) return;
      row.setAttribute('data-dash-open', 'au-rule-' + id);
      row.style.cursor = 'pointer';
      row.style.transition = 'background 160ms';
      row.addEventListener('mouseenter', function () { row.style.background = 'var(--surface-raised)'; });
      row.addEventListener('mouseleave', function () { row.style.background = ''; });
      row.addEventListener('click', function () { openAuRule(id); });
    });
  }
  function openAuRule(id) {
    var r = AU_RULES[id];
    if (!r) return;
    var failingHtml = r.failing.length
      ? r.failing.map(function (k) {
          var c = AU_CLIENTS[k];
          return '<div class="dash-kv"><span class="k"><strong style="color:var(--block);">' + c.name + '</strong> · ' + c.loc + '</span><span class="v" style="color:var(--block);">✗</span></div>';
        }).join('')
      : '<div class="dash-note" style="background:oklch(96% 0.03 150);">' + bi('Nenhum cliente falhando esta regra · portfolio 100% pass','No clients failing this rule · portfolio 100% pass') + '</div>';
    openDrawer({
      eyebrow: bi('Regra RecyClass · ','RecyClass rule · ') + id,
      title: r.title,
      subtitle: bi('Portfolio: ','Portfolio: ') + r.pass + '/' + (r.pass + r.fail),
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">' + bi('Aprovados','Passing') + '</span><span class="v" style="color:var(--accent-strong);">' + r.pass + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Falhando','Failing') + '</span><span class="v" style="color:' + (r.fail > 0 ? 'var(--block)' : 'var(--ink-faint)') + ';">' + r.fail + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Cobertura','Coverage') + '</span><span class="v">' + Math.round(r.pass / (r.pass + r.fail) * 100) + '%</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Descrição','Description') + '</div>' +
          '<div class="dash-note">' + r.desc + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Clientes com falha','Clients failing') + '</div>' +
          failingHtml +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Auditor: Field checklist ---------- */
  function wireAuChecklist() {
    var rows = document.querySelectorAll('#field .au-check-row');
    if (!rows.length) return;
    rows.forEach(function (row, i) {
      var item = AU_CHECKLIST[i];
      if (!item) return;
      row.setAttribute('data-dash-open', 'au-chk-' + i);
      row.style.cursor = 'pointer';
      row.style.transition = 'background 160ms';
      row.addEventListener('mouseenter', function () { row.style.background = 'var(--surface-raised)'; });
      row.addEventListener('mouseleave', function () { row.style.background = ''; });
      row.addEventListener('click', function () { openAuCheck(item, row); });
    });
  }
  function openAuCheck(item, row) {
    if (item.state === 'auto-done') {
      openDrawer({
        eyebrow: bi('Checklist · ','Checklist · ') + item.rule,
        title: item.label,
        subtitle: bi('Auto-validado pela plataforma','Auto-validated by the platform'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">Status</span><span class="v" style="color:var(--accent-strong);">✓ ' + bi('aprovado','passed') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Fonte','Source') + '</span><span class="v">' + item.src + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Método','Method') + '</span><span class="v"><span class="au-lab au-lab-auto" style="font-size:0.5625rem;">auto</span></span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-note">' + bi('Regras deste tipo não exigem visita de campo. A evidência já está anexada ao pack do cliente com hash SHA-256.','Rules of this type don\'t require a field visit. Evidence is already attached to the client pack with SHA-256 hash.') + '</div>' +
          '</div>',
        footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
      });
    } else if (item.state === 'field-err') {
      openDrawer({
        eyebrow: bi('Checklist · ','Checklist · ') + item.rule,
        title: item.label,
        subtitle: bi('Flag ativo · exige revisão em campo','Active flag · requires field review'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">Status</span><span class="v" style="color:var(--block);">! ' + bi('flag','flagged') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Fonte','Source') + '</span><span class="v" style="color:var(--block);">' + item.src + '</span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Ação em campo','Field action') + '</div>' +
            '<div class="dash-note warn">' + bi('Coletar explicação do operador · fotografar sistema de pesagem · anexar aqui como evidência. Assim que resolvido, RC-03 volta a verde.','Get operator explanation · photograph the weighing setup · attach here as evidence. Once resolved, RC-03 returns to green.') + '</div>' +
          '</div>',
        footer:
          '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
          '<button type="button" class="dash-btn accent" data-upload>' + bi('Anexar evidência em campo','Upload field evidence') + '</button>'
      });
    } else {
      openDrawer({
        eyebrow: bi('Checklist · ','Checklist · ') + item.rule,
        title: item.label,
        subtitle: bi('Aguardando visita de campo','Awaiting field visit'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">Status</span><span class="v" style="color:var(--warning);">' + bi('pendente','pending') + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Método','Method') + '</span><span class="v"><span class="au-lab au-lab-field" style="font-size:0.5625rem;">field</span></span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Fonte','Source') + '</span><span class="v">' + item.src + '</span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-note">' + bi('Visita de campo agendada para 15 jul. Fotografar, anotar e fazer upload da evidência aqui mesmo.','Field visit scheduled for 15 Jul. Photograph, note, and upload evidence right here.') + '</div>' +
          '</div>',
        footer:
          '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
          '<button type="button" class="dash-btn accent" data-upload>' + bi('Anexar evidência em campo','Upload field evidence') + '</button>'
      });
    }
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var up = currentDrawer.querySelector('[data-upload]');
    if (up) up.addEventListener('click', function () {
      mockAction(up, function () {
        closeAll();
        toast({ title: bi('Evidência anexada','Evidence uploaded'), msg: item.rule + ' · ' + bi('checklist atualizado','checklist updated') });
        if (row) {
          var checkbox = row.querySelector('.au-checkbox');
          if (checkbox) { checkbox.className = 'au-checkbox done'; checkbox.textContent = '✓'; }
          var label = row.querySelector('.au-check-label');
          if (label) label.classList.add('done');
          var status = row.querySelector('.au-check-status');
          if (status) { status.className = 'au-check-status done'; status.innerHTML = '<span class="au-lab au-lab-auto">' + bi('anexado','uploaded') + '</span>'; }
        }
      });
    });
  }

  /* ---------- Auditor: Export pack + verifiable link ---------- */
  function wireAuPack() {
    var pack = document.getElementById('pack');
    if (!pack) return;
    var buttons = pack.querySelectorAll('button');
    buttons.forEach(function (btn) {
      var text = btn.textContent.toLowerCase();
      btn.addEventListener('click', function () {
        if (text.indexOf('export') !== -1 || text.indexOf('exportar') !== -1 || text.indexOf('pack') !== -1) {
          mockAction(btn, function () {
            toast({ title: bi('Pacote exportado','Pack exported'), msg: bi('audit-pack-adriatic-2026-07-10.zip · PDF + CSV + hash trail','audit-pack-adriatic-2026-07-10.zip · PDF + CSV + hash trail') });
          });
        } else if (text.indexOf('link') !== -1 || text.indexOf('verificável') !== -1 || text.indexOf('verifiable') !== -1) {
          mockAction(btn, function () {
            var url = 'https://carrot.eco/verify/audit/adriatic-2026-07-10';
            if (navigator.clipboard) navigator.clipboard.writeText(url);
            toast({ title: bi('Link copiado','Link copied'), msg: url });
          });
        }
      });
    });
    // Strip hash-anchored clicável
    var strip = pack.querySelector('.au-ev-strip');
    if (strip) {
      strip.style.cursor = 'pointer';
      strip.addEventListener('click', function () {
        openModal({
          title: bi('Hash chain SHA-256','SHA-256 hash chain'),
          subtitle: bi('Ancorado na Carrot Network · 1.284 eventos deste cliente','Anchored on Carrot Network · 1,284 events for this client'),
          body:
            '<div class="dash-preview-card">' +
              '<h4>0x7b…a2f9</h4>' +
              '<div class="pc-sub">Block 62,184,097 · 15 Jun 2026 14:22 UTC</div>' +
              '<div class="pc-hash">' + bi('Última âncora · nenhum evento alterado desde então','Last anchor · no event altered since') + '</div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-kv"><span class="k">' + bi('Eventos ancorados','Events anchored') + '</span><span class="v">1,284</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Integridade','Integrity') + '</span><span class="v" style="color:var(--accent-strong);">' + bi('intacta · 0 quebras','intact · 0 breaks') + '</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Documentos','Documents') + '</span><span class="v">36 tipos</span></div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-note">' + bi('Cada MassID linka ao anterior via prev→next hash SHA-256. Alteração em qualquer evento quebra a cadeia visualmente. Auditoria verifica no bloco público sem depender da plataforma.','Every MassID links to the previous via prev→next SHA-256 hash. Any event alteration visibly breaks the chain. Audit verifies on public block without depending on the platform.') + '</div>' +
            '</div>',
          footer:
            '<button type="button" class="dash-btn" data-cancel>' + bi('Fechar','Close') + '</button>' +
            '<button type="button" class="dash-btn primary" data-copyhash>' + bi('Copiar hash','Copy hash') + '</button>'
        });
        wireCancel();
        var ch = currentModal.querySelector('[data-copyhash]');
        if (ch) ch.addEventListener('click', function () {
          mockAction(ch, function () {
            if (navigator.clipboard) navigator.clipboard.writeText('0x7b…a2f9');
            toast({ title: bi('Hash copiado','Hash copied'), msg: '0x7b…a2f9' });
          });
        });
      });
    }
  }

  /* ---------- Auditor: Cross-client intelligence ---------- */
  function wireAuCrossClient() {
    var cells = document.querySelectorAll('#cross-client .au-cross-cell');
    if (!cells.length) return;
    cells.forEach(function (c, i) {
      var info = AU_CROSS[i];
      if (!info) return;
      c.setAttribute('data-dash-open', 'au-cross-' + i);
      c.style.cursor = 'pointer';
      c.style.transition = 'transform 160ms, border-color 160ms';
      c.addEventListener('mouseenter', function () {
        c.style.transform = 'translateY(-2px)';
        c.style.borderColor = 'var(--accent)';
      });
      c.addEventListener('mouseleave', function () {
        c.style.transform = '';
        c.style.borderColor = '';
      });
      c.addEventListener('click', function () {
        openDrawer({
          eyebrow: bi('Rede · intel cross-client','Network · cross-client intel'),
          title: info.title,
          body:
            '<div class="dash-section">' +
              '<div class="dash-section-lab">' + bi('Padrão detectado','Pattern detected') + '</div>' +
              '<div class="dash-note">' + info.example + '</div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-section-lab">' + bi('Valor pro auditor','Value to the auditor') + '</div>' +
              '<div class="dash-note" style="background:oklch(96% 0.03 150);">' + info.value + '</div>' +
            '</div>',
          footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
        });
        var close = currentDrawer.querySelector('[data-close]');
        if (close) close.addEventListener('click', closeAll);
      });
    });
  }

  /* ---------- Auditor: Tooltips ---------- */
  function wireAuTooltips() {
    // Passrate bars
    document.querySelectorAll('#triage .au-passrate').forEach(function (pr) {
      pr.addEventListener('mouseenter', function (e) {
        var pct = (pr.querySelector('.pct') || {}).textContent;
        var bar = pr.querySelector('.au-barmini i');
        var color = bar && bar.classList.contains('red') ? bi('vermelho — precisa revisão','red — needs review') : (bar && bar.classList.contains('amber') ? bi('amber — em observação','amber — on watch') : bi('verde — limpo','green — clean'));
        showTip('<span class="tip-num">' + pct + '</span><strong>' + bi('Pass rate','Pass rate') + '</strong><br>' + color, e);
      });
      pr.addEventListener('mousemove', moveTip);
      pr.addEventListener('mouseleave', hideTip);
    });

    // RC-01..06 bars
    document.querySelectorAll('#rule-compliance .au-rc-row .track').forEach(function (t) {
      t.addEventListener('mouseenter', function (e) {
        var row = t.closest('.au-rc-row');
        var id = row ? (row.querySelector('.id') || {}).textContent : '';
        var r = AU_RULES[id];
        if (!r) return;
        var extra = r.failing.length
          ? bi('Falhando: ','Failing: ') + r.failing.map(function (k) { return AU_CLIENTS[k].name; }).join(', ')
          : bi('Portfolio 100% aprovado','Portfolio 100% pass');
        showTip('<span class="tip-num">' + r.pass + '/' + (r.pass + r.fail) + '</span><strong>' + id + ' · ' + r.title + '</strong><br>' + extra, e);
      });
      t.addEventListener('mousemove', moveTip);
      t.addEventListener('mouseleave', hideTip);
    });

    // Exception fdots
    document.querySelectorAll('#exceptions .au-exc .fdot').forEach(function (dot) {
      dot.addEventListener('mouseenter', function (e) {
        var sev = dot.classList.contains('red') ? 'BLOCK · RED' : 'FLAG · AMBER';
        var txt = dot.classList.contains('red') ? bi('Bloqueia emissão de crédito até resolução.','Blocks credit issuance until resolved.') : bi('Sinal de alerta · não bloqueia · triagem obrigatória.','Warning signal · does not block · triage required.');
        showTip('<strong>' + sev + '</strong><br>' + txt, e);
      });
      dot.addEventListener('mousemove', moveTip);
      dot.addEventListener('mouseleave', hideTip);
    });

    // Live cells
    document.querySelectorAll('#live .au-live-cell').forEach(function (cell) {
      cell.addEventListener('mouseenter', function (e) {
        showTip(bi('Clique para ver o breakdown','Click to see breakdown'), e);
      });
      cell.addEventListener('mousemove', moveTip);
      cell.addEventListener('mouseleave', hideTip);
    });
  }

  /* =============================================================
     BENCHMARK DASHBOARD · handlers
     ============================================================= */

  var BN_METRICS = {
    tons: {
      title: bi('Toneladas processadas / mês','Tons processed / mo'),
      you: '4.820 t',
      peerAvg: '4.340 t',
      delta: bi('+11% acima da média','+11% above average'),
      trend: bi('▲ 6.2% vs período anterior','▲ 6.2% vs prior period'),
      source: bi('Somatório do MassID.eligibleKg por planta / mês. Fonte canônica: engine de validação, sincronizada com escalas certificadas.','Sum of MassID.eligibleKg per plant / month. Canonical source: validation engine, synced with certified scales.'),
      driver: bi('Cascade opera 312 cargas/mês vs 268 média do segmento. Diferença vem de utilização de linha superior (2 turnos vs 1.5).','Cascade runs 312 loads/mo vs 268 segment average. Difference comes from higher line utilisation (2 shifts vs 1.5).')
    },
    diversion: {
      title: bi('Taxa de aproveitamento','Diversion rate'),
      you: '71%',
      peerAvg: '65%',
      delta: bi('+6 pts acima da média','+6 pts above average'),
      trend: bi('▲ 2.1 pts vs período anterior','▲ 2.1 pts vs prior period'),
      source: bi('Output vendável ÷ input bruto por MassBalanceReconciliation mensal. Reconciliado contra as 5 categorias RC-03.','Sellable output ÷ gross input from monthly MassBalanceReconciliation. Reconciled against the 5 RC-03 categories.'),
      driver: bi('Cascade tem contamination rate 4% menor que peers. Origem: pré-sorting na origem em 60% dos ingressos.','Cascade runs contamination 4% below peers. Driver: source-side pre-sorting on 60% of intake.')
    },
    quality: {
      title: bi('Nota de qualidade do dado','Data quality score'),
      you: '92 / 100',
      peerAvg: '81 / 100',
      delta: bi('+11 pts acima da média','+11 pts above average'),
      trend: bi('▲ 3 pts vs período anterior','▲ 3 pts vs prior period'),
      source: bi('Compostagem: 40% completude (todos campos obrigatórios preenchidos), 35% integridade hash (payload/mass), 25% temporalidade (timestamps consistentes).','Composed of: 40% completeness (all mandatory fields), 35% hash integrity (payload/mass), 25% timeliness (consistent timestamps).'),
      driver: bi('Todas as ingestões automatizadas via API + hardware certificado. Zero entrada manual em 60 dias.','All ingestion automated via API + certified hardware. Zero manual entry in 60 days.')
    },
    trace: {
      title: bi('Chain-of-custody verificada','Chain-of-custody verified'),
      you: '88%',
      peerAvg: '76%',
      delta: bi('+12 pts acima da média','+12 pts above average'),
      trend: bi('▼ 1.4 pts vs período anterior','▼ 1.4 pts vs prior period'),
      source: bi('% dos MassIDs com hash chain SHA-256 intacta do generator até output, sem gap. Verificado contra event log ancorado.','% of MassIDs with intact SHA-256 hash chain from generator to output, no gap. Verified against anchored event log.'),
      driver: bi('Queda de 1.4 pts veio de 3 novos generators com KYC incompleto. Fechando esses gaps sobe pra 92%.','1.4 pt drop came from 3 new generators with incomplete KYC. Closing those gaps returns to 92%.')
    }
  };

  var BN_SEG_NAMES = {
    large: bi('Large Processors','Large Processors'),
    regional: bi('Regional Collector Networks','Regional Collector Networks'),
    national: bi('National MRF Networks','National MRF Networks'),
    all: bi('Todos os segmentos','All peer segments')
  };

  /* ---------- Benchmark: Score card verde escuro ---------- */
  function wireBnScore() {
    var score = document.querySelector('.bn-score');
    if (!score) return;
    score.setAttribute('data-dash-open', 'bn-score');
    score.style.cursor = 'pointer';
    score.style.transition = 'transform 160ms, box-shadow 160ms';
    score.addEventListener('mouseenter', function () {
      score.style.transform = 'translateY(-2px)';
      score.style.boxShadow = '0 10px 24px oklch(15% 0.03 220 / 0.18)';
    });
    score.addEventListener('mouseleave', function () {
      score.style.transform = '';
      score.style.boxShadow = '';
    });
    score.addEventListener('click', function (e) {
      // Se clicou no verify chip, deixa o handler dele agir
      if (e.target.closest('.bn-verify-chip')) return;
      openBnScoreDrawer();
    });
  }
  function openBnScoreDrawer() {
    var seg = document.querySelector('#segmentFilter button.on');
    var segKey = seg ? seg.getAttribute('data-seg') : 'large';
    var pctEl = document.getElementById('indexPct');
    var pct = pctEl ? pctEl.textContent : '84th percentile';
    var num = (document.getElementById('indexNumber') || {}).textContent || '78';
    openDrawer({
      eyebrow: bi('Índice de Recuperação Composto','Composite Recovery Performance Index'),
      title: bi('Sua nota: ','Your score: ') + num + ' / 100',
      subtitle: bi('Você está no ','You rank at the ') + pct + ' · ' + BN_SEG_NAMES[segKey],
      body:
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Como o índice é calculado','How the index is calculated') + '</div>' +
          '<div class="dash-kv"><span class="k">' + bi('Volume & fluxo de material','Material volume & flow') + '</span><span class="v">55%</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Qualidade do dado','Data quality') + '</span><span class="v">25%</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Verificação de chain-of-custody','Chain-of-custody verification') + '</span><span class="v">20%</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Sua contribuição por dimensão','Your contribution by dimension') + '</div>' +
          '<div class="dash-kv"><span class="k">Volume · 4,820 t</span><span class="v" style="color:var(--accent-strong);">39 pts</span></div>' +
          '<div class="dash-kv"><span class="k">Data quality · 92/100</span><span class="v" style="color:var(--accent-strong);">23 pts</span></div>' +
          '<div class="dash-kv"><span class="k">Chain-of-custody · 88%</span><span class="v" style="color:var(--accent-strong);">17.6 pts</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Bônus data-consistency','Data-consistency bonus') + '</span><span class="v" style="color:var(--accent-strong);">-1.6 pts</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Total ponderado','Weighted total') + '</span><span class="v" style="color:var(--accent-strong);"><strong>78</strong></span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Como subir de posição','How to move up') + '</div>' +
          '<div class="dash-note">' + bi('<strong>+3 pontos</strong> se chain-of-custody subir de 88% para 95%: fechar KYC dos 3 generators novos. <strong>+2 pontos</strong> se data quality subir de 92 para 96: eliminar as 4 entradas manuais restantes.','<strong>+3 points</strong> if chain-of-custody rises from 88% to 95%: close KYC of 3 new generators. <strong>+2 points</strong> if data quality rises from 92 to 96: eliminate the 4 remaining manual entries.') + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Fonte da métrica','Metric source') + '</div>' +
          '<div class="dash-kv"><span class="k">Ledger</span><span class="v mono">0x9f2c71a…e83</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Última auditoria','Last audit') + '</span><span class="v mono">8 Jul 2026</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Recomputação','Recompute') + '</span><span class="v">' + bi('mensal','monthly') + '</span></div>' +
        '</div>',
      footer:
        '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>' +
        '<button type="button" class="dash-btn primary" data-export>' + bi('Exportar relatório','Export report') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
    var exp = currentDrawer.querySelector('[data-export]');
    if (exp) exp.addEventListener('click', function () {
      mockAction(exp, function () {
        closeAll();
        toast({ title: bi('Relatório exportado','Report exported'), msg: 'recovery-index-cascade-' + Date.now().toString(36) + '.pdf' });
      });
    });
  }

  /* ---------- Benchmark: 4 headline rows ---------- */
  function wireBnHeadline() {
    var rows = document.querySelectorAll('.bn-headline .bn-headline-row');
    if (!rows.length) return;
    var keys = ['tons','diversion','quality','trace'];
    rows.forEach(function (r, i) {
      var k = keys[i];
      if (!k) return;
      r.setAttribute('data-dash-open', 'bn-hl-' + k);
      r.style.cursor = 'pointer';
      r.style.transition = 'background 160ms, padding-left 160ms';
      r.addEventListener('mouseenter', function () {
        r.style.background = 'oklch(97% 0.02 220 / 0.4)';
        r.style.paddingLeft = '0.35rem';
      });
      r.addEventListener('mouseleave', function () {
        r.style.background = '';
        r.style.paddingLeft = '';
      });
      r.addEventListener('click', function () { openBnMetric(k); });
    });
  }
  function openBnMetric(k) {
    var m = BN_METRICS[k];
    if (!m) return;
    openDrawer({
      eyebrow: bi('Métrica headline','Headline metric'),
      title: m.title,
      subtitle: bi('Você: ','You: ') + m.you + ' · ' + bi('média do segmento: ','segment average: ') + m.peerAvg,
      body:
        '<div class="dash-section">' +
          '<div class="dash-kv"><span class="k">' + bi('Você','You') + '</span><span class="v" style="color:var(--accent-strong);">' + m.you + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Média do segmento','Segment average') + '</span><span class="v">' + m.peerAvg + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Delta','Delta') + '</span><span class="v" style="color:var(--accent-strong);">' + m.delta + '</span></div>' +
          '<div class="dash-kv"><span class="k">' + bi('Tendência','Trend') + '</span><span class="v">' + m.trend + '</span></div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('Fonte do dado','Data source') + '</div>' +
          '<div class="dash-note">' + m.source + '</div>' +
        '</div>' +
        '<div class="dash-section">' +
          '<div class="dash-section-lab">' + bi('O que está por trás','What drives this') + '</div>' +
          '<div class="dash-note" style="background:oklch(96% 0.03 150);">' + m.driver + '</div>' +
        '</div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Benchmark: 4 KPI cards (bn-kcard) ---------- */
  function wireBnKpiCards() {
    var cards = document.querySelectorAll('.bn-kpi-cards .bn-kcard');
    if (!cards.length) return;
    var keys = ['tons','diversion','quality','trace'];
    cards.forEach(function (c, i) {
      var k = keys[i];
      if (!k) return;
      c.setAttribute('data-dash-open', 'bn-kc-' + k);
      c.style.cursor = 'pointer';
      c.style.transition = 'transform 160ms, box-shadow 160ms, border-color 160ms';
      c.addEventListener('mouseenter', function () {
        c.style.transform = 'translateY(-2px)';
        c.style.boxShadow = '0 6px 18px oklch(15% 0.03 220 / 0.08)';
        c.style.borderColor = 'var(--accent)';
      });
      c.addEventListener('mouseleave', function () {
        c.style.transform = '';
        c.style.boxShadow = '';
        c.style.borderColor = '';
      });
      c.addEventListener('click', function () { openBnMetric(k); });
    });
  }

  /* ---------- Benchmark: Leaderboard (event delegation) ---------- */
  function wireBnLeaderboard() {
    var body = document.getElementById('lbBody');
    if (!body) return;
    body.addEventListener('click', function (e) {
      var tr = e.target.closest('tr');
      if (!tr || tr.parentNode !== body) return;
      // Buscar dados da linha
      var cells = tr.querySelectorAll('td');
      if (cells.length < 6) return;
      var name = cells[0].textContent.replace(/YOU/i, '').replace(/·\s*masked/i, '').trim();
      var isYou = tr.classList.contains('you-row');
      var tons = cells[1].textContent.trim();
      var diversion = cells[2].textContent.trim();
      var quality = cells[3].textContent.trim();
      var trace = cells[4].textContent.trim();
      var percentile = cells[5].textContent.trim();
      openBnLbRow({
        name: name, isYou: isYou,
        tons: tons, diversion: diversion, quality: quality, trace: trace, percentile: percentile
      });
    });
    // Hover em row
    body.style.transition = 'background 160ms';
    body.addEventListener('mouseover', function (e) {
      var tr = e.target.closest('tr');
      if (!tr || tr.parentNode !== body) return;
      tr.style.background = 'oklch(97% 0.02 220 / 0.5)';
      tr.style.cursor = 'pointer';
    });
    body.addEventListener('mouseout', function (e) {
      var tr = e.target.closest('tr');
      if (!tr || tr.parentNode !== body) return;
      // Preserva you-row visual
      if (!tr.classList.contains('you-row')) tr.style.background = '';
    });
  }
  function openBnLbRow(row) {
    if (row.isYou) {
      openDrawer({
        eyebrow: bi('Sua posição no segmento','Your segment position'),
        title: 'Cascade Materials Recovery',
        subtitle: bi('Percentil: ','Percentile: ') + row.percentile,
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">' + bi('Toneladas / mês','Tons / mo') + '</span><span class="v">' + row.tons + '</span></div>' +
            '<div class="dash-kv"><span class="k">Diversion rate</span><span class="v">' + row.diversion + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Qualidade','Data quality') + '</span><span class="v">' + row.quality + '</span></div>' +
            '<div class="dash-kv"><span class="k">Chain-of-custody</span><span class="v">' + row.trace + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Percentil','Percentile') + '</span><span class="v" style="color:var(--accent-strong);"><strong>' + row.percentile + '</strong></span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Gap até o líder','Gap to leader') + '</div>' +
            '<div class="dash-note">' + bi('O líder atual do segmento está no 91º percentil (Peer 2 · masked). Diferença: +7 pontos no índice composto. Nas dimensões: chain-of-custody -4 pts, data quality -2 pts.','Current segment leader is at 91st percentile (Peer 2 · masked). Gap: +7 index points. Dimensions: chain-of-custody -4 pts, data quality -2 pts.') + '</div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Ação sugerida','Suggested action') + '</div>' +
            '<div class="dash-note" style="background:oklch(96% 0.03 150);">' + bi('Fechar KYC dos 3 generators novos leva chain-of-custody de 88% para 92%. Isso sozinho move você para 88º percentil e passa 3 peers no ranking.','Closing KYC for the 3 new generators takes chain-of-custody from 88% to 92%. That alone moves you to 88th percentile and passes 3 peers in the ranking.') + '</div>' +
          '</div>',
        footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
      });
    } else {
      openDrawer({
        eyebrow: bi('Peer anonimizado · benchmark','Anonymised peer · benchmark'),
        title: row.name,
        subtitle: bi('Identidade mascarada · dados agregados verificados','Identity masked · verified aggregate data'),
        body:
          '<div class="dash-section">' +
            '<div class="dash-kv"><span class="k">' + bi('Toneladas / mês','Tons / mo') + '</span><span class="v">' + row.tons + '</span></div>' +
            '<div class="dash-kv"><span class="k">Diversion rate</span><span class="v">' + row.diversion + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Qualidade','Data quality') + '</span><span class="v">' + row.quality + '</span></div>' +
            '<div class="dash-kv"><span class="k">Chain-of-custody</span><span class="v">' + row.trace + '</span></div>' +
            '<div class="dash-kv"><span class="k">' + bi('Percentil','Percentile') + '</span><span class="v"><strong>' + row.percentile + '</strong></span></div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Por que a identidade é mascarada','Why the identity is masked') + '</div>' +
            '<div class="dash-note">' + bi('Concorrentes nunca são nomeados aqui. Cada peer opta-in ao benchmark. Dados são agregados por segmento e re-computados mensalmente contra ledger público, sem revelar identidade.','Competitors are never named here. Each peer opts-in to the benchmark. Data is aggregated by segment and monthly re-computed against public ledger, without revealing identity.') + '</div>' +
          '</div>' +
          '<div class="dash-section">' +
            '<div class="dash-section-lab">' + bi('Comparação direta com você','Direct comparison to you') + '</div>' +
            makeComparisonRows(row) +
          '</div>',
        footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
      });
    }
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }
  function makeComparisonRows(peer) {
    var you = { tons: '4 820', diversion: '71%', quality: '92', trace: '88%' };
    function delta(y, p, unit) {
      var yn = parseFloat(String(y).replace(/[^0-9.]/g,''));
      var pn = parseFloat(String(p).replace(/[^0-9.]/g,''));
      if (isNaN(yn) || isNaN(pn)) return '';
      var d = yn - pn;
      var s = d >= 0 ? '+' : '';
      var col = d >= 0 ? 'var(--accent-strong)' : 'var(--block)';
      return '<span style="color:' + col + ';">' + s + Math.round(d * 10) / 10 + (unit || '') + '</span>';
    }
    return '<div class="dash-kv"><span class="k">Tons / mo</span><span class="v">' + delta(you.tons, peer.tons, ' t') + '</span></div>' +
      '<div class="dash-kv"><span class="k">Diversion</span><span class="v">' + delta(you.diversion, peer.diversion, ' pts') + '</span></div>' +
      '<div class="dash-kv"><span class="k">Quality</span><span class="v">' + delta(you.quality, peer.quality, ' pts') + '</span></div>' +
      '<div class="dash-kv"><span class="k">Chain-of-custody</span><span class="v">' + delta(you.trace, peer.trace, ' pts') + '</span></div>';
  }

  /* ---------- Benchmark: Verify chip (ledger) ---------- */
  function wireBnExtras() {
    var chip = document.querySelector('.bn-verify-chip');
    if (chip) {
      chip.style.cursor = 'pointer';
      chip.addEventListener('click', function (e) {
        e.stopPropagation();
        openModal({
          title: bi('Verificação pública do índice','Public verification of index'),
          subtitle: bi('Ledger 0x9f2c71a…e83 · auditado 8 jul 2026','Ledger 0x9f2c71a…e83 · audited Jul 8, 2026'),
          body:
            '<div class="dash-preview-card">' +
              '<h4>Recovery Index · Cascade Materials Recovery</h4>' +
              '<div class="pc-sub">' + bi('Índice composto público · verificável on-chain','Public composite index · on-chain verifiable') + '</div>' +
              '<div class="pc-hash">0x9f2c71a…e83 · ' + bi('block 62,184,097','block 62,184,097') + '</div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-kv"><span class="k">' + bi('Score composto','Composite score') + '</span><span class="v" style="color:var(--accent-strong);">78 / 100 ✓</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Percentil','Percentile') + '</span><span class="v">84th ✓</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Última recomputação','Last recompute') + '</span><span class="v">8 Jul 2026</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Próxima recomputação','Next recompute') + '</span><span class="v">1 Aug 2026</span></div>' +
              '<div class="dash-kv"><span class="k">' + bi('Metodologia','Methodology') + '</span><span class="v mono">v1.2 · docs.impactrakr.io</span></div>' +
            '</div>' +
            '<div class="dash-section">' +
              '<div class="dash-note">' + bi('Qualquer pessoa pode verificar este índice on-chain sem depender da plataforma. Nome do reciclador nunca é revelado — só a nota agregada e o segmento.','Anyone can verify this index on-chain without depending on the platform. The recycler\'s name is never revealed — only the aggregate score and segment.') + '</div>' +
            '</div>',
          footer:
            '<button type="button" class="dash-btn" data-cancel>' + bi('Fechar','Close') + '</button>' +
            '<button type="button" class="dash-btn primary" data-copyledger>' + bi('Copiar link on-chain','Copy on-chain link') + '</button>'
        });
        wireCancel();
        var cl = currentModal.querySelector('[data-copyledger]');
        if (cl) cl.addEventListener('click', function () {
          mockAction(cl, function () {
            var url = 'https://carrot.eco/verify/index/0x9f2c71a-e83';
            if (navigator.clipboard) navigator.clipboard.writeText(url);
            toast({ title: bi('Link copiado','Link copied'), msg: url });
          });
        });
      });
    }

    // Charts cards adicionam CTA "explain methodology" no head
    var chartCards = document.querySelectorAll('#vs .bn-card .bn-card-head');
    chartCards.forEach(function (head, idx) {
      var btn = el('<button type="button" class="dash-btn" style="padding:0.4rem 0.7rem; font-size:0.75rem;">' + bi('Metodologia','Methodology') + '</button>');
      head.appendChild(btn);
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        openBnChartMethodology(idx);
      });
    });
  }
  function openBnChartMethodology(idx) {
    var title, body;
    if (idx === 0) {
      title = bi('Volume · metodologia','Volume · methodology');
      body = bi('Cada barra é a média mensal de toneladas processadas em uma janela rolante de 30 dias. Fonte: MassID.eligibleKg somado por planta. Peers são anonimizados por policy de opt-in do segmento.','Each bar is the monthly average of tons processed over a rolling 30-day window. Source: MassID.eligibleKg summed per plant. Peers are anonymised per segment opt-in policy.');
    } else if (idx === 1) {
      title = bi('Decomposição do índice · metodologia','Composite index breakdown · methodology');
      body = bi('Radar em 4 dimensões, cada uma normalizada 0-100. Volume index é o quantil do peer no segmento (não valor absoluto) para permitir comparação entre plantas de tamanhos diferentes. Diversion, quality e trace são valores brutos (%).','Radar in 4 dimensions, each normalized 0-100. Volume index is the peer\'s quantile within the segment (not absolute value) to allow comparison across differently-sized plants. Diversion, quality and trace are raw values (%).');
    }
    openDrawer({
      eyebrow: bi('Metodologia · benchmark','Methodology · benchmark'),
      title: title,
      body: '<div class="dash-section"><div class="dash-note">' + body + '</div></div>',
      footer: '<button type="button" class="dash-btn" data-close>' + bi('Fechar','Close') + '</button>'
    });
    var close = currentDrawer.querySelector('[data-close]');
    if (close) close.addEventListener('click', closeAll);
  }

  /* ---------- Benchmark: Tooltips ---------- */
  function wireBnTooltips() {
    var marker = document.getElementById('pctMarker');
    if (marker) {
      marker.style.cursor = 'help';
      marker.addEventListener('mouseenter', function (e) {
        var pctEl = document.getElementById('indexPct');
        var pct = pctEl ? pctEl.textContent : '';
        showTip('<span class="tip-num">' + pct + '</span><strong>' + bi('Sua posição no segmento','Your segment position') + '</strong><br>' + bi('Recomputado mensalmente contra ledger público.','Recomputed monthly against public ledger.'), e);
      });
      marker.addEventListener('mousemove', moveTip);
      marker.addEventListener('mouseleave', hideTip);
    }
    // Verify chip
    var chip = document.querySelector('.bn-verify-chip');
    if (chip) {
      chip.addEventListener('mouseenter', function (e) {
        showTip('<strong>' + bi('Ledger público on-chain','Public on-chain ledger') + '</strong><br>' + bi('Clique para ver a verificação completa e copiar o link.','Click to see full verification and copy the link.'), e);
      });
      chip.addEventListener('mousemove', moveTip);
      chip.addEventListener('mouseleave', hideTip);
    }
    // Filter buttons
    document.querySelectorAll('.bn-filter-group button').forEach(function (b) {
      b.addEventListener('mouseenter', function (e) {
        var group = b.closest('.bn-filter-group');
        if (!group) return;
        var kind = group.id === 'segmentFilter' ? bi('Segmento','Segment') : bi('Período','Period');
        showTip('<strong>' + kind + '</strong><br>' + bi('Recalcula todo o painel para o corte selecionado.','Recalculates the whole panel for the selected slice.'), e);
      });
      b.addEventListener('mousemove', moveTip);
      b.addEventListener('mouseleave', hideTip);
    });
  }

  /* ---------------- expose ---------------- */
  window.DashInteractions = {
    open: openDrawer, openModal: openModal, toast: toast, close: closeAll
  };
})();
