/**
 * College Transport Management System - Main App JS
 * Handles Theme Toggling, Mobile Drawer & Bottom Nav, Live Clock, Global Search, SOS Emergency Modal,
 * Seat Occupancy Heatmap, Audio Integration, and Animated Statistics.
 */

document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMobileNav();
    initLiveClock();
    initGlobalSearch();
    initProfileSync();
    initAudioControls();
    initSosEmergencySystem();
    initSeatHeatmapModal();
    initStatCounters();
    highlightActiveNavLink();
});

/* --------------------------------------------------------------------------
   Theme Management (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initTheme() {
    const savedTheme = AppStorage.getTheme();
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggleIcons(savedTheme);

    const themeToggleBtns = document.querySelectorAll('.theme-toggle-btn');
    themeToggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (window.AppAudio) AppAudio.playClick();
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            document.documentElement.setAttribute('data-theme', newTheme);
            AppStorage.setTheme(newTheme);
            updateThemeToggleIcons(newTheme);
            showToast('Theme Updated', `Switched to ${newTheme === 'dark' ? 'Dark Mode' : 'Light Mode'}`, 'info');
        });
    });
}

function updateThemeToggleIcons(theme) {
    const icons = document.querySelectorAll('.theme-icon');
    icons.forEach(icon => {
        if (theme === 'dark') {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="m4.93 4.93 1.41 1.41"></path><path d="m17.66 17.66 1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="m6.34 17.66-1.41 1.41"></path><path d="m19.07 4.93-1.41 1.41"></path></svg>`;
        } else {
            icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path></svg>`;
        }
    });
}

/* --------------------------------------------------------------------------
   Audio Mute & Voice Controls
   -------------------------------------------------------------------------- */
function initAudioControls() {
    const audioToggleBtn = document.getElementById('headerAudioToggleBtn');
    if (!audioToggleBtn) return;

    function updateAudioIcon() {
        const isMuted = window.AppAudio ? AppAudio.isMuted : false;
        if (isMuted) {
            audioToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 18 18"></path><path d="M11 5 6 9H2v6h4l5 4V5Z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>`;
            audioToggleBtn.title = "Unmute Audio";
        } else {
            audioToggleBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>`;
            audioToggleBtn.title = "Mute Audio";
        }
    }

    updateAudioIcon();

    audioToggleBtn.addEventListener('click', () => {
        if (window.AppAudio) {
            const isMuted = AppAudio.toggleMute();
            updateAudioIcon();
            showToast('Audio Settings', isMuted ? 'Sound & voice muted' : 'Sound & voice active', 'info');
        }
    });
}

/* --------------------------------------------------------------------------
   Emergency SOS System & Modal
   -------------------------------------------------------------------------- */
