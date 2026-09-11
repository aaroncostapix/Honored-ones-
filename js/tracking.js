/**
 * College Transport Management System - Bus Tracking Simulation & Canvas Radar Engine
 * Pure Frontend Simulation with Animated Canvas Map, Live Telemetry, Voice Alerts & Web Audio
 */

class BusTrackingSimulation {
    constructor() {
        this.route = AppStorage.getRouteById('panaji-donapaula');
        this.currentStopIndex = 1; // Default: Patto Plaza (Index 1) -> Next: Portais (Index 2)
        this.progressBetweenStops = 0.40; // 40% between Patto Plaza and Portais
        this.isPlaying = true;
        this.speedMultiplier = 1; // 1x, 2x, 5x
        this.simInterval = null;
        this.etaSeconds = 405;
        this.busSpeedKmH = 45;
        this.radarAngle = 0;

        // Telemetry GPS Coordinates (Simulated along Panaji -> Dona Paula highway)
        this.coordinates = [
            { lat: 15.4989, lng: 73.8370 }, // Panaji Bus Stand
            { lat: 15.4975, lng: 73.8340 }, // Patto Plaza
            { lat: 15.4920, lng: 73.8310 }, // Portais
            { lat: 15.4780, lng: 73.8320 }, // St. Cruz Church
            { lat: 15.4605, lng: 73.8350 }, // Goa Medical College (GMC)
            { lat: 15.4650, lng: 73.8210 }, // AIR Tower
            { lat: 15.4590, lng: 73.8110 }, // Goa University
            { lat: 15.4540, lng: 73.8040 }  // Dona Paula Circle
        ];

        // Elements
        this.routeSelect = document.getElementById('trackingRouteSelect');
        this.currentStopEl = document.getElementById('trackingCurrentStop');
        this.nextStopEl = document.getElementById('trackingNextStop');
        this.busNumberEl = document.getElementById('trackingBusNumber');
        this.driverNameEl = document.getElementById('trackingDriverName');
        this.etaDisplayEl = document.getElementById('trackingEtaDisplay');
        this.speedDisplayEl = document.getElementById('trackingSpeedDisplay');
        this.statusBadgeEl = document.getElementById('trackingStatusBadge');
        this.progressBarEl = document.getElementById('trackingProgressBar');
        this.progressPercentText = document.getElementById('trackingProgressPercent');
        this.progressAsciiBar = document.getElementById('trackingProgressAscii');
        this.stopsTimelineContainer = document.getElementById('trackingTimelineContainer');
        this.radarCanvas = document.getElementById('gpsRadarCanvas');
        this.telemetryGpsEl = document.getElementById('trackingTelemetryGps');

        this.init();
    }

    init() {
        // Load URL Param if any
        const urlParams = new URLSearchParams(window.location.search);
        const routeId = urlParams.get('route') || 'panaji-donapaula';
        this.route = AppStorage.getRouteById(routeId);

        // Restore saved simulation state if valid for current route
        const savedState = AppStorage.getSimulationState();
        if (savedState && savedState.routeId === this.route.id) {
            if (typeof savedState.currentStopIndex === 'number' &&
                savedState.currentStopIndex >= 0 &&
                savedState.currentStopIndex < this.route.stops.length) {
                this.currentStopIndex = savedState.currentStopIndex;
            }
            if (typeof savedState.progressBetweenStops === 'number' &&
                savedState.progressBetweenStops >= 0 &&
                savedState.progressBetweenStops <= 1) {
                this.progressBetweenStops = savedState.progressBetweenStops;
            }
        }

        // Populate Route Select
        if (this.routeSelect) {
            const allRoutes = AppStorage.getRoutes();
            this.routeSelect.innerHTML = allRoutes.map(r => `
                <option value="${r.id}" ${r.id === this.route.id ? 'selected' : ''}>${r.name} (${r.busNumber})</option>
            `).join('');

            this.routeSelect.addEventListener('change', (e) => {
                this.switchRoute(e.target.value);
            });
        }

        // Initialize Controls
        this.bindControls();

        // Render Initial UI & Start Loops
        this.renderTimeline();
        this.updateDisplays();
        this.startLoop();
        this.startRadarCanvas();
    }

