/**
 * SAFESTOP Scoring Engine
 * Normal evidence: bus accessibility (35) + stop accessibility (35) +
 * verification freshness (30). Unknown values earn no points and limit confidence.
 */

const SafestopEngine = {
    LEVELS: {
        HIGH: { label: 'HIGH', min: 70, max: 100, class: 'confidence-high', color: '#10b981' },
        MODERATE: { label: 'MODERATE', min: 40, max: 69, class: 'confidence-moderate', color: '#f59e0b' },
        LOW: { label: 'LOW', min: 0, max: 39, class: 'confidence-low', color: '#ef4444' }
    },

    // Critical barriers are handled by the override, never by this deduction table.
    BARRIER_PENALTIES: { minor: 5, moderate: 15 },

    BUS_FACTORS: [
        { field: 'lowFloor', points: 12, label: 'Low-floor step-free bus entry' },
        { field: 'wheelchairSpace', points: 9, label: 'Dedicated wheelchair bay' },
        { field: 'rampAvailable', points: 8, label: 'Deployable boarding ramp' },
        { field: 'accessibleBoarding', points: 6, label: 'Audio/visual boarding assistance' }
    ],

    STOP_FACTORS: [
        { field: 'stepFreeApproach', points: 12, label: 'Step-free approach path' },
        { field: 'clearBoardingArea', points: 9, label: 'Clear 1.5m boarding area' },
        { field: 'rampAvailable', points: 8, label: 'Platform boarding ramp' },
        { field: 'tactilePath', points: 6, label: 'Tactile paving for vision support' }
    ],

    /**
     * @param {Object} params - { busProfile, stopProfile, activeBarriers }
     * @returns {Object} Boarding Confidence Evaluation Result
     */
    calculateConfidence({ busProfile, stopProfile, activeBarriers = [] }) {
        const keyFactors = [];
        const warnings = [];
        const limitations = [];
        const caps = [];

        const scoreProfile = (profile, factors, profileName) => {
            let score = 0;
            let unknownPoints = 0;
            if (!profile) {
                factors.forEach(factor => { unknownPoints += factor.points; });
                warnings.push(`${profileName} accessibility profile is unavailable`);
                limitations.push(`${profileName} accessibility profile is unavailable`);
                return { score, unknownPoints };
            }
            factors.forEach(factor => {
                const value = profile[factor.field];
                if (value === true) {
                    score += factor.points;
                    keyFactors.push(`${factor.label} (+${factor.points})`);
                } else if (value === false) {
                    warnings.push(`${profileName} does not have verified ${factor.label.toLowerCase()}`);
                } else {
                    // null/undefined is unknown, not evidence that the feature is absent.
                    unknownPoints += factor.points;
                    warnings.push(`${profileName} ${factor.label.toLowerCase()} is unknown`);
                    limitations.push(`${profileName} ${factor.label.toLowerCase()} is unknown`);
                }
            });
            return { score, unknownPoints };
        };

        const bus = scoreProfile(busProfile, this.BUS_FACTORS, 'Bus');
        const stop = scoreProfile(stopProfile, this.STOP_FACTORS, 'Stop');
        const busScore = bus.score;
        const stopScore = stop.score;
        let freshnessScore = 0;
        let freshnessUnknown = false;
        let isStale = false;
        const verifiedDate = stopProfile && stopProfile.lastVerified ? new Date(stopProfile.lastVerified) : null;

        // Fixed freshness scores: 30/20/10/0 for <=7/30/90/>90 days.
        if (verifiedDate && !Number.isNaN(verifiedDate.getTime())) {
            const diffDays = Math.max(0, Math.floor((Date.now() - verifiedDate.getTime()) / 86400000));
            if (diffDays <= 7) {
                freshnessScore = 30;
                keyFactors.push('Verified within the last 7 days (+30)');
            } else if (diffDays <= 30) {
                freshnessScore = 20;
                keyFactors.push('Verified within the last 30 days (+20)');
            } else if (diffDays <= 90) {
                freshnessScore = 10;
                keyFactors.push('Verified within the last 90 days (+10)');
            } else {
                isStale = true;
                warnings.push(`Stale verification data (${diffDays} days old)`);
                limitations.push(`Verification is stale (${diffDays} days old)`);
            }
        } else {
            freshnessUnknown = true;
            warnings.push('No valid physical verification record');
            limitations.push('Verification freshness is unavailable');
        }

        // Caps state the maximum confidence supported by missing evidence: an absent
        // whole profile caps at 65; unknown fields remove their point weight; missing
        // or stale freshness caps at 69 so it cannot qualify as HIGH. Multiple caps
        // use the lowest maximum.
        if (!busProfile) caps.push({ reason: 'Bus profile unavailable', maxScore: 65 });
        else if (bus.unknownPoints) caps.push({ reason: 'Unknown bus accessibility fields', maxScore: 100 - bus.unknownPoints });
        if (!stopProfile) caps.push({ reason: 'Stop profile unavailable', maxScore: 65 });
        else if (stop.unknownPoints) caps.push({ reason: 'Unknown stop accessibility fields', maxScore: 100 - stop.unknownPoints });
        if (freshnessUnknown) caps.push({ reason: 'Verification freshness unavailable', maxScore: 69 });
        else if (isStale) caps.push({ reason: 'Verification is older than 90 days', maxScore: 69 });

        let barrierPenalty = 0;
        const barrierDetails = [];
        const criticalBarriers = [];
        const barriers = Array.isArray(activeBarriers) ? activeBarriers : [];
        barriers.forEach(barrier => {
            const severity = String(barrier && barrier.severity || '').toLowerCase();
            const description = barrier && (barrier.description || barrier.type) || 'Unspecified barrier';
            if (severity === 'critical') {
                criticalBarriers.push(barrier);
                warnings.push(`Critical active barrier: ${description}`);
                barrierDetails.push({ severity, description, penalty: 0, override: true });
            } else {
                const penalty = this.BARRIER_PENALTIES[severity] || this.BARRIER_PENALTIES.moderate;
                barrierPenalty += penalty;
                warnings.push(`Active ${severity || 'unclassified'} barrier: ${description} (-${penalty})`);
                barrierDetails.push({ severity: severity || 'unclassified', description, penalty, override: false });
            }
        });

        const normalEvidenceScore = busScore + stopScore + freshnessScore;
        const rawScore = normalEvidenceScore - barrierPenalty;
        const scoreCap = caps.length ? Math.min(...caps.map(cap => cap.maxScore)) : 100;
        const cappedScore = Math.min(rawScore, scoreCap);
        const criticalBarrierOverride = criticalBarriers.length > 0;
        // Critical barriers force LOW and a final score below 40; they are not deducted.
        const finalScore = Math.max(0, Math.min(100, Math.round(
            criticalBarrierOverride ? Math.min(cappedScore, 39) : cappedScore
        )));

        if (criticalBarrierOverride) {
            warnings.push('Critical active barrier forces LOW boarding confidence.');
            limitations.push('Critical active barrier override applied');
        }

        let level = this.LEVELS.LOW;
        if (!criticalBarrierOverride && finalScore >= this.LEVELS.HIGH.min) level = this.LEVELS.HIGH;
        else if (!criticalBarrierOverride && finalScore >= this.LEVELS.MODERATE.min) level = this.LEVELS.MODERATE;

        return {
            score: finalScore,
            level: level.label,
            levelMeta: level,
            breakdown: {
                busScore,
                stopScore,
                freshnessScore,
                barrierPenalty,
                normalEvidenceScore,
                rawScore,
                finalScore,
                caps,
                limitations,
                criticalBarrierOverride,
                barrierDetails
            },
            isStale,
            isCapped: caps.length > 0,
            criticalBarrierOverride,
            keyFactors,
            warnings,
            timestamp: new Date().toISOString()
        };
    }
};

if (typeof window !== 'undefined') {
    window.SafestopEngine = SafestopEngine;
}
