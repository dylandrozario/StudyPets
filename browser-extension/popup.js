// StudyPets Blocker Extension Popup Script
class StudyPetsPopup {
    constructor() {
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
        this.startPeriodicUpdate();
    }

    async loadData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
            this.settings = response.settings;
            this.petStats = response.petStats;
            this.isBlockingActive = response.isBlockingActive;
            
            // Load blocked attempts
            const result = await chrome.storage.local.get(['blocked_attempts']);
            this.blockedAttempts = result.blocked_attempts || [];
        } catch (error) {
            console.error('Failed to load data:', error);
            this.settings = this.getDefaultSettings();
            this.petStats = this.getDefaultPetStats();
            this.isBlockingActive = false;
            this.blockedAttempts = [];
        }
    }

    getDefaultSettings() {
        return {
            smartBlocking: true,
            happinessThreshold: 70,
            energyThreshold: 60,
            focusThreshold: 80,
            blockingStrictness: 'moderate',
            entertainmentSites: []
        };
    }

    getDefaultPetStats() {
        return {
            happiness: 85,
            energy: 70,
            focusPercentage: 95
        };
    }

    setupEventListeners() {
        document.getElementById('openStudyPets').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:3000' });
        });

        document.getElementById('manageSettings').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:3000/settings' });
        });
    }

    updateUI() {
        this.updateStatus();
        this.updatePetStats();
        this.updateBlockedAttempts();
        this.updateThresholds();
    }

    updateStatus() {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');

        if (this.isBlockingActive) {
            statusDot.className = 'status-dot blocking';
            statusText.textContent = 'Entertainment sites blocked';
        } else {
            statusDot.className = 'status-dot allowed';
            statusText.textContent = 'Entertainment sites allowed';
        }
    }

    updatePetStats() {
        const petAvatar = document.getElementById('petAvatar');
        const happinessLevel = document.getElementById('happinessLevel');
        const energyLevel = document.getElementById('energyLevel');
        const focusLevel = document.getElementById('focusLevel');
        const happinessStatus = document.getElementById('happinessStatus');
        const energyStatus = document.getElementById('energyStatus');
        const focusStatus = document.getElementById('focusStatus');

        // Update pet emoji based on average levels
        const avgLevel = (this.petStats.happiness + this.petStats.energy + this.petStats.focusPercentage) / 3;
        if (avgLevel >= 80) {
            petAvatar.textContent = '😸';
        } else if (avgLevel >= 60) {
            petAvatar.textContent = '😺';
        } else if (avgLevel >= 40) {
            petAvatar.textContent = '😿';
        } else {
            petAvatar.textContent = '😾';
        }

        // Update levels with color coding and status indicators
        this.updateLevelElement(happinessLevel, happinessStatus, this.petStats.happiness, this.settings.happinessThreshold);
        this.updateLevelElement(energyLevel, energyStatus, this.petStats.energy, this.settings.energyThreshold);
        this.updateLevelElement(focusLevel, focusStatus, this.petStats.focusPercentage, this.settings.focusThreshold);
    }

    updateLevelElement(valueElement, statusElement, current, threshold) {
        valueElement.textContent = `${Math.round(current)}%`;
        if (current >= threshold) {
            valueElement.className = 'level-value met';
            statusElement.textContent = '✓';
            statusElement.className = 'level-status met';
        } else {
            valueElement.className = 'level-value missing';
            statusElement.textContent = '✗';
            statusElement.className = 'level-status missing';
        }
    }

    updateBlockedAttempts() {
        const blockedAttemptsElement = document.getElementById('blockedAttempts');
        blockedAttemptsElement.textContent = this.blockedAttempts.length;
    }

    updateThresholds() {
        const thresholdsSummary = document.getElementById('thresholdsSummary');
        thresholdsSummary.textContent = `${this.settings.happinessThreshold}/${this.settings.energyThreshold}/${this.settings.focusThreshold}`;
    }

    startPeriodicUpdate() {
        // Update every 5 seconds
        setInterval(async () => {
            await this.loadData();
            this.updateUI();
        }, 5000);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StudyPetsPopup();
});
