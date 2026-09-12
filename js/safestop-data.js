/**
 * SAFESTOP Data Layer & Accessibility Seed Repository
 * Manages bus accessibility profiles, stop accessibility features,
 * composite stop ID generation, and real-time barrier reports.
 */

const SafestopData = {
    // Generate globally unique composite stop ID
    getCompositeStopId(routeId, stopId) {
        return `${routeId}-stop-${stopId}`;
    },

    // Seed Bus Accessibility Profiles mapped by Route / Bus Number
    SEED_BUS_PROFILES: {
        "panaji-donapaula": { busNumber: "KTCL-EV-Demo-06", lowFloor: true, wheelchairSpace: true, rampAvailable: true, accessibleBoarding: true, lastVerified: new Date().toISOString() },
        "panaji-mapusa": { busNumber: "KTCL-Demo-01", lowFloor: false, wheelchairSpace: true, rampAvailable: true, accessibleBoarding: false, lastVerified: new Date().toISOString() },
        "panaji-ponda": { busNumber: "KTCL-Demo-02", lowFloor: false, wheelchairSpace: false, rampAvailable: false, accessibleBoarding: false, lastVerified: new Date().toISOString() },
        "panaji-margao": { busNumber: "KTCL-Demo-03", lowFloor: true, wheelchairSpace: true, rampAvailable: true, accessibleBoarding: true, lastVerified: new Date().toISOString() },
        "panaji-vasco": { busNumber: "KTCL-Demo-04", lowFloor: false, wheelchairSpace: true, rampAvailable: true, accessibleBoarding: true, lastVerified: new Date().toISOString() },
        "mopa-panaji": { busNumber: "KTCL-EV-Demo-05", lowFloor: true, wheelchairSpace: true, rampAvailable: true, accessibleBoarding: true, lastVerified: new Date().toISOString() }
    },

    // Seed Stop Accessibility Profiles for Goa KTCL routes
    SEED_STOP_PROFILES: (() => {
        const routes = {
            "panaji-donapaula": ["Panaji Bus Stand", "Patto Plaza", "Portais", "St. Cruz Church", "Goa Medical College (GMC)", "AIR Tower", "Goa University", "Dona Paula Circle"],
            "panaji-mapusa": ["Panaji Bus Stand", "Mandovi Bridge", "Porvorim (Mall de Goa)", "Guirim Junction", "Mapusa KTC Bus Stand"],
            "panaji-ponda": ["Panaji Bus Stand", "Ribandar", "Old Goa", "Banastarim", "Ponda KTC Bus Stand"],
            "panaji-margao": ["Panaji Bus Stand", "GMC Bambolim", "Agassaim", "Cortalim Junction", "Verna Industrial Estate", "Margao KTC Bus Stand"],
            "panaji-vasco": ["Panaji Bus Stand", "GMC Bambolim", "Agassaim", "Cortalim Junction", "Chicalim", "Vasco KTC Bus Stand"],
            "mopa-panaji": ["Mopa Airport Terminal", "Dhargal Highway Hub", "Mapusa Bypass", "Porvorim Junction", "Panaji Bus Stand"]
        };
        const profiles = {};
        Object.entries(routes).forEach(([routeId, stops]) => {
            stops.forEach((stopName, index) => {
                const stopId = index + 1;
                const compositeStopId = `${routeId}-stop-${stopId}`;
                profiles[compositeStopId] = {
                    compositeStopId,
                    routeId,
                    stopId,
                    stopName,
                    stepFreeApproach: stopId !== 4,
                    clearBoardingArea: stopId !== 3,
                    rampAvailable: stopId === 1 || stopId === stops.length || stopId % 2 === 0,
                    tactilePath: stopId === 1 || stopId === stops.length || stopId === 2,
                    lastVerified: new Date().toISOString()
                };
            });
        });
        return profiles;
    })(),

    // Default Barrier Reports
    SEED_BARRIERS: [
        {
            id: "bar-101",
            compositeStopId: "panaji-donapaula-stop-5",
            routeId: "panaji-donapaula",
            stopId: 5,
            stopName: "Goa Medical College (GMC)",
            severity: "moderate",
            description: "Tactile paving tiles damaged near GMC main entrance.",
            timestamp: new Date().toISOString(),
            status: "active"
        },
        {
            id: "bar-102",
            compositeStopId: "panaji-donapaula-stop-2",
            routeId: "panaji-donapaula",
            stopId: 2,
            stopName: "Patto Plaza",
            severity: "minor",
            description: "Temporary construction hoarding narrowing sidewalk ramp.",
            timestamp: new Date().toISOString(),
            status: "active"
        },
        {
            id: "bar-103",
            compositeStopId: "panaji-margao-stop-2",
            routeId: "panaji-margao",
            stopId: 2,
            stopName: "GMC Bambolim",
            severity: "critical",
            description: "Wheelchair ramp broken at GMC highway bay; high curb block.",
            timestamp: new Date().toISOString(),
            status: "active"
        }
    ],

    // Initialize Seed Data into localStorage
    init() {
        AppStorage.saveSafestopAccessibility({
            buses: this.SEED_BUS_PROFILES,
            stops: this.SEED_STOP_PROFILES
        });

        const storedBarriers = AppStorage.getSafestopBarriers();
        if (!storedBarriers || storedBarriers.length === 0) {
            AppStorage.saveSafestopBarriers(this.SEED_BARRIERS);
        }
    },

    // Retrieve Bus Accessibility Profile
    getBusProfile(routeId, busNumber) {
        const data = AppStorage.getSafestopAccessibility();
        if (data.buses && data.buses[routeId]) {
            return data.buses[routeId];
        }
        return this.SEED_BUS_PROFILES[routeId] || {
            busNumber: busNumber || "KTCL-EV-Demo-06",
            routeName: routeId,
            lowFloor: null,
            wheelchairSpace: null,
            rampAvailable: null,
            accessibleBoarding: null,
            wheelchairCapacity: 0,
            audioVisualAnnouncements: null,
            lastInspected: null
        };
    },

    // Retrieve Stop Accessibility Profile
    getStopProfile(routeId, stopId, stopName) {
        const compositeId = this.getCompositeStopId(routeId, stopId);
        const data = AppStorage.getSafestopAccessibility();
        
        if (data.stops && data.stops[compositeId]) {
            return data.stops[compositeId];
        }

        if (this.SEED_STOP_PROFILES[compositeId]) {
            return this.SEED_STOP_PROFILES[compositeId];
        }

        // Unknown dynamic fallback for unseeded stops
        return {
            compositeStopId: compositeId,
            routeId: routeId,
            stopId: stopId,
            stopName: stopName || `Stop #${stopId}`,
            stepFreeApproach: null,
            rampAvailable: null,
            clearBoardingArea: null,
            tactilePath: null,
            lastVerified: null
        };
    },

    // Retrieve active barriers for a composite stop ID
    getActiveBarriersForStop(compositeStopId) {
        const barriers = AppStorage.getSafestopBarriers();
        return barriers.filter(b => b.compositeStopId === compositeStopId && b.status === 'active');
    }
};

// Initialize Safestop Data Layer on load
if (typeof AppStorage !== 'undefined') {
    SafestopData.init();
}
