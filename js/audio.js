/**
 * College Transport Management System - Audio & Voice Engine
 * Zero-dependency Web Audio API sound synthesizer and Web Speech API voice alerts
 */

const AppAudio = {
    audioCtx: null,
    isMuted: false,
    speechEnabled: true,

    init() {
        const savedMute = localStorage.getItem('ctms_audio_muted');
        this.isMuted = savedMute === 'true';

        const savedSpeech = localStorage.getItem('ctms_speech_enabled');
        this.speechEnabled = savedSpeech !== 'false';

        // Auto unlock audio context on first user interaction
        const unlockAudio = () => {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) {
                    this.audioCtx = new AudioContext();
                }
            }
            if (this.audioCtx && this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }
            document.removeEventListener('click', unlockAudio);
            document.removeEventListener('keydown', unlockAudio);
        };

        document.addEventListener('click', unlockAudio);
        document.addEventListener('keydown', unlockAudio);
    },

    toggleMute() {
        this.isMuted = !this.isMuted;
        localStorage.setItem('ctms_audio_muted', this.isMuted);
        return this.isMuted;
    },

    toggleSpeech() {
        this.speechEnabled = !this.speechEnabled;
        localStorage.setItem('ctms_speech_enabled', this.speechEnabled);
        return this.speechEnabled;
    },

    // Play synthesized UI click/chime
    playTone(frequency = 520, duration = 0.08, type = 'sine', gainVal = 0.08) {
        if (this.isMuted) return;
        try {
            if (!this.audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioCtx = new AudioContext();
            }
            if (this.audioCtx.state === 'suspended') {
                this.audioCtx.resume();
            }

            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();

            osc.type = type;
            osc.frequency.setValueAtTime(frequency, this.audioCtx.currentTime);

            gain.gain.setValueAtTime(gainVal, this.audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + duration);

            osc.connect(gain);
            gain.connect(this.audioCtx.destination);

            osc.start();
            osc.stop(this.audioCtx.currentTime + duration);
        } catch (e) {
            // Audio context not allowed yet
        }
    },

    // Stop arrival chime (high pitch pleasant 2-tone chime)
    playArrivalChime() {
        if (this.isMuted) return;
        this.playTone(587.33, 0.12, 'sine', 0.1); // D5
        setTimeout(() => {
            this.playTone(880, 0.25, 'sine', 0.1); // A5
        }, 120);
    },

    // UI Click Sound
    playClick() {
        this.playTone(600, 0.04, 'triangle', 0.04);
    },

    // Emergency Alert Beep
    playSosAlarm() {
        if (this.isMuted) return;
        this.playTone(900, 0.2, 'sawtooth', 0.15);
        setTimeout(() => this.playTone(600, 0.2, 'sawtooth', 0.15), 200);
        setTimeout(() => this.playTone(900, 0.2, 'sawtooth', 0.15), 400);
    },

    // Voice announcement using Web Speech API
    speakAnnouncement(text) {
        if (this.isMuted || !this.speechEnabled) return;
        if (!('speechSynthesis' in window)) return;

        window.speechSynthesis.cancel(); // Stop any pending speech

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.05;
        utterance.volume = 0.9;

        // Try to pick an English voice if available
        const voices = window.speechSynthesis.getVoices();
        const englishVoice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Female')));
        if (englishVoice) {
            utterance.voice = englishVoice;
        }

        window.speechSynthesis.speak(utterance);
    }
};

AppAudio.init();
