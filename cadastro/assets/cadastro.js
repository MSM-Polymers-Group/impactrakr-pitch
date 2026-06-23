/* =============================================================
   Cadastro — helpers comuns (localStorage state, stepper, mocks)
   ============================================================= */

window.Cadastro = (function () {
  const STORAGE_KEY = 'cad-state';

  function getState() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; }
  }
  function setState(patch) {
    const cur = getState();
    const next = { ...cur, ...patch };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  }
  function resetState() { localStorage.removeItem(STORAGE_KEY); }

  // Bind form inputs to state on a given namespace (e.g. "kyc", "kyb", etc.)
  function bindForm(rootSelector, namespace) {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const state = getState()[namespace] || {};
    root.querySelectorAll('[data-field]').forEach(el => {
      const k = el.dataset.field;
      if (state[k] !== undefined) {
        if (el.type === 'checkbox') el.checked = !!state[k];
        else el.value = state[k];
      }
      el.addEventListener('input', () => {
        const cur = getState();
        const ns = cur[namespace] || {};
        ns[k] = el.type === 'checkbox' ? el.checked : el.value;
        setState({ [namespace]: ns });
      });
      el.addEventListener('change', () => {
        const cur = getState();
        const ns = cur[namespace] || {};
        ns[k] = el.type === 'checkbox' ? el.checked : el.value;
        setState({ [namespace]: ns });
      });
    });
  }

  // Mock upload — adds 'uploaded' class to .upload-card on click
  function bindMockUploads() {
    document.querySelectorAll('.upload-card').forEach(card => {
      const btn = card.querySelector('.up-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        card.classList.toggle('uploaded');
        const k = card.dataset.upload;
        if (!k) return;
        const cur = getState();
        const uploads = cur.uploads || {};
        uploads[k] = card.classList.contains('uploaded');
        setState({ uploads });
      });
    });
    document.querySelectorAll('.doc-list li').forEach(li => {
      const btn = li.querySelector('.doc-up-btn');
      if (!btn) return;
      btn.addEventListener('click', () => {
        li.classList.toggle('uploaded');
        const k = li.dataset.docId;
        if (!k) return;
        const cur = getState();
        const docs = cur.docs || {};
        docs[k] = li.classList.contains('uploaded');
        setState({ docs });
        const langPt = document.documentElement.getAttribute('data-app-lang') === 'pt';
        const upLabel = li.classList.contains('uploaded')
          ? (langPt ? '✓ Enviado' : '✓ Uploaded')
          : (langPt ? 'Enviar' : 'Upload');
        btn.innerHTML = upLabel;
      });
    });
    // Sync visual state on load
    const state = getState();
    document.querySelectorAll('.upload-card').forEach(card => {
      const k = card.dataset.upload;
      if (k && state.uploads && state.uploads[k]) card.classList.add('uploaded');
    });
    document.querySelectorAll('.doc-list li').forEach(li => {
      const k = li.dataset.docId;
      if (k && state.docs && state.docs[k]) {
        li.classList.add('uploaded');
        const btn = li.querySelector('.doc-up-btn');
        const langPt = document.documentElement.getAttribute('data-app-lang') === 'pt';
        if (btn) btn.innerHTML = langPt ? '✓ Enviado' : '✓ Uploaded';
      }
    });
  }

  // Stepper builder — currentStep is 1..5
  function renderStepper(currentStep) {
    const el = document.getElementById('stepper');
    if (!el) return;
    const langPt = document.documentElement.getAttribute('data-app-lang') === 'pt';
    const steps = [
      { pt: 'Representante', en: 'Representative' },
      { pt: 'Empresa', en: 'Company' },
      { pt: 'Documentos', en: 'Documents' },
      { pt: 'Operação', en: 'Operation' },
      { pt: 'Revisão', en: 'Review' }
    ];
    el.innerHTML = steps.map((s, i) => {
      const idx = i + 1;
      const cls = idx < currentStep ? 'done' : (idx === currentStep ? 'current' : '');
      return `<div class="step-pill ${cls}"><span class="step-n">${String(idx).padStart(2,'0')}</span>${langPt ? s.pt : s.en}</div>`;
    }).join('');
  }

  // Document catalogue parameterised by role × jurisdiction × modules
  function getDocumentList(role, juris, modules) {
    const M = modules || {};
    const list = { licencas: [], certidoes: [], descritivos: [] };

    // Universal docs (any role · any jurisdiction)
    list.licencas.push(
      { id: 'cnpj_tin', pt: 'Cartão CNPJ / TIN — identificação fiscal', en: 'CNPJ / TIN — fiscal ID', req: true },
      { id: 'commercial_reg', pt: 'Contrato social / Trade Register Extract', en: 'Articles of association / Trade Register', req: true }
    );

    // BR specific
    if (juris === 'brazil') {
      list.licencas.push(
        { id: 'alvara', pt: 'Alvará de Funcionamento', en: 'Operating Permit', req: true },
        { id: 'avcb', pt: 'AVCB · Auto de Vistoria do Corpo de Bombeiros', en: 'Fire Safety Certificate (AVCB)', req: true },
        { id: 'ibama_cert', pt: 'Certificado de Regularidade do IBAMA', en: 'IBAMA Regularity Certificate', req: true },
        { id: 'licenca_ambiental', pt: 'Licença Ambiental de Operação · LAO', en: 'Environmental Operating Permit', req: true }
      );
      list.certidoes.push(
        { id: 'cnd_federal', pt: 'CND Débitos Federais (Receita + PGFN)', en: 'Federal Tax Clearance', req: true },
        { id: 'cnd_estadual', pt: 'CND Débitos Estaduais (SEFAZ)', en: 'State Tax Clearance', req: true },
        { id: 'cnd_municipal', pt: 'CND Débitos Municipais', en: 'Municipal Tax Clearance', req: true },
        { id: 'cnd_fgts', pt: 'CND FGTS (CRF · Caixa)', en: 'FGTS Clearance', req: true },
        { id: 'cnd_cndt', pt: 'CNDT · Certidão Negativa de Débitos Trabalhistas', en: 'Labour Court Clearance (CNDT)', req: true },
        { id: 'cnd_ibama', pt: 'CND IBAMA · sem autuações ambientais', en: 'IBAMA Sanctions Clearance', req: true }
      );
    }

    // Malta / UE-genérico
    if (juris === 'malta' || juris === 'eu_other') {
      const isMalta = juris === 'malta';
      list.licencas.push(
        { id: 'trade_licence', pt: isMalta ? 'Trading Licence · Commerce Department Malta' : 'Trade Licence · Local Council', en: isMalta ? 'Trading Licence · Commerce Dept Malta' : 'Trade Licence · Local Council', req: true },
        { id: 'fire_safety', pt: isMalta ? 'Fire Safety Certificate · CPD Malta' : 'Fire Safety Certificate · national authority', en: isMalta ? 'Fire Safety Certificate · CPD Malta' : 'Fire Safety Certificate', req: true },
        { id: 'env_operator_reg', pt: isMalta ? 'ERA Operator Registration' : 'National Environmental Agency Registration', en: isMalta ? 'ERA Operator Registration' : 'Environmental Agency Registration', req: true },
        { id: 'env_permit', pt: isMalta ? 'Environmental Permit · ERA · classe R3' : 'IPPC Permit · Waste Treatment Permit (Art. 23 WFD)', en: isMalta ? 'Environmental Permit · ERA · R3 class' : 'IPPC / Waste Treatment Permit', req: true }
      );
      // Cross-border specific
      if (role === 'carrier' || role === 'recycler' || role === 'processor') {
        list.licencas.push({ id: 'eori', pt: 'EORI Number · Economic Operators Registration', en: 'EORI Number', req: true });
      }
      if (M.eu) {
        list.licencas.push({ id: 'wsr_notif', pt: 'WSR Notification Number · Reg EU 2024/1157 Art. 4 (se cross-border)', en: 'WSR Notification Number · EU Reg 2024/1157 Art. 4 (if cross-border)', req: false });
      }
      list.certidoes.push(
        { id: 'tax_clearance_nat', pt: isMalta ? 'CFR Tax Compliance Certificate' : 'National Tax Clearance Certificate', en: isMalta ? 'CFR Tax Compliance Certificate' : 'National Tax Clearance', req: true },
        { id: 'tax_clearance_local', pt: 'Local Council Tax Clearance', en: 'Local Council Tax Clearance', req: true },
        { id: 'ss_clearance', pt: isMalta ? 'DSS Social Security Clearance' : 'Social Security Clearance', en: isMalta ? 'DSS Social Security Clearance' : 'Social Security Clearance', req: true },
        { id: 'labour_tribunal', pt: isMalta ? 'Industrial Tribunal Clearance' : 'Labour Tribunal Clearance', en: isMalta ? 'Industrial Tribunal Clearance' : 'Labour Tribunal Clearance', req: true },
        { id: 'era_compliance', pt: isMalta ? 'ERA Compliance Certificate · sem multas' : 'Environmental Agency Compliance · no pending sanctions', en: isMalta ? 'ERA Compliance Certificate' : 'Environmental Compliance', req: true },
        { id: 'vat_clearance', pt: 'VAT Clearance (cross-border)', en: 'VAT Clearance (cross-border)', req: false }
      );
    }

    // LATAM (placeholder padrão)
    if (juris === 'latam') {
      list.licencas.push(
        { id: 'commercial_perm', pt: 'Permiso Comercial (local)', en: 'Local Commercial Permit', req: true },
        { id: 'env_permit_latam', pt: 'Licencia Ambiental (Ministerio del Ambiente · MARN · MARENA · etc.)', en: 'Environmental Permit (Ministry of Environment)', req: true }
      );
      list.certidoes.push(
        { id: 'tax_clear_latam', pt: 'Solvencia Fiscal (autoridad tributaria)', en: 'Tax Solvency Certificate', req: true },
        { id: 'ss_clear_latam', pt: 'Solvencia Seguridad Social', en: 'Social Security Clearance', req: true }
      );
    }

    // Role-specific extras
    if (role === 'carrier') {
      list.licencas.push({ id: 'haulage_lic', pt: 'Licença de transporte de resíduos', en: 'Waste haulage licence', req: true });
      list.licencas.push({ id: 'fleet_reg', pt: 'Registro de frota autorizada', en: 'Authorised fleet register', req: true });
    }
    if (role === 'recycler') {
      list.descritivos.push(
        { id: 'descritivo_r3', pt: 'Descritivo Operacional da Instalação R3', en: 'R3 Recovery Operation Description', req: true },
        { id: 'declaracao_unif', pt: 'Declaração Unificada de Conformidade e Procedimentos', en: 'Unified Declaration of Conformity and Procedures', req: true },
        { id: 'project_boundary', pt: 'Planilha de Limite do Projeto · rotas cross-border (se >200km)', en: 'Project Boundary Worksheet · cross-border routes (if >200km)', req: false }
      );
    }
    if (role === 'integrator') {
      list.licencas.push({ id: 'api_security', pt: 'Auditoria de segurança da API e dados (último ano)', en: 'API and data security audit (last year)', req: true });
    }

    return list;
  }

  // Compute next step path
  function next(currentPage) {
    const pages = ['index.html', 'representante.html', 'empresa.html', 'documentos.html', 'operacao.html', 'revisao.html', 'status.html'];
    const i = pages.indexOf(currentPage);
    return pages[i + 1] || 'status.html';
  }
  function prev(currentPage) {
    const pages = ['index.html', 'representante.html', 'empresa.html', 'documentos.html', 'operacao.html', 'revisao.html', 'status.html'];
    const i = pages.indexOf(currentPage);
    return pages[Math.max(0, i - 1)];
  }

  // Re-render stepper on lang change
  document.addEventListener('impactrakr:lang', () => {
    const cur = document.querySelector('#stepper');
    if (cur && cur.dataset.step) renderStepper(parseInt(cur.dataset.step, 10));
  });

  return { getState, setState, resetState, bindForm, bindMockUploads, renderStepper, getDocumentList, next, prev };
})();
