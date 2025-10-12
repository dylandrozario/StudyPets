# StudyPets - Focus Tracking with Virtual Pet

A beautiful, interactive web application that helps you stay focused while studying by taking care of a virtual pet. Built with vanilla HTML, CSS, and JavaScript featuring a stunning liquid glass UI design.

## Features

- **Virtual Pet System**: Take care of your pet by staying focused and maintaining good study habits
- **Focus Tracking**: Monitor your study sessions and productivity levels
- **Analytics Dashboard**: Detailed insights into your study patterns and progress
- **Achievement System**: Unlock rewards and milestones as you build consistent habits
- **Shop System**: Earn coins by studying and spend them on items to keep your pet happy
- **Calendar Integration**: Track your study schedule and sessions
- **Liquid Glass UI**: Beautiful, modern interface with frosted glass effects

## Project Structure

```
studypets/
├── index.html                    # Root redirect page
├── README.md                     # Project documentation
├── .gitignore                    # Git ignore file
└── src/
    ├── package.json              # Project dependencies
    └── frontend/
        ├── index.html            # Welcome/landing page
        ├── shared/
        │   └── styles.css        # Shared CSS styles
        ├── dashboard/
        │   ├── index.html        # Main dashboard page
        │   └── script.js         # Dashboard functionality
        ├── analytics/
        │   ├── analytics.html    # Analytics page
        │   └── analytics.js      # Analytics functionality
        ├── calendar/
        │   ├── calendar.html     # Calendar page
        │   └── calendar.js       # Calendar functionality
        ├── achievements/
        │   ├── achievements.html # Achievements page
        │   └── achievements.js   # Achievements functionality
        ├── settings/
        │   ├── settings.html     # Settings page
        │   └── settings.js       # Settings functionality
        └── shop/
            ├── shop.html         # Shop page
            └── shop.js           # Shop functionality
```

## Pages Overview

###  Dashboard (`src/frontend/dashboard/`)
- Main pet interface with happiness, energy, and focus stats
- Study session tracking and timers
- Pet interaction buttons (feed, play, rest)
- Real-time focus monitoring
- Currency display and earning system

### Analytics (`src/frontend/analytics/`)
- Study time charts and graphs
- Focus percentage tracking
- Productivity metrics
- Historical data visualization
- Performance insights

### 📅 Calendar (`src/frontend/calendar/`)
- Study session scheduling
- Daily/weekly/monthly views
- Session history tracking
- Goal setting and planning

### 🏆 Achievements (`src/frontend/achievements/`)
- Milestone tracking
- Progress indicators
- Reward system
- Achievement categories

### 🛍️ Shop (`src/frontend/shop/`)
- Item categories (Food, Toys, Accessories)
- Currency-based purchasing
- Inventory management
- Item effects on pet stats

### ⚙️ Settings (`src/frontend/settings/`)
- User preferences
- Pet customization
- Notification settings
- Data management

## 🎨 Design Features

- **Liquid Glass UI**: Frosted glass effects with backdrop blur
- **Gradient Backgrounds**: Dynamic, colorful blob animations
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and hover effects
- **Modern Typography**: Inter font family for clean readability

## 🛠️ Technologies Used

- **HTML5**: Semantic markup and structure
- **CSS3**: Advanced styling with backdrop-filter, gradients, and animations
- **Vanilla JavaScript**: No frameworks, pure ES6+ JavaScript
- **LocalStorage**: Persistent data storage for user progress
- **Canvas API**: Custom chart rendering for analytics

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd studypets
   ```

2. **Start a local server**
   ```bash
   # Using Python
   python3 -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   Navigate to `http://localhost:8000` (will redirect to the frontend)

## 💡 Usage Tips

- **Stay Focused**: The pet's happiness depends on your focus levels
- **Earn Currency**: Study for 30 seconds to earn 5 coins
- **Use Items**: Purchase and use items from the shop to boost your pet
- **Track Progress**: Check analytics regularly to monitor your study habits
- **Set Goals**: Use the calendar to plan and track your study sessions

## 🎮 Game Mechanics

### Pet Stats
- **Happiness**: Increases with focused study time, decreases when unfocused
- **Energy**: Natural regeneration, affected by activities and items
- **Focus**: Real-time tracking of your attention levels

### Currency System
- **Earning**: 5 coins every 30 seconds of focused study
- **Spending**: Purchase items to improve pet stats
- **Persistence**: Currency is saved across sessions

### Items & Effects
- **Food**: Restore happiness and energy
- **Toys**: Provide entertainment and stat boosts
- **Accessories**: Permanent stat improvements

## 🔧 Customization

The application is built with modularity in mind. Each page has its own folder with dedicated HTML, CSS, and JavaScript files. Shared styles are in the `shared/` folder for consistency.

## 📱 Browser Support

- Chrome 76+
- Firefox 70+
- Safari 13+
- Edge 79+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- Inspired by productivity apps and virtual pet games
- UI design influenced by iOS 26 liquid glass aesthetic
- Built with modern web technologies and best practices

---

**Happy Studying! 🎓🐾**
