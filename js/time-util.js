/**
 * SAFESTOP Asia/Kolkata (IST) Time Utility
 */
const SafestopTime = {
    // Returns current Date object for Asia/Kolkata timezone
    getISTDate() {
        const now = new Date();
        const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
        return new Date(istString);
    },

    // Format IST time display string (e.g., "07:40:00 AM IST")
    formatISTClock(date = this.getISTDate()) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12).padStart(2, '0');
        return `${formattedHours}:${minutes}:${seconds} ${ampm} IST`;
    },

    // Format IST short time string (e.g., "07:40 AM")
    formatISTShort(date = this.getISTDate()) {
        const hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = String(hours % 12 || 12).padStart(2, '0');
        return `${formattedHours}:${minutes} ${ampm}`;
    },

    // Returns total minutes from midnight IST (0 to 1439)
    getISTMinutesOfDay(date = this.getISTDate()) {
        return date.getHours() * 60 + date.getMinutes();
    },

    // Parses a time string like "07:30 AM" into minutes of day (0-1439)
    parseTimeToMinutes(timeStr) {
        if (!timeStr) return 0;
        const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
        if (!match) return 0;
        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const ampm = match[3] ? match[3].toUpperCase() : null;
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SafestopTime };
}