    switchRoute(routeId) {
        this.route = AppStorage.getRouteById(routeId);
        this.currentStopIndex = 0;
        this.progressBetweenStops = 0.1;
        this.etaSeconds = 300;
        this.renderTimeline();
        this.updateDisplays();
        if (window.AppAudio) AppAudio.playTone(440, 0.1);
        showToast('Route Switched', `Now tracking ${this.route.name} (${this.route.busNumber})`, 'info');
    }

    bindControls() {
        const playBtn = document.getElementById('simPlayBtn');
        const pauseBtn = document.getElementById('simPauseBtn');
        const nextStepBtn = document.getElementById('simStepNextBtn');
        const resetBtn = document.getElementById('simResetBtn');
        const speed1x = document.getElementById('simSpeed1x');
        const speed2x = document.getElementById('simSpeed2x');
        const speed5x = document.getElementById('simSpeed5x');
        const voiceAnnounceBtn = document.getElementById('voiceAnnounceBtn');

        if (playBtn) playBtn.addEventListener('click', () => this.play());
        if (pauseBtn) pauseBtn.addEventListener('click', () => this.pause());
        if (nextStepBtn) nextStepBtn.addEventListener('click', () => this.stepNextStop());
        if (resetBtn) resetBtn.addEventListener('click', () => this.resetSimulation());

        const setSpeed = (spd, btn) => {
            this.speedMultiplier = spd;
            [speed1x, speed2x, speed5x].forEach(b => b && b.classList.remove('btn-primary'));
            if (btn) btn.classList.add('btn-primary');
            if (window.AppAudio) AppAudio.playTone(700, 0.05);
            showToast('Simulation Speed', `Speed set to ${spd}x`, 'info');
        };

        if (speed1x) speed1x.addEventListener('click', () => setSpeed(1, speed1x));
        if (speed2x) speed2x.addEventListener('click', () => setSpeed(2, speed2x));
        if (speed5x) speed5x.addEventListener('click', () => setSpeed(5, speed5x));

        if (voiceAnnounceBtn) {
            voiceAnnounceBtn.addEventListener('click', () => {
                const nextStop = this.route.stops[this.currentStopIndex + 1] || this.route.stops[this.currentStopIndex];
                if (window.AppAudio) {
                    AppAudio.playArrivalChime();
                    AppAudio.speakAnnouncement(`Attention students. Bus number ${this.route.busNumber}. Next stop is ${nextStop.name}. Scheduled time ${nextStop.time}.`);
                    showToast('Voice Announcement', `Broadcasting stop announcement for ${nextStop.name}`, 'info');
                }
            });
        }
    }

    startLoop() {
        if (this.simInterval) clearInterval(this.simInterval);
        this.simInterval = setInterval(() => {
            if (!this.isPlaying) return;

            // Increment progress
            const stepDelta = 0.015 * this.speedMultiplier;
            this.progressBetweenStops += stepDelta;
            this.etaSeconds = Math.max(10, this.etaSeconds - (2 * this.speedMultiplier));
            this.busSpeedKmH = Math.floor(42 + Math.random() * 6);

            if (this.progressBetweenStops >= 1.0) {
                this.progressBetweenStops = 0;
                if (this.currentStopIndex < this.route.stops.length - 1) {
                    this.currentStopIndex++;
                    this.etaSeconds = 480; // Reset ETA for next leg
                    const currentStop = this.route.stops[this.currentStopIndex];
                    
                    // Audio & Speech Alert
                    if (window.AppAudio) {
                        AppAudio.playArrivalChime();
                        AppAudio.speakAnnouncement(`Bus arrived at ${currentStop.name}. Next stop is ${this.route.stops[this.currentStopIndex + 1]?.name || 'Dona Paula Circle'}.`);
                    }

                    showToast('Bus Arrival', `Bus ${this.route.busNumber} arrived at ${currentStop.name}`, 'success');
                } else {
                    // Reached destination!
                    this.isPlaying = false;
                    if (window.AppAudio) {
                        AppAudio.playArrivalChime();
                        AppAudio.speakAnnouncement(`Bus reached destination at Dona Paula Circle.`);
                    }
                    showToast('Destination Reached', `Bus ${this.route.busNumber} reached ${this.route.destination}`, 'success');
                }
            }

            this.updateDisplays();
            this.updateTimelineClasses();
        }, 1000);
    }

    play() {
        this.isPlaying = true;
        if (window.AppAudio) AppAudio.playTone(500, 0.06);
        showToast('Simulation Resumed', `Bus live tracking active at ${this.speedMultiplier}x`, 'info');
        this.updateControlButtons();
    }

