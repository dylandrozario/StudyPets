import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './shared/PageStyles.css';
import './Shop.css';

const Shop = () => {
  const [currency, setCurrency] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [ownedItems, setOwnedItems] = useState([]);

  // Load currency and owned items from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem('studyPetsCurrency');
    const savedOwnedItems = localStorage.getItem('studyPetsOwnedItems');
    
    if (savedCurrency) {
      setCurrency(parseInt(savedCurrency));
    }
    if (savedOwnedItems) {
      setOwnedItems(JSON.parse(savedOwnedItems));
    }
  }, []);

  const shopItems = {
    food: [
      {
        id: 'apple',
        name: 'Fresh Apple',
        description: 'A crisp, juicy apple that boosts energy',
        price: 10,
        effect: { energy: 15, happiness: 5 },
        icon: '🍎',
        category: 'food'
      },
      {
        id: 'carrot',
        name: 'Crunchy Carrot',
        description: 'Nutritious carrot for healthy growth',
        price: 8,
        effect: { energy: 10, happiness: 3 },
        icon: '🥕',
        category: 'food'
      },
      {
        id: 'fish',
        name: 'Delicious Fish',
        description: 'Premium fish meal for maximum satisfaction',
        price: 20,
        effect: { energy: 25, happiness: 15 },
        icon: '🐟',
        category: 'food'
      },
      {
        id: 'treat',
        name: 'Special Treat',
        description: 'A rare treat that pets absolutely love',
        price: 35,
        effect: { energy: 20, happiness: 30 },
        icon: '🍪',
        category: 'food'
      }
    ],
    toys: [
      {
        id: 'ball',
        name: 'Bouncy Ball',
        description: 'A colorful ball for endless fun',
        price: 15,
        effect: { happiness: 20, energy: -5 },
        icon: '🎾',
        category: 'toys'
      },
      {
        id: 'rope',
        name: 'Chew Rope',
        description: 'Durable rope toy for active play',
        price: 12,
        effect: { happiness: 15, energy: -3 },
        icon: '🪢',
        category: 'toys'
      },
      {
        id: 'puzzle',
        name: 'Puzzle Toy',
        description: 'Mental stimulation toy for smart pets',
        price: 25,
        effect: { happiness: 25, energy: -8 },
        icon: '🧩',
        category: 'toys'
      },
      {
        id: 'laser',
        name: 'Laser Pointer',
        description: 'Interactive laser for exciting playtime',
        price: 30,
        effect: { happiness: 35, energy: -10 },
        icon: '🔴',
        category: 'toys'
      }
    ],
    accessories: [
      {
        id: 'collar',
        name: 'Fancy Collar',
        description: 'A stylish collar to make your pet look great',
        price: 20,
        effect: { happiness: 10 },
        icon: '🎀',
        category: 'accessories'
      },
      {
        id: 'hat',
        name: 'Cute Hat',
        description: 'An adorable hat for special occasions',
        price: 18,
        effect: { happiness: 12 },
        icon: '🎩',
        category: 'accessories'
      },
      {
        id: 'glasses',
        name: 'Smart Glasses',
        description: 'Stylish glasses for the intellectual pet',
        price: 22,
        effect: { happiness: 8 },
        icon: '👓',
        category: 'accessories'
      },
      {
        id: 'bowtie',
        name: 'Elegant Bowtie',
        description: 'A sophisticated bowtie for formal events',
        price: 25,
        effect: { happiness: 15 },
        icon: '🎀',
        category: 'accessories'
      }
    ],
    furniture: [
      {
        id: 'bed',
        name: 'Comfy Bed',
        description: 'A soft bed for restful sleep',
        price: 40,
        effect: { energy: 30, happiness: 10 },
        icon: '🛏️',
        category: 'furniture'
      },
      {
        id: 'house',
        name: 'Pet House',
        description: 'A cozy house for your pet to call home',
        price: 60,
        effect: { energy: 25, happiness: 20 },
        icon: '🏠',
        category: 'furniture'
      },
      {
        id: 'scratching',
        name: 'Scratching Post',
        description: 'Perfect for cats to sharpen their claws',
        price: 35,
        effect: { happiness: 18, energy: -5 },
        icon: '📏',
        category: 'furniture'
      },
      {
        id: 'tree',
        name: 'Cat Tree',
        description: 'A multi-level tree for climbing and resting',
        price: 80,
        effect: { energy: 20, happiness: 25 },
        icon: '🌳',
        category: 'furniture'
      }
    ],
    health: [
      {
        id: 'vitamins',
        name: 'Pet Vitamins',
        description: 'Essential vitamins for optimal health',
        price: 30,
        effect: { energy: 20, happiness: 5 },
        icon: '💊',
        category: 'health'
      },
      {
        id: 'grooming',
        name: 'Grooming Kit',
        description: 'Complete grooming set for pet care',
        price: 25,
        effect: { happiness: 15, energy: 10 },
        icon: '🪒',
        category: 'health'
      },
      {
        id: 'medicine',
        name: 'Health Medicine',
        description: 'Special medicine for when pets are sick',
        price: 45,
        effect: { energy: 40, happiness: 20 },
        icon: '💉',
        category: 'health'
      }
    ]
  };

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛍️' },
    { id: 'food', name: 'Food', icon: '🍎' },
    { id: 'toys', name: 'Toys', icon: '🎾' },
    { id: 'accessories', name: 'Accessories', icon: '🎀' },
    { id: 'furniture', name: 'Furniture', icon: '🛏️' },
    { id: 'health', name: 'Health', icon: '💊' }
  ];

  const getAllItems = () => {
    return Object.values(shopItems).flat();
  };

  const getFilteredItems = () => {
    if (selectedCategory === 'all') {
      return getAllItems();
    }
    return shopItems[selectedCategory] || [];
  };

  const handlePurchase = (item) => {
    if (currency >= item.price) {
      setCurrency(currency - item.price);
      setOwnedItems([...ownedItems, item.id]);
      
      // Save to localStorage
      localStorage.setItem('studyPetsCurrency', (currency - item.price).toString());
      localStorage.setItem('studyPetsOwnedItems', JSON.stringify([...ownedItems, item.id]));
      
      // Show success message (you could add a toast notification here)
      alert(`Successfully purchased ${item.name}!`);
    } else {
      alert('Not enough coins!');
    }
  };

  const isOwned = (itemId) => {
    return ownedItems.includes(itemId);
  };

  return (
    <div className="page-shop">
      {/* Background Elements */}
      <div className="background">
        <div className="bg-blob bg-blob-1"></div>
        <div className="bg-blob bg-blob-2"></div>
        <div className="bg-blob bg-blob-3"></div>
        <div className="bg-blob bg-blob-4"></div>
        <div className="bg-blob bg-blob-5"></div>
        <div className="bg-blob bg-blob-6"></div>
        <div className="bg-blob bg-blob-7"></div>
        <div className="bg-blob bg-blob-8"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="glass-nav">
        <div className="nav-container">
          <div className="nav-left">
            <h1 className="logo">
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>StudyPets</Link>
            </h1>
          </div>
          <div className="nav-right">
            <div className="currency-display">
              <span className="currency-icon">💰</span>
              <span className="currency-amount">{currency}</span>
            </div>
            <Link to="/dashboard" className="glass-btn secondary">Back to Dashboard</Link>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <main className="main-content">
          <div className="content-wrapper">
            <div className="page-header">
              <h1>Pet Shop</h1>
              <p>Spend your earned coins on items to keep your pet happy and healthy</p>
            </div>
            
            {/* Currency Display */}
            <div className="currency-section glass-card">
              <div className="currency-info">
                <h3>Your Wallet</h3>
                <div className="currency-display-large">
                  <span className="currency-icon">💰</span>
                  <span className="currency-amount">{currency} coins</span>
                </div>
                <p>Earn coins by studying and staying focused!</p>
              </div>
            </div>

            {/* Category Filter */}
            <div className="category-filter">
              <h3>Categories</h3>
              <div className="category-buttons">
                {categories.map(category => (
                  <button
                    key={category.id}
                    className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category.id)}
                  >
                    <span className="category-icon">{category.icon}</span>
                    <span className="category-name">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {/* Shop Items Grid */}
            <div className="shop-grid">
              {getFilteredItems().map(item => (
                <div key={item.id} className={`shop-item glass-card ${isOwned(item.id) ? 'owned' : ''}`}>
                  <div className="item-header">
                    <div className="item-icon">{item.icon}</div>
                    <div className="item-info">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-category">{item.category}</div>
                    </div>
                  </div>
                  
                  <p className="item-description">{item.description}</p>
                  
                  <div className="item-effects">
                    <h4>Effects:</h4>
                    <div className="effects-list">
                      {item.effect.energy && (
                        <span className={`effect ${item.effect.energy > 0 ? 'positive' : 'negative'}`}>
                          Energy: {item.effect.energy > 0 ? '+' : ''}{item.effect.energy}
                        </span>
                      )}
                      {item.effect.happiness && (
                        <span className={`effect ${item.effect.happiness > 0 ? 'positive' : 'negative'}`}>
                          Happiness: {item.effect.happiness > 0 ? '+' : ''}{item.effect.happiness}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="item-footer">
                    <div className="item-price">{item.price} coins</div>
                    {isOwned(item.id) ? (
                      <button className="glass-btn owned" disabled>
                        ✓ Owned
                      </button>
                    ) : (
                      <button 
                        className={`glass-btn ${currency >= item.price ? 'primary' : 'disabled'}`}
                        onClick={() => handlePurchase(item)}
                        disabled={currency < item.price}
                      >
                        {currency >= item.price ? 'Buy' : 'Need More Coins'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
