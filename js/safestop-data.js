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
        "patan-itr": {
            busNumber: "GJ-02-AZ-4512",
            routeName: "Patan - ITR Campus",
            lowFloor: true,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: true,
            wheelchairCapacity: 2,
            audioVisualAnnouncements: true,
            lastInspected: "2026-09-01T08:00:00.000Z"
        },
        "mehsana-itr": {
            busNumber: "GJ-02-AZ-4513",
            routeName: "Mehsana - ITR Campus",
            lowFloor: true,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: false,
            wheelchairCapacity: 1,
            audioVisualAnnouncements: true,
            lastInspected: "2026-08-25T10:00:00.000Z"
        },
        "chanasma-itr": {
            busNumber: "GJ-02-AZ-4514",
            routeName: "Chanasma - ITR Campus",
            lowFloor: false,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: false,
            wheelchairCapacity: 1,
            audioVisualAnnouncements: false,
            lastInspected: "2026-07-15T09:30:00.000Z"
        },
        "sidhpur-itr": {
            busNumber: "GJ-02-AZ-4515",
            routeName: "Sidhpur - ITR Campus",
            lowFloor: true,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: true,
            wheelchairCapacity: 2,
            audioVisualAnnouncements: true,
            lastInspected: "2026-09-05T11:00:00.000Z"
        },
        "unjha-itr": {
            busNumber: "GJ-02-AZ-4516",
            routeName: "Unjha - ITR Campus",
            lowFloor: false,
            wheelchairSpace: false,
            rampAvailable: false,
            accessibleBoarding: false,
            wheelchairCapacity: 0,
            audioVisualAnnouncements: false,
            lastInspected: "2026-06-01T14:00:00.000Z" // Stale >90 days
        },
        "harij-itr": {
            busNumber: "GJ-02-AZ-4517",
            routeName: "Harij - ITR Campus",
            lowFloor: true,
            wheelchairSpace: true,
            rampAvailable: false,
            accessibleBoarding: true,
            wheelchairCapacity: 1,
            audioVisualAnnouncements: true,
            lastInspected: "2026-08-10T12:00:00.000Z"
        },
        "radhanpur-itr": {
            busNumber: "GJ-02-AZ-4518",
            routeName: "Radhanpur - ITR Campus",
            lowFloor: false,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: false,
            wheelchairCapacity: 1,
            audioVisualAnnouncements: false,
            lastInspected: "2026-08-28T09:00:00.000Z"
        },
        "visnagar-itr": {
            busNumber: "GJ-02-AZ-4519",
            routeName: "Visnagar - ITR Campus",
            lowFloor: true,
            wheelchairSpace: true,
            rampAvailable: true,
            accessibleBoarding: true,
            wheelchairCapacity: 2,
            audioVisualAnnouncements: true,
            lastInspected: "2026-09-08T15:00:00.000Z"
        }
    },

    // Seed Stop Accessibility Profiles for Patan-ITR and key stops across network
    SEED_STOP_PROFILES: {
        "patan-itr-stop-1": {
            compositeStopId: "patan-itr-stop-1",
            routeId: "patan-itr",
            stopId: 1,
            stopName: "Patan Bus Stand",
            stepFreeApproach: true,
            rampAvailable: true,
            clearBoardingArea: true,
            tactilePath: true,
            lastVerified: "2026-09-08T10:00:00.000Z"
        },
        "patan-itr-stop-2": {
            compositeStopId: "patan-itr-stop-2",
            routeId: "patan-itr",
            stopId: 2,
            stopName: "GIDC Char Rasta",
            stepFreeApproach: true,
            rampAvailable: false,
            clearBoardingArea: true,
            tactilePath: false,
            lastVerified: "2026-09-02T14:30:00.000Z"
        },
        "patan-itr-stop-3": {
            compositeStopId: "patan-itr-stop-3",
            routeId: "patan-itr",
            stopId: 3,
            stopName: "Bagavada Darwaja",
            stepFreeApproach: true,
            rampAvailable: true,
            clearBoardingArea: true,
            tactilePath: true,
            lastVerified: "2026-09-05T09:15:00.000Z"
        },
        "patan-itr-stop-4": {
            compositeStopId: "patan-itr-stop-4",
            routeId: "patan-itr",
            stopId: 4,
            stopName: "TB Hospital Circle",
            stepFreeApproach: false,
            rampAvailable: false,
            clearBoardingArea: false,
            tactilePath: false,
            lastVerified: "2026-08-12T11:00:00.000Z"
        },
        "patan-itr-stop-5": {
            compositeStopId: "patan-itr-stop-5",
            routeId: "patan-itr",
            stopId: 5,
            stopName: "University Road Cross",
            stepFreeApproach: true,
            rampAvailable: true,
            clearBoardingArea: true,
            tactilePath: true,
            lastVerified: "2026-09-01T16:00:00.000Z"
        },
        "patan-itr-stop-6": {
            compositeStopId: "patan-itr-stop-6",
            routeId: "patan-itr",
            stopId: 6,
            stopName: "Rani ki Vav Circle",
            stepFreeApproach: true,
            rampAvailable: true,
            clearBoardingArea: true,
            tactilePath: true,
            lastVerified: "2026-09-07T10:30:00.000Z"
        },
        "patan-itr-stop-13": {
            compositeStopId: "patan-itr-stop-13",
            routeId: "patan-itr",
            stopId: 13,
            stopName: "ITR Campus Main Gate",
            stepFreeApproach: true,
            rampAvailable: true,
            clearBoardingArea: true,
            tactilePath: true,
            lastVerified: "2026-09-10T12:00:00.000Z"
        }
    },

    // Default Barrier Reports
    SEED_BARRIERS: [
        {
            id: "bar-101",
            compositeStopId: "patan-itr-stop-2",
            routeId: "patan-itr",
            stopId: 2,
            stopName: "GIDC Char Rasta",
            type: "obstructed_path",
            severity: "moderate",
            description: "Temporary roadwork debris blocking sidewalk tactile path near bus shelter.",
            timestamp: "2026-09-11T09:15:00.000Z",
            reportedBy: "Prototype community report",
            status: "active"
        },
        {
            id: "bar-102",
            compositeStopId: "patan-itr-stop-4",
            routeId: "patan-itr",
            stopId: 4,
            stopName: "TB Hospital Circle",
            type: "unsafe_boarding",
            severity: "critical",
            description: "High curb drop-off without curb ramp; severe puddle accumulation after rain.",
            timestamp: "2026-09-10T16:45:00.000Z",
            reportedBy: "Prototype community report",
            status: "active"
        }
    ],

    // Initialize Seed Data into localStorage if absent
    init() {
        const storedAccess = AppStorage.getSafestopAccessibility();
        if (!storedAccess.buses || Object.keys(storedAccess.buses).length === 0) {
            AppStorage.saveSafestopAccessibility({
                buses: this.SEED_BUS_PROFILES,
                stops: this.SEED_STOP_PROFILES
            });
        }

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
            busNumber: busNumber || "GJ-XX-XXXX",
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
