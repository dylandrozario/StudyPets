// StudyPets Website Blocker - Content Script
class StudyPetsContentScript {
    constructor() {
        this.isStudyPetsPage = this.checkIfStudyPetsPage();
        this.init();
    }

    init() {
        if (this.isStudyPetsPage) {
            this.setupStudyPetsIntegration();
        }
        this.setupMessageListener();
    }

    checkIfStudyPetsPage() {
        return window.location.hostname === 'localhost' && 
               window.location.port === '8000' &&
               (window.location.pathname.includes('/dashboard/') || 
                window.location.pathname.includes('/study/') || 
                window.location.pathname.includes('/settings/'));
    }

    setupStudyPetsIntegration() {
        // Wait for StudyPets to load
        const checkStudyPets = () => {
            if (window.localStorage) {
                this.syncWithStudyPets();
                this.setupLocalStorageListener();
            } else {
                setTimeout(checkStudyPets, 1000);
            }
        };
        checkStudyPets();
    }

    setupLocalStorageListener() {
        // Listen for changes in StudyPets localStorage
        const originalSetItem = localStorage.setItem;
        const originalRemoveItem = localStorage.removeItem;
        const originalClear = localStorage.clear;

        localStorage.setItem = (key, value) => {
            originalSetItem.call(localStorage, key, value);
            this.handleLocalStorageChange(key, value);
        };

        localStorage.removeItem = (key) => {
            originalRemoveItem.call(localStorage, key);
            this.handleLocalStorageChange(key, null);
        };

        localStorage.clear = () => {
            originalClear.call(localStorage);
            this.handleLocalStorageChange(null, null);
        };
    }

    handleLocalStorageChange(key, value) {
        if (key === 'settings') {
            try {
                const settings = JSON.parse(value);
                chrome.runtime.sendMessage({
                    action: 'updateSettings',
                    settings: settings
                });
            } catch (error) {
                console.error('Failed to parse settings:', error);
            }
        } else if (key === 'studyPetsPetStats') {
            try {
                const petStats = JSON.parse(value);
                chrome.runtime.sendMessage({
                    action: 'updatePetStats',
                    petStats: petStats
                });
            } catch (error) {
                console.error('Failed to parse pet stats:', error);
            }
        }
    }

    async syncWithStudyPets() {
        try {
            // Get current StudyPets data
            const settings = JSON.parse(localStorage.getItem('settings') || '{}');
            const petStats = JSON.parse(localStorage.getItem('studyPetsPetStats') || '{}');

            // Send to background script
            chrome.runtime.sendMessage({
                action: 'updateSettings',
                settings: settings
            });

            chrome.runtime.sendMessage({
                action: 'updatePetStats',
                petStats: petStats
            });

            console.log('StudyPets data synced with extension');
        } catch (error) {
            console.error('Failed to sync with StudyPets:', error);
        }
    }

    setupMessageListener() {
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            if (request.action === 'syncData') {
                // Update StudyPets with extension data
                if (request.settings) {
                    localStorage.setItem('settings', JSON.stringify(request.settings));
                }
                if (request.petStats) {
                    localStorage.setItem('studyPetsPetStats', JSON.stringify(request.petStats));
                }
                sendResponse({ success: true });
            }
            return true;
        });
    }
}

// Initialize content script
new StudyPetsContentScript();
