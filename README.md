# SAFESTOP — Accessible Transit Assistant 🚌♿✨

> **Empowering commuters with disabilities and reduced mobility through transparent, multi-factor Boarding Confidence evaluations across Goa's bus transit network.**

---

## 1. Project Overview

**SAFESTOP** is an accessible transit intelligence web prototype designed to solve one of the most critical challenges in public transportation: **the gap between vehicle accessibility and stop infrastructure accessibility.**

While modern low-floor electric buses may be wheelchair-accessible on paper, a commuter with a mobility impairment cannot board if the bus stop lacks a ramp, has broken tactile paving, or is obstructed by construction barriers.

SAFESTOP bridges this gap by combining **bus feature data, physical stop attributes, verification freshness, and crowd-reported active barriers** into a transparent **0–100 Boarding Confidence score**.

---

## 2. Problem Statement

* **Vehicle vs. Stop Mismatch:** A wheelchair-accessible bus servicing a step-only stop renders the bus unusable for mobility-impaired passengers.
* **Unverified Claims & Travel Anxiety:** Static transit timetables declare routes as "accessible" without accounting for broken platform ramps or temporary sidewalk hazards.
* **Lack of Real-Time Barrier Visibility:** Construction, illegally parked vehicles, and broken tactile paths frequently obstruct boarding bays without warning.

---

## 3. The SAFESTOP Solution

SAFESTOP provides real-time accessibility transparency for commuters, caregivers, and transit operators.

**Core User Question Answered:**
> *"Can I realistically board this bus from this stop under current reported conditions?"*

### Key Principles:
* **Evidence-Based Scoring:** Points are awarded strictly for verified, present accessibility features.
* **Strict Semantic Data Model:**
  * `true` = Verified present
  * `false` = Verified absent
  * `null` / `undefined` = Unknown / Unverified (earns 0 points and caps confidence)
* **Critical Barrier Override:** Physical hazards that completely block boarding immediately override calculated points and force the confidence level to **LOW**.

---

## 4. How Boarding Confidence Works

SAFESTOP's deterministic engine calculates a **0–100 Boarding Confidence Score** divided into three evidence categories:

### Score Breakdown (100 Points Base)

| Category | Max Points | Measured Attributes |
| :--- | :---: | :--- |
| **Bus Accessibility** | **35 pts** | • Low-floor step-free entry (`12 pts`)<br>• Dedicated wheelchair bay (`9 pts`)<br>• Deployable boarding ramp (`8 pts`)<br>• Audio/visual boarding support (`6 pts`) |
| **Stop Accessibility** | **35 pts** | • Step-free approach path (`12 pts`)<br>• Clear 1.5m boarding area (`9 pts`)<br>• Platform boarding ramp (`8 pts`)<br>• Tactile paving for vision support (`6 pts`) |
| **Verification Freshness** | **30 pts** | • Verified $\le 7$ days: `30 pts`<br>• Verified $\le 30$ days: `20 pts`<br>• Verified $\le 90$ days: `10 pts`<br>• $> 90$ days or unverified: `0 pts` *(Caps confidence at 69)* |

### Barrier Penalties & Hard Overrides

* **Minor Barrier:** `-5 pts` (e.g., temporary narrow scaffolding).
* **Moderate Barrier:** `-15 pts` (e.g., damaged tactile tiles).
* **Critical Active Barrier (HARD OVERRIDE):** Unconditionally forces level **LOW** and caps final score at **$\le 39$** (e.g., broken wheelchair ramp, high curb block).

### Confidence Levels

| Level | Score Range | Meaning |
| :--- | :---: | :--- |
| <span style="color:#10b981; font-weight:bold;">HIGH</span> | **70 – 100** | Verified step-free bus, accessible stop, and recent inspection support independent boarding. |
| <span style="color:#f59e0b; font-weight:bold;">MODERATE</span> | **40 – 69** | Independent boarding may require driver assistance or ramp deployment; minor limits apply. |
| <span style="color:#ef4444; font-weight:bold;">LOW</span> | **0 – 39** | Critical access barrier or missing verification data; boarding assistance is mandatory. |

---

## 5. Demo / Goa Prototype Network

SAFESTOP is modeled on 6 key intra-Goa transit corridors operated by Kadamba Transport Corporation Limited (KTCL):

1. **Route 447:** `panaji-donapaula` — Panaji Bus Stand → Dona Paula Circle (Smart City EV Shuttle)
2. **Route 655:** `panaji-mapusa` — Panaji Bus Stand → Mapusa KTC Bus Stand (NH-66 North Goa Hub)
3. **Route 356:** `panaji-ponda` — Panaji Bus Stand → Ponda KTC Bus Stand (via Old Goa & Banastarim)
4. **Route 356M:** `panaji-margao` — Panaji Bus Stand → Margao KTC Bus Stand (Express Trunk Route)
5. **Route 374:** `panaji-vasco` — Panaji Bus Stand → Vasco KTC Bus Stand (via Cortalim Junction)
6. **KTCL-EV:** `mopa-panaji` — Manohar International Airport (Mopa) → Panaji Express

---

## 6. Main Features

* **Interactive Boarding Confidence Gauge:** Real-time SVG circular meter displaying sub-scores, active barriers, and evidence limitations.
* **Community Barrier Reporting:** Modal allowing commuters to report active obstacles with immediate score recalculation.
* **Live Radar & Telemetry Simulation:** Animated HTML5 Canvas radar displaying bus GPS position, speed, and upcoming stop ETA.
* **Interactive Timetable & Stop Schedules:** Comprehensive stop-by-stop schedule viewer with audio arrival announcements.
* **Digital Commuter Pass & Profile:** Student pass generator and commuter accessibility settings.
* **Offline-First LocalStorage Sync:** Instant client-side persistence for profile settings, favorite routes, and custom barrier reports.

