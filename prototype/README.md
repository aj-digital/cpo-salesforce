# DESNZ CPO Clickable Prototype

## Overview
This is a lightweight, stateful HTML prototype for the DESNZ CPO internal Salesforce-style screens. It uses vanilla HTML, CSS, and JS with `localStorage` to simulate a connected workspace across different journeys without requiring a real backend.

## How to Run it
To run the prototype with local routing properly, use the start script:
```bash
npm start
# or 
./start.sh
```
This will launch a local server running on `http://localhost:8080/`.

---

## The Journey We've Built: Journey 1 — Case Officer
We have wired the **Case Officer End-to-End Journey** intelligently into the frontend state store. This journey demonstrates a fully coherent operational path.

### How to Demo the Journey:

1. **Queue View**: Open the landing page. Native links exist. Click `CPO-2026-0041` to enter the Case Record.
2. **Case Record**: The main hub. Use the path at the top right to `Advance Stage` (or click on the stage names natively). Check the top pill!
3. **Pre-App Review**: Under the Pre-app tab, click on "Accept to Proceed", "Further Info", or "Not Accepted" to see it lock in your decision.
4. **Payment & Acceptance**: Notice the clickable `[Toggle]` labels next to Payment and Acceptance. Simulating payment unlocks the Validation checks block. 
5. **Validation Workspace**: Document lines are clickable! Toggle receipt of the Environmental Statement or Notice Affidavit to see the progress bar dynamically recalculate.
6. **RFI Management**: Notice how the completeness banner throws an error because of open RFIs. Head to the RFI workspace, click `Mark Resolved`, and then jump back to Validation to see the UI unblock!
7. **Consultation**: Click "Awaited" for the Drumrossie party to log their feedback as "Received". KPI integers natively respond.
8. **Objections**: Similar interactivity. Switch Walney's objector status from 'Negotiating' to 'Withdrawn'.
9. **Decision & Closure**: As the process completes, toggle the Legal Sign-off, and hit the 'Close case' button. The prototype respects this stage and displays 'Closed' intelligently globally.

---

## State Changes Supported
Actionable fields use `localStorage` meaning state persists even if you reload the page natively! Handled states include:
* **Global Case State**: Progression of the main stage (Pre-App → Validated → Consultation → etc).
* **Pre-App Options**: Persisted choice for application progression.
* **Payment Signals**: Modifying payment received/acceptance states.
* **Document Progress logic**: Completeness check of mandatory documents on the Validation screen.
* **RFI Synchronization**: Real-time resolution flow for RFI-002 that automatically unblocks dependent case files in the Validation workspace!
* **Stakeholders/Objections**: Dynamic list updates and variable tracking.

To reset the prototype, clear your browser's local storage or call `Store.resetState()` via the console.
