// StudyPets Blocked Page Script
class BlockedPage {
    constructor() {
        this.domain = '';
        this.originalUrl = '';
        this.settings = null;
        this.petStats = null;
        this.init();
    }

    async init() {
        this.parseUrlParams();
        await this.loadData();
        this.setupEventListeners();
        this.updateUI();
    }

    parseUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        this.domain = decodeURIComponent(urlParams.get('domain') || 'Unknown Site');
        this.originalUrl = decodeURIComponent(urlParams.get('originalUrl') || '');
    }

    async loadData() {
        try {
            const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
            this.settings = response.settings;
            this.petStats = response.petStats;
        } catch (error) {
            console.error('Failed to load data:', error);
            this.settings = this.getDefaultSettings();
            this.petStats = this.getDefaultPetStats();
        }
    }

    getDefaultSettings() {
        return {
            happinessThreshold: 70,
            energyThreshold: 60,
            focusThreshold: 80
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
        document.getElementById('studyBtn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:8000/src/frontend/study/study.html' });
        });

        document.getElementById('dashboardBtn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'http://localhost:8000' });
        });
    }

    updateUI() {
        this.updateDomain();
        this.updatePetStatus();
    }

    updateDomain() {
        document.getElementById('blockedDomain').textContent = this.domain;
    }

    updatePetStatus() {
        const petAvatar = document.getElementById('petAvatar');
        const happinessItem = document.getElementById('happinessItem');
        const energyItem = document.getElementById('energyItem');
        const focusItem = document.getElementById('focusItem');

        // Update pet emoji
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

        // Update level items
        this.updateLevelItem(happinessItem, 'happiness', this.petStats.happiness, this.settings.happinessThreshold);
        this.updateLevelItem(energyItem, 'energy', this.petStats.energy, this.settings.energyThreshold);
        this.updateLevelItem(focusItem, 'focus', this.petStats.focusPercentage, this.settings.focusThreshold);
    }

    updateLevelItem(item, type, current, threshold) {
        const valueEl = item.querySelector('.level-value');
        const requirementEl = item.querySelector('.level-requirement');

        valueEl.textContent = `${Math.round(current)}%`;
        requirementEl.textContent = `(need ${threshold}%)`;

        if (current >= threshold) {
            item.classList.add('met');
            item.classList.remove('missing');
        } else {
            item.classList.add('missing');
            item.classList.remove('met');
        }
    }

}

// Initialize blocked page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BlockedPage();
});
