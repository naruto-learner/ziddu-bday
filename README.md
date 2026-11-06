# 🎂 Happy 3rd Birthday Website

A magical, mobile-first birthday celebration website for a special 3-year-old! Deployable to GitHub Pages with zero configuration.

## ✨ Features

- 🎈 **Interactive Birthday Cake** - Tap to blow out candles (with microphone blow detection!)
- 🌈 **Animated Wishes Carousel** - Swipe through magical birthday messages
- 🎨 **Photo Gallery** - Tap photos to make them dance
- 💌 **Guestbook** - Visitors can leave birthday wishes (saved locally)
- 🎊 **Confetti Celebrations** - Beautiful particle animations throughout
- 📱 **Mobile-First** - Optimized for touch, works great on all devices
- 🌐 **PWA Ready** - Installable, works offline with Service Worker
- ♿ **Accessible** - Semantic HTML, keyboard navigation, reduced motion support
- 🎵 **Audio Feedback** - Cheerful sounds for interactions

## 🚀 Quick Deploy to GitHub Pages

### Option 1: Automatic (Recommended)

1. **Create a new repository** on GitHub named `birthday-website` (or any name)
2. **Push these files** to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial birthday website"
   git branch -M main
   git remote add origin https://github.com/YOURUSERNAME/birthday-website.git
   git push -u origin main
   ```
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Source: "Deploy from a branch"
   - Branch: `main` / `(root)`
   - Click Save
4. **Your site will be live at**: `https://YOURUSERNAME.github.io/birthday-website/`

### Option 2: GitHub Actions (Auto-deploy on push)

Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/configure-pages@v4
      - uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      - uses: actions/deploy-pages@v4
```

## 🎨 Customization

### Change the Name
Edit `index.html`:
```html
<p class="birthday-name">Little Star ✨</p>
```
Replace "Little Star" with the child's name.

### Add Real Photos
Replace the placeholder gallery items in `index.html`:
```html
<div class="gallery-item" tabindex="0" role="button" aria-label="Photo description">
    <img src="photos/photo1.jpg" alt="Description" loading="lazy">
    <p class="photo-caption">Caption</p>
</div>
```
Add your photos to a `photos/` folder.

### Change Colors
Edit CSS variables in `style.css`:
```css
:root {
    --accent-pink: #ff6b9d;    /* Main pink */
    --accent-blue: #4ecdc4;    /* Teal accent */
    --accent-yellow: #ffe66d;  /* Yellow accent */
    --accent-purple: #c471ed;  /* Purple accent */
    --accent-orange: #ff9f43;  /* Orange accent */
}
```

### Modify Wishes
Edit the wish cards in `index.html`:
```html
<div class="wish-card" data-wish="1">
    <div class="wish-icon">🌈</div>
    <p class="wish-text">Your custom message here!</p>
</div>
```

## 📁 Project Structure

```
birthday-website/
├── index.html          # Main HTML file
├── style.css           # All styles (mobile-first)
├── script.js           # Interactive functionality
├── sw.js               # Service Worker (offline support)
├── manifest.json       # PWA manifest
├── icons/              # App icons (create your own!)
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png
│   ├── icon-384.png
│   └── icon-512.png
├── photos/             # Add your photos here (optional)
└── README.md           # This file
```

## 📱 Mobile Features

- **Touch Optimized** - All interactions work with tap, swipe, long-press
- **Viewport Safe** - Respects safe area insets (notches, home indicators)
- **Install Prompt** - "Add to Home Screen" works on iOS Safari & Android Chrome
- **Offline Ready** - Service Worker caches everything for offline viewing
- **Landscape Support** - Works in both orientations

## ♿ Accessibility

- Semantic HTML5 structure
- ARIA labels and roles
- Keyboard navigation support
- Focus visible states
- Reduced motion support (`prefers-reduced-motion`)
- High contrast mode support
- Screen reader friendly

## 🛠 Local Development

```bash
# Using Python
python3 -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```
Then open `http://localhost:8000`

## 🌐 Browser Support

| Browser | Version |
|---------|---------|
| Chrome  | 80+     |
| Firefox | 75+     |
| Safari  | 14+     |
| Edge    | 80+     |
| Samsung Internet | 13+ |

## 📄 License

MIT License - Feel free to use for your own celebrations!

## 💖 Made with Love

Created for a very special 3-year-old's birthday. Hope it brings smiles! 🎂✨