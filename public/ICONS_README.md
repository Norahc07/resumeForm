# PWA Icons Required

This directory needs two icon files for the PWA to work properly:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

## How to Create Icons

### Option 1: Online Tools
- [PWA Asset Generator](https://www.pwabuilder.com/imageGenerator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)
- [Favicon.io](https://favicon.io/)

### Option 2: Image Editor
1. Create a square image (at least 512x512)
2. Export as PNG
3. Resize to create both sizes
4. Save as `icon-192.png` and `icon-512.png`

### Option 3: Use a Logo
If you have a logo:
1. Open in image editor
2. Resize to 512x512 (maintain aspect ratio, add padding if needed)
3. Export as PNG
4. Create 192x192 version

## Icon Design Tips
- Use simple, recognizable designs
- Ensure icons work at small sizes
- Use high contrast colors
- Test on different backgrounds
- Consider maskable icons (works with transparent backgrounds)

Once created, place both files in the `public/` directory.