function initSosEmergencySystem() {
    // Inject SOS Modal if not in DOM
    if (!document.getElementById('sosEmergencyModal')) {
        const sosModalHtml = `
            <div id="sosEmergencyModal" class="modal-backdrop">
                <div class="modal-card" style="max-width: 520px; border-top: 5px solid #ef4444;">
                    <div class="modal-header" style="background: rgba(239, 68, 68, 0.1);">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <div style="width: 38px; height: 38px; border-radius: 50%; background: #ef4444; color: #fff; display: flex; align-items: center; justify-content: center;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                            </div>
                            <div>
                                <h3 style="color: #ef4444; font-size: 1.2rem; font-weight: 800;">Emergency Safety SOS</h3>
                                <div style="font-size: 0.78rem; color: var(--text-muted);">24x7 ITR Transit Security Command Center</div>
                            </div>
                        </div>
                        <button class="btn-sm btn-secondary" onclick="document.getElementById('sosEmergencyModal').classList.remove('active')">✕</button>
                    </div>
                    <div style="padding: 1.5rem;">
                        <p style="font-size: 0.92rem; color: var(--text-muted); line-height: 1.5; margin-bottom: 1.25rem;">
                            If you require immediate medical, breakdown, or safety assistance while traveling on a college bus, trigger the dispatch protocol below:
                        </p>

                        <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
                            <a href="tel:02766291000" class="btn btn-primary" style="background: #ef4444; justify-content: flex-start; padding: 0.85rem 1.2rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                                <div>
                                    <div style="font-weight: 800;">Call Campus Security: 02766-291000</div>
                                    <div style="font-size: 0.74rem; opacity: 0.9;">Direct line to Main Gate Transport Control</div>
                                </div>
                            </a>

                            <button onclick="simulateEmergencyDispatch()" class="btn btn-secondary" style="border-color: #f59e0b; color: #d97706; justify-content: flex-start; padding: 0.85rem 1.2rem;">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a8 8 0 0 0-8 8c0 5.25 8 12 8 12s8-6.75 8-12a8 8 0 0 0-8-8z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                <div>
                                    <div style="font-weight: 800;">Broadcast Live GPS to Parent & Security</div>
                                    <div style="font-size: 0.74rem; color: var(--text-muted);">Transmits location telemetry via simulated SMS</div>
                                </div>
                            </button>
                        </div>

                        <div style="padding: 0.75rem; border-radius: var(--radius-md); background: var(--bg-muted); font-size: 0.82rem; color: var(--text-muted);">
                            <strong>Student:</strong> Preyal Modi | <strong>Route:</strong> Patan → ITR (GJ-02-AZ-4512)
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', sosModalHtml);
    }

    const sosBtns = document.querySelectorAll('.trigger-sos-modal');
    sosBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AppAudio) AppAudio.playSosAlarm();
            document.getElementById('sosEmergencyModal').classList.add('active');
        });
    });
}

function simulateEmergencyDispatch() {
    const modal = document.getElementById('sosEmergencyModal');
    if (modal) modal.classList.remove('active');
    if (window.AppAudio) AppAudio.playArrivalChime();
    showToast('Emergency SOS Sent', 'Live coordinates dispatched to Father (+91 94280 12345) & Campus Security!', 'danger');
}

/* --------------------------------------------------------------------------
   Live Seat Heatmap & Capacity Modal
   -------------------------------------------------------------------------- */
function initSeatHeatmapModal() {
    if (!document.getElementById('seatHeatmapModal')) {
        const seatModalHtml = `
            <div id="seatHeatmapModal" class="modal-backdrop">
                <div class="modal-card" style="max-width: 580px;">
                    <div class="modal-header">
                        <div class="card-title">
                            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                            <span>Live Bus Seat Availability Heatmap</span>
                        </div>
                        <button class="btn-sm btn-secondary" onclick="document.getElementById('seatHeatmapModal').classList.remove('active')">✕</button>
                    </div>
                    <div style="padding: 1.5rem;">
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                            <div>
                                <strong style="font-size: 1.1rem; color: var(--text-main);">Bus #GJ-02-AZ-4512 (Patan Route)</strong>
                                <div style="font-size: 0.8rem; color: var(--text-muted);">Capacity: 54 Seats | <strong>48 Occupied</strong> | <span style="color:#10b981; font-weight:700;">6 Available</span></div>
                            </div>
                            <div style="display: flex; gap: 0.75rem; font-size: 0.75rem;">
                                <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:10px;height:10px;border-radius:2px;background:#ef4444;"></span> Occupied</span>
                                <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:10px;height:10px;border-radius:2px;background:#10b981;"></span> Available</span>
                                <span style="display:flex; align-items:center; gap:0.25rem;"><span style="width:10px;height:10px;border-radius:2px;background:#8b5cf6;"></span> Reserved</span>
                            </div>
                        </div>

                        <!-- 54 Seats Layout Grid -->
                        <div class="bus-seat-grid" id="busSeatGridContainer">
                            <!-- Populated dynamically -->
                        </div>

                        <div style="display: flex; justify-content: flex-end;">
                            <button class="btn btn-secondary btn-sm" onclick="document.getElementById('seatHeatmapModal').classList.remove('active')">Close Heatmap</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', seatModalHtml);
    }

    // Populate seats
    const seatGrid = document.getElementById('busSeatGridContainer');
    if (seatGrid) {
        let seatsHtml = `<div class="seat-box driver-seat">DRIVER CABIN</div><div class="seat-aisle"></div><div class="seat-box reserved" title="Conductor">COND</div><div class="seat-box reserved" title="Staff">STF</div>`;
        for (let i = 1; i <= 52; i++) {
            const isAvailable = [8, 14, 21, 33, 42, 49].includes(i);
            const isReserved = [1, 2, 3, 4].includes(i);
            let cls = isAvailable ? 'available' : (isReserved ? 'reserved' : 'occupied');
            let tooltip = isAvailable ? `Seat #${i} Available` : (isReserved ? `Seat #${i} Female Reserved` : `Seat #${i} Occupied`);

            seatsHtml += `<div class="seat-box ${cls}" title="${tooltip}" onclick="showToast('Seat Selected', '${tooltip}', '${isAvailable ? 'success' : 'info'}')">${i}</div>`;
            if (i % 4 === 2) {
                seatsHtml += `<div class="seat-aisle"></div>`;
            }
        }
        seatGrid.innerHTML = seatsHtml;
    }

    const seatBtns = document.querySelectorAll('.trigger-seat-modal');
    seatBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (window.AppAudio) AppAudio.playClick();
            document.getElementById('seatHeatmapModal').classList.add('active');
        });
    });
}