    pause() {
        this.isPlaying = false;
        if (window.AppAudio) AppAudio.playTone(350, 0.06);
        showToast('Simulation Paused', 'Bus position is temporarily held', 'warning');
        this.updateControlButtons();
    }

    stepNextStop() {
        if (this.currentStopIndex < this.route.stops.length - 1) {
            this.currentStopIndex++;
            this.progressBetweenStops = 0.1;
            this.etaSeconds = 360;
            this.updateDisplays();
            this.renderTimeline();
            if (window.AppAudio) AppAudio.playArrivalChime();
            showToast('Fast Forward', `Jumped to stop: ${this.route.stops[this.currentStopIndex].name}`, 'info');
        }
    }

    resetSimulation() {
        this.currentStopIndex = 0;
        this.progressBetweenStops = 0;
        this.etaSeconds = 600;
        this.isPlaying = true;
        this.updateDisplays();
        this.renderTimeline();
        if (window.AppAudio) AppAudio.playTone(400, 0.1);
        showToast('Simulation Reset', `Restarted at ${this.route.stops[0].name}`, 'info');
    }

    jumpToStop(stopIndex) {
        this.currentStopIndex = stopIndex;
        this.progressBetweenStops = 0.1;
        this.etaSeconds = 300;
        this.updateDisplays();
        this.renderTimeline();
        if (window.AppAudio) AppAudio.playTone(620, 0.08);
        showToast('Bus Repositioned', `Moved bus to ${this.route.stops[stopIndex].name}`, 'info');
    }

    updateControlButtons() {
        const playBtn = document.getElementById('simPlayBtn');
        const pauseBtn = document.getElementById('simPauseBtn');
        if (playBtn && pauseBtn) {
            if (this.isPlaying) {
                playBtn.classList.add('btn-primary');
                pauseBtn.classList.remove('btn-primary');
            } else {
                pauseBtn.classList.add('btn-primary');
                playBtn.classList.remove('btn-primary');
            }
        }
    }

    calculateTotalPercentage() {
        const totalStops = this.route.stops.length - 1;
        if (totalStops <= 0) return 100;
        const currentFraction = (this.currentStopIndex + this.progressBetweenStops) / totalStops;
        return Math.min(100, Math.round(currentFraction * 100));
    }

    generateAsciiBar(percent) {
        const totalBlocks = 14;
        const filledBlocks = Math.round((percent / 100) * totalBlocks);
        const emptyBlocks = Math.max(0, totalBlocks - filledBlocks);
        return '█'.repeat(filledBlocks) + '░'.repeat(emptyBlocks) + ` ${percent}%`;
    }

