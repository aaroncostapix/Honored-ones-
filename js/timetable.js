/**
 * College Transport Management System - Timetable Logic
 * Handles Route Selection, Dynamic Timetable Rendering, Stop Search, Time Filter & Next Stop Highlighting
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('timetableTableBody')) return;
    initTimetablePage();
});

function initTimetablePage() {
    const routeSelect = document.getElementById('timetableRouteSelect');
    const searchStopInput = document.getElementById('timetableSearchInput');
    const timeFilter = document.getElementById('timetableTimeFilter');
    const tableBody = document.getElementById('timetableTableBody');
    const routeNoticeEl = document.getElementById('timetableNoticeText');
    const routeInfoCard = document.getElementById('timetableRouteMeta');

    // Parse URL params for pre-selection
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedRouteId = urlParams.get('route') || 'panaji-donapaula';
    const preselectedStop = urlParams.get('stop') || '';

    // Populate route selector
    const routes = AppStorage.getRoutes();
    if (routeSelect) {
        routeSelect.innerHTML = routes.map(r => `
            <option value="${r.id}" ${r.id === preselectedRouteId ? 'selected' : ''}>
                ${r.name} (${r.busNumber})
            </option>
        `).join('');

        routeSelect.addEventListener('change', () => {
            renderTimetable();
        });
    }

    if (searchStopInput && preselectedStop) {
        searchStopInput.value = preselectedStop;
    }

    function renderTimetable() {
        const activeRouteId = routeSelect ? routeSelect.value : 'panaji-donapaula';
        const route = AppStorage.getRouteById(activeRouteId);
        const searchQuery = (searchStopInput ? searchStopInput.value : '').toLowerCase().trim();
        const activeTimeFilter = timeFilter ? timeFilter.value : 'all';

        // Update Notice
        if (routeNoticeEl) {
            routeNoticeEl.textContent = route.notice || "Passengers are requested to reach their respective bus stop 2–5 minutes before the scheduled arrival time.";
        }

        // Update Meta Header
        if (routeInfoCard) {
            routeInfoCard.innerHTML = `
                <div style="display: flex; flex-wrap: wrap; gap: 1.5rem; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.35rem; flex-wrap: wrap;">
                            <span class="badge badge-source-official" title="Official KTCL GTFS Route Code">${route.code}</span>
                            <span class="badge badge-source-official" style="font-size: 0.68rem;">Official GTFS</span>
                            <h2 style="font-size: 1.4rem; font-weight: 800; color: var(--text-main); margin-left: 0.25rem;">${route.name}</h2>
                        </div>
                        <p style="color: var(--text-muted); font-size: 0.88rem;">
                            Assigned Bus: <strong style="font-family: var(--font-mono); color: var(--text-main);">${route.busNumber}</strong> | 
                            Operator: <strong style="color: var(--text-main);">${route.driverName}</strong> |
                            Departure: <strong>${route.startTime}</strong> → Arrival: <strong>${route.arrivalTime}</strong>
                        </p>
                    </div>
                    <div style="display: flex; gap: 0.75rem;">
                        <a href="tracking.html?route=${route.id}" class="btn btn-primary btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                            Track Bus Live
                        </a>
                        <button type="button" onclick="window.print()" class="btn btn-secondary btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect width="12" height="8" x="6" y="14"></rect></svg>
                            Print Timetable
                        </button>
                    </div>
                </div>
            `;
        }

        // Filter stops
        let filteredStops = route.stops.filter(stop => {
            const matchesQuery = stop.name.toLowerCase().includes(searchQuery) ||
                                 stop.landmark.toLowerCase().includes(searchQuery) ||
                                 stop.time.toLowerCase().includes(searchQuery);
            
            let matchesTime = true;
            if (activeTimeFilter === 'morning-early') {
                matchesTime = stop.time.includes('7:') || stop.time.includes('07:');
            } else if (activeTimeFilter === 'morning-late') {
                matchesTime = stop.time.includes('8:') || stop.time.includes('08:') || stop.time.includes('9:') || stop.time.includes('09:');
            }
            return matchesQuery && matchesTime;
        });

        if (filteredStops.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align: center; padding: 3rem 1.5rem; color: var(--text-muted);">
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-subtle); margin-bottom: 0.5rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                        <div style="font-weight: 700; font-size: 1rem;">No bus stops found</div>
                        <div style="font-size: 0.82rem; margin-top: 0.2rem;">Try searching for a different stop name or landmark.</div>
                    </td>
                </tr>
            `;
            return;
        }

        // Determine "Upcoming / Next" stop simulation (defaults to stop #5 Patto Plaza or based on current simulated progress)
        const activeSim = AppStorage.getSimulationState() || { currentStopIndex: 4 };
        const highlightStopIndex = activeSim.currentStopIndex || 4; // default Patto Plaza / Portais

        tableBody.innerHTML = filteredStops.map((stop, idx) => {
            const originalIndex = route.stops.findIndex(s => s.id === stop.id);
            const isPassed = originalIndex < highlightStopIndex;
            const isCurrentNext = originalIndex === highlightStopIndex;
            const isDestination = originalIndex === route.stops.length - 1;

            let rowClass = '';
            let statusBadge = `<span class="badge badge-info" style="font-size: 0.72rem;">Scheduled</span>`;

            if (isCurrentNext) {
                rowClass = 'style="background-color: var(--primary-subtle); font-weight: 700;"';
                statusBadge = `<span class="badge badge-warning" style="font-size: 0.72rem;"><span class="pulse-dot" style="width:6px;height:6px;border-radius:50%;background:#f59e0b;display:inline-block;"></span> Next Stop</span>`;
            } else if (isPassed) {
                statusBadge = `<span class="badge badge-success" style="font-size: 0.72rem;">Passed</span>`;
            } else if (isDestination) {
                statusBadge = `<span class="badge badge-primary" style="font-size: 0.72rem;">Destination</span>`;
            }

            let confidencePill = `<span class="badge" style="font-size: 0.72rem; background: var(--bg-muted); color: var(--text-muted);">Unverified</span>`;
            if (typeof SafestopData !== 'undefined' && typeof SafestopEngine !== 'undefined') {
                const busProfile = SafestopData.getBusProfile(route.id, route.busNumber);
                const stopProfile = SafestopData.getStopProfile(route.id, stop.id, stop.name);
                const compositeId = SafestopData.getCompositeStopId(route.id, stop.id);
                const activeBarriers = SafestopData.getActiveBarriersForStop(compositeId);
                const evalRes = SafestopEngine.calculateConfidence({ busProfile, stopProfile, activeBarriers });
                confidencePill = `<span class="confidence-badge-pill ${evalRes.levelMeta.class}" style="font-size:0.7rem; padding: 0.2rem 0.5rem;">${evalRes.score}/100 (${evalRes.level})</span>`;
            }

            return `
                <tr ${rowClass}>
                    <td data-label="Stop #" style="font-family: var(--font-mono); font-weight: 700; color: var(--text-subtle); width: 60px;">
                        ${String(originalIndex + 1).padStart(2, '0')}
                    </td>
                    <td data-label="Bus Stop Name">
                        <div style="display: flex; align-items: center; gap: 0.6rem;">
                            ${isCurrentNext ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: var(--primary-light); flex-shrink:0;"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>` : ''}
                            <span style="font-size: 0.95rem; font-weight: ${isCurrentNext ? '800' : '600'}; color: var(--text-main);">${stop.name}</span>
                        </div>
                    </td>
                    <td data-label="Scheduled Time">
                        <span class="stop-time-badge" style="font-size: 0.88rem; font-weight: 700; ${isCurrentNext ? 'background-color: var(--primary-light); color:#fff;' : ''}">
                            ${stop.time}
                        </span>
                    </td>
                    <td data-label="Prominent Landmark" style="color: var(--text-muted); font-size: 0.86rem;">
                        ${stop.landmark || 'Main Road Stand'}
                    </td>
                    <td data-label="Distance" style="font-family: var(--font-mono); font-size: 0.84rem; color: var(--text-muted);">
                        ${stop.distanceKm} km
                    </td>
                    <td data-label="SAFESTOP Confidence">
                        ${confidencePill}
                    </td>
                    <td data-label="Status">
                        ${statusBadge}
                    </td>
                </tr>
            `;
        }).join('');
    }

    const timeFilterBtns = document.querySelectorAll('.timetable-filter-btn');
    if (timeFilterBtns.length > 0) {
        timeFilterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const slot = btn.dataset.time;
                timeFilterBtns.forEach(b => {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
                btn.setAttribute('aria-pressed', 'true');
                if (timeFilter) timeFilter.value = slot;
                renderTimetable();
            });
        });
    }

    if (searchStopInput) searchStopInput.addEventListener('input', renderTimetable);
    if (timeFilter) {
        timeFilter.addEventListener('change', () => {
            timeFilterBtns.forEach(b => {
                const isSelected = b.dataset.time === timeFilter.value;
                b.classList.toggle('btn-primary', isSelected);
                b.classList.toggle('btn-secondary', !isSelected);
                b.setAttribute('aria-pressed', isSelected ? 'true' : 'false');
            });
            renderTimetable();
        });
    }

    // Initial Render
    renderTimetable();
}
