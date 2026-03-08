# Glassmorphic Theme CSS Reference

# GlassThemes-FixedBg : Background and animation is 100vh - Yields better performance on long pages
# GlassTheme          : Background is absolute over the entire page height - Better aestethics

## How to Enable Theme Styles

```javascript
ThemeGenerator.init({
    colorTheme: 'aurora',    // Choose your theme
    applyThemeStyles: true   // Enable UI theme styles
});
```

## Available CSS Classes

### Container Classes
- `glass-container` - Basic glass container with backdrop blur
- `glass-box` - Same as container (alias)
- `glass-card` - Glass card style

### Text Classes
- `glass-text-primary` - Primary theme color text
- `glass-text-secondary` - Secondary theme color text
- `glass-text-accent` - Accent theme color text
- `glass-text-muted` - Muted text color
- `glass-label` - Form label styling

### Button Classes
- `glass-button` / `glass-btn` - Default glass button
- `glass-button-primary` / `glass-btn-primary` - Primary colored button

### Form Classes
- `glass-input` - Text input styling
- `glass-textarea` - Textarea styling
- `glass-select` - Select dropdown styling

### Alert Classes
- `glass-alert` - Basic alert container
- `glass-alert-error` - Error alert styling
- `glass-alert-success` - Success alert styling
- `glass-alert-warning` - Warning alert styling

### Badge Classes
- `glass-badge` - Primary badge
- `glass-badge-secondary` - Secondary badge
- `glass-badge-accent` - Accent badge

### Utility Classes
- `glass-divider` - Styled horizontal rule
- `glass-link` - Styled links
- `glass-bg-primary` - Primary background color
- `glass-bg-secondary` - Secondary background color
- `glass-bg-accent` - Accent background color

## CSS Custom Properties (Variables)

The theme system creates these CSS variables that you can use in your own styles:

```css
:root {
    --glass-primary: /* Primary theme color */
    --glass-secondary: /* Secondary theme color */
    --glass-accent: /* Accent theme color */
    --glass-text: /* Main text color */
    --glass-text-muted: /* Muted text color */
    --glass-bg: /* Glass background color */
    --glass-bg-hover: /* Glass background hover color */
    --glass-border: /* Glass border color */
    --glass-border-hover: /* Glass border hover color */
    --glass-shadow: /* Shadow color */
    --glass-error: /* Error color */
    --glass-success: /* Success color */
    --glass-warning: /* Warning color */
}
```

## Usage Examples

### Custom Styled Component
```css
.my-custom-card {
    background: var(--glass-bg);
    border: 2px solid var(--glass-primary);
    color: var(--glass-text);
    box-shadow: 0 4px 20px var(--glass-shadow);
}
```

### Override Specific Colors
```css
/* Override just the primary color for a specific element */
.special-button {
    background: var(--glass-accent);
    color: white;
}
```

### Combine with Your Own Styles
```html
<!-- Your structural classes + glass theme classes -->
<div class="my-layout-class glass-container">
    <h2 class="my-heading-style">Styled Heading</h2>
    <button class="my-button-size glass-btn-primary">
        Themed Button
    </button>
</div>
```

## Available Themes

Each theme provides a cohesive color palette:

- **aurora** - Vibrant neon greens and purples
- **ocean** - Cool blues and teals
- **sunset** - Warm oranges and pinks
- **forest** - Natural greens
- **galaxy** - Purple and pink cosmic colors
- **neon** - Bright electric colors
- **lavender** - Soft purple tones
- **fire** - Hot reds and oranges

## Tips

1. **Structural CSS stays separate** - The theme only provides colors, you control layout
2. **Mix and match** - Use theme classes where needed, skip them where you don't
3. **Easy overrides** - Use CSS variables in your custom styles
4. **Disable when needed** - Set `applyThemeStyles: false` for background only
5. **Custom themes** - Use `colorTheme: 'custom'` with `customColors` array