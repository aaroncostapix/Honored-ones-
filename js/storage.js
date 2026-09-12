/**
 * College Transport Management System - Data Store & LocalStorage Management
 * Handles persistent state for student profile, routes, timetable, drivers, announcements, and settings.
 */

const STORAGE_KEYS = {
    THEME: 'ctms_theme',
    STUDENT_PROFILE: 'ctms_student_profile',
    FAVORITE_ROUTE: 'ctms_fav_route',
    FAVORITE_STOP: 'ctms_fav_stop',
    RECENT_ROUTES: 'ctms_recent_routes',
    SIMULATION_STATE: 'ctms_sim_state',
    ANNOUNCEMENTS_READ: 'ctms_announcements_read',
    CUSTOM_SETTINGS: 'ctms_settings',
    SAFESTOP_ACCESSIBILITY: 'ctms_safestop_accessibility',
    SAFESTOP_BARRIERS: 'ctms_safestop_barriers'
};

// Default Real & Demo Data
const DEFAULT_DATA = {
    studentProfile: {
        id: "GOA-2026-PASS-089",
        name: "Preyal Modi",
        email: "preyal.modi@goamobility.in",
        phone: "+91 98765 43210",
        course: "Computer Engineering",
        department: "Computer Engineering",
        semester: "6th Semester",
        enrollmentNo: "210120116045",
        bloodGroup: "B+",
        assignedRoute: "panaji-donapaula",
        boardingStop: "Patto Plaza",
        busNumber: "KTCL-EV-Demo-06",
        realBusNumber: "KTCL-EV-Demo-06",
        passNumber: "PASS-2026-8841",
        passValidity: "July 2026 – June 2027",
        passStatus: "Active",
        emergencyContact: "+91 98765 43211 (Parent/Guardian)"
    },
    
    routes: [
        {
            id: "panaji-donapaula", code: "KTCL-453", name: "Route 453: Panaji → Dona Paula (Yellow Line EV)",
            busNumber: "KTCL-EV-Demo-06", driverId: "DRV-GOA-01", driverName: "Anand Ferns", driverPhone: "+91 98221 10001",
            startPoint: "Panaji Bus Stand", destination: "Dona Paula Circle", startTime: "07:30 AM", arrivalTime: "08:15 AM", totalDuration: "45m", totalDistance: "12 km", status: "Active", tripStatus: "On Time", capacity: 40, occupiedSeats: 28, stopsCount: 8,
            notice: "Official KTCL Route 453 Yellow Line serving Panaji urban corridor via Patto & GMC.",
            stops: [
                { id: 1, name: "Panaji Bus Stand", time: "07:30 AM", time24: "07:30", landmark: "Kadamba Terminal", distanceKm: 0 },
                { id: 2, name: "Patto Plaza", time: "07:35 AM", time24: "07:35", landmark: "Financial District", distanceKm: 2 },
                { id: 3, name: "Portais", time: "07:42 AM", time24: "07:42", landmark: "Portais Junction", distanceKm: 4 },
                { id: 4, name: "St. Cruz Church", time: "07:48 AM", time24: "07:48", landmark: "Santa Cruz Center", distanceKm: 6 },
                { id: 5, name: "Goa Medical College (GMC)", time: "07:55 AM", time24: "07:55", landmark: "GMC Bambolim Gate", distanceKm: 8 },
                { id: 6, name: "AIR Tower", time: "08:02 AM", time24: "08:02", landmark: "Altinho AIR", distanceKm: 10 },
                { id: 7, name: "Goa University", time: "08:08 AM", time24: "08:08", landmark: "University Gate", distanceKm: 11 },
                { id: 8, name: "Dona Paula Circle", time: "08:15 AM", time24: "08:15", landmark: "View Point Circle", distanceKm: 12 }
            ]
        },
        {
            id: "panaji-mapusa", code: "KTCL-379", name: "Route 379: Panaji → Mapusa", busNumber: "KTCL-Demo-01", driverId: "DRV-GOA-02", driverName: "Devidas Naik", driverPhone: "+91 98221 10002",
            startPoint: "Panaji Bus Stand", destination: "Mapusa KTC Bus Stand", startTime: "08:00 AM", arrivalTime: "08:35 AM", totalDuration: "35m", totalDistance: "13 km", status: "Active", tripStatus: "On Time", capacity: 54, occupiedSeats: 42, stopsCount: 5, notice: "Official KTCL Route 379 serving NH-66 North Goa corridor.",
            stops: [{ id: 1, name: "Panaji Bus Stand", time: "08:00 AM", time24: "08:00", landmark: "Kadamba Bus Stand", distanceKm: 0 }, { id: 2, name: "Mandovi Bridge", time: "08:06 AM", time24: "08:06", landmark: "Mandovi North Junction", distanceKm: 2 }, { id: 3, name: "Porvorim (Mall de Goa)", time: "08:14 AM", time24: "08:14", landmark: "Mall de Goa Highway", distanceKm: 5 }, { id: 4, name: "Guirim Junction", time: "08:24 AM", time24: "08:24", landmark: "Guirim Cross Road", distanceKm: 9 }, { id: 5, name: "Mapusa KTC Bus Stand", time: "08:35 AM", time24: "08:35", landmark: "Mapusa Terminal", distanceKm: 13 }]
        },
        {
            id: "panaji-ponda", code: "KTCL-343", name: "Route 343: Panaji → Ponda (via Old Goa)", busNumber: "KTCL-Demo-02", driverId: "DRV-GOA-03", driverName: "Gurudas Shirodkar", driverPhone: "+91 98221 10003",
            startPoint: "Panaji Bus Stand", destination: "Ponda KTC Bus Stand", startTime: "08:15 AM", arrivalTime: "09:05 AM", totalDuration: "50m", totalDistance: "29 km", status: "Active", tripStatus: "On Time", capacity: 50, occupiedSeats: 38, stopsCount: 5, notice: "Official KTCL Route 343 heritage corridor via Old Goa and Banastarim.",
            stops: [{ id: 1, name: "Panaji Bus Stand", time: "08:15 AM", time24: "08:15", landmark: "Panaji Terminal", distanceKm: 0 }, { id: 2, name: "Ribandar", time: "08:23 AM", time24: "08:23", landmark: "Ribandar Causeway", distanceKm: 5 }, { id: 3, name: "Old Goa", time: "08:33 AM", time24: "08:33", landmark: "Old Goa Church Complex", distanceKm: 10 }, { id: 4, name: "Banastarim", time: "08:47 AM", time24: "08:47", landmark: "Banastarim Bridge", distanceKm: 19 }, { id: 5, name: "Ponda KTC Bus Stand", time: "09:05 AM", time24: "09:05", landmark: "Ponda Depot", distanceKm: 29 }]
        },
        {
            id: "panaji-margao", code: "KTCL-335", name: "Route 335: Panaji → Margao", busNumber: "KTCL-Demo-03", driverId: "DRV-GOA-04", driverName: "Santosh Sawant", driverPhone: "+91 98221 10004",
            startPoint: "Panaji Bus Stand", destination: "Margao KTC Bus Stand", startTime: "07:45 AM", arrivalTime: "08:40 AM", totalDuration: "55m", totalDistance: "33 km", status: "Active", tripStatus: "On Time", capacity: 54, occupiedSeats: 48, stopsCount: 6, notice: "Official KTCL Route 335 North-South trunk express via Bambolim-Cortalim.",
            stops: [{ id: 1, name: "Panaji Bus Stand", time: "07:45 AM", time24: "07:45", landmark: "Panaji Bus Stand", distanceKm: 0 }, { id: 2, name: "GMC Bambolim", time: "07:57 AM", time24: "07:57", landmark: "Hospital Circle", distanceKm: 7 }, { id: 3, name: "Agassaim", time: "08:08 AM", time24: "08:08", landmark: "Zuari Bridge North", distanceKm: 14 }, { id: 4, name: "Cortalim Junction", time: "08:16 AM", time24: "08:16", landmark: "Zuari South Circle", distanceKm: 18 }, { id: 5, name: "Verna Industrial Estate", time: "08:27 AM", time24: "08:27", landmark: "Verna Gate", distanceKm: 25 }, { id: 6, name: "Margao KTC Bus Stand", time: "08:40 AM", time24: "08:40", landmark: "Margao Central Terminal", distanceKm: 33 }]
        },
        {
            id: "panaji-vasco", code: "KTCL-336", name: "Route 336: Panaji → Vasco (via Cortalim)", busNumber: "KTCL-Demo-04", driverId: "DRV-GOA-05", driverName: "Pradeep Gaonkar", driverPhone: "+91 98221 10005",
            startPoint: "Panaji Bus Stand", destination: "Vasco KTC Bus Stand", startTime: "08:30 AM", arrivalTime: "09:20 AM", totalDuration: "50m", totalDistance: "30 km", status: "Active", tripStatus: "On Time", capacity: 52, occupiedSeats: 41, stopsCount: 6, notice: "Official KTCL Route 336 Port city express via Cortalim and Chicalim.",
            stops: [{ id: 1, name: "Panaji Bus Stand", time: "08:30 AM", time24: "08:30", landmark: "Kadamba Terminal", distanceKm: 0 }, { id: 2, name: "GMC Bambolim", time: "08:42 AM", time24: "08:42", landmark: "Medical College Gate", distanceKm: 7 }, { id: 3, name: "Agassaim", time: "08:52 AM", time24: "08:52", landmark: "Agassaim Church", distanceKm: 14 }, { id: 4, name: "Cortalim Junction", time: "09:00 AM", time24: "09:00", landmark: "Cortalim Stand", distanceKm: 18 }, { id: 5, name: "Chicalim", time: "09:10 AM", time24: "09:10", landmark: "Chicalim Circle", distanceKm: 24 }, { id: 6, name: "Vasco KTC Bus Stand", time: "09:20 AM", time24: "09:20", landmark: "Vasco Bus Terminal", distanceKm: 30 }]
        },
        {
            id: "mopa-panaji", code: "KTCL-325", name: "Route 325: Mopa Airport → Panaji Express", busNumber: "KTCL-EV-Demo-05", driverId: "DRV-GOA-06", driverName: "Rajesh Prabhu", driverPhone: "+91 98221 10006",
            startPoint: "Manohar International Airport (Mopa)", destination: "Panaji KTC Bus Stand", startTime: "09:00 AM", arrivalTime: "09:55 AM", totalDuration: "55m", totalDistance: "35 km", status: "Active", tripStatus: "On Time", capacity: 45, occupiedSeats: 32, stopsCount: 5, notice: "Official KTCL Route 325 EV Airport Shuttle with direct express connectivity.",
            stops: [{ id: 1, name: "Mopa Airport Terminal", time: "09:00 AM", time24: "09:00", landmark: "Arrival Gate", distanceKm: 0 }, { id: 2, name: "Dhargal Highway Hub", time: "09:12 AM", time24: "09:12", landmark: "Dhargal NH-66", distanceKm: 8 }, { id: 3, name: "Mapusa Bypass", time: "09:30 AM", time24: "09:30", landmark: "Tarcar Circle", distanceKm: 22 }, { id: 4, name: "Porvorim Junction", time: "09:44 AM", time24: "09:44", landmark: "Porvorim Circle", distanceKm: 30 }, { id: 5, name: "Panaji Bus Stand", time: "09:55 AM", time24: "09:55", landmark: "Panaji KTC Stand", distanceKm: 35 }]
        }
    ],

    drivers: [
        { id: "DRV-GOA-01", name: "Anand Ferns", phone: "+91 98221 10001", busNumber: "KTCL-EV-Demo-06", route: "Route 453: Panaji → Dona Paula", routeId: "panaji-donapaula", experience: "12 Years", licenseNo: "DL-GOA-DEMO-01", bloodGroup: "O+", rating: 4.9, safetyScore: "99.4%", status: "Active & On Route", emergencyContact: "+91 98221 10011", joinedDate: "August 2014" },
        { id: "DRV-GOA-02", name: "Devidas Naik", phone: "+91 98221 10002", busNumber: "KTCL-Demo-01", route: "Route 379: Panaji → Mapusa", routeId: "panaji-mapusa", experience: "9 Years", licenseNo: "DL-GOA-DEMO-02", bloodGroup: "A+", rating: 4.8, safetyScore: "98.8%", status: "Active & On Route", emergencyContact: "+91 98221 10012", joinedDate: "July 2017" },
        { id: "DRV-GOA-03", name: "Gurudas Shirodkar", phone: "+91 98221 10003", busNumber: "KTCL-Demo-02", route: "Route 343: Panaji → Ponda", routeId: "panaji-ponda", experience: "15 Years", licenseNo: "DL-GOA-DEMO-03", bloodGroup: "B+", rating: 4.9, safetyScore: "99.8%", status: "Active & On Route", emergencyContact: "+91 98221 10013", joinedDate: "January 2011" },
        { id: "DRV-GOA-04", name: "Santosh Sawant", phone: "+91 98221 10004", busNumber: "KTCL-Demo-03", route: "Route 335: Panaji → Margao", routeId: "panaji-margao", experience: "8 Years", licenseNo: "DL-GOA-DEMO-04", bloodGroup: "AB+", rating: 4.7, safetyScore: "98.2%", status: "Active & On Route", emergencyContact: "+91 98221 10014", joinedDate: "August 2018" },
        { id: "DRV-GOA-05", name: "Pradeep Gaonkar", phone: "+91 98221 10005", busNumber: "KTCL-Demo-04", route: "Route 336: Panaji → Vasco", routeId: "panaji-vasco", experience: "11 Years", licenseNo: "DL-GOA-DEMO-05", bloodGroup: "O+", rating: 4.8, safetyScore: "99.1%", status: "Active & On Route", emergencyContact: "+91 98221 10015", joinedDate: "May 2015" },
        { id: "DRV-GOA-06", name: "Rajesh Prabhu", phone: "+91 98221 10006", busNumber: "KTCL-EV-Demo-05", route: "Route 325: Mopa Airport → Panaji", routeId: "mopa-panaji", experience: "7 Years", licenseNo: "DL-GOA-DEMO-06", bloodGroup: "A-", rating: 4.6, safetyScore: "97.9%", status: "Active & On Route", emergencyContact: "+91 98221 10016", joinedDate: "November 2019" }
    ],

    announcements: [
        { id: "ANN-01", title: "KTCL Route 453 EV Service Adjustment", category: "Service Update", type: "warning", date: "18 Aug 2026", time: "06:30 AM", content: "Route 453 Panaji → Dona Paula Smart City EV services will use adjusted boarding bays at Panaji Bus Stand during peak hours.", priority: "High", badge: "Service Update" },
        { id: "ANN-02", title: "Mandovi Corridor Traffic Advisory", category: "Traffic Alert", type: "info", date: "16 Aug 2026", time: "04:15 PM", content: "Route 379 Panaji → Mapusa services may allow a short additional travel window near the Mandovi Bridge corridor during evening peak traffic.", priority: "Medium", badge: "Traffic Alert" },
        { id: "ANN-03", title: "Zuari Express Schedule Update", category: "Timetable Update", type: "success", date: "14 Aug 2026", time: "11:00 AM", content: "Route 335 (Margao) and Route 336 (Vasco) Zuari express services will follow published morning schedules from Panaji terminal.", priority: "Medium", badge: "Updated" },
        { id: "ANN-04", title: "Monsoon Mobility Advisory", category: "Weather Notice", type: "alert", date: "12 Aug 2026", time: "08:00 AM", content: "Allow a few extra minutes for Goa Mobility services during heavy monsoon conditions and follow live trip updates.", priority: "Low", badge: "Weather Alert" },
        { id: "ANN-05", title: "Goa Mobility Delay Notification Protocol", category: "Delay Notice", type: "info", date: "10 Aug 2026", time: "02:00 PM", content: "For delays exceeding 10 minutes, Goa Mobility sends real-time updates to the mobility portal and registered passenger contacts.", priority: "Low", badge: "Protocol" }
    ],

    stats: {
        officialEvBuses: 171,
        officialRoutes: 453,
        officialBusStands: 16,
        demoCorridors: 6,
        onTimeRate: "98.5%",
        fleetHealth: "100% Operational"
    }
};

