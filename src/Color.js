export class Color {
    constructor(input) {
        this.r = 0;
        this.g = 0;
        this.b = 0;
        this.a = 1;

        if (input) {
            this.parse(input);
        }
    }

    parse(input) {
        if (typeof input === 'string') {
            input = input.trim().toLowerCase();
            if (input.startsWith('#')) {
                const hex = input.substring(1);
                if (hex.length === 3) {
                    this.r = parseInt(hex[0] + hex[0], 16);
                    this.g = parseInt(hex[1] + hex[1], 16);
                    this.b = parseInt(hex[2] + hex[2], 16);
                } else if (hex.length === 6) {
                    this.r = parseInt(hex.substring(0, 2), 16);
                    this.g = parseInt(hex.substring(2, 4), 16);
                    this.b = parseInt(hex.substring(4, 6), 16);
                }
            } else if (input.startsWith('rgb')) {
                const parts = input.match(/[\d.]+/g);
                if (parts && parts.length >= 3) {
                    this.r = parseFloat(parts[0]);
                    this.g = parseFloat(parts[1]);
                    this.b = parseFloat(parts[2]);
                    if (parts.length > 3) this.a = parseFloat(parts[3]);
                }
            } else if (input.startsWith('hsl')) {
                const parts = input.match(/[\d.]+/g);
                if (parts && parts.length >= 3) {
                    const h = parseFloat(parts[0]);
                    const s = parseFloat(parts[1]);
                    const l = parseFloat(parts[2]);
                    const a = parts.length > 3 ? parseFloat(parts[3]) : 1;
                    this._updateFromHsl(h, s, l);
                    this.a = a;
                }
            }
        } else if (typeof input === 'object') {
            if (input.r !== undefined && input.g !== undefined && input.b !== undefined) {
                this.r = input.r;
                this.g = input.g;
                this.b = input.b;
                this.a = input.a !== undefined ? input.a : 1;
            }
        }
    }

    toHex() {
        const toHexPart = (v) => {
            const hex = Math.round(v).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHexPart(this.r)}${toHexPart(this.g)}${toHexPart(this.b)}`;
    }

    toRgb() {
        return { r: this.r, g: this.g, b: this.b, a: this.a };
    }

    toHsl() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100), a: this.a };
    }

    toHsv() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, v = max;
        const d = max - min;
        s = max === 0 ? 0 : d / max;

        if (max === min) {
            h = 0;
        } else {
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100), a: this.a };
    }

    toCmyk() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;
        const k = 1 - Math.max(r, g, b);
        if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
        const c = (1 - r - k) / (1 - k);
        const m = (1 - g - k) / (1 - k);
        const y = (1 - b - k) / (1 - k);
        return {
            c: Math.round(c * 100),
            m: Math.round(m * 100),
            y: Math.round(y * 100),
            k: Math.round(k * 100)
        };
    }

    // Manipulations
    _updateFromHsl(h, s, l) {
        s /= 100;
        l /= 100;
        let c = (1 - Math.abs(2 * l - 1)) * s,
            x = c * (1 - Math.abs(((h / 60) % 2) - 1)),
            m = l - c / 2,
            r = 0,
            g = 0,
            b = 0;

        if (0 <= h && h < 60) {
            r = c;
            g = x;
            b = 0;
        } else if (60 <= h && h < 120) {
            r = x;
            g = c;
            b = 0;
        } else if (120 <= h && h < 180) {
            r = 0;
            g = c;
            b = x;
        } else if (180 <= h && h < 240) {
            r = 0;
            g = x;
            b = c;
        } else if (240 <= h && h < 300) {
            r = x;
            g = 0;
            b = c;
        } else if (300 <= h && h < 360) {
            r = c;
            g = 0;
            b = x;
        }
        this.r = Math.round((r + m) * 255);
        this.g = Math.round((g + m) * 255);
        this.b = Math.round((b + m) * 255);
    }

    lighten(amount) {
        const hsl = this.toHsl();
        hsl.l = Math.min(100, Math.max(0, hsl.l + amount));
        this._updateFromHsl(hsl.h, hsl.s, hsl.l);
        return this;
    }

    darken(amount) {
        return this.lighten(-amount);
    }

    saturate(amount) {
        const hsl = this.toHsl();
        hsl.s = Math.min(100, Math.max(0, hsl.s + amount));
        this._updateFromHsl(hsl.h, hsl.s, hsl.l);
        return this;
    }

    desaturate(amount) {
        return this.saturate(-amount);
    }

    rotate(degrees) {
        const hsl = this.toHsl();
        hsl.h = (hsl.h + degrees) % 360;
        if (hsl.h < 0) hsl.h += 360;
        this._updateFromHsl(hsl.h, hsl.s, hsl.l);
        return this;
    }

    setAlpha(value) {
        this.a = Math.min(1, Math.max(0, value));
        return this;
    }

    // Accessibility
    getLuminance() {
        // Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
        // Linearized RGB
        const normalize = (v) => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        };
        const r = normalize(this.r);
        const g = normalize(this.g);
        const b = normalize(this.b);
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    contrast(otherColor) {
        if (!(otherColor instanceof Color)) {
            otherColor = new Color(otherColor);
        }
        const l1 = this.getLuminance();
        const l2 = otherColor.getLuminance();
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }

    isAccessible(otherColor, level = 'AA', size = 'small') {
        const ratio = this.contrast(otherColor);
        if (level === 'AAA') {
            return size === 'large' ? ratio >= 4.5 : ratio >= 7;
        } else {
            // AA
            return size === 'large' ? ratio >= 3 : ratio >= 4.5;
        }
    }

    // Palettes
    complementary() {
        return [this.clone().rotate(180)];
    }

    analogous() {
        return [
            this.clone().rotate(-30),
            this.clone().rotate(30)
        ];
    }

    triadic() {
        return [
            this.clone().rotate(120),
            this.clone().rotate(240)
        ];
    }

    tetradic() {
        return [
            this.clone().rotate(90),
            this.clone().rotate(180),
            this.clone().rotate(270)
        ];
    }

    splitComplementary() {
        return [
            this.clone().rotate(150),
            this.clone().rotate(210)
        ];
    }

    clone() {
        return new Color(this.toRgb());
    }
}
