// Shop System for StudyPets
class ShopSystem {
    constructor() {
        this.currency = this.loadCurrency();
        this.inventory = this.loadInventory();
        this.shopItems = this.initializeShopItems();
        this.currentCategory = 'all';
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderShopItems();
        this.renderInventory();
        this.updateCurrencyDisplay();
    }

    // ==================== Data Management ====================
    loadCurrency() {
        const saved = localStorage.getItem('studyPetsCurrency');
        return saved ? parseInt(saved) : 0;
    }

    saveCurrency() {
        localStorage.setItem('studyPetsCurrency', this.currency.toString());
    }

    loadInventory() {
        const saved = localStorage.getItem('studyPetsInventory');
        return saved ? JSON.parse(saved) : {};
    }

    saveInventory() {
        localStorage.setItem('studyPetsInventory', JSON.stringify(this.inventory));
    }

    // ==================== Shop Items Configuration ====================
    initializeShopItems() {
        return {
            food: [
                {
                    id: 'apple',
                    name: 'Fresh Apple',
                    description: 'A healthy snack that restores 20 happiness',
                    price: 15,
                    icon: '🍎',
                    effect: { happiness: 20 }
                },
                {
                    id: 'fish',
                    name: 'Golden Fish',
                    description: 'Premium fish that restores 30 happiness and 15 energy',
                    price: 25,
                    icon: '🐟',
                    effect: { happiness: 30, energy: 15 }
                },
                {
                    id: 'cake',
                    name: 'Birthday Cake',
                    description: 'Special treat that restores 50 happiness',
                    price: 50,
                    icon: '🎂',
                    effect: { happiness: 50 }
                },
                {
                    id: 'carrot',
                    name: 'Magic Carrot',
                    description: 'Energizing carrot that restores 25 energy',
                    price: 20,
                    icon: '🥕',
                    effect: { energy: 25 }
                }
            ],
            toys: [
                {
                    id: 'ball',
                    name: 'Bouncy Ball',
                    description: 'A fun toy that increases happiness by 15',
                    price: 20,
                    icon: '⚽',
                    effect: { happiness: 15 }
                },
                {
                    id: 'puzzle',
                    name: 'Brain Puzzle',
                    description: 'Mental stimulation that increases focus by 10%',
                    price: 35,
                    icon: '🧩',
                    effect: { focus: 10 }
                },
                {
                    id: 'frisbee',
                    name: 'Flying Frisbee',
                    description: 'Active play that restores 20 energy and 10 happiness',
                    price: 30,
                    icon: '🥏',
                    effect: { energy: 20, happiness: 10 }
                },
                {
                    id: 'robot',
                    name: 'Robot Companion',
                    description: 'Advanced toy that restores 40 happiness and 20 energy',
                    price: 75,
                    icon: '🤖',
                    effect: { happiness: 40, energy: 20 }
                }
            ],
            accessories: [
                {
                    id: 'crown',
                    name: 'Golden Crown',
                    description: 'Royal accessory that boosts all stats by 5',
                    price: 100,
                    icon: '👑',
                    effect: { happiness: 5, energy: 5, focus: 5 }
                },
                {
                    id: 'hat',
                    name: 'Wizard Hat',
                    description: 'Magical hat that increases focus by 15%',
                    price: 60,
                    icon: '🧙‍♂️',
                    effect: { focus: 15 }
                },
                {
                    id: 'glasses',
                    name: 'Smart Glasses',
                    description: 'Tech accessory that increases focus by 20%',
                    price: 80,
                    icon: '👓',
                    effect: { focus: 20 }
                },
                {
                    id: 'cape',
                    name: 'Super Cape',
                    description: 'Heroic cape that boosts energy by 30',
                    price: 90,
                    icon: '🦸‍♂️',
                    effect: { energy: 30 }
                }
            ]
        };
    }

    // ==================== Event Listeners ====================
    setupEventListeners() {
        this.setupCategoryListeners();
        this.setupMenuToggle();
    }

