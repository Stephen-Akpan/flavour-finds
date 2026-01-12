# FlavorFinds - Deployment Guide

## Quick Start

### Local Development
```bash
npm install
npm start
```

### Build for Production
```bash
npm run build
```

## Deployment Options

### GitHub Pages
```bash
npm run deploy
```

Live at: `https://Stephen-Akpan.github.io/flavour-finds`

### Vercel
```bash
npm install -g vercel
vercel
```

Live at: `https://flavour-finds.vercel.app`

### Netlify
1. Push to GitHub
2. Connect repo at netlify.com
3. Auto-deploys on push to main

Live at: `https://flavour-finds.netlify.app`

## Sharing with Testers

Share the live URL with testers:
- **GitHub Pages**: `https://Stephen-Akpan.github.io/flavour-finds`
- **Vercel**: `https://flavour-finds.vercel.app`
- **Netlify**: `https://flavour-finds.netlify.app`

## Build Output
- Production build: `./build/`
- Optimized and minified
- Ready for static hosting

## Environment Variables
If using API keys:
1. Add `.env` to `.gitignore`
2. Set secrets in hosting platform
3. Reference as `process.env.REACT_APP_*`

## Troubleshooting

### Build fails
```bash
npm ci  # Clean install
npm run build
```

### Routing issues on GitHub Pages
- Use HashRouter if needed
- Update `homepage` in package.json

### API key issues
- Set environment variables in platform settings
- Don't commit `.env` files
