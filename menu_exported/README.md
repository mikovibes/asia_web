# Béo Ăn Menu Component

This folder contains the fully extracted, standalone "Menu" component from the Béo Ăn website, ready to be dropped into any React project.

## Quick Start (Previewing)

You don't need to install anything to see it working!
1. Start a local server in this directory to get around CORS issues with loading local JSON:
   ```bash
   npx serve .
   ```
   *(Or use any local server like Python's `python -m http.server 8000`)*
2. Open the URL provided to view `index.html`. It loads React, GSAP, and Tailwind via CDN and compiles the JSX directly in your browser.

## Using it in your React Project

### 1. Copy the Files
Copy the `src` folder from this directory into your project's `src` folder:
- `src/components/MenuGrid.jsx` (The React Component)
- `src/data/menu_data.json` (The Menu Content Data)
- `src/styles/menu-styles.css` (The Custom Fonts and Styles)

### 2. Install Dependencies
Make sure you have GSAP installed since the menu relies heavily on it for scroll animations.
```bash
npm install gsap
```

### 3. Tailwind Configuration
The component utilizes Tailwind CSS. Ensure your `tailwind.config.js` is set up to read from your components folder and includes these custom colors and fonts in the `extend` block:

```javascript
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'beo-yellow': '#fed43d',
        'beo-blue': '#386ad2',
        'beo-black': '#111827',
      },
      fontFamily: {
        cartoon: ['DynaPuff', 'sans-serif'],
        nunito: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

### 4. Global Styles & Fonts
Import the `menu-styles.css` into your global CSS file (or `App.jsx`) to bring in the `DynaPuff` and `Nunito` Google fonts, as well as specific utility overrides (`text-cartoon`).

```javascript
// In App.jsx or main.jsx
import './styles/menu-styles.css';
```

### 5. Import and Mount!
Now you can import the `MenuGrid` and use it.

```jsx
import MenuGrid from './components/MenuGrid';

function App() {
  return (
    <div>
      {/* Your other page content */}
      <MenuGrid />
    </div>
  );
}

export default App;
```

## Features Deep Dive

- **Data-Driven:** The entire menu is rendered dynamically from `src/data/menu_data.json`. To add items, change prices, or tweak descriptions, simply edit that JSON file. No code changes needed!
- **GSAP ScrollTrigger:** As the user scrolls down, sections fade up (`y: 150` to `0`), and item separator lines scale out horizontally (`scaleX: 0` to `1`). The logic handles cleanup automatically on unmount.
- **Sticky Sidebar:** Categories like "Bánh Mì" use CSS `sticky` to remain on screen as the user browses through the items in that specific category on desktop.
- **Responsive:** Designed fully mobile-first using CSS Grid (`grid-cols-1` to `lg:grid-cols-12`).
