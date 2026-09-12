# SAFESTOP — Accessible Transit Assistant 🚌♿✨

> **Empowering commuters with disabilities and reduced mobility through transparent, multi-factor Boarding Confidence evaluations, barrier intelligence, and time-aware demand estimates across Goa's public transit network.**

Core question answered by SAFESTOP:
> *"Can I realistically board this bus from this stop under current reported conditions?"*

SAFESTOP combines vehicle accessibility, stop infrastructure, verification freshness, and reported barriers into a transparent Boarding Confidence Score, alongside a separate time-aware Boarding Demand Estimate.

---

## 1. Live Demo

* **Prototype Demo URL:** [https://smarttransport1.netlify.app/](https://smarttransport1.netlify.app/)
* **Deployment Notice & Status Flag:** The live URL above hosts the initial static baseline demonstration. Note that the latest `main` branch codebase (including the full SAFESTOP Boarding Confidence engine, demand estimates, and Goa route dataset) can be run locally via the instructions in Section 17.
* **Disclaimer:** This demo deployment is an independent hackathon prototype for evaluation purposes, not production or official transit software.

---

## 2. The Problem

While modern low-floor electric buses may be wheelchair-accessible on paper, a commuter with a mobility impairment cannot board if the bus stop lacks a platform ramp, has broken tactile paving, or is obstructed by active construction hazards.

Static transit schedules declare routes as "accessible" without accounting for physical stop conditions. SAFESTOP bridges this specific gap by evaluating both the vehicle and the boarding stop infrastructure together.

---

## 3. The Solution

SAFESTOP delivers three core capabilities:

1. **Boarding Confidence Evaluation:** Transparent 0–100 scoring based on bus accessibility, stop features, and inspection freshness.
2. **Barrier Intelligence:** Community barrier reporting, instant score recalculations, hard critical overrides, and alternate accessible stop recommendations.
3. **Boarding Demand Estimate:** Deterministic, time-aware demand window heuristics for Goa transit corridors.

*Note:* Tracking and radar visualization features are provided as a separate client-side **Tracking Simulation**.

---

## 4. Boarding Confidence Model

SAFESTOP's engine calculates a **0–100 Boarding Confidence Score** based on verifiable evidence:

### Score Formula (100 Points Base)

$$\text{Boarding Confidence} = \text{Vehicle Accessibility (35 pts)} + \text{Stop Accessibility (35 pts)} + \text{Verification Freshness (30 pts)} - \text{Barrier Penalties}$$

> **Data Honesty Note:** Boarding Confidence is a **structured prototype evidence score** based on available assessment data. It is **not** a statistical probability, physical guarantee, or official accessibility certification.

### Category Breakdown

| Category | Max Points | Measured Attributes |
| :--- | :---: | :--- |
| **Vehicle Accessibility** | **35 pts** | • Low-floor step-free entry (`12 pts`)<br>• Dedicated wheelchair bay (`9 pts`)<br>• Deployable boarding ramp (`8 pts`)<br>• Audio/visual boarding support (`6 pts`) |
| **Stop Accessibility** | **35 pts** | • Step-free approach path (`12 pts`)<br>• Clear 1.5m boarding area (`9 pts`)<br>• Platform boarding ramp (`8 pts`)<br>• Tactile paving for vision support (`6 pts`) |
| **Verification Freshness** | **30 pts** | • Verified $\le 7$ days: `30 pts`<br>• Verified $\le 30$ days: `20 pts`<br>• Verified $\le 90$ days: `10 pts`<br>• $> 90$ days or unverified: `0 pts` *(Caps confidence at 69)* |

### Barrier Penalties & Hard Overrides

* **Minor Barrier:** `-5 pts` (e.g., temporary narrow scaffolding).
* **Moderate Barrier:** `-15 pts` (e.g., damaged tactile tiles).
* **Critical Active Barrier (HARD OVERRIDE):** Unconditionally forces level **LOW** and caps score at **$\le 39$** (e.g., broken wheelchair ramp, high curb block).

### Confidence Levels

| Level | Score Range | Meaning |
| :--- | :---: | :--- |
| <span style="color:#10b981; font-weight:bold;">HIGH</span> | **70 – 100** | Evaluated step-free bus, accessible stop, and recent verification updates support independent boarding. |
| <span style="color:#f59e0b; font-weight:bold;">MODERATE</span> | **40 – 69** | Independent boarding may require driver assistance or ramp deployment; minor limitations apply. |
| <span style="color:#ef4444; font-weight:bold;">LOW</span> | **0 – 39** | Critical access barrier or missing verification data; boarding assistance is mandatory. |

---

## 5. Barrier Intelligence Workflow

1. **Report Barrier:** Commuters or operators submit active physical obstacle reports via the barrier modal.
2. **Score Recalculation:** The engine recalculates the Boarding Confidence score immediately.
3. **Critical Override:** Active critical barriers immediately cap confidence at **$\le 39$ / LOW**.
4. **Alternate Stop Recommendation:** The engine automatically identifies nearby accessible stops on the same route and presents a one-click alternate stop recommendation.
5. **Barrier Resolution:** Commuters or operators can mark active barriers as resolved.
6. **Confidence Recovery:** Score automatically recovers to baseline upon barrier resolution.

---

## 6. Boarding Demand Estimate (SAFESTOP ESTIMATE)

SAFESTOP includes a time-aware heuristic labeled **BOARDING DEMAND ESTIMATE** or **SAFESTOP ESTIMATE**.

### Valid Outcomes
* **HIGH** (Peak commuting windows, e.g., 08:00–10:00 IST Morning Rush & 17:00–19:00 IST Office Departures)
* **MODERATE** (Contextual windows, e.g., 08:00–09:30 IST Hospital OPD arrival window at GMC)
* **LOW** (Standard off-peak baseline traffic)
* **DEMAND ESTIMATE UNAVAILABLE** (Invalid time or missing schedule window data)

> **Data Honesty Note:** The Boarding Demand Estimate is a deterministic time-window model based on scheduled Goa transit patterns. It is **NOT** live passenger occupancy, **NOT** live passenger counting, and **NOT** live crowd-sensor data.

---

## 7. Current Demand Examples (Live Test Sourced)

The following demand evaluations reflect the actual output of the deterministic demand engine across test runs:

| Stop / Corridor | 08:00 IST | 12:00 IST | 17:30 IST | 21:00 IST |
| :--- | :---: | :---: | :---: | :---: |
| **Route 453 → Patto Plaza** | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* | **HIGH** *(Office Peak)* | **LOW** *(Off-Peak)* |
| **Route 453 → GMC** | **MODERATE** *(OPD Window)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* |
| **Route 335 → Margao KTC Bus Stand** | **HIGH** *(Morning Peak)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* |
| **Route 325 → Porvorim Junction** | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* | **LOW** *(Off-Peak)* |

*Contextual Note:* The 08:00 IST MODERATE rating at Goa Medical College (GMC) represents a scheduled hospital OPD window heuristic, not live passenger counts.

---

## 8. Bus Tracking & GPS Radar Simulation

The tracking page (`tracking.html`) features **Bus Tracking & GPS Radar Simulation** displaying **SIMULATED TELEMETRY**.

* **Radar Visualizer:** HTML5 Canvas 2D sweep depicting animated bus movement along route stop nodes.
* **Simulated Telemetry:** Client-side calculated speed, ETA countdown, and stop progression.
* **Disclaimer:** All GPS coordinates, vehicle speeds, and radar telemetry are generated by client-side JavaScript loops for demonstration purposes. They are **NOT** live hardware GPS transponder streams from KTCL vehicles.

---

## 9. Data Provenance

SAFESTOP maintains three clear data boundaries:

1. **OFFICIAL KTCL DATA:** Published route numbers, static timetables, and official stop names.
2. **SAFESTOP PROTOTYPE ASSESSMENT:** Boarding Confidence scores, sub-score breakdowns, feature evaluations, community barrier reports, and demand estimate heuristics.
3. **SIMULATED TELEMETRY:** Client-side GPS radar coordinates, vehicle speeds, and animated route progress.

---

## 10. Prototype Digital Transit Pass

The digital pass page (`bus-pass.html`) generates a **Prototype Digital Transit Pass**.

* **Demo Artifact:** Displays passenger details, route ID, QR code visualization, and a **DEMO ACTIVE** status badge.
* **Export Options:** Supports client-side PNG export and PDF printing.
* **Disclaimer:** This digital pass is a prototype demo artifact for hackathon presentation and is **NOT** an officially issued transit credential, government ID, or KTCL authorization.

---

## 11. Accessibility Features

SAFESTOP includes practical accessibility implementation details:

* **Semantic HTML5 Markup:** Form controls, landmarks, and structured document hierarchy.
* **Keyboard Navigation:** Focusable interactive controls, visible `:focus-visible` outlines, and skip links.
* **Modal Accessibility:** Keyboard focus trapping, `Escape` key listeners, and focus restoration upon modal close.
* **ARIA Attributes:** Accessible labels, modal roles (`role="dialog"`), and dynamic state messaging.
* **User Motion Preferences:** Reduced-motion CSS `@media (prefers-reduced-motion: reduce)` support.
* **Responsive Layout:** Mobile and desktop responsive layouts across standard viewports.

---

## 12. Secondary Transit Services

SAFESTOP also includes supporting frontend views:

* **Route Directory (`routes.html`):** Route catalog with low-floor vehicle badges.
* **Timetable (`timetable.html`):** Interactive stop schedule viewer with Web Audio chimes.
* **Commuter Profile (`profile.html`):** Travel preferences and neutral demo identity (`Goan` / `Goa Commuter`).
* **Emergency SOS (`index.html` modal):** Prototype SOS alert simulation modal.
* **Seat Heatmap (`index.html` modal):** Accessible 52-seat bus interior chassis layout visualizer.
* **Settings & Announcements:** Data reset utility and service advisory views.

---

## 13. Hackathon Judge Demo Flow

To evaluate the application using the tested demo sequence:

1. **Open SAFESTOP Portal (`safestop.html`):** Default selection **Route 453 (Panaji → Dona Paula)** at **Patto Plaza (Stop #2)**. Observe **100/100 HIGH CONFIDENCE** score and **LOW BOARDING DEMAND ESTIMATE** (08:00 IST baseline).
2. **Inspect Moderate Barrier:** Select **Goa Medical College (Stop #5)**. Observe **71/100 HIGH CONFIDENCE** with `-15 pts` deduction for damaged tactile paving.
3. **Report Critical Barrier:** Click **Report Accessibility Barrier** $\rightarrow$ Select **Blocked Boarding Ramp / High Curb Block** $\rightarrow$ Submit. Observe score instantly drop to **39/100 LOW**.
4. **Alternate Stop Recommendation:** Observe the recommended alternate accessible stop on Route 453. Click **Switch to Alternate Stop**.
5. **Resolve Barrier:** Return to Patto Plaza, click **Resolve Barrier**, and observe confidence score recovery.
6. **Bus Tracking Simulation (`tracking.html`):** View animated Canvas radar sweep, simulated bus telemetry, and voice arrival alerts.
7. **Prototype Digital Pass (`bus-pass.html`):** View pass card, verify **DEMO ACTIVE** badge, and test **Save PNG** / **Print Pass (PDF)**.

---

## 14. Tech Stack

* **Frontend:** HTML5, Vanilla CSS3 (CSS Variables, Flexbox, Grid), Native JavaScript ES6+.
* **Web APIs:** HTML5 Canvas 2D, Web Audio API, Web Speech API (`SpeechSynthesis`), LocalStorage.
* **Dependencies:** Zero external runtime frameworks or npm package dependencies.
* **Backend:** 100% Client-side static application (no backend server required).

---

## 15. Project Structure

```
smart-college-transport-main/
├── index.html            # Goa Mobility Dashboard & Quick Stats
├── safestop.html         # SAFESTOP Accessible Boarding Portal
├── tracking.html         # Bus Tracking & GPS Radar Simulation Visualizer
├── timetable.html        # Interactive Bus Timetable & Schedules
├── routes.html           # KTCL Route Directory
├── announcements.html    # Transit Service Advisories
├── bus-pass.html         # Prototype Digital Transit Pass
├── profile.html          # Commuter Profile & Preferences
├── drivers.html          # Driver Roster Directory
├── settings.html         # Local Data Reset & Theme Options
├── css/
│   ├── style.css         # Main Design System & UI Utility Tokens
│   ├── safestop.css      # SAFESTOP Gauge & Card Styling
│   ├── dashboard.css     # Grid Layouts & Card Utilities
│   └── responsive.css    # Responsive Mobile/Tablet Breakpoints
└── js/
    ├── storage.js        # AppStorage Persistence & Demo Profile
    ├── safestop-data.js   # SAFESTOP Seed Data & Profiles
    ├── safestop-demand.js # SAFESTOP Boarding Demand Estimate Engine
    ├── safestop.js        # SAFESTOP Boarding Confidence Engine
    ├── tracking.js        # Canvas Radar Engine & Telemetry Simulation
    ├── timetable.js       # Timetable Renderer
    ├── routes.js          # Route Directory Renderer
    ├── audio.js           # Web Audio & Speech Synthesis Engine
    └── app.js             # Global Modals, SOS System & Toasts
```

---

## 16. Run Locally

### Clone Repository
```bash
git clone https://github.com/aaroncostapix/Honored-ones-.git
cd Honored-ones-/smart-college-transport-main
```

### Serve Locally
Run using Python's built-in HTTP server:
```bash
python -m http.server 8000
```
Then open `http://localhost:8000` in any modern web browser.

---

## 17. Prototype Disclaimer & Data Honesty

* **Independent Hackathon Prototype:** SAFESTOP is an independent hackathon demonstration project. It is **NOT** an official product of Kadamba Transport Corporation Limited (KTCL) or the Government of Goa.
* **Prototype Assessment Data:** Boarding Confidence scores, stop feature assessments, barrier reports, and demand estimates represent prototype evaluations created for hackathon demonstration purposes. They do **NOT** constitute official government accessibility certification.
* **Simulated Telemetry:** Bus positions, speeds, and radar sweeps are client-side simulations and do **NOT** represent live hardware GPS streams from KTCL vehicles.
* **Digital Pass:** The digital bus pass is a prototype demo artifact and is **NOT** an officially issued transit credential.
* **No Guarantee:** Boarding Confidence scores provide structured evidence ratings and do **NOT** guarantee physical boarding outcomes.

---

## 18. License

This project is licensed under the **MIT License**.
