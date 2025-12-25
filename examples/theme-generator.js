import { Color } from '../src/index.js';

function generateTheme(brandHex) {
    const primary = new Color(brandHex);

    // 1. Generate State Variants
    const hover = primary.clone().lighten(10);
    const active = primary.clone().darken(10);
    const disabled = primary.clone().desaturate(50).setAlpha(0.5);

    // 2. Determine Accessible Text Color (for buttons)
    const white = new Color('#ffffff');
    const black = new Color('#000000');
    // Check contrast against white; if poor, use black.
    const textColor = primary.contrast(white) >= 4.5 ? white : black;

    // 3. Generate Accent Color (Complementary)
    const accent = primary.complementary()[0];

    // 4. Generate Background Shades (Tints)
    const background = primary.clone().setAlpha(0.1); // Subtle tint

    return {
        brand: primary.toHex(),
        states: {
            hover: hover.toHex(),
            active: active.toHex(),
            disabled: disabled.toRgb(), // Object with alpha
        },
        text: {
            onPrimary: textColor.toHex(),
        },
        accent: accent.toHex(),
        ui: {
            backgroundTint: background.toRgb()
        }
    };
}

// Example: "Deep Purple" Brand Color
const theme = generateTheme('#6b2c91');
console.log('Generated Theme System:', JSON.stringify(theme, null, 2));

// Example: "Bright Yellow" Brand Color (should trigger black text)
const yellowTheme = generateTheme('#f1c40f');
console.log('\nGenerated Yellow Theme:', JSON.stringify(yellowTheme, null, 2));
