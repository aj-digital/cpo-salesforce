document.addEventListener('DOMContentLoaded', () => {
  render();
  window.addEventListener('statechange', render);

  // --- Global Clicks ---
  const qRows = document.querySelectorAll('.td-link a');
  qRows.forEach(a => {
    a.addEventListener('click', (e) => {
      // Just let href and click bubble logic in index.html work natively
    });
  });

  // Stage Advance
  const btnAdvanceStage = document.getElementById('btn-advance-stage');
  const stageMap = {
    'Pre-App': 'Payment',
    'Payment': 'Validation',
    'Validation': 'Consultation',
    'Consultation': 'Objections',
    'Objections': 'Decision',
    'Decision': 'Closed',
    'Closed': 'Closed'
  };
  
  function advance() {
    const current = Store.getState().caseStage;
    Store.updateState('caseStage', stageMap[current]);
  }
  
  if (btnAdvanceStage) btnAdvanceStage.addEventListener('click', advance);
  const s1Label = document.getElementById('s1-stage-label');
  if (s1Label) s1Label.addEventListener('click', advance);

  // --- Screen 3: Pre-App Review ---
  const preAppOpts = document.querySelectorAll('.preapp-opt');
  preAppOpts.forEach(opt => {
    opt.style.cursor = 'pointer';
    opt.addEventListener('click', () => {
      Store.updateState('preAppOutcome', opt.getAttribute('data-val'));
      // Also sync case stage to Pre-App if they are making changes here
      Store.updateState('caseStage', 'Pre-App');
    });
  });

  // --- Screen 4: Payment ---
  const tglPay = document.getElementById('toggle-payment');
  if (tglPay) tglPay.addEventListener('click', () => {
    const s = Store.getState().paymentStatus === 'Received' ? 'Pending' : 'Received';
    Store.updateState('paymentStatus', s);
  });
  const tglAcc = document.getElementById('toggle-acceptance');
  if (tglAcc) tglAcc.addEventListener('click', () => {
    const s = Store.getState().acceptanceStatus === 'Accepted' ? 'Pending' : 'Accepted';
    Store.updateState('acceptanceStatus', s);
  });

  // --- Screen 5: Validation ---
  const valEnvDoc = document.getElementById('val-env-doc');
  if(valEnvDoc) {
    valEnvDoc.addEventListener('click', () => {
      Store.updateState('docEnvStatementReceived', !Store.getState().docEnvStatementReceived);
    });
  }

  const valAffDoc = document.getElementById('val-aff-doc');
  if(valAffDoc) {
    valAffDoc.addEventListener('click', () => {
      Store.updateState('docAffidavitReceived', !Store.getState().docAffidavitReceived);
    });
  }

  // --- Screen 6: RFI 002 ---
  const btnRes002 = document.getElementById('btn-resolve-rfi002');
  if (btnRes002) btnRes002.addEventListener('click', () => Store.updateState('rfi002Status', 'Resolved'));
  const btnReopen002 = document.getElementById('btn-reopen-rfi002');
  if (btnReopen002) btnReopen002.addEventListener('click', () => Store.updateState('rfi002Status', 'Awaiting'));
  const btnRecv002 = document.getElementById('btn-recv-rfi002');
  if (btnRecv002) btnRecv002.addEventListener('click', () => Store.updateState('rfi002Status', 'Received'));

  // --- Screen 7: Consultation ---
  const consDrum = document.getElementById('cons-drum');
  if(consDrum) {
    consDrum.querySelector('.cons-status').addEventListener('click', () => {
      const current = Store.getState().consultationItems.drumrossie;
      Store.updateState('consultationItems.drumrossie', current === 'Awaited' ? 'Received' : 'Awaited');
    });
  }

  // --- Screen 8: Objections ---
  const objWalney = document.getElementById('obj-walney');
  if(objWalney) {
    objWalney.querySelector('.obj-status').addEventListener('click', () => {
      const current = Store.getState().objections.walney;
      Store.updateState('objections.walney', current === 'Negotiating' ? 'Withdrawn' : 'Negotiating');
    });
  }

  // --- Screen 9: Decision & Case Close ---
  const decLegal = document.getElementById('dec-legalsign');
  if(decLegal) {
    decLegal.addEventListener('click', () => {
      Store.updateState('decisionSteps.legalSignoff', !Store.getState().decisionSteps.legalSignoff);
    });
  }
  const btnCloseCase = document.getElementById('btn-close-case');
  if (btnCloseCase) btnCloseCase.addEventListener('click', () => {
    Store.updateState('caseStage', 'Closed');
    alert('Case officially closed!');
  });
});

