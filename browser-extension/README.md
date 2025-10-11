# StudyPets Website Blocker Extension

A Chrome browser extension that blocks entertainment websites based on your StudyPets pet levels. This extension works system-wide and can intercept all navigation attempts to blocked sites.

## 🚀 Features

- **System-wide blocking**: Blocks entertainment sites across all browser tabs
- **Pet-level based**: Only blocks when your pet's happiness, energy, and focus are below thresholds
- **Real-time sync**: Automatically syncs with your StudyPets web app
- **Beautiful UI**: Glassmorphism design matching StudyPets aesthetic
- **Smart tracking**: Records blocked attempts and force navigations
- **Configurable**: Customize thresholds and blocked site lists

## 📦 Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download the extension files** to your computer
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer mode** (toggle in top right)
4. **Click "Load unpacked"** and select the `browser-extension` folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Install from Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store once published.

## ⚙️ Setup

### 1. Start StudyPets Web App

Make sure your StudyPets web app is running on `http://localhost:8000`

### 2. Configure Settings

1. **Open StudyPets** in your browser
2. **Go to Settings** → Website Blocking
3. **Enable Smart Blocking**
4. **Set your thresholds**:
   - Happiness Threshold (default: 70%)
   - Energy Threshold (default: 60%)
   - Focus Threshold (default: 80%)
5. **Manage blocked sites** list

### 3. Extension Auto-Sync

The extension automatically syncs with your StudyPets settings and pet stats. No manual configuration needed!

## 🎮 How It Works

### Blocking Logic

1. **Pet Level Check**: Extension monitors your pet's happiness, energy, and focus levels
2. **Threshold Comparison**: Compares current levels to your set thresholds
3. **Smart Blocking**: Blocks entertainment sites when ANY threshold isn't met
4. **Auto-Unblock**: Automatically allows access when all thresholds are satisfied

### Blocked Sites

Default entertainment sites include:
- YouTube, TikTok, Twitter, Instagram
- Netflix, Reddit, Twitch, Discord
- Facebook, Snapchat, Pinterest
- And many more...

You can customize this list in StudyPets settings.

## 🖥️ Extension Interface

### Popup (Click Extension Icon)

- **Status Indicator**: Shows if blocking is active (🚫) or allowed (✅)
- **Pet Status**: Current happiness, energy, and focus levels
- **Blocked Attempts**: Count of blocked navigation attempts
- **Quick Actions**: Open StudyPets, manage settings

### Blocked Page

When you try to visit a blocked site:
- **Beautiful blocking page** with pet status
- **Level requirements** shown with color coding
- **Action buttons**: Study to improve, go to dashboard, or force navigate
- **Helpful tips** for improving pet levels

## 🔧 Technical Details

### Permissions Required

- `webRequest`: Intercept and block web requests
- `webRequestBlocking`: Actually block the requests
- `storage`: Store settings and pet stats
- `activeTab`: Access current tab information
- `tabs`: Create new tabs for StudyPets
- `<all_urls>`: Monitor all websites

### Data Storage

The extension stores:
- StudyPets settings and pet stats
- Blocked attempt history
- Force navigation tracking
- All data is stored locally in Chrome's storage

### Security

- **No external servers**: All data stays on your device
- **No tracking**: Extension doesn't send data anywhere
- **Open source**: Code is available for review
- **Minimal permissions**: Only requests necessary permissions

## 🛠️ Development

### File Structure

```
browser-extension/
├── manifest.json          # Extension configuration
├── background.js          # Background service worker
├── content.js            # Content script for StudyPets sync
├── popup.html            # Extension popup UI
├── popup.css             # Popup styles
├── popup.js              # Popup functionality
├── blocked-page.html     # Blocked site page
├── blocked-page.css      # Blocked page styles
├── blocked-page.js       # Blocked page functionality
└── README.md             # This file
```

### Building

No build process required - the extension uses vanilla JavaScript and CSS.

### Testing

1. Load the extension in developer mode
2. Start StudyPets web app
3. Lower pet levels below thresholds
4. Try visiting entertainment sites
5. Verify blocking works correctly

## 🐛 Troubleshooting

### Extension Not Blocking Sites

1. **Check StudyPets is running** on localhost:8000
2. **Verify smart blocking is enabled** in StudyPets settings
3. **Check pet levels** are below thresholds
4. **Reload the extension** in chrome://extensions/

### Sync Issues

1. **Refresh StudyPets page** to trigger sync
2. **Check browser console** for error messages
3. **Restart Chrome** if sync persists

### Permission Issues

1. **Check extension permissions** in chrome://extensions/
2. **Ensure all permissions are granted**
3. **Reload the extension** if needed

## 📊 Analytics

The extension tracks:
- **Blocked attempts**: When sites are blocked
- **Force navigations**: When users bypass blocking
- **Pet stats at time of blocking**: For behavior analysis

This data helps you understand your browsing patterns and pet care habits.

## 🔄 Updates

The extension will automatically update when you update the StudyPets web app. No manual updates needed!

## 🤝 Contributing

To contribute to the extension:

1. **Fork the repository**
2. **Make your changes**
3. **Test thoroughly**
4. **Submit a pull request**

## 📄 License

This extension is part of the StudyPets project and follows the same license terms.

## 🆘 Support

If you encounter issues:

1. **Check this README** for troubleshooting steps
2. **Review browser console** for error messages
3. **Check StudyPets web app** is working correctly
4. **Submit an issue** on the StudyPets repository

---

**Happy studying! 🎓🐾**
