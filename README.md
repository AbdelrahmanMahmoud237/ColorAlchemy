# ColorAlchemy

A robust, dependency-free JavaScript library for color manipulation, conversion, and accessibility analysis.

## Features

- **Universal Parsing**: Handles Hex (`#FFF`, `#FFFFFF`), RGB strings (`rgb(255, 0, 0)`), HSL strings (`hsl(0, 100%, 50%)`), and Objects (`{r: 255, g: 0, b:0}`).
- **Conversions**: Convert seamlessly between RGB, Hex, HSL, HSV, and CMYK.
- **Manipulation**: Lighten, Darken, Saturate, Desaturate, Rotate Hue, and set Alpha transparency.
- **Accessibility**: Built-in WCAG contrast ratio calculations and AA/AAA compliance checks.
- **Palette Generation**: Automatically generate Complementary, Analogous, Triadic, Tetradic, and Split-Complementary color harmonies.

## Installation

```bash
npm install color-alchemy
```

## Real-World Use Case: Automated Theme Generation

One of the most powerful features is the ability to generate entire design systems from a single brand color. The library can automatically create interactive states (hover/active) and ensure text accessibility.

```javascript
import { Color } from 'color-alchemy';

function generateTheme(brandHex) {
  const primary = new Color(brandHex);
  const white = new Color('#ffffff');
  const black = new Color('#000000');

  // Automatically determine if white or black text is more readable
  const textColor = primary.contrast(white) >= 4.5 ? '#ffffff' : '#000000';

  return {
    brand: primary.toHex(),
    // Generate consistent hover/active states mathmatically
    hover: primary.clone().lighten(10).toHex(),
    active: primary.clone().darken(10).toHex(),
    // Accessible text color
    textOnPrimary: textColor,
    // Generate a harmonious accent color
    accent: primary.complementary()[0].toHex()
  };
}

const myTheme = generateTheme('#6b2c91');
console.log(myTheme);
/*
Output:
{
  brand: "#6b2c91",
  hover: "#8738b7",
  active: "#4d2069",
  textOnPrimary: "#ffffff",
  accent: "#53902c"
}
*/
```

## API Reference

### Constructor

#### `new Color(input)`
Creates a new color instance.
- **input**: `string` (Hex, RGB, HSL) or `object` ({r, g, b, a}).
- **Example**: `new Color('#ff0000')` or `new Color('rgb(255, 0, 0)')`.

### Conversion Methods

| Method | Description | Return Format |
|--------|-------------|---------------|
| `toHex()` | Returns the Hex representation. | `"#ff0000"` |
| `toRgb()` | Returns the RGB object. | `{ r: 255, g: 0, b: 0, a: 1 }` |
| `toHsl()` | Returns the HSL object. | `{ h: 0, s: 100, l: 50, a: 1 }` |
| `toHsv()` | Returns the HSV object. | `{ h: 0, s: 100, v: 100, a: 1 }` |
| `toCmyk()` | Returns the CMYK object. | `{ c: 0, m: 100, y: 100, k: 0 }` |

### Manipulation Methods
All manipulation methods return the `Color` instance itself (chainable), except those that return palettes.

- **`lighten(amount)`**: Lightens the color by a percentage (0-100).
- **`darken(amount)`**: Darkens the color by a percentage (0-100).
- **`saturate(amount)`**: Increases saturation by a percentage (0-100).
- **`desaturate(amount)`**: Decreases saturation by a percentage (0-100).
- **`rotate(degrees)`**: Rotates the hue by degrees (0-360).
- **`setAlpha(value)`**: Sets the alpha transparency (0-1).
- **`clone()`**: Returns a new new independent instance of the current color.

### Accessibility Tools

- **`getLuminance()`**: Returns the relative luminance (0 to 1).
- **`contrast(otherColor)`**: Returns the contrast ratio between this color and another (1 to 21).
  - *Example*: `color.contrast(new Color('#fff'))`
- **`isAccessible(otherColor, level, size)`**: Returns `true` if the contrast meets WCAG standards.
  - **level**: `'AA'` (default) or `'AAA'`.
  - **size**: `'small'` (default) or `'large'`.

### Palette Generation
These methods return an **Array** of new `Color` instances.

- **`complementary()`**: Returns 1 color (180° rotation).
- **`analogous()`**: Returns 2 colors (-30° and +30°).
- **`triadic()`**: Returns 2 colors (120° and 240°).
- **`tetradic()`**: Returns 3 colors (90°, 180°, 270°).
- **`splitComplementary()`**: Returns 2 colors (150° and 210°).

## License

ISC