    updateDisplays() {
        const totalPercent = this.calculateTotalPercentage();
        const currentStop = this.route.stops[this.currentStopIndex] || this.route.stops[0];
        const nextStop = this.route.stops[this.currentStopIndex + 1] || { name: 'Destination Reached (Dona Paula)', time: this.route.arrivalTime };

        if (this.currentStopEl) this.currentStopEl.textContent = currentStop.name;
        if (this.nextStopEl) this.nextStopEl.textContent = nextStop.name;
        if (this.busNumberEl) this.busNumberEl.textContent = this.route.busNumber;
        if (this.driverNameEl) this.driverNameEl.textContent = `${this.route.driverName} (${this.route.driverPhone})`;
        
        // Format ETA
        const etaMins = Math.floor(this.etaSeconds / 60);
        const etaSecs = String(this.etaSeconds % 60).padStart(2, '0');
        if (this.etaDisplayEl) {
            this.etaDisplayEl.textContent = `${etaMins}m ${etaSecs}s (${nextStop.time})`;
        }

        if (this.speedDisplayEl) {
            this.speedDisplayEl.textContent = `${this.busSpeedKmH} km/h (Live GPS)`;
        }

        // Telemetry GPS Coordinates
        const c1 = this.coordinates[this.currentStopIndex] || this.coordinates[0];
        const c2 = this.coordinates[this.currentStopIndex + 1] || c1;
        const liveLat = (c1.lat + (c2.lat - c1.lat) * this.progressBetweenStops).toFixed(4);
        const liveLng = (c1.lng + (c2.lng - c1.lng) * this.progressBetweenStops).toFixed(4);

        if (this.telemetryGpsEl) {
            this.telemetryGpsEl.textContent = `${liveLat}° N, ${liveLng}° E | Highway SH-7`;
        }

        if (this.statusBadgeEl) {
            this.statusBadgeEl.innerHTML = `
                <span class="live-dot" style="width:7px;height:7px;border-radius:50%;background:#10b981;display:inline-block;animation:livePulse 1.5s infinite;"></span>
                On Time (${this.route.tripStatus})
            `;
        }

        if (this.progressBarEl) {
            this.progressBarEl.style.width = `${totalPercent}%`;
        }
        if (this.progressPercentText) {
            this.progressPercentText.textContent = `${totalPercent}% Completed`;
        }
        if (this.progressAsciiBar) {
            this.progressAsciiBar.textContent = this.generateAsciiBar(totalPercent);
        }

        // SAFESTOP Live Telemetry Evaluation
        if (typeof SafestopEngine !== 'undefined' && typeof SafestopData !== 'undefined') {
            const targetStop = this.route.stops[this.currentStopIndex + 1] || currentStop;
            const busProfile = SafestopData.getBusProfile(this.route.id, this.route.busNumber);
            const stopProfile = SafestopData.getStopProfile(this.route.id, targetStop.id, targetStop.name);
            const compositeId = SafestopData.getCompositeStopId(this.route.id, targetStop.id);
            const activeBarriers = SafestopData.getActiveBarriersForStop(compositeId);

            const evalResult = SafestopEngine.calculateConfidence({
                busProfile,
                stopProfile,
                activeBarriers
            });

            let barrierBadgeHtml = '';
            if (evalResult.criticalBarrierOverride) {
                barrierBadgeHtml = `
                    <span class="confidence-badge-pill confidence-low" style="font-size:0.75rem; padding: 0.25rem 0.65rem; margin-left: 0.35rem; background: #ef4444; color: #ffffff;">
                        ⚠️ Critical Barrier (Forces LOW)
                    </span>
                `;
            } else if (activeBarriers.length > 0 || evalResult.breakdown.barrierPenalty > 0) {
                barrierBadgeHtml = `
                    <span class="confidence-badge-pill confidence-moderate" style="font-size:0.75rem; padding: 0.25rem 0.65rem; margin-left: 0.35rem; background: #f59e0b; color: #ffffff;">
                        ⚠️ Active Barrier (-${evalResult.breakdown.barrierPenalty} pts)
                    </span>
                `;
            }

            const telemetryBadge = document.getElementById('safestopTelemetryBadge');
            if (telemetryBadge) {
                telemetryBadge.innerHTML = `
                    <span class="confidence-badge-pill ${evalResult.levelMeta.class}" style="font-size:0.75rem; padding: 0.25rem 0.75rem;">
                        Boarding Confidence: ${evalResult.score}/100 (${evalResult.level})
                    </span>
                    ${barrierBadgeHtml}
                `;
            }

            const viewDetailsLink = document.querySelector('a[href^="safestop.html"]');
            if (viewDetailsLink) {
                viewDetailsLink.href = `safestop.html?route=${encodeURIComponent(this.route.id)}&stop=${encodeURIComponent(targetStop.id)}`;
            }
        }

        // Save state for synchronization with dashboard
        AppStorage.saveSimulationState({
            routeId: this.route.id,
            currentStopIndex: this.currentStopIndex,
            progressBetweenStops: this.progressBetweenStops,
            currentStopName: currentStop.name,
            nextStopName: nextStop.name,
            nextStopTime: nextStop.time,
            etaMinutes: etaMins,
            totalPercent: totalPercent,
            busNumber: this.route.busNumber,
            lat: liveLat,
            lng: liveLng
        });
    }

    renderTimeline() {
        if (!this.stopsTimelineContainer) return;

        const totalPercent = this.calculateTotalPercentage();

        this.stopsTimelineContainer.innerHTML = `
            <div class="route-visual-container" style="position: relative; padding: 1.5rem 0;">
                <div class="visual-path-line" style="position: absolute; left: 24px; top: 25px; bottom: 25px; width: 4px; background: var(--border-color); z-index: 1;">
                    <div class="visual-path-progress" style="width: 100%; height: ${totalPercent}%; background: linear-gradient(to bottom, #10b981, #2563eb); transition: height 0.5s ease;"></div>
                </div>
                
                <div class="stops-nodes-list" style="display: flex; flex-direction: column; gap: 1.25rem; position: relative; z-index: 2;">
                    ${this.route.stops.map((stop, idx) => {
                        const isPassed = idx < this.currentStopIndex;
                        const isCurrent = idx === this.currentStopIndex;
                        const isNext = idx === this.currentStopIndex + 1;
                        const isDestination = idx === this.route.stops.length - 1;

                        let nodeIcon = `<span style="font-size: 0.72rem; font-weight: 800;">${idx + 1}</span>`;
                        let nodeBg = 'var(--bg-surface)';
                        let nodeBorder = 'var(--border-color)';
                        let nodeColor = 'var(--text-muted)';
                        let badgeHtml = `<span class="badge badge-info" style="font-size:0.7rem;">Scheduled</span>`;

                        if (isCurrent) {
                            nodeBg = 'var(--primary-light)';
                            nodeBorder = 'var(--primary)';
                            nodeColor = '#ffffff';
                            nodeIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6v6"></path><path d="M15 6v6"></path><path d="M2 12h19.6"></path><path d="M18 18h3s.5-1.7.8-2.8c.1-.4.2-.8.2-1.2 0-.4-.1-.8-.2-1.2l-.8-2.8H18"></path><path d="M4 18H2"></path><path d="m4 6 2-2h12l2 2"></path></svg>`;
                            badgeHtml = `<span class="badge badge-primary" style="font-size:0.7rem;"><span class="live-dot" style="width:6px;height:6px;border-radius:50%;background:#3b82f6;display:inline-block;animation:livePulse 1.5s infinite;"></span> Current Location</span>`;
                        } else if (isNext) {
                            nodeBg = 'rgba(245, 158, 11, 0.15)';
                            nodeBorder = '#f59e0b';
                            nodeColor = '#f59e0b';
                            badgeHtml = `<span class="badge badge-warning" style="font-size:0.7rem;"><span class="live-dot" style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;"></span> Approaching Next</span>`;
                        } else if (isPassed) {
                            nodeBg = 'var(--success-bg)';
                            nodeBorder = 'var(--success)';
                            nodeColor = 'var(--success)';
                            nodeIcon = `✓`;
                            badgeHtml = `<span class="badge badge-success" style="font-size:0.7rem;">Passed</span>`;
                        } else if (isDestination) {
                            badgeHtml = `<span class="badge badge-accent" style="font-size:0.7rem;">College Campus</span>`;
                        }