---

## 7. Architecture

SAFESTOP follows a modular, decoupled architecture:

```
┌────────────────────────────────────────────────────────┐
│                     USER INTERFACE                     │
│  (safestop.html, tracking.html, timetable.html, etc.)  │
└───────────────────────────┬────────────────────────────┘
                            │
┌───────────────────────────▼────────────────────────────┐
│                    SAFESTOP ENGINE                     │
│        SafestopEngine.calculateConfidence()           │
└──────┬────────────────────┬────────────────────┬───────┘
       │                    │                    │
┌──────▼──────┐      ┌──────▼──────┐      ┌──────▼──────┐
│  DATA LAYER │      │ PERSISTENCE │      │ AUDIO/RADAR │
│ SafestopData│      │ AppStorage  │      │  AppAudio   │
└─────────────┘      └─────────────┘      └─────────────┘
```

---

## 8. Tech Stack

* **Frontend Structure:** HTML5 (Semantic, Accessible markup)
* **Styling:** Vanilla CSS3 (Custom CSS Variables, Flexbox, CSS Grid, Glassmorphism, Dark/Light theme)
* **Logic & Engine:** JavaScript ES6+ (Pure native JS, Web Audio API, Web Speech API, HTML5 Canvas 2D)
* **Dependencies:** Zero external frameworks or npm package runtime requirements.

---

## 9. Project Structure

```
smart-college-transport-main/
├── index.html            # Main Goa Mobility Dashboard & Quick Stats
├── safestop.html         # SAFESTOP Accessible Boarding Evaluation Portal
├── tracking.html         # Live Bus Radar & Telemetry Simulation
├── timetable.html        # Interactive Bus Timetable & Scheduled Halts
├── routes.html           # KTCL Route Directory & Low-Floor Badges
├── announcements.html    # Transit Service Advisories & Weather Alerts
├── bus-pass.html         # Digital Commuter Pass Generator
├── profile.html          # Commuter Profile & Travel Preferences
├── drivers.html          # Driver Directory & Contact Roster
├── settings.html         # Data Reset & Theme Management
├── css/
│   ├── style.css         # Main Design System & CSS Utility Tokens
│   ├── safestop.css      # SAFESTOP Meter & Score Card Styling
│   ├── dashboard.css     # Dashboard Grid & Card Layouts
│   └── responsive.css    # Responsive Mobile/Tablet Breakpoints
└── js/
    ├── storage.js        # AppStorage Persistence & Default Goa Data
    ├── safestop-data.js   # SafeStop Seed Repository & Profile Queries
    ├── safestop.js        # SAFESTOP Scoring Engine (calculateConfidence)
    ├── tracking.js        # Canvas Radar Engine & Bus Telemetry Simulation
    ├── timetable.js       # Timetable Render & Stop Highlight Logic
    ├── routes.js          # Route Catalog Renderer
    ├── audio.js           # Web Audio Tones & Speech Synthesis Engine
    └── app.js             # Global Modals, SOS System & Toast Notifications
```

---

## 10. Local Setup

No build step or server setup is required.

1. **Clone or Download the Repository:**
   ```bash
   git clone https://github.com/your-username/safestop.git
   cd safestop/smart-college-transport-main
   ```

2. **Run Locally:**
   * Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari), or
   * Serve using any local static HTTP server:
     ```bash
     npx serve .
     ```

---

## 11. Demo Flow for Evaluation

1. **Step 1: Open SAFESTOP Assistant (`safestop.html`)**
   * Default Selection: **Route 447 (Panaji → Dona Paula)** at **Dona Paula Circle (Stop #8)**.
   * Observe **100/100 HIGH CONFIDENCE** score, green gauge fill, and verified feature breakdown.

2. **Step 2: Inspect Moderate Barrier Impact**
   * Select **Goa Medical College (Stop #5)**.
   * Observe **71/100 HIGH CONFIDENCE** score with moderate barrier alert (`-15 pts` deduction for damaged tactile paving).

3. **Step 3: Test Critical Barrier Override**
   * Select **Route 356M (Panaji → Margao)** and **GMC Bambolim (Stop #2)**.
   * Observe **39/100 LOW CONFIDENCE** override forced by the broken wheelchair ramp (`bar-103`).

4. **Step 4: Submit a New Barrier**
   * Click **Report Accessibility Barrier** $\rightarrow$ Enter details $\rightarrow$ Submit.
   * Observe instant score recalculation.

5. **Step 5: Live Radar Tracking (`tracking.html`)**
   * Observe animated Canvas radar sweep, simulated bus position updates, and voice arrival announcements.

---

## 12. Prototype Limitations & Data Disclaimer

* **Prototype Demo Data:** All vehicle accessibility attributes, stop feature flags, barrier reports, and GPS telemetry are simulated demo data created for prototype evaluation.
* **No Official Endorsement:** SAFESTOP is an independent hackathon prototype and is **not** an official product of Kadamba Transport Corporation Limited (KTCL) or the Government of Goa.
* **Simulated Telemetry:** GPS locations are generated by client-side simulation loops, not live hardware GPS transponders.
* **Score Definition:** Boarding Confidence represents a structured accessibility evidence score based on available data. It is **not** a statistical probability or guarantee of boarding.

---

## 13. License

This project is licensed under the **MIT License**.
