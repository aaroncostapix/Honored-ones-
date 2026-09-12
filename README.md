# SAFESTOP — Accessible Transit Assistant 🚌♿✨

> **Empowering commuters with disabilities and reduced mobility through transparent, multi-factor Boarding Confidence evaluations, barrier intelligence, and time-aware demand estimates across Goa's public transit network.**

---

## 1. Project Overview

**SAFESTOP** is an accessible transit intelligence web prototype designed to solve one of the most critical challenges in public transportation: **the gap between vehicle accessibility and stop infrastructure accessibility.**

While modern low-floor electric buses may be wheelchair-accessible on paper, a commuter with a mobility impairment cannot board if the bus stop lacks a ramp, has broken tactile paving, or is obstructed by active construction barriers.

SAFESTOP bridges this gap by evaluating **bus feature data, physical stop attributes, verification freshness, active barrier reports, and time-aware boarding demand** into a transparent **0–100 Boarding Confidence score** and structured **Boarding Demand Estimate**.

---

## 2. Problem Statement

* **Vehicle vs. Stop Infrastructure Mismatch:** A wheelchair-accessible bus servicing a step-only stop renders the bus unusable for mobility-impaired passengers.
* **Unverified Claims & Travel Anxiety:** Static transit schedules declare routes as "accessible" without accounting for broken platform ramps or temporary sidewalk hazards.
* **Lack of Real-Time Barrier Visibility:** Construction, illegally parked vehicles, and broken tactile paths frequently obstruct boarding bays without warning.

---

## 3. Core Boarding Confidence Model

SAFESTOP's deterministic engine calculates a **0–100 Boarding Confidence Score** divided into three evidence categories:

### Score Formula (100 Points Base)

$$\text{Boarding Confidence} = \text{Vehicle Accessibility (35 pts)} + \text{Stop Accessibility (35 pts)} + \text{Verification Freshness (30 pts)} - \text{Barrier Penalties}$$

> **Important Note:** Boarding Confidence is a **structured prototype evidence score** based on available assessment data. It is **not** a statistical probability or guarantee of boarding.

### Category Breakdown

| Category | Max Points | Measured Attributes |
| :--- | :---: | :--- |
| **Vehicle Accessibility** | **35 pts** | • Low-floor step-free entry (`12 pts`)<br>• Dedicated wheelchair bay (`9 pts`)<br>• Deployable boarding ramp (`8 pts`)<br>• Audio/visual boarding support (`6 pts`) |
| **Stop Accessibility** | **35 pts** | • Step-free approach path (`12 pts`)<br>• Clear 1.5m boarding area (`9 pts`)<br>• Platform boarding ramp (`8 pts`)<br>• Tactile paving for vision support (`6 pts`) |
| **Verification Freshness** | **30 pts** | • Verified $\le 7$ days: `30 pts`<br>• Verified $\le 30$ days: `20 pts`<br>• Verified $\le 90$ days: `10 pts`<br>• $> 90$ days or unverified: `0 pts` *(Caps confidence at 69)* |

### Barrier Intelligence & Hard Overrides

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

## 4. Barrier Intelligence & Resolution Workflow

SAFESTOP provides full lifecycle barrier management:
1. **Report Barrier:** Commuters or operators submit active physical obstacle reports.
2. **Score Recalculation:** The engine recalculates the Boarding Confidence score instantly.
3. **Critical Override:** A critical active barrier immediately caps confidence at **$\le 39$ / LOW**.
4. **Alternate Stop Recommendation:** The engine automatically evaluates nearby accessible stops on the same route and recommends an alternate boarding location.
5. **Barrier Resolution:** Operators or commuters can mark barriers as resolved.
6. **Confidence Recovery:** Upon barrier resolution, the score automatically recovers to its baseline assessment.

---

## 5. Boarding Demand Estimate (SAFESTOP Estimate)

SAFESTOP includes a deterministic, time-aware **BOARDING DEMAND ESTIMATE** (also labeled **SAFESTOP ESTIMATE**).

### Valid Outcomes
* **HIGH** (Peak commuting windows, e.g., 08:00–10:00 IST Morning Office Rush & 17:00–19:00 IST Evening Office Departures)
* **MODERATE** (Mid-day campus & interchange transfers, e.g., 12:00–14:00 IST)
* **LOW** (Off-peak baseline traffic)
* **DEMAND ESTIMATE UNAVAILABLE** (Missing or invalid schedule window data)

> **Data Honesty Note:** The Boarding Demand Estimate is a deterministic time-window model based on scheduled Goa transit patterns. It is **not** live passenger occupancy, **not** live passenger counting, and **not** live crowd sensors.

---

## 6. Bus Tracking & GPS Radar Simulation

The tracking visualizer (`tracking.html`) is titled **Bus Tracking & GPS Radar Simulation** and displays **SIMULATED TELEMETRY**.

* **Interactive Radar Canvas:** HTML5 2D Canvas sweep displaying animated bus progression along route stop nodes.
* **Simulated Telemetry Metrics:** Client-side speed, ETA countdown, and stop-to-stop movement.
* **Simulation Disclaimer:** All GPS coordinates, speeds, and radar telemetry are generated by client-side simulation loops and do **not** represent live hardware GPS transponders fitted to KTCL vehicles.