    setupCategoryListeners() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.selectCategory(btn);
            });
        });
    }

    selectCategory(selectedBtn) {
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(b => b.classList.remove('active'));
        selectedBtn.classList.add('active');
        
        this.currentCategory = selectedBtn.dataset.category;
        this.renderShopItems();
    }

    setupMenuToggle() {
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => {
                this.toggleSidebar(menuToggle, sidebar);
            });
        }
    }

    toggleSidebar(menuToggle, sidebar) {
        sidebar.classList.toggle('collapsed');
        menuToggle.classList.toggle('active');
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.style.marginLeft = sidebar.classList.contains('collapsed') ? '0' : '280px';
        }
    }

    // ==================== Shop Rendering ====================
    renderShopItems() {
        const shopGrid = document.getElementById('shopGrid');
        if (!shopGrid) return;

        const itemsToShow = this.getItemsForCategory();
        shopGrid.innerHTML = itemsToShow.map(item => this.createShopItemHTML(item)).join('');
    }

    getItemsForCategory() {
        if (this.currentCategory === 'all') {
            return [
                ...this.shopItems.food,
                ...this.shopItems.toys,
                ...this.shopItems.accessories
            ];
        }
        return this.shopItems[this.currentCategory] || [];
    }

    createShopItemHTML(item) {
        const owned = this.inventory[item.id] || 0;
        const canAfford = this.currency >= item.price;
        
        return `
            <div class="shop-item">
                <div class="item-icon">${item.icon}</div>
                <h3 class="item-name">${item.name}</h3>
                <p class="item-description">${item.description}</p>
                <div class="item-price">
                    <div class="currency-icon">💰</div>
                    <span class="price-amount">${item.price}</span>
                </div>
                <button class="buy-btn" 
                        onclick="shopSystem.buyItem('${item.id}')" 
                        ${!canAfford ? 'disabled' : ''}>
                    ${canAfford ? 'Buy Now' : 'Not Enough Coins'}
                </button>
                ${owned > 0 ? `<div class="owned-badge">Owned: ${owned}</div>` : ''}
            </div>
        `;
    }

    renderInventory() {
        const inventoryGrid = document.getElementById('inventoryGrid');
        if (!inventoryGrid) return;

        const inventoryItems = this.getInventoryItems();
        
        if (inventoryItems.length === 0) {
            inventoryGrid.innerHTML = '<p style="text-align: center; color: #6b7280; grid-column: 1 / -1;">No items in inventory yet. Buy some items from the shop!</p>';
            return;
        }

        inventoryGrid.innerHTML = inventoryItems.map(([id, quantity]) => {
            const item = this.findItemById(id);
            return item ? this.createInventoryItemHTML(item, quantity) : '';
        }).join('');
    }

    getInventoryItems() {
        return Object.entries(this.inventory).filter(([id, quantity]) => quantity > 0);
    }

    createInventoryItemHTML(item, quantity) {
        return `
            <div class="inventory-item">
                <div class="inventory-icon">${item.icon}</div>
                <div class="inventory-name">${item.name}</div>
                <div class="inventory-quantity">Quantity: ${quantity}</div>
                <button class="buy-btn" style="margin-top: 0.5rem; padding: 0.5rem 1rem; font-size: 0.875rem;" 
                        onclick="shopSystem.useItem('${item.id}')">
                    Use Item
                </button>
            </div>
        `;
    }

    // ==================== Item Management ====================
    findItemById(itemId) {
        for (const category of Object.values(this.shopItems)) {
            const item = category.find(i => i.id === itemId);
            if (item) return item;
        }
        return null;
    }

    buyItem(itemId) {
        const item = this.findItemById(itemId);
        if (!item) return;
        
        if (!this.canAffordItem(item)) {
            this.showNotification('Not enough coins!', 'error');
            return;
        }
        
        this.processPurchase(item);
    }

    canAffordItem(item) {
        return this.currency >= item.price;
    }

    processPurchase(item) {
        this.currency -= item.price;
        this.saveCurrency();
        
        this.inventory[item.id] = (this.inventory[item.id] || 0) + 1;
        this.saveInventory();
        
        this.updateDisplays();
        this.showNotification(`Bought ${item.name}!`, 'success');
        this.applyItemEffect(item);
    }

    useItem(itemId) {
        if (!this.hasItem(itemId)) {
            this.showNotification('You don\'t have this item!', 'error');
            return;
        }
        
        const item = this.findItemById(itemId);
        if (!item) return;
        
        this.removeItemFromInventory(itemId);
        this.applyItemEffect(item);
        this.renderInventory();
        this.showNotification(`Used ${item.name}!`, 'success');
    }

    hasItem(itemId) {
        return this.inventory[itemId] && this.inventory[itemId] > 0;
    }

    removeItemFromInventory(itemId) {
        this.inventory[itemId] -= 1;
        if (this.inventory[itemId] <= 0) {
            delete this.inventory[itemId];
        }
        this.saveInventory();
    }

    // ==================== Item Effects ====================
    applyItemEffect(item) {
        const petStats = this.getPetStats();
        
        this.applyEffectToStats(petStats, item.effect);
        this.savePetStats(petStats);
        this.notifyStatsUpdate(petStats);
    }

    getPetStats() {
        return JSON.parse(localStorage.getItem('studyPetsStats') || '{}');
    }

    applyEffectToStats(petStats, effect) {
        if (effect.happiness) {
            petStats.happiness = Math.min(100, (petStats.happiness || 85) + effect.happiness);
        }
        if (effect.energy) {
            petStats.energy = Math.min(100, (petStats.energy || 70) + effect.energy);
        }
        if (effect.focus) {
            petStats.focusPercentage = Math.min(100, (petStats.focusPercentage || 95) + effect.focus);
        }
    }

    savePetStats(petStats) {
        localStorage.setItem('studyPetsStats', JSON.stringify(petStats));
    }

    notifyStatsUpdate(petStats) {
        window.dispatchEvent(new StorageEvent('storage', {
            key: 'studyPetsStats',
            newValue: JSON.stringify(petStats)
        }));
    }

    // ==================== UI Updates ====================
    updateDisplays() {
        this.updateCurrencyDisplay();
        this.renderShopItems();
        this.renderInventory();
    }

    updateCurrencyDisplay() {
        const currencyAmount = document.getElementById('currencyAmount');
        if (currencyAmount) {
            currencyAmount.textContent = this.currency;
        }
    }

    // ==================== Notifications ====================
    showNotification(message, type = 'info') {
        const notification = this.createNotificationElement(message, type);
        document.body.appendChild(notification);
        
        this.animateNotificationIn(notification);
        this.scheduleNotificationRemoval(notification);
    }

    createNotificationElement(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        const styles = this.getNotificationStyles(type);
        Object.assign(notification.style, styles);
        
        return notification;
    }

    getNotificationStyles(type) {
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
        };

        const typeStyles = {
            success: { background: 'linear-gradient(135deg, #10b981, #059669)' },
            error: { background: 'linear-gradient(135deg, #ef4444, #dc2626)' },
            info: { background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }
        };

        return { ...baseStyles, ...typeStyles[type] };
    }

    animateNotificationIn(notification) {
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
    }

    scheduleNotificationRemoval(notification) {
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // ==================== Currency Management ====================
    earnCurrency(amount) {
        this.currency += amount;
        this.saveCurrency();
        this.updateCurrencyDisplay();
        this.showNotification(`Earned ${amount} coins!`, 'success');
    }
}

// ==================== Global Initialization ====================
let shopSystem;

document.addEventListener('DOMContentLoaded', () => {
    shopSystem = new ShopSystem();
    window.shopSystem = shopSystem;
});

// Listen for currency updates from other pages
window.addEventListener('storage', (e) => {
    if (e.key === 'studyPetsCurrency' && shopSystem) {
        shopSystem.currency = parseInt(e.newValue) || 0;
        shopSystem.updateCurrencyDisplay();
    }
});