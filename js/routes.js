/**
 * College Transport Management System - Routes Page Logic
 * Renders route cards, filters, and route details
 */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('routesGridContainer')) return;
    initRoutesPage();
});

function initRoutesPage() {
    const routes = AppStorage.getRoutes();
    const container = document.getElementById('routesGridContainer');
    const searchInput = document.getElementById('routeSearchInput');
    const filterStatus = document.getElementById('routeStatusFilter');

    function renderRoutes(list) {
        if (!container) return;
        
        if (list.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1 / -1; padding: 4rem 2rem; text-align: center; background: var(--bg-surface); border: 1px dashed var(--border-color); border-radius: var(--radius-xl);">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--text-subtle); margin-bottom: 1rem;"><circle cx="12" cy="12" r="10"></circle><line x1="8" y1="12" x2="16" y2="12"></line></svg>
                    <h3 style="font-size: 1.2rem; font-weight: 700; margin-bottom: 0.5rem;">No Bus Routes Found</h3>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">Try adjusting your search criteria or clear your active filters.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = list.map(route => `
            <div class="card route-directory-card" style="display: flex; flex-direction: column; justify-content: space-between;">
                <div class="card-body" style="padding: 1.6rem;">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.2rem;">
                        <div>
                            <div style="display: flex; gap: 0.4rem; align-items: center; margin-bottom: 0.4rem;">
                                <span class="badge badge-primary">${route.code}</span>
                                ${typeof SafestopData !== 'undefined' && SafestopData.getBusProfile(route.id, route.busNumber).lowFloor
                                    ? '<span class="badge badge-success" style="font-size: 0.7rem; background: var(--confidence-high-bg); color: var(--confidence-high); border: 1px solid var(--confidence-high);">♿ Low Floor</span>'
                                    : '<span class="badge" style="font-size: 0.7rem; background: var(--bg-muted); color: var(--text-muted);">Step Entry</span>'}
                            </div>
                            <h2 style="font-size: 1.35rem; font-weight: 800; color: var(--text-main); letter-spacing: -0.02em;">${route.name}</h2>
                        </div>
                        <span class="badge badge-success">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
                            ${route.status}
                        </span>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.85rem; padding: 1rem; background-color: var(--bg-muted); border-radius: var(--radius-md); border: 1px solid var(--border-color); margin-bottom: 1.25rem; font-size: 0.86rem;">
                        <div>
                            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Departure</div>
                            <div style="font-weight: 700; color: var(--primary-light); font-size: 1rem;">${route.startTime}</div>
                            <div style="font-size: 0.76rem; color: var(--text-subtle);">${route.startPoint}</div>
                        </div>
                        <div>
                            <div style="font-size: 0.72rem; color: var(--text-muted); text-transform: uppercase; font-weight: 700;">Destination</div>
                            <div style="font-weight: 700; color: var(--accent); font-size: 1rem;">${route.arrivalTime}</div>
                            <div style="font-size: 0.76rem; color: var(--text-subtle);">${route.destination}</div>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 0.5rem; font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1.5rem;">
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span>Assigned Bus:</span>
                            <strong style="font-family: var(--font-mono); color: var(--text-main);">${route.busNumber}</strong>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span>Total Stops:</span>
                            <strong style="color: var(--text-main);">${route.stopsCount} Verified Stops</strong>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span>Route Distance & Time:</span>
                            <strong style="color: var(--text-main);">${route.totalDistance} (${route.totalDuration})</strong>
                        </div>
                        <div style="display: flex; align-items: center; justify-content: space-between;">
                            <span>Assigned Operator:</span>
                            <strong style="color: var(--text-main);">${route.driverName}</strong>
                        </div>
                    </div>
                </div>

                <div style="padding: 1rem 1.6rem; background-color: var(--bg-muted); border-top: 1px solid var(--border-color); display: flex; gap: 0.75rem;">
                    <a href="tracking.html?route=${route.id}" class="btn btn-primary btn-sm" style="flex: 1;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
                        Track Live
                    </a>
                    <a href="timetable.html?route=${route.id}" class="btn btn-secondary btn-sm" style="flex: 1;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                        Timetable
                    </a>
                </div>
            </div>
        `).join('');
    }

    function filterData() {
        const query = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const status = (filterStatus ? filterStatus.value : 'all');

        const filtered = routes.filter(r => {
            const matchesQuery = r.name.toLowerCase().includes(query) ||
                                 r.busNumber.toLowerCase().includes(query) ||
                                 r.startPoint.toLowerCase().includes(query) ||
                                 r.destination.toLowerCase().includes(query) ||
                                 r.driverName.toLowerCase().includes(query);
            const matchesStatus = status === 'all' || r.status.toLowerCase() === status.toLowerCase();
            return matchesQuery && matchesStatus;
        });

        renderRoutes(filtered);
    }

    if (searchInput) searchInput.addEventListener('input', filterData);
    if (filterStatus) filterStatus.addEventListener('change', filterData);

    // Initial Render
    renderRoutes(routes);
}