/* --------------------------------------------------------------------------
   Animated Number Counters
   -------------------------------------------------------------------------- */
function initStatCounters() {
    const statValues = document.querySelectorAll('.stat-value');
    statValues.forEach(el => {
        const target = parseInt(el.textContent.replace(/[^0-9]/g, '')) || 0;
        if (target <= 0) return;
        let count = 0;
        const step = Math.max(1, Math.floor(target / 25));
        const timer = setInterval(() => {
            count += step;
            if (count >= target) {
                el.textContent = target;
                clearInterval(timer);
            } else {
                el.textContent = count;
            }
        }, 30);
    });
}

/* --------------------------------------------------------------------------
   Mobile Navigation Drawer & Bottom Bar
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle-btn');
    
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }

    if (menuToggle && sidebar) {
        menuToggle.addEventListener('click', () => {
            if (window.AppAudio) AppAudio.playClick();
            sidebar.classList.toggle('open');
            overlay.classList.toggle('active');
        });

        overlay.addEventListener('click', () => {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
        });
    }
}

/* --------------------------------------------------------------------------
   Sidebar Active Link Highlighting
   -------------------------------------------------------------------------- */
function highlightActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* --------------------------------------------------------------------------
   Live Digital Clock
   -------------------------------------------------------------------------- */
function initLiveClock() {
    const clockElement = document.getElementById('liveClockDisplay');
    if (!clockElement) return;

    function updateClock() {
        const now = new Date();
        const hours = now.getHours();
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12).padStart(2, '0');
        
        clockElement.textContent = `${formattedHours}:${minutes}:${seconds} ${ampm}`;
    }

    updateClock();
    setInterval(updateClock, 1000);
}

/* --------------------------------------------------------------------------
   Global Search Modal & Instant Filter
   -------------------------------------------------------------------------- */
