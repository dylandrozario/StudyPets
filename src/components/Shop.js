import React from 'react';
import { Link } from 'react-router-dom';
import './shared/PageStyles.css';

const Shop = () => {
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
            
            <div className="shop-grid">
              <div className="glass-card">
                <h3>🍎 Food</h3>
                <p>Feed your pet to increase energy and happiness</p>
                <div className="item-price">10 coins</div>
                <button className="glass-btn primary">Buy</button>
              </div>
              <div className="glass-card">
                <h3>🎾 Toys</h3>
                <p>Play with your pet to increase happiness</p>
                <div className="item-price">15 coins</div>
                <button className="glass-btn primary">Buy</button>
              </div>
              <div className="glass-card">
                <h3>🛏️ Bed</h3>
                <p>Let your pet rest to restore energy</p>
                <div className="item-price">25 coins</div>
                <button className="glass-btn primary">Buy</button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Shop;