                        return `
                            <div class="stop-node-item" onclick="window.busSim && window.busSim.jumpToStop(${idx})" style="display: flex; align-items: center; gap: 1.25rem; cursor: pointer; padding: 0.5rem 0.75rem; border-radius: var(--radius-md); transition: background-color var(--transition-fast);">
                                <div class="node-circle" style="width: 42px; height: 42px; border-radius: 50%; background: ${nodeBg}; border: 2.5px solid ${nodeBorder}; color: ${nodeColor}; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: var(--shadow-sm); transition: all 0.3s ease;">
                                    ${nodeIcon}
                                </div>
                                <div class="node-details" style="flex: 1; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.5rem; background: var(--bg-muted); padding: 0.75rem 1.1rem; border-radius: var(--radius-md); border: 1px solid var(--border-color);">
                                    <div>
                                        <div style="font-weight: 700; font-size: 0.95rem; color: var(--text-main);">${stop.name}</div>
                                        <div style="font-size: 0.78rem; color: var(--text-muted);">${stop.landmark} (${stop.distanceKm} km)</div>
                                    </div>
                                    <div style="display: flex; align-items: center; gap: 0.75rem;">
                                        <span class="stop-time-badge" style="font-weight: 700;">${stop.time}</span>
                                        ${badgeHtml}
                                    </div>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    updateTimelineClasses() {
        const progressLine = document.querySelector('.visual-path-progress');
        if (progressLine) {
            progressLine.style.height = `${this.calculateTotalPercentage()}%`;
        }
    }

    /* ----------------------------------------------------------------------
       Canvas GPS Radar & Highway Corridor Map Visualizer
       ---------------------------------------------------------------------- */
    startRadarCanvas() {
        const canvas = this.radarCanvas;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            const rect = canvas.parentElement.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = 360;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const drawLoop = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const w = canvas.width;
            const h = canvas.height;

            // Background Grid
            ctx.strokeStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
            ctx.lineWidth = 1;
            const gridSize = 40;
            for (let x = 0; x < w; x += gridSize) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let y = 0; y < h; y += gridSize) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }

            // Radar Sweep
            this.radarAngle += 0.02;
            const centerX = w / 2;
            const centerY = h / 2;
            const maxRadius = Math.min(w, h) * 0.45;

            // Radar Rings
            ctx.strokeStyle = 'rgba(13, 148, 136, 0.2)';
            for (let r = 50; r < maxRadius; r += 50) {
                ctx.beginPath();
                ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
                ctx.stroke();
            }

            // Sweep Line
            const sweepX = centerX + Math.cos(this.radarAngle) * maxRadius;
            const sweepY = centerY + Math.sin(this.radarAngle) * maxRadius;
            const sweepGrad = ctx.createLinearGradient(centerX, centerY, sweepX, sweepY);
            sweepGrad.addColorStop(0, 'rgba(13, 148, 136, 0.4)');
            sweepGrad.addColorStop(1, 'rgba(13, 148, 136, 0)');
            ctx.strokeStyle = sweepGrad;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(sweepX, sweepY);
            ctx.stroke();

            // Highway Route Line
            const stopsCount = this.route.stops.length;
            const marginX = 60;
            const stepX = (w - marginX * 2) / (stopsCount - 1);
            const midY = h / 2;

            // Base Road Line
            ctx.strokeStyle = '#94a3b8';
            ctx.lineWidth = 6;
            ctx.beginPath();
            for (let i = 0; i < stopsCount; i++) {
                const px = marginX + i * stepX;
                const py = midY + Math.sin(i * 0.8) * 35;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.stroke();

            // Completed Road Line (Green)
            const completedFrac = (this.currentStopIndex + this.progressBetweenStops) / (stopsCount - 1);
            const busX = marginX + completedFrac * (w - marginX * 2);
            const busY = midY + Math.sin(completedFrac * (stopsCount - 1) * 0.8) * 35;

            ctx.strokeStyle = '#10b981';
            ctx.lineWidth = 6;
            ctx.beginPath();
            for (let i = 0; i <= this.currentStopIndex; i++) {
                const px = marginX + i * stepX;
                const py = midY + Math.sin(i * 0.8) * 35;
                if (i === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.lineTo(busX, busY);
            ctx.stroke();

            // Draw Stop Nodes
            for (let i = 0; i < stopsCount; i++) {
                const px = marginX + i * stepX;
                const py = midY + Math.sin(i * 0.8) * 35;
                const isPassed = i <= this.currentStopIndex;

                ctx.fillStyle = isPassed ? '#10b981' : '#cbd5e1';
                ctx.beginPath();
                ctx.arc(px, py, 6, 0, Math.PI * 2);
                ctx.fill();

                // Stop label
                ctx.fillStyle = document.documentElement.getAttribute('data-theme') === 'dark' ? '#cbd5e1' : '#475569';
                ctx.font = '10px "Plus Jakarta Sans", sans-serif';
                ctx.textAlign = 'center';
                const label = this.route.stops[i].name.split(' ')[0];
                ctx.fillText(label, px, py + (i % 2 === 0 ? 20 : -14));
            }

            // Draw Animated Bus Marker
            ctx.save();
            ctx.translate(busX, busY);

            // Glowing Pulse Ring
            ctx.fillStyle = 'rgba(37, 99, 235, 0.25)';
            ctx.beginPath();
            ctx.arc(0, 0, 18 + Math.sin(Date.now() * 0.005) * 4, 0, Math.PI * 2);
            ctx.fill();

            // Bus Body Icon
            ctx.fillStyle = '#2563eb';
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 2.5;
            ctx.stroke();

            // Bus Headlights Beam
            ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
            ctx.beginPath();
            ctx.moveTo(10, -4);
            ctx.lineTo(35, -16);
            ctx.lineTo(35, 16);
            ctx.lineTo(10, 4);
            ctx.closePath();
            ctx.fill();

            ctx.restore();

            requestAnimationFrame(drawLoop);
        };

        requestAnimationFrame(drawLoop);
    }
}

// Instantiate on tracking page load
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('trackingContainer')) {
        window.busSim = new BusTrackingSimulation();
    }
});