function initGlobalSearch() {
    if (!document.getElementById('globalSearchModal')) {
        const modalHtml = `
            <div id="globalSearchModal" class="search-modal-backdrop">
                <div class="search-modal">
                    <div class="search-modal-header">
                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.3-4.3"></path></svg>
                        <input type="text" id="globalModalSearchInput" class="search-modal-input" placeholder="Search routes, bus stops, bus numbers, drivers..." autocomplete="off">
                        <button id="closeSearchModalBtn" class="btn-sm btn-secondary">ESC</button>
                    </div>
                    <div id="globalSearchResults" class="search-modal-results">
                        <div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">Type to search all routes, stops, and transport information...</div>
                    </div>
                    <div class="search-modal-footer">
                        <span>Quick Navigation</span>
                        <span>Press <kbd>ESC</kbd> to close</span>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
    }

    const searchBackdrop = document.getElementById('globalSearchModal');
    const searchInput = document.getElementById('globalModalSearchInput');
    const closeBtn = document.getElementById('closeSearchModalBtn');
    const resultsContainer = document.getElementById('globalSearchResults');
    const triggerBars = document.querySelectorAll('.trigger-search-modal, .global-search-bar');

    function openSearch() {
        if (window.AppAudio) AppAudio.playClick();
        searchBackdrop.classList.add('active');
        searchInput.focus();
    }

    function closeSearch() {
        searchBackdrop.classList.remove('active');
        searchInput.value = '';
    }

    triggerBars.forEach(bar => {
        bar.addEventListener('click', (e) => {
            e.preventDefault();
            openSearch();
        });
    });

    if (closeBtn) closeBtn.addEventListener('click', closeSearch);

    searchBackdrop.addEventListener('click', (e) => {
        if (e.target === searchBackdrop) closeSearch();
    });

    // Keyboard Shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearch();
        } else if (e.key === '/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            openSearch();
        } else if (e.key === 'Escape' && searchBackdrop.classList.contains('active')) {
            closeSearch();
        }
    });

    // Search Query Processing
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                resultsContainer.innerHTML = '<div style="padding: 1.5rem; text-align: center; color: var(--text-muted);">Type to search all routes, stops, and transport information...</div>';
                return;
            }

            const routes = AppStorage.getRoutes();
            const drivers = AppStorage.getDrivers();
            const announcements = AppStorage.getAnnouncements();

            const matches = [];

            // Search Routes & Stops
            routes.forEach(route => {
                if (route.name.toLowerCase().includes(query) || route.busNumber.toLowerCase().includes(query) || route.startPoint.toLowerCase().includes(query) || route.destination.toLowerCase().includes(query)) {
                    matches.push({
                        type: 'Route',
                        title: route.name,
                        sub: `Bus: ${route.busNumber} | ${route.stopsCount} Stops | Departs: ${route.startTime}`,
                        link: `routes.html?route=${route.id}`
                    });
                }

                // Stops search
                route.stops.forEach(stop => {
                    if (stop.name.toLowerCase().includes(query) || stop.landmark.toLowerCase().includes(query)) {
                        matches.push({
                            type: 'Bus Stop',
                            title: stop.name,
                            sub: `Route: ${route.name} | Time: ${stop.time} (${stop.landmark})`,
                            link: `timetable.html?route=${route.id}&stop=${encodeURIComponent(stop.name)}`
                        });
                    }
                });
            });

            // Search Drivers
            drivers.forEach(driver => {
                if (driver.name.toLowerCase().includes(query) || driver.phone.includes(query) || driver.busNumber.toLowerCase().includes(query)) {
                    matches.push({
                        type: 'Driver',
                        title: driver.name,
                        sub: `Bus: ${driver.busNumber} | Route: ${driver.route} | Rating: ${driver.rating} ★`,
                        link: `drivers.html`
                    });
                }
            });

            // Search Announcements
            announcements.forEach(ann => {
                if (ann.title.toLowerCase().includes(query) || ann.content.toLowerCase().includes(query)) {
                    matches.push({
                        type: 'Notice',
                        title: ann.title,
                        sub: `${ann.category} (${ann.date}) - ${ann.content.substring(0, 50)}...`,
                        link: `announcements.html`
                    });
                }
            });

            // Render Results
            if (matches.length === 0) {
                resultsContainer.innerHTML = `<div style="padding: 2rem; text-align: center; color: var(--text-subtle);">No matching transport data found for "<strong>${escapeHtml(query)}</strong>"</div>`;
            } else {
                resultsContainer.innerHTML = matches.slice(0, 10).map(m => `
                    <div class="search-result-item" onclick="window.location.href='${m.link}'">
                        <div>
                            <div style="font-weight: 700; color: var(--text-main); font-size: 0.95rem;">${m.title}</div>
                            <div style="font-size: 0.78rem; color: var(--text-muted); margin-top: 0.2rem;">${m.sub}</div>
                        </div>
                        <span class="badge ${m.type === 'Route' ? 'badge-primary' : m.type === 'Bus Stop' ? 'badge-info' : 'badge-warning'}">${m.type}</span>
                    </div>
                `).join('');
            }
        });
    }
}

/* --------------------------------------------------------------------------
   Student Profile Sync in Header
   -------------------------------------------------------------------------- */
function initProfileSync() {
    const profile = AppStorage.getStudentProfile();
    const nameEls = document.querySelectorAll('.header-student-name');
    const roleEls = document.querySelectorAll('.header-student-role');
    const avatarEls = document.querySelectorAll('.header-student-avatar');

    nameEls.forEach(el => el.textContent = profile.name || 'Preyal Modi');
    roleEls.forEach(el => el.textContent = profile.course || 'Computer Engineering');
    avatarEls.forEach(el => {
        const initials = (profile.name || 'PM').split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        el.textContent = initials;
    });
}

/* --------------------------------------------------------------------------
   Toast Notifications System
   -------------------------------------------------------------------------- */
function showToast(title, message, type = 'info') {
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '';
    if (type === 'success') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"></path></svg>`;
    } else if (type === 'warning') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
    } else if (type === 'danger') {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
    } else {
        iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>`;
    }

    toast.innerHTML = `
        <div class="toast-icon">${iconSvg}</div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-message">${escapeHtml(message)}</div>
        </div>
        <button class="toast-close-btn" onclick="this.parentElement.remove()">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(20px)';
        setTimeout(() => toast.remove(), 300);
    }, 4500);
}

function escapeHtml(string) {
    const div = document.createElement('div');
    div.textContent = string;
    return div.innerHTML;
}
