const STORE_KEY = 'cpo_prototype_state';

const defaultState = {
  // Case Global State
  caseStage: 'Validation', // Pre-App, Payment, Validation, Consultation, Objections, Decision, Closed
  caseRag: 'Red', // Red, Amber, Green
  openRfiCount: 2,

  // Pre-App Review
  preAppOutcome: null, // 'Accepted', 'FurtherInfo', 'NotAccepted'
  
  // Payment
  paymentStatus: 'Received', // 'Pending', 'Received'
  acceptanceStatus: 'Accepted', // 'Pending', 'Accepted'
  
  // Formal App / Validation
  docEnvStatementReceived: false,
  docAffidavitReceived: false,
  
  // RFIs
  rfi002Status: 'Awaiting', // 'Sent', 'Awaiting', 'Received', 'Resolved'
  rfi003Status: 'Awaiting',
  
  // Consultation
  consultationItems: {
    drumrossie: 'Awaited', // Awaited, Received
    sepa: 'Awaited'
  },
  
  // Objections
  objections: {
    walney: 'Negotiating', // Negotiating, Withdrawn
    cumbria: 'Proceeding' // Proceeding, Withdrawn
  },
  
  // Decision
  decisionSteps: {
    scReview: false,
    legalSignoff: false,
    ministerAuth: false,
    decisionIssued: false,
    decisionPublished: false,
    caseClosed: false
  }
};

const Store = {
  getState() {
    const data = localStorage.getItem(STORE_KEY);
    return data ? JSON.parse(data) : { ...defaultState };
  },

  updateState(key, value) {
    const state = this.getState();
    const keys = key.split('.');
    
    if (keys.length === 2) {
      state[keys[0]][keys[1]] = value;
    } else {
      state[key] = value;
    }
    
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event('statechange'));
  },
  
  resetState() {
    localStorage.setItem(STORE_KEY, JSON.stringify(defaultState));
    window.dispatchEvent(new Event('statechange'));
  }
};
