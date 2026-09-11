# Smart College Transportation (ITR Transport) 🚌✨

> **Live Demo Web App**: [https://smarttransport1.netlify.app/](https://smarttransport1.netlify.app/)

A modern, responsive, and feature-rich **College Transportation Management Web Application** designed for students, drivers, and transport administrators. Built entirely with **pure HTML5, CSS3, and JavaScript** with zero heavy frameworks.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-smarttransport1.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://smarttransport1.netlify.app/)
[![Frontend](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-blue?style=for-the-badge)](https://smarttransport1.netlify.app/)
[![Audio API](https://img.shields.io/badge/Audio-Web%20Audio%20%2B%20Web%20Speech-orange?style=for-the-badge)](https://smarttransport1.netlify.app/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 🌐 Live Deployment

The application is deployed and accessible at:
🔗 **[https://smarttransport1.netlify.app/](https://smarttransport1.netlify.app/)**

---

## 🌟 Key Features

- 🚌 **Live Bus Tracking Simulation & HTML5 Canvas Radar**: Interactive simulation engine featuring live speed, distance-to-go, real-time GPS telemetry coordinates, animated canvas sweep radar, and visual roadmap progression.
- 🗣️ **Web Speech & Web Audio Synthesizer**: Text-to-Speech stop voice alerts (*"Approaching Chanasma stop"*) and procedural audio tones without any external audio asset dependencies.
- 📋 **Authentic Patan → ITR Route Timetable**: Accurate 13-stop morning route starting from Bagavada Darwaja (7:40 AM) to ITR Campus (9:30 AM).
- 🎫 **Digital Bus Pass with Canvas QR**: Verified student bus pass featuring holographic security strip, dynamic 2D matrix Canvas QR code generator, and 1-click **Download as PNG / Print PDF** support.
- 🚨 **Emergency SOS System**: Instant alert popup with 1-tap campus helpline dialing, emergency SMS triggering, and sirens.
- 💺 **Bus Seat Occupancy Heatmap**: Visual interactive bus seating layout (54 seats, 48 occupied, 6 available) with window/aisle indicators.
- 🗺️ **Multi-Corridor Route Directory**: 8 active bus corridors connecting 68 stops with search and corridor filters.
- 👨‍✈️ **Verified Drivers Directory**: Authorized drivers list with experience records, safety ratings, and direct helpline contact.
- 📢 **Campus Notice Board**: Categorized circulars (Urgent, Timetable Updates, Holidays, Maintenance).
- 🌓 **High-Contrast Dark / Light Mode**: Seamless theme switching with smooth transitions and persistent `localStorage` preference.
- 🧭 **Smart Journey & Fare Planner**: Calculate scheduled boarding time, distance, and transit arrival for any stop.

---

## 📸 Page Overview

| Page | File | Description |
| :--- | :--- | :--- |
| **Dashboard** | `index.html` | High-level metrics, active corridor status, upcoming bus card, and quick links |
| **Live Tracking** | `tracking.html` | Real-time Canvas highway radar, simulation controls (Play, Pause, Step, Speed 1x-5x), and live telemetry |
| **Timetable** | `timetable.html` | Scheduled stop timings, landmark directory, slot filters, and official travel notices |
| **Bus Pass** | `bus-pass.html` | Digital student identity pass with live QR generator, PNG exporter, and print template |
| **Bus Routes** | `routes.html` | Grid of 8 active campus bus lines with bus numbers, stops, and durations |
| **Drivers** | `drivers.html` | Campus driver contact information, ratings, and vehicle assignment |
| **Announcements** | `announcements.html` | Transport notice board with category filters (Urgent, Monsoon schedule, etc.) |
| **Student Profile** | `profile.html` | Editable student profile and default boarding stop selection |
| **Settings** | `settings.html` | Theme toggle, simulation preferences, and storage management |

---

## 🗂️ Project Structure

```
college-transport-management/
├── index.html              # Main dashboard
├── tracking.html           # Live bus tracking & canvas radar
├── timetable.html          # Stop-by-stop schedule
├── bus-pass.html           # Digital student pass with QR generator
├── routes.html             # Route directory
├── drivers.html            # Driver directory
├── announcements.html      # Campus announcements
├── profile.html            # Profile management
├── settings.html           # System configuration
├── css/
│   ├── style.css           # Core styling, tokens, reset & components
│   ├── dashboard.css       # Layout styles and specific card designs
│   └── responsive.css      # Mobile, tablet & desktop media queries
├── js/
│   ├── storage.js          # Central mock data & localStorage manager
│   ├── audio.js            # Web Audio API tone synth & Web Speech voice alerts
│   ├── app.js              # Global navbar, theme, SOS, clock & modals
│   ├── tracking.js         # Canvas radar loop & tracking simulation engine
│   ├── routes.js           # Dynamic routes renderer & filters
│   └── timetable.js        # Timetable viewer & search
└── README.md               # Project documentation
```

---

## 🚀 How to Run Locally

### Option 1: Direct File Open
Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Microsoft Edge, Firefox, Safari).

### Option 2: Local HTTP Server
Using Python:
```bash
python -m http.server 3000
```
Then navigate to `http://localhost:3000` in your web browser.

---

## 🛠️ Technology Stack

- **Semantic HTML5**
- **Vanilla CSS3** (Custom Properties, Flexbox, CSS Grid, Glassmorphism, Keyframe Animations)
- **Vanilla JavaScript (ES6+)**
- **HTML5 Canvas API** (Real-time radar rendering & QR code generation)
- **Web Audio API** (Procedural UI tones, arrival chimes, SOS alert)
- **Web Speech API** (Voice announcements for bus stops)
- **Local Storage API** (Persistent preferences, profile changes, and simulation states)

---

## 📄 License
This project is open source and available under the [MIT License](LICENSE).