/**
 * Storage Service Wrapper
 */
const AppStorage = {
    // Initialize defaults if not present
    init() {
        if (!localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE)) {
            localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(DEFAULT_DATA.studentProfile));
        }
        if (!localStorage.getItem(STORAGE_KEYS.FAVORITE_ROUTE)) {
            localStorage.setItem(STORAGE_KEYS.FAVORITE_ROUTE, "panaji-donapaula");
        }
        if (!localStorage.getItem(STORAGE_KEYS.FAVORITE_STOP)) {
            localStorage.setItem(STORAGE_KEYS.FAVORITE_STOP, "Patto Plaza");
        }
        if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
            localStorage.setItem(STORAGE_KEYS.THEME, "light");
        }
        if (!localStorage.getItem(STORAGE_KEYS.RECENT_ROUTES)) {
            localStorage.setItem(STORAGE_KEYS.RECENT_ROUTES, JSON.stringify(["panaji-donapaula", "panaji-margao"]));
        }
    },

    getStudentProfile() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.STUDENT_PROFILE);
            return data ? JSON.parse(data) : DEFAULT_DATA.studentProfile;
        } catch (e) {
            return DEFAULT_DATA.studentProfile;
        }
    },

    saveStudentProfile(profile) {
        localStorage.setItem(STORAGE_KEYS.STUDENT_PROFILE, JSON.stringify(profile));
    },

    getRoutes() {
        return DEFAULT_DATA.routes;
    },

    getRouteById(id) {
        return DEFAULT_DATA.routes.find(r => r.id === id) || DEFAULT_DATA.routes[0];
    },

    getDrivers() {
        return DEFAULT_DATA.drivers;
    },

    getDriverByRouteId(routeId) {
        return DEFAULT_DATA.drivers.find(d => d.routeId === routeId) || DEFAULT_DATA.drivers[0];
    },

    getAnnouncements() {
        return DEFAULT_DATA.announcements;
    },

    getStats() {
        return DEFAULT_DATA.stats;
    },

    getTheme() {
        return localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
    },

    setTheme(theme) {
        localStorage.setItem(STORAGE_KEYS.THEME, theme);
    },

    getSimulationState() {
        try {
            const state = localStorage.getItem(STORAGE_KEYS.SIMULATION_STATE);
            return state ? JSON.parse(state) : null;
        } catch (e) {
            return null;
        }
    },

    saveSimulationState(state) {
        localStorage.setItem(STORAGE_KEYS.SIMULATION_STATE, JSON.stringify(state));
    },

    // SAFESTOP Storage Facades
    getSafestopAccessibility() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SAFESTOP_ACCESSIBILITY);
            return data ? JSON.parse(data) : { buses: {}, stops: {} };
        } catch (e) {
            return { buses: {}, stops: {} };
        }
    },

    saveSafestopAccessibility(data) {
        localStorage.setItem(STORAGE_KEYS.SAFESTOP_ACCESSIBILITY, JSON.stringify(data));
    },

    getSafestopBarriers() {
        try {
            const data = localStorage.getItem(STORAGE_KEYS.SAFESTOP_BARRIERS);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            return [];
        }
    },

    saveSafestopBarriers(barriers) {
        localStorage.setItem(STORAGE_KEYS.SAFESTOP_BARRIERS, JSON.stringify(barriers));
    },

    addSafestopBarrier(barrier) {
        const barriers = this.getSafestopBarriers();
        barriers.unshift(barrier);
        this.saveSafestopBarriers(barriers);
        return barrier;
    },

    resolveSafestopBarrier(barrierId) {
        const barriers = this.getSafestopBarriers();
        const barrier = barriers.find(b => b.id === barrierId);
        if (barrier) {
            barrier.status = 'resolved';
            barrier.resolvedAt = new Date().toISOString();
            this.saveSafestopBarriers(barriers);
        }
        return barrier;
    },

    resetAllData() {
        localStorage.clear();
        this.init();
    }
};

// Auto initialize on load
AppStorage.init();