function render() {
  const state = Store.getState();
  
  // --- Global Case Stage & Queue ---
  const stageCol = document.getElementById('q-2026-stage');
  if (stageCol) {
    stageCol.innerText = state.caseStage;
    if (state.caseStage === 'Validation') stageCol.className = 'f-value tag-amber';
    else if (state.caseStage === 'Closed') stageCol.className = 'f-value tag-gray';
    else stageCol.className = 'f-value tag-blue';
  }
  const s1Label = document.getElementById('s1-stage-label');
  if (s1Label) {
    s1Label.innerText = state.caseStage;
    if (state.caseStage === 'Validation' || state.caseStage === 'Payment') s1Label.className = 'hf-value status-review';
    else if (state.caseStage === 'Closed') s1Label.className = 'hf-value tag-gray';
    else s1Label.className = 'hf-value status-valid';
  }

  const pVal = document.getElementById('path-validation');
  const pCon = document.getElementById('path-consultation');
  if (pVal && pCon) {
    ['Validation','Consultation','Objections','Decision','Closed'].forEach(key => {
       const el = [...document.querySelectorAll('.sf-path-node')].find(e => e.innerText.includes(key));
       if (el) {
           el.className = 'sf-path-node';
           el.innerHTML = key;
       }
    });

    const activeNode = [...document.querySelectorAll('.sf-path-node')].find(e => e.innerText.includes(state.caseStage));
    if (activeNode) {
       activeNode.className = 'sf-path-node active';
       activeNode.innerHTML = '&#9679; ' + state.caseStage;
    }
  }

  // --- Screen 3: Pre-App ---
  const preAppOpts = document.querySelectorAll('.preapp-opt');
  preAppOpts.forEach(opt => {
    if (opt.getAttribute('data-val') === state.preAppOutcome) {
      opt.className = 'dec-opt selected preapp-opt';
      opt.style.borderColor = '#2e844a';
      opt.style.color = '#2e844a';
    } else {
      opt.className = 'dec-opt preapp-opt';
      opt.style.borderColor = '#dddbda';
      opt.style.color = '#5a5a5a';
    }
  });

  // --- Screen 4: Payment ---
  const payVal = document.getElementById('pay-status-val');
  if (payVal) {
    if (state.paymentStatus === 'Received') {
      payVal.className = 'f-value tag-green';
      payVal.innerHTML = '18 Nov 2025 &#10003;';
    } else {
      payVal.className = 'f-value tag-amber';
      payVal.innerText = 'Pending';
    }
  }
  const accVal = document.getElementById('acc-status-val');
  if (accVal) {
    if (state.acceptanceStatus === 'Accepted') {
      accVal.className = 'f-value tag-green';
      accVal.innerText = 'Accepted to Proceed';
    } else {
      accVal.className = 'f-value tag-amber';
      accVal.innerText = 'Pending / Under Review';
    }
  }

  // --- Screen 5: Validation ---
  const valEnvCb = document.getElementById('val-env-cb');
  if(valEnvCb) {
    if (state.docEnvStatementReceived) {
        valEnvCb.innerHTML = '&#10003;';
        valEnvCb.style.borderColor = '#c9c7c5';
        document.getElementById('val-env-text').innerHTML = 'Environmental Statement <span style="color:#2e844a">— Received</span>';
        document.getElementById('val-env-status').className = 'f-value tag-green';
        document.getElementById('val-env-status').innerText = 'Received';
    } else {
        valEnvCb.innerHTML = '';
        valEnvCb.style.borderColor = '#ba0517';
        let sub = '— RFI-002 awaits response';
        if (state.rfi002Status === 'Resolved') sub = '— RFI-002 resolved, awaiting portal sync';
        if (state.rfi002Status === 'Received') sub = '— Response received, under review';
        document.getElementById('val-env-text').innerHTML = `Environmental Statement <span style="color:#ba6400">${sub}</span>`;
        document.getElementById('val-env-status').className = 'f-value tag-red';
        document.getElementById('val-env-status').innerText = 'Outstanding';
    }
  }

  const valAffCb = document.getElementById('val-aff-cb');
  if(valAffCb) {
    if (state.docAffidavitReceived) {
        valAffCb.innerHTML = '&#10003;';
        valAffCb.style.borderColor = '#c9c7c5';
        document.getElementById('val-aff-text').innerHTML = 'Notice affidavit <span style="color:#2e844a">— Received</span>';
        document.getElementById('val-aff-status').className = 'f-value tag-green';
        document.getElementById('val-aff-status').innerText = 'Received';
    } else {
        valAffCb.innerHTML = '';
        valAffCb.style.borderColor = '#ba0517';
        document.getElementById('val-aff-text').innerHTML = 'Notice affidavit <span style="color:#ba0517">— RFI-003 awaiting response</span>';
        document.getElementById('val-aff-status').className = 'f-value tag-red';
        document.getElementById('val-aff-status').innerText = 'Outstanding';
    }
  }

  let docs = 5;
  if(state.docEnvStatementReceived) docs++;
  if(state.docAffidavitReceived) docs++;
  
  const valHeadCompl = document.getElementById('val-head-compl');
  if(valHeadCompl) {
    valHeadCompl.innerText = `${docs} / 7 mandatory docs`;
    document.getElementById('val-bar-fill').style.width = Math.round(docs/7 * 100) + '%';
    document.getElementById('val-bar-text').innerText = `${docs} of 7 mandatory docs (${Math.round(docs/7 * 100)}%)`;
    
    const banner = document.getElementById('val-banner');
    if (docs === 7 && state.rfi002Status === 'Resolved') {
        banner.className = 'sf-banner success';
        banner.innerHTML = '&#10003; All mandatory documents received and RFIs resolved — ready for validation';
    } else {
        banner.className = 'sf-banner error';
        banner.innerHTML = `&#9888; ${7 - docs} mandatory documents outstanding, or RFIs not fully resolved.`;
    }
  }

  // --- Screen 6: RFI-002 ---
  const rfiHeadStatus = document.getElementById('rfi002-head-status');
  if(rfiHeadStatus) {
    const bRes = document.getElementById('btn-resolve-rfi002');
    const bReopen = document.getElementById('btn-reopen-rfi002');
    const bRecv = document.getElementById('btn-recv-rfi002');
    
    if (state.rfi002Status === 'Resolved') {
        rfiHeadStatus.className = 'hf-value status-valid';
        rfiHeadStatus.innerText = 'Resolved';
        document.getElementById('rfi002-resp-banner').className = 'sf-banner success';
        document.getElementById('rfi002-resp-banner').innerText = 'Response confirmed and resolved.';
        if(bRes) bRes.style.display = 'none';
        if(bRecv) bRecv.style.display = 'none';
        if(bReopen) bReopen.style.display = 'inline-flex';
    } else if (state.rfi002Status === 'Received') {
        rfiHeadStatus.className = 'hf-value status-review';
        rfiHeadStatus.innerText = 'Response Received';
        document.getElementById('rfi002-resp-banner').className = 'sf-banner warn';
        document.getElementById('rfi002-resp-banner').innerText = 'Response received by applicant. Awaiting officer review.';
        if(bRes) bRes.style.display = 'inline-flex';
        if(bRecv) bRecv.style.display = 'none';
        if(bReopen) bReopen.style.display = 'none';
    } else {
        rfiHeadStatus.className = 'hf-value status-review';
        rfiHeadStatus.innerText = 'Awaiting response';
        document.getElementById('rfi002-resp-banner').className = 'sf-banner info';
        document.getElementById('rfi002-resp-banner').innerText = 'No response received yet — deadline 15 Apr 2026.';
        if(bRes) bRes.style.display = 'inline-flex';
        if(bRecv) bRecv.style.display = 'inline-flex';
        if(bReopen) bReopen.style.display = 'none';
    }
  }

  // --- Screen 7: Consultation ---
  const consDrum = document.getElementById('cons-drum');
  if(consDrum) {
    const statusTag = consDrum.querySelector('.cons-status');
    if (state.consultationItems.drumrossie === 'Received') {
        statusTag.className = 'f-value tag-green cons-status';
        statusTag.innerText = 'Received';
        document.getElementById('cons-kpi-rep').innerText = '11';
        document.getElementById('cons-kpi-await').innerText = '21';
    } else {
        statusTag.className = 'f-value tag-amber cons-status';
        statusTag.innerText = 'Awaited';
        document.getElementById('cons-kpi-rep').innerText = '10';
        document.getElementById('cons-kpi-await').innerText = '22';
    }
  }

  // --- Screen 8: Objections ---
  const objWalney = document.getElementById('obj-walney');
  if(objWalney) {
    const statusTag = objWalney.querySelector('.obj-status');
    const withTag = objWalney.querySelector('.obj-withdrawing');
    if (state.objections.walney === 'Withdrawn') {
        statusTag.className = 'f-value tag-green obj-status';
        statusTag.innerText = 'Withdrawn';
        withTag.innerHTML = '<span style="color:#2e844a">Yes</span>';
    } else {
        statusTag.className = 'f-value tag-amber obj-status';
        statusTag.innerText = 'Negotiating';
        withTag.innerText = 'TBC';
    }
  }

  // --- Screen 9: Decision ---
  const decLegal = document.getElementById('dec-legalsign');
  if(decLegal) {
    const cb = decLegal.querySelector('.sf-checkbox');
    const spanText = decLegal.querySelector('span:nth-child(2)');
    const spanStatus = decLegal.querySelector('span:nth-child(3)');
    if (state.decisionSteps.legalSignoff) {
        cb.innerHTML = '&#10003;';
        cb.style.color = '#1b1b1b';
        spanText.style.color = '#1b1b1b';
        spanStatus.style.color = '#2e844a';
        spanStatus.innerText = 'Completed just now';
    } else {
        cb.innerHTML = '';
        cb.style.color = '#ccc';
        spanText.style.color = '#9b9b9b';
        spanStatus.style.color = '#9b9b9b';
        spanStatus.innerText = 'Pending';
    }
  }
}
