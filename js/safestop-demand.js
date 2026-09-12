/**
 * SAFESTOP Boarding Demand Estimate Heuristic & Evidence Repository
 * Estimates demand levels based on IST time, published service frequency, and official evidence.
 * NOT a live passenger-occupancy measurement.
 */

const SafestopDemand = {
    // Evidence Database (Tier 1: Official Govt / Legislative Records; Tier 2: Reputable News)
    EVIDENCE_RECORDS: [
        {
            id: "EVID-GOA-LEG-01",
            corridorId: "panaji-margao",
            stopNames: ["Margao KTC Bus Stand", "Panaji Bus Stand", "Agassaim", "Cortalim Junction", "Verna Industrial Estate"],
            startMinutes: 450, // 07:30 AM IST
            endMinutes: 510,   // 08:30 AM IST
            peakLevel: "HIGH",
            windowText: "07:30–08:30 IST Peak-Demand Window",
            explanation: "Official Goa Legislative Assembly passenger-flow record documented elevated shuttle commuter volume on the Panaji–Margao shuttle service during morning peak hours.",
            sourceTitle: "Goa Legislative Assembly Passenger Flow Record",
            sourceUrl: "https://goavidhansabha.gov.in/questions-and-answers",
            tier: "TIER 1 — OFFICIAL",
            evidenceType: "OFFICIAL PASSENGER-FLOW EVIDENCE"
        },
        {
            id: "EVID-GOA-LEG-02",
            corridorId: null,
            stopNames: ["Panaji Bus Stand", "Patto Plaza", "Portais"],
            startMinutes: 1020, // 17:00 IST (5:00 PM)
            endMinutes: 1140,   // 19:00 IST (7:00 PM)
            peakLevel: "HIGH",
            windowText: "17:00–19:00 IST Peak Office Departures Window",
            explanation: "Assembly record documented passenger accumulation at Panaji terminal during evening peak office departure hours.",
            sourceTitle: "Goa Legislative Assembly Transport Service Record",
            sourceUrl: "https://goavidhansabha.gov.in/questions-and-answers",
            tier: "TIER 1 — OFFICIAL",
            evidenceType: "OFFICIAL PASSENGER-FLOW EVIDENCE"
        },
        {
            id: "EVID-GOA-HEALTH-01",
            corridorId: null,
            stopNames: ["Goa Medical College (GMC)", "GMC Bambolim"],
            startMinutes: 480, // 08:00 AM IST
            endMinutes: 570,   // 09:30 AM IST
            peakLevel: "MODERATE",
            windowText: "08:00–09:30 IST GMC Hospital OPD Window",
            explanation: "Inferred contextual demand window based on Goa Health Services official OPD registration hours; not a live or measured passenger-crowding record.",
            sourceTitle: "Goa Health Services Public OPD Timetable",
            sourceUrl: "https://gmc.goa.gov.in/opd-timings",
            tier: "TIER 1 — OFFICIAL",
            evidenceType: "INFERRED CONTEXT"
        },
        {
            id: "EVID-GOA-NEWS-01",
            corridorId: "panaji-mapusa",
            stopNames: ["Panaji Bus Stand", "Mapusa KTC Bus Stand", "Porvorim (Mall de Goa)"],
            startMinutes: 480, // 08:00 AM IST
            endMinutes: 540,   // 09:00 AM IST
            peakLevel: "MODERATE",
            windowText: "08:00–09:00 IST Mandovi Corridor Morning Peak",
            explanation: "Published North Goa intra-district commuter flow guidelines indicate elevated morning highway travel demand.",
            sourceTitle: "KTCL Citizen Charter & Route Advisory",
            sourceUrl: "https://ktclgoa.com/bus-schedules/",
            tier: "TIER 1 — OFFICIAL",
            evidenceType: "OFFICIAL SERVICE EVIDENCE"
        }
    ],

    // Evaluate deterministic Boarding Demand Estimate
    evaluateDemand({ routeId, stopName, timeDate = (typeof SafestopTime !== 'undefined' ? SafestopTime.getISTDate() : new Date()) }) {
        if (!stopName) {
            return {
                level: "UNAVAILABLE",
                badgeClass: "badge-warning",
                windowText: "Demand Estimate Unavailable",
                explanation: "Stop identity not specified.",
                sourceTitle: "KTCL Official Timetable Baseline",
                sourceUrl: "https://ktclgoa.com/",
                tier: "NO ACTIVE DEMAND EVIDENCE",
                evidenceType: "OFFICIAL SERVICE EVIDENCE",
                isOfficialEvidence: false
            };
        }

        const istMinutes = (typeof SafestopTime !== 'undefined' ? SafestopTime.getISTMinutesOfDay(timeDate) : (timeDate.getHours() * 60 + timeDate.getMinutes()));

        // Search for an ACTIVE evidence window match
        const activeRecord = this.EVIDENCE_RECORDS.find(rec => {
            const matchesRoute = !rec.corridorId || rec.corridorId === routeId;
            const matchesStop = rec.stopNames.some(s => s.toLowerCase() === (stopName || '').toLowerCase());
            const inPeakWindow = istMinutes >= rec.startMinutes && istMinutes <= rec.endMinutes;
            return matchesRoute && matchesStop && inPeakWindow;
        });

        if (activeRecord) {
            const isOfficial = activeRecord.evidenceType === "OFFICIAL PASSENGER-FLOW EVIDENCE" || activeRecord.evidenceType === "OFFICIAL SERVICE EVIDENCE";
            return {
                level: activeRecord.peakLevel,
                badgeClass: activeRecord.peakLevel === 'HIGH' ? 'badge-danger' : 'badge-warning',
                windowText: activeRecord.windowText,
                explanation: activeRecord.explanation,
                sourceTitle: activeRecord.sourceTitle,
                sourceUrl: activeRecord.sourceUrl,
                tier: activeRecord.tier,
                evidenceType: activeRecord.evidenceType,
                isOfficialEvidence: isOfficial
            };
        }

        // For off-peak hours (outside active evidence windows) or unevidenced stops: default to LOW
        return {
            level: "LOW",
            badgeClass: "badge-success",
            windowText: "Standard Off-Peak Baseline",
            explanation: "No documented elevated demand signal applies at this time.",
            sourceTitle: "KTCL Official Timetable & Service Baseline",
            sourceUrl: "https://ktclgoa.com/bus-schedules/",
            tier: "NO ACTIVE DEMAND EVIDENCE",
            evidenceType: "OFFICIAL SERVICE EVIDENCE",
            isOfficialEvidence: false
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SafestopDemand };
}
