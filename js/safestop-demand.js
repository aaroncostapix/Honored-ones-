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
            sourceUrl: "https://goavidhansabha.gov.in/",
            tier: "TIER 1 — OFFICIAL"
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
            sourceUrl: "https://goavidhansabha.gov.in/",
            tier: "TIER 1 — OFFICIAL"
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
            sourceUrl: "https://gmc.goa.gov.in/",
            tier: "TIER 1 — OFFICIAL"
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
            sourceUrl: "https://ktclgoa.com/",
            tier: "TIER 1 — OFFICIAL"
        }
    ],

    // Evaluate deterministic Boarding Demand Estimate
    evaluateDemand({ routeId, stopName, timeDate = (typeof SafestopTime !== 'undefined' ? SafestopTime.getISTDate() : new Date()) }) {
        const istMinutes = (typeof SafestopTime !== 'undefined' ? SafestopTime.getISTMinutesOfDay(timeDate) : (timeDate.getHours() * 60 + timeDate.getMinutes()));

        // Search for applicable evidence match
        const matchingRecord = this.EVIDENCE_RECORDS.find(rec => {
            const matchesRoute = !rec.corridorId || rec.corridorId === routeId;
            const matchesStop = rec.stopNames.some(s => s.toLowerCase() === (stopName || '').toLowerCase());
            return matchesRoute && matchesStop;
        });

        if (matchingRecord) {
            const inPeakWindow = istMinutes >= matchingRecord.startMinutes && istMinutes <= matchingRecord.endMinutes;
            if (inPeakWindow) {
                return {
                    level: matchingRecord.peakLevel,
                    badgeClass: matchingRecord.peakLevel === 'HIGH' ? 'badge-danger' : 'badge-warning',
                    windowText: matchingRecord.windowText,
                    explanation: matchingRecord.explanation,
                    sourceTitle: matchingRecord.sourceTitle,
                    sourceUrl: matchingRecord.sourceUrl,
                    tier: matchingRecord.tier,
                    isOfficialEvidence: true
                };
            } else {
                return {
                    level: "MODERATE",
                    badgeClass: "badge-warning",
                    windowText: "Off-Peak Hours (Outside Documented Window)",
                    explanation: `Historical demand evidence documented during ${matchingRecord.windowText}. Lower demand estimated currently.`,
                    sourceTitle: matchingRecord.sourceTitle,
                    sourceUrl: matchingRecord.sourceUrl,
                    tier: matchingRecord.tier,
                    isOfficialEvidence: true
                };
            }
        }

        // For unevidenced stops or general off-peak times: default to LOW
        return {
            level: "LOW",
            badgeClass: "badge-success",
            windowText: "Standard Service Window",
            explanation: "No elevated boarding demand or service disruption documented for this stop/time window.",
            sourceTitle: "KTCL Official Timetable & Service Baseline",
            sourceUrl: "https://ktclgoa.com/",
            tier: "TIER 1 — OFFICIAL",
            isOfficialEvidence: false
        };
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SafestopDemand };
}