---

## 7. Data Provenance & Classification

SAFESTOP clearly distinguishes between three data tiers across the entire platform:

1. **OFFICIAL KTCL DATA:** Static route catalogs, published transit timetables, and official stop names.
2. **SAFESTOP PROTOTYPE ASSESSMENT:** Boarding Confidence scores, sub-score breakdowns, feature availability flags, barrier reports, and time-aware demand estimates.
3. **SIMULATED TELEMETRY:** Client-side GPS radar coordinates, vehicle speeds, and progress tracking.

---

## 8. Current Hackathon Judge Demo Flow

To evaluate the application using the actual tested demo data:

1. **Open SAFESTOP Portal (`safestop.html`)**
   * Default selection: **Route 453 (Panaji → Dona Paula)** at **Patto Plaza (Stop #2)**.
   * Observe **100/100 HIGH CONFIDENCE** score and **LOW BOARDING DEMAND ESTIMATE**.
2. **Inspect Moderate Barrier Impact**
   * Select **Goa Medical College (Stop #5)**.
   * Observe **71/100 HIGH CONFIDENCE** score with moderate barrier alert (`-15 pts` deduction for damaged tactile paving).
3. **Report Critical Barrier / Test Hard Override**
   * Click **Report Accessibility Barrier** $\rightarrow$ Select **Blocked Boarding Ramp / High Curb Block** $\rightarrow$ Submit.
   * Observe Boarding Confidence score instantly drop to **39/100 LOW**.
4. **Alternate Stop Recommendation**
   * Observe the engine automatically display a recommended alternate accessible stop on Route 453.
   * Click **Switch to Alternate Stop**.
5. **Resolve Barrier & Score Recovery**
   * Return to original stop, click **Resolve Barrier**.
   * Observe score instantly recover to baseline.
6. **Explore Bus Tracking & GPS Radar Simulation (`tracking.html`)**
   * Observe animated radar sweep, simulated bus telemetry, and voice arrival alerts.
7. **Inspect Digital Pass (`bus-pass.html`)**
   * View the prototype digital pass, verify **DEMO ACTIVE** status badge, and test **Save PNG** / **Print Pass (PDF)** export.

---

## 9. Repository & Setup Instructions

SAFESTOP is built as a zero-dependency static web application.

### Clone Repository
```bash
git clone https://github.com/aaroncostapix/Honored-ones-.git
cd Honored-ones-/smart-college-transport-main
```

### Running Locally
No build tools, npm installs, or backend server dependencies are required.

* **Option A (Direct File):** Open `index.html` directly in any modern web browser.
* **Option B (Local HTTP Server):**
  ```bash
  python -m http.server 8000
  ```
  Then open `http://localhost:8000` in your browser.

---

## 10. Project Structure

```
smart-college-transport-main/
├── index.html            # Goa Transit Overview & Core Metrics
├── safestop.html         # SAFESTOP Boarding Confidence & Barrier Portal
├── tracking.html         # Bus Tracking & GPS Radar Simulation Visualizer
├── timetable.html        # Interactive Bus Timetable & Scheduled Halts
├── routes.html           # KTCL Route Directory & Accessibility Flags
├── announcements.html    # Transit Service Advisories & System Notices
├── bus-pass.html         # Prototype Digital Transit Pass (Demo Artifact)
├── profile.html          # Commuter Profile & Travel Preferences
├── drivers.html          # Driver Directory & Contact Roster
├── settings.html         # Theme Settings & Local Data Reset
├── css/
│   ├── style.css         # Main Design System & CSS Utility Tokens
│   ├── safestop.css      # SAFESTOP Gauge & Score Card Styling
│   ├── dashboard.css     # Layout Grids & Dashboard Utilities
│   └── responsive.css    # Responsive Mobile/Tablet Breakpoints
└── js/
    ├── storage.js        # AppStorage Persistence & Default Demo Seeding
    ├── safestop-data.js   # SAFESTOP Seed Data & Evidence Records
    ├── safestop.js        # SAFESTOP Scoring & Demand Assessment Engine
    ├── tracking.js        # Canvas Radar Engine & Telemetry Simulation
    ├── timetable.js       # Timetable Render & Schedule Viewer Logic
    ├── routes.js          # Route Directory Renderer
    ├── audio.js           # Web Audio & Speech Synthesis Engine
    └── app.js             # Global Modals, SOS System & Toast Notifications
```

---

## 11. Prototype Disclaimer & Data Honesty

* **Independent Hackathon Prototype:** SAFESTOP is an independent hackathon demonstration project. It is **not** an official product of Kadamba Transport Corporation Limited (KTCL) or the Government of Goa.
* **Prototype Assessment Data:** Boarding Confidence scores, stop feature evaluations, barrier reports, and demand estimates represent prototype demo evaluations created for hackathon demonstration purposes. They do **not** constitute official government accessibility certification.
* **Simulated Telemetry:** Bus locations, speeds, and radar animations are client-side simulations and do **not** connect to live vehicle hardware GPS hardware.

---

## 12. License

This project is licensed under the **MIT License**.
