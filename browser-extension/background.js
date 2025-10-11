// StudyPets Website Blocker - Background Script (Manifest V3)
class StudyPetsBlocker {
    constructor() {
        this.settings = null;
        this.petStats = null;
        this.blockedSites = [];
        this.isBlockingActive = false;
        this.rules = [];
        this.init();
    }

    async init() {
        await this.loadSettings();
        await this.loadPetStats();
        this.setupStorageListener();
        this.startPeriodicCheck();
        await this.updateBlockingRules();
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.local.get(['studypets_settings']);
            if (result.studypets_settings) {
                this.settings = result.studypets_settings;
            } else {
                // Default settings
                this.settings = {
                    smartBlocking: true,
                    happinessThreshold: 70,
                    energyThreshold: 60,
                    focusThreshold: 80,
                    blockingStrictness: 'moderate',
                    entertainmentSites: [
                        'youtube.com', 'tiktok.com', 'twitter.com', 'netflix.com', 
                        'instagram.com', 'reddit.com', 'twitch.tv', 'discord.com', 
                        'pinterest.com', 'facebook.com', 'snapchat.com', 'tumblr.com',
                        '9gag.com', 'buzzfeed.com', 'vice.com', 'vox.com',
                        'theverge.com', 'techcrunch.com', 'mashable.com'
                    ]
                };
                await chrome.storage.local.set({ studypets_settings: this.settings });
            }
        } catch (error) {
            console.error('Failed to load settings:', error);
            this.settings = this.getDefaultSettings();
        }
    }

    async loadPetStats() {
        try {
            const result = await chrome.storage.local.get(['studypets_pet_stats']);
            if (result.studypets_pet_stats) {
                this.petStats = result.studypets_pet_stats;
            } else {
                // Default pet stats
                this.petStats = {
                    happiness: 85,
                    energy: 70,
                    focusPercentage: 95
                };
                await chrome.storage.local.set({ studypets_pet_stats: this.petStats });
            }
        } catch (error) {
            console.error('Failed to load pet stats:', error);
            this.petStats = this.getDefaultPetStats();
        }
    }

    getDefaultSettings() {
        return {
            smartBlocking: true,
            happinessThreshold: 70,
            energyThreshold: 60,
            focusThreshold: 80,
            blockingStrictness: 'moderate',
            entertainmentSites: [
                'youtube.com', 'tiktok.com', 'twitter.com', 'netflix.com', 
                'instagram.com', 'reddit.com', 'twitch.tv', 'discord.com', 
                'pinterest.com', 'facebook.com', 'snapchat.com', 'tumblr.com',
                '9gag.com', 'buzzfeed.com', 'vice.com', 'vox.com',
                'theverge.com', 'techcrunch.com', 'mashable.com'
            ]
        };
    }

    getDefaultPetStats() {
        return {
            happiness: 85,
            energy: 70,
            focusPercentage: 95
        };
    }

    setupStorageListener() {
        chrome.storage.onChanged.addListener((changes, namespace) => {
            if (namespace === 'local') {
                if (changes.studypets_settings) {
                    this.settings = changes.studypets_settings.newValue;
                    this.updateBlockingStatus();
                }
                if (changes.studypets_pet_stats) {
                    this.petStats = changes.studypets_pet_stats.newValue;
                    this.updateBlockingStatus();
                }
            }
        });
    }

    startPeriodicCheck() {
        // Check every 5 seconds for changes
        setInterval(async () => {
            await this.loadSettings();
            await this.loadPetStats();
            this.updateBlockingStatus();
        }, 5000);
    }

    async updateBlockingStatus() {
        if (!this.settings || !this.settings.smartBlocking) {
            this.isBlockingActive = false;
            await this.clearBlockingRules();
            this.updateBadge();
            return;
        }

        // Check if pet meets the thresholds
        const meetsThresholds = this.checkPetThresholds();
        
        if (meetsThresholds) {
            this.isBlockingActive = false;
            await this.clearBlockingRules();
            console.log('Pet levels are high enough - entertainment sites allowed');
        } else {
            this.isBlockingActive = true;
            await this.updateBlockingRules();
            console.log('Pet levels too low - blocking entertainment sites');
        }

        this.updateBadge();
    }

    checkPetThresholds() {
        if (!this.settings || !this.petStats) {
            return false;
        }

        const happinessOk = this.petStats.happiness >= this.settings.happinessThreshold;
        const energyOk = this.petStats.energy >= this.settings.energyThreshold;
        const focusOk = this.petStats.focusPercentage >= this.settings.focusThreshold;

        console.log('Pet threshold check:', {
            happiness: `${this.petStats.happiness}% (need ${this.settings.happinessThreshold}%)`,
            energy: `${this.petStats.energy}% (need ${this.settings.energyThreshold}%)`,
            focus: `${this.petStats.focusPercentage}% (need ${this.settings.focusThreshold}%)`,
            allMet: happinessOk && energyOk && focusOk
        });

        return happinessOk && energyOk && focusOk;
    }

    async updateBlockingRules() {
        if (!this.settings || !this.settings.entertainmentSites) {
            return;
        }

        // Clear existing rules
        await this.clearBlockingRules();

        // Create new rules for each entertainment site
        const rules = [];
        let ruleId = 1;

        for (const site of this.settings.entertainmentSites) {
            // Create rule for exact domain match
            rules.push({
                id: ruleId++,
                priority: 1,
                action: {
                    type: "redirect",
                    redirect: {
                        url: chrome.runtime.getURL('blocked-page.html') + 
                             '?domain=' + encodeURIComponent(site) +
                             '&originalUrl=' + encodeURIComponent('https://' + site)
                    }
                },
                condition: {
                    urlFilter: `*://${site}/*`,
                    resourceTypes: ["main_frame"]
                }
            });

            // Create rule for subdomain matches if moderate/loose strictness
            if (this.settings.blockingStrictness === 'moderate' || this.settings.blockingStrictness === 'loose') {
                rules.push({
                    id: ruleId++,
                    priority: 1,
                    action: {
                        type: "redirect",
                        redirect: {
                            url: chrome.runtime.getURL('blocked-page.html') + 
                                 '?domain=' + encodeURIComponent(site) +
                                 '&originalUrl=' + encodeURIComponent('https://' + site)
                        }
                    },
                    condition: {
                        urlFilter: `*://*.${site}/*`,
                        resourceTypes: ["main_frame"]
                    }
                });
            }
        }

        // Add the rules
        if (rules.length > 0) {
            try {
                await chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: [],
                    addRules: rules
                });
                console.log(`Added ${rules.length} blocking rules`);
            } catch (error) {
                console.error('Failed to add blocking rules:', error);
            }
        }
    }

    async clearBlockingRules() {
        try {
            // Get existing rules
            const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
            const ruleIds = existingRules.map(rule => rule.id);
            
            if (ruleIds.length > 0) {
                await chrome.declarativeNetRequest.updateDynamicRules({
                    removeRuleIds: ruleIds,
                    addRules: []
                });
                console.log(`Removed ${ruleIds.length} blocking rules`);
            }
        } catch (error) {
            console.error('Failed to clear blocking rules:', error);
        }
    }

    updateBadge() {
        if (this.isBlockingActive) {
            chrome.action.setBadgeText({ text: '🚫' });
            chrome.action.setBadgeBackgroundColor({ color: '#ef4444' });
            chrome.action.setTitle({ title: 'StudyPets: Entertainment sites blocked' });
        } else {
            chrome.action.setBadgeText({ text: '✅' });
            chrome.action.setBadgeBackgroundColor({ color: '#10b981' });
            chrome.action.setTitle({ title: 'StudyPets: Entertainment sites allowed' });
        }
    }

    async trackBlockedAttempt(domain, url) {
        try {
            const result = await chrome.storage.local.get(['blocked_attempts']);
            const attempts = result.blocked_attempts || [];
            
            attempts.push({
                domain: domain,
                url: url,
                timestamp: Date.now(),
                petStats: { ...this.petStats }
            });

            // Keep only last 100 attempts
            if (attempts.length > 100) {
                attempts.splice(0, attempts.length - 100);
            }

            await chrome.storage.local.set({ blocked_attempts: attempts });
        } catch (error) {
            console.error('Failed to track blocked attempt:', error);
        }
    }

    // Method to sync with StudyPets web app
    async syncWithStudyPets() {
        try {
            // This would be called by content script when StudyPets page is loaded
            const tabs = await chrome.tabs.query({ url: '*://localhost:8000/*' });
            
            for (const tab of tabs) {
                chrome.tabs.sendMessage(tab.id, { 
                    action: 'syncData',
                    settings: this.settings,
                    petStats: this.petStats
                });
            }
        } catch (error) {
            console.error('Failed to sync with StudyPets:', error);
        }
    }
}

// Initialize the blocker
const studyPetsBlocker = new StudyPetsBlocker();

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'updateSettings') {
        studyPetsBlocker.settings = request.settings;
        chrome.storage.local.set({ studypets_settings: request.settings });
        studyPetsBlocker.updateBlockingStatus();
        sendResponse({ success: true });
    } else if (request.action === 'updatePetStats') {
        studyPetsBlocker.petStats = request.petStats;
        chrome.storage.local.set({ studypets_pet_stats: request.petStats });
        studyPetsBlocker.updateBlockingStatus();
        sendResponse({ success: true });
    } else if (request.action === 'getStatus') {
        sendResponse({
            isBlockingActive: studyPetsBlocker.isBlockingActive,
            settings: studyPetsBlocker.settings,
            petStats: studyPetsBlocker.petStats
        });
    }
    return true; // Keep message channel open for async response
});

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === 'install') {
        chrome.tabs.create({ url: 'popup.html' });
    }
});