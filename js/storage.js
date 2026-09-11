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
    CUSTOM_SETTINGS: 'ctms_settings'
};

// Default Real & Demo Data
const DEFAULT_DATA = {
    studentProfile: {
        id: "ITR-2024-CS-089",
        name: "Preyal Modi",
        email: "preyal.modi@itr.ac.in",
        phone: "+91 98765 43210",
        course: "Computer Engineering",
        department: "Computer Engineering",
        semester: "6th Semester",
        enrollmentNo: "210120116045",
        bloodGroup: "B+",
        assignedRoute: "patan-itr",
        boardingStop: "Bagavada Darwaja",
        busNumber: "GJ-XX-XXXX",
        realBusNumber: "GJ-02-AZ-4512",
        passNumber: "PASS-2026-8841",
        passValidity: "July 2026 – June 2027",
        passStatus: "Active",
        emergencyContact: "+91 94280 12345 (Father)"
    },
    
    routes: [
        {
            id: "patan-itr",
            name: "Patan → ITR",
            code: "ROUTE-01",
            busNumber: "GJ-02-AZ-4512",
            driverId: "DRV-101",
            driverName: "Ramesh Patel",
            driverPhone: "+91 98250 11223",
            startPoint: "Bagavada Darwaja (Patan)",
            destination: "ITR Campus",
            startTime: "7:40 AM",
            arrivalTime: "9:30 AM",
            totalDuration: "1h 50m",
            totalDistance: "48 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 54,
            occupiedSeats: 48,
            stopsCount: 13,
            notice: "Students are requested to reach their respective bus stand 2–5 minutes before the scheduled arrival time. The bus will not wait for late passengers.",
            stops: [
                { id: 1, name: "Bagavada Darwaja", time: "7:40 AM", time24: "07:40", landmark: "Near City Gate", distanceKm: 0 },
                { id: 2, name: "Sidhpur Cross Road", time: "7:50 AM", time24: "07:50", landmark: "Highway Junction", distanceKm: 4 },
                { id: 3, name: "Padhmnath Chokdi", time: "7:53 AM", time24: "07:53", landmark: "Padhmnath Circle", distanceKm: 6 },
                { id: 4, name: "Harij Cross Road", time: "8:00 AM", time24: "08:00", landmark: "Harij Highway Stand", distanceKm: 10 },
                { id: 5, name: "Chanasma", time: "8:10 AM", time24: "08:10", landmark: "Chanasma Bus Stand", distanceKm: 16 },
                { id: 6, name: "Lanva", time: "8:26 AM", time24: "08:26", landmark: "Lanva Circle", distanceKm: 24 },
                { id: 7, name: "Dhinoj", time: "8:40 AM", time24: "08:40", landmark: "Dhinoj Bus Stand", distanceKm: 30 },
                { id: 8, name: "DMart", time: "8:50 AM", time24: "08:50", landmark: "DMart Highway Mall", distanceKm: 36 },
                { id: 9, name: "Golden Square", time: "8:53 AM", time24: "08:53", landmark: "Golden Square Complex", distanceKm: 38 },
                { id: 10, name: "Kashi Vishwanath Temple", time: "8:55 AM", time24: "08:55", landmark: "Temple Entrance", distanceKm: 40 },
                { id: 11, name: "Kapila Hanuman Temple", time: "8:58 AM", time24: "08:58", landmark: "Kapila Circle", distanceKm: 42 },
                { id: 12, name: "Radhanpur Cross Road", time: "9:05 AM", time24: "09:05", landmark: "Radhanpur Highway Bypass", distanceKm: 44 },
                { id: 13, name: "ITR", time: "9:30 AM", time24: "09:30", landmark: "Institute Main Gate", distanceKm: 48 }
            ]
        },
        {
            id: "mehsana-itr",
            name: "Mehsana → ITR",
            code: "ROUTE-02",
            busNumber: "GJ-02-BZ-1890",
            driverId: "DRV-102",
            driverName: "Kishorbhai Prajapati",
            driverPhone: "+91 97241 88765",
            startPoint: "Modhera Circle (Mehsana)",
            destination: "ITR Campus",
            startTime: "7:45 AM",
            arrivalTime: "9:20 AM",
            totalDuration: "1h 35m",
            totalDistance: "42 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 50,
            occupiedSeats: 45,
            stopsCount: 8,
            notice: "Bus halts at Radhanpur Road for 2 mins.",
            stops: [
                { id: 1, name: "Modhera Circle", time: "7:45 AM", time24: "07:45", landmark: "Main Circle", distanceKm: 0 },
                { id: 2, name: "Radhanpur Road", time: "7:55 AM", time24: "07:55", landmark: "Near Overbridge", distanceKm: 5 },
                { id: 3, name: "Nagalpur Cross Road", time: "8:05 AM", time24: "08:05", landmark: "Water Tank", distanceKm: 11 },
                { id: 4, name: "Panchot Bypass", time: "8:18 AM", time24: "08:18", landmark: "Panchot Circle", distanceKm: 18 },
                { id: 5, name: "Balisana", time: "8:35 AM", time24: "08:35", landmark: "Balisana Chokdi", distanceKm: 26 },
                { id: 6, name: "Manund", time: "8:50 AM", time24: "08:50", landmark: "Highway Corner", distanceKm: 33 },
                { id: 7, name: "Valam Cross Road", time: "9:05 AM", time24: "09:05", landmark: "Petrol Pump", distanceKm: 39 },
                { id: 8, name: "ITR", time: "9:20 AM", time24: "09:20", landmark: "Institute Main Gate", distanceKm: 42 }
            ]
        },
        {
            id: "sidhpur-itr",
            name: "Sidhpur → ITR",
            code: "ROUTE-03",
            busNumber: "GJ-02-CX-7734",
            driverId: "DRV-103",
            driverName: "Dineshbhai Vaghela",
            driverPhone: "+91 94291 33445",
            startPoint: "Bindu Sarovar (Sidhpur)",
            destination: "ITR Campus",
            startTime: "7:50 AM",
            arrivalTime: "9:25 AM",
            totalDuration: "1h 35m",
            totalDistance: "38 km",
            status: "Active",
            tripStatus: "Departed",
            capacity: 52,
            occupiedSeats: 40,
            stopsCount: 6,
            notice: "Morning route runs via Kakoshi Cross Road.",
            stops: [
                { id: 1, name: "Bindu Sarovar", time: "7:50 AM", time24: "07:50", landmark: "Temple Gate", distanceKm: 0 },
                { id: 2, name: "Sidhpur Railway Station", time: "8:00 AM", time24: "08:00", landmark: "Station Chokdi", distanceKm: 4 },
                { id: 3, name: "Kakoshi Char Rasta", time: "8:15 AM", time24: "08:15", landmark: "Highway Bridge", distanceKm: 12 },
                { id: 4, name: "Metrana", time: "8:32 AM", time24: "08:32", landmark: "Village Entrance", distanceKm: 20 },
                { id: 5, name: "Unjha Cross Road", time: "8:50 AM", time24: "08:50", landmark: "Umiya Mataji Highway", distanceKm: 28 },
                { id: 6, name: "ITR", time: "9:25 AM", time24: "09:25", landmark: "Institute Main Gate", distanceKm: 38 }
            ]
        },
        {
            id: "unjha-itr",
            name: "Unjha → ITR",
            code: "ROUTE-04",
            busNumber: "GJ-02-DD-9921",
            driverId: "DRV-104",
            driverName: "Mukeshbhai Parmar",
            driverPhone: "+91 98980 66554",
            startPoint: "Umiya Mataji Temple (Unjha)",
            destination: "ITR Campus",
            startTime: "8:00 AM",
            arrivalTime: "9:25 AM",
            totalDuration: "1h 25m",
            totalDistance: "32 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 50,
            occupiedSeats: 46,
            stopsCount: 5,
            notice: "Direct express college shuttle.",
            stops: [
                { id: 1, name: "Umiya Temple Complex", time: "8:00 AM", time24: "08:00", landmark: "Main Gate", distanceKm: 0 },
                { id: 2, name: "Unjha APMC Market", time: "8:10 AM", time24: "08:10", landmark: "Gate 1", distanceKm: 3 },
                { id: 3, name: "Bhandu Cross Road", time: "8:25 AM", time24: "08:25", landmark: "Campus Junction", distanceKm: 10 },
                { id: 4, name: "Motidau", time: "8:45 AM", time24: "08:45", landmark: "Village Stand", distanceKm: 19 },
                { id: 5, name: "ITR", time: "9:25 AM", time24: "09:25", landmark: "Institute Main Gate", distanceKm: 32 }
            ]
        },
        {
            id: "harij-itr",
            name: "Harij → ITR",
            code: "ROUTE-05",
            busNumber: "GJ-02-EE-3419",
            driverId: "DRV-105",
            driverName: "Arvindbhai Solanki",
            driverPhone: "+91 97123 44556",
            startPoint: "Harij Bus Stand",
            destination: "ITR Campus",
            startTime: "7:30 AM",
            arrivalTime: "9:30 AM",
            totalDuration: "2h 00m",
            totalDistance: "55 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 54,
            occupiedSeats: 51,
            stopsCount: 5,
            notice: "Connects rural boarding points along State Highway 7.",
            stops: [
                { id: 1, name: "Harij Bus Station", time: "7:30 AM", time24: "07:30", landmark: "Depot Stand", distanceKm: 0 },
                { id: 2, name: "Dunawada", time: "7:48 AM", time24: "07:48", landmark: "Dunawada Circle", distanceKm: 8 },
                { id: 3, name: "Adraj Chokdi", time: "8:10 AM", time24: "08:10", landmark: "Highway Post", distanceKm: 18 },
                { id: 4, name: "Chanasma Tower", time: "8:35 AM", time24: "08:35", landmark: "Clock Tower", distanceKm: 29 },
                { id: 5, name: "ITR", time: "9:30 AM", time24: "09:30", landmark: "Institute Main Gate", distanceKm: 55 }
            ]
        },
        {
            id: "visnagar-itr",
            name: "Visnagar → ITR",
            code: "ROUTE-06",
            busNumber: "GJ-02-FF-6612",
            driverId: "DRV-106",
            driverName: "Bharatbhai Raval",
            driverPhone: "+91 99099 22114",
            startPoint: "Kada Darwaja (Visnagar)",
            destination: "ITR Campus",
            startTime: "7:55 AM",
            arrivalTime: "9:25 AM",
            totalDuration: "1h 30m",
            totalDistance: "36 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 50,
            occupiedSeats: 42,
            stopsCount: 5,
            notice: "High-density morning route.",
            stops: [
                { id: 1, name: "Kada Darwaja", time: "7:55 AM", time24: "07:55", landmark: "Town Entry", distanceKm: 0 },
                { id: 2, name: "Visnagar Bus Station", time: "8:05 AM", time24: "08:05", landmark: "GSRTC Depot", distanceKm: 3 },
                { id: 3, name: "Kansa Cross Road", time: "8:20 AM", time24: "08:20", landmark: "Kansa Chokdi", distanceKm: 10 },
                { id: 4, name: "Basna", time: "8:42 AM", time24: "08:42", landmark: "Basna Stand", distanceKm: 21 },
                { id: 5, name: "ITR", time: "9:25 AM", time24: "09:25", landmark: "Institute Main Gate", distanceKm: 36 }
            ]
        },
        {
            id: "kadi-itr",
            name: "Kadi → ITR",
            code: "ROUTE-07",
            busNumber: "GJ-02-GG-5510",
            driverId: "DRV-107",
            driverName: "Sureshbhai Desai",
            driverPhone: "+91 94088 77661",
            startPoint: "Narsinhpura (Kadi)",
            destination: "ITR Campus",
            startTime: "7:35 AM",
            arrivalTime: "9:30 AM",
            totalDuration: "1h 55m",
            totalDistance: "52 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 52,
            occupiedSeats: 49,
            stopsCount: 4,
            notice: "Industrial zone connection corridor.",
            stops: [
                { id: 1, name: "Narsinhpura", time: "7:35 AM", time24: "07:35", landmark: "Kadi Gate", distanceKm: 0 },
                { id: 2, name: "Kundal Cross Road", time: "7:55 AM", time24: "07:55", landmark: "Kundal Stand", distanceKm: 9 },
                { id: 3, name: "Nandasan Chokdi", time: "8:20 AM", time24: "08:20", landmark: "Express Highway", distanceKm: 20 },
                { id: 4, name: "ITR", time: "9:30 AM", time24: "09:30", landmark: "Institute Main Gate", distanceKm: 52 }
            ]
        },
        {
            id: "vadnagar-itr",
            name: "Vadnagar → ITR",
            code: "ROUTE-08",
            busNumber: "GJ-02-HH-8822",
            driverId: "DRV-108",
            driverName: "Jagdishbhai Chaudhari",
            driverPhone: "+91 98790 55443",
            startPoint: "Toran Gate (Vadnagar)",
            destination: "ITR Campus",
            startTime: "7:40 AM",
            arrivalTime: "9:30 AM",
            totalDuration: "1h 50m",
            totalDistance: "46 km",
            status: "Active",
            tripStatus: "On Time",
            capacity: 50,
            occupiedSeats: 44,
            stopsCount: 4,
            notice: "Historic route via Kheralu junction.",
            stops: [
                { id: 1, name: "Toran Gate Vadnagar", time: "7:40 AM", time24: "07:40", landmark: "Kirti Toran", distanceKm: 0 },
                { id: 2, name: "Vadnagar Railway Station", time: "7:50 AM", time24: "07:50", landmark: "Station Square", distanceKm: 3 },
                { id: 3, name: "Sipor Chokdi", time: "8:15 AM", time24: "08:15", landmark: "Highway Crossing", distanceKm: 15 },
                { id: 4, name: "ITR", time: "9:30 AM", time24: "09:30", landmark: "Institute Main Gate", distanceKm: 46 }
            ]
        }
    ],

    drivers: [
        {
            id: "DRV-101",
            name: "Ramesh Patel",
            phone: "+91 98250 11223",
            busNumber: "GJ-02-AZ-4512",
            route: "Patan → ITR",
            routeId: "patan-itr",
            experience: "12 Years",
            licenseNo: "GJ-02-2012-DL00482",
            bloodGroup: "O+",
            rating: 4.9,
            safetyScore: "99.4%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 98250 99881",
            joinedDate: "August 2014"
        },
        {
            id: "DRV-102",
            name: "Kishorbhai Prajapati",
            phone: "+91 97241 88765",
            busNumber: "GJ-02-BZ-1890",
            route: "Mehsana → ITR",
            routeId: "mehsana-itr",
            experience: "9 Years",
            licenseNo: "GJ-02-2015-DL01984",
            bloodGroup: "A+",
            rating: 4.8,
            safetyScore: "98.8%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 97241 22331",
            joinedDate: "July 2017"
        },
        {
            id: "DRV-103",
            name: "Dineshbhai Vaghela",
            phone: "+91 94291 33445",
            busNumber: "GJ-02-CX-7734",
            route: "Sidhpur → ITR",
            routeId: "sidhpur-itr",
            experience: "15 Years",
            licenseNo: "GJ-02-2009-DL00129",
            bloodGroup: "B+",
            rating: 4.9,
            safetyScore: "99.8%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 94291 99112",
            joinedDate: "January 2011"
        },
        {
            id: "DRV-104",
            name: "Mukeshbhai Parmar",
            phone: "+91 98980 66554",
            busNumber: "GJ-02-DD-9921",
            route: "Unjha → ITR",
            routeId: "unjha-itr",
            experience: "8 Years",
            licenseNo: "GJ-02-2016-DL02883",
            bloodGroup: "AB+",
            rating: 4.7,
            safetyScore: "98.2%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 98980 11990",
            joinedDate: "August 2018"
        },
        {
            id: "DRV-105",
            name: "Arvindbhai Solanki",
            phone: "+91 97123 44556",
            busNumber: "GJ-02-EE-3419",
            route: "Harij → ITR",
            routeId: "harij-itr",
            experience: "11 Years",
            licenseNo: "GJ-02-2013-DL00774",
            bloodGroup: "O+",
            rating: 4.8,
            safetyScore: "99.1%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 97123 88123",
            joinedDate: "May 2015"
        },
        {
            id: "DRV-106",
            name: "Bharatbhai Raval",
            phone: "+91 99099 22114",
            busNumber: "GJ-02-FF-6612",
            route: "Visnagar → ITR",
            routeId: "visnagar-itr",
            experience: "7 Years",
            licenseNo: "GJ-02-2017-DL03991",
            bloodGroup: "A-",
            rating: 4.6,
            safetyScore: "97.9%",
            status: "Active & On Route",
            policeVerified: true,
            emergencyContact: "+91 99099 44332",
            joinedDate: "November 2019"
        }
    ],

    announcements: [
        {
            id: "ANN-01",
            title: "Important Bus Notice: Boarding Time Advisory",
            category: "Urgent Notice",
            type: "warning",
            date: "18 Aug 2026",
            time: "06:30 AM",
            content: "Students are requested to reach their respective bus stand 2–5 minutes before the scheduled arrival time. The bus will not wait for late passengers.",
            priority: "High",
            badge: "Mandatory"
        },
        {
            id: "ANN-02",
            title: "Updated Patan Route Timetable for Monsoon Term",
            category: "Timetable Update",
            type: "info",
            date: "16 Aug 2026",
            time: "04:15 PM",
            content: "Patan → ITR route morning departure from Bagavada Darwaja is confirmed at 7:40 AM sharp. Chanasma halt scheduled at 8:10 AM and ITR arrival at 9:30 AM.",
            priority: "Medium",
            badge: "Updated"
        },
        {
            id: "ANN-03",
            title: "Holiday Transportation Schedule for Janmashtami",
            category: "Holiday Notice",
            type: "success",
            date: "14 Aug 2026",
            time: "11:00 AM",
            content: "On account of Janmashtami festival on upcoming Friday, college buses will operate on regular morning schedules and special early return departures at 03:30 PM from campus.",
            priority: "Medium",
            badge: "Holiday"
        },
        {
            id: "ANN-04",
            title: "Route Maintenance Notice near Radhanpur Bypass",
            category: "Maintenance",
            type: "alert",
            date: "12 Aug 2026",
            time: "08:00 AM",
            content: "Due to highway maintenance near Radhanpur Bypass, Route 01 and Route 05 might encounter a minor 5-minute reroute during the return trip.",
            priority: "Low",
            badge: "Traffic Alert"
        },
        {
            id: "ANN-05",
            title: "Bus Service Delay Notification Protocol",
            category: "Delay Notice",
            type: "info",
            date: "10 Aug 2026",
            time: "02:00 PM",
            content: "In case of any highway breakdown or weather slowdown exceeding 10 minutes, real-time broadcast will be dispatched to student dashboard and registered parents.",
            priority: "Low",
            badge: "Protocol"
        }
    ],

    stats: {
        totalBuses: 12,
        activeRoutes: 8,
        todayTrips: 24,
        registeredStudents: 850,
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
            localStorage.setItem(STORAGE_KEYS.FAVORITE_ROUTE, "patan-itr");
        }
        if (!localStorage.getItem(STORAGE_KEYS.FAVORITE_STOP)) {
            localStorage.setItem(STORAGE_KEYS.FAVORITE_STOP, "Bagavada Darwaja");
        }
        if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
            localStorage.setItem(STORAGE_KEYS.THEME, "light");
        }
        if (!localStorage.getItem(STORAGE_KEYS.RECENT_ROUTES)) {
            localStorage.setItem(STORAGE_KEYS.RECENT_ROUTES, JSON.stringify(["patan-itr", "mehsana-itr"]));
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

    resetAllData() {
        localStorage.clear();
        this.init();
    }
};

// Auto initialize on load
AppStorage.init();
