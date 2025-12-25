import { describe, it, expect } from 'vitest';
import { Color } from '../src/Color';

describe('Color Class', () => {
    it('should default to black transparent if no input', () => {
        const c = new Color();
        expect(c.toRgb()).toEqual({ r: 0, g: 0, b: 0, a: 1 });
    });

    it('should parse 6-digit hex', () => {
        const c = new Color('#ff0000');
        expect(c.toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });
    });

    it('should output hex correctly', () => {
        const c = new Color('#00ff00');
        expect(c.toHex()).toBe('#00ff00');
    });

    it('should parse rgb string', () => {
        const c = new Color('rgb(0, 255, 0)');
        expect(c.toRgb()).toEqual({ r: 0, g: 255, b: 0, a: 1 });
    });

    it('should parse rgba string', () => {
        const c = new Color('rgba(0, 0, 255, 0.5)');
        expect(c.toRgb()).toEqual({ r: 0, g: 0, b: 255, a: 0.5 });
    });

    it('should parse object input', () => {
        const c = new Color({ r: 100, g: 100, b: 100, a: 0.8 });
        expect(c.toRgb()).toEqual({ r: 100, g: 100, b: 100, a: 0.8 });
    });

    it('should convert to HSL', () => {
        const c = new Color('#ff0000');
        expect(c.toHsl()).toEqual({ h: 0, s: 100, l: 50, a: 1 });
    });

    it('should convert to HSV', () => {
        const c = new Color('#00ff00');
        expect(c.toHsv()).toEqual({ h: 120, s: 100, v: 100, a: 1 });
    });

    it('should convert to CMYK', () => {
        const c = new Color('#000000'); // black
        expect(c.toCmyk()).toEqual({ c: 0, m: 0, y: 0, k: 100 });
    });

    it('should lighten color', () => {
        const c = new Color('hsl(0, 100%, 50%)'); // red
        c.lighten(10);
        const hsl = c.toHsl();
        expect(hsl.l).toBe(60);
    });

    it('should darken color', () => {
        const c = new Color('hsl(0, 100%, 50%)');
        c.darken(10);
        const hsl = c.toHsl();
        expect(hsl.l).toBe(40);
    });

    it('should saturate color', () => {
        const c = new Color('hsl(0, 50%, 50%)');
        c.saturate(10);
        const hsl = c.toHsl();
        expect(hsl.s).toBe(60);
    });

    it('should rotate hue', () => {
        const c = new Color('hsl(0, 100%, 50%)');
        c.rotate(180);
        const hsl = c.toHsl();
        expect(hsl.h).toBe(180);
        // Should be cyan-ish
        expect(c.toHex()).toBe('#00ffff');
    });

    it('should set alpha', () => {
        const c = new Color('#000000');
        c.setAlpha(0.5);
        expect(c.a).toBe(0.5);
    });

    it('should calculate luminance', () => {
        const white = new Color('#ffffff');
        const black = new Color('#000000');
        expect(white.getLuminance()).toBe(1);
        expect(black.getLuminance()).toBe(0);
    });

    it('should calculate contrast ratio', () => {
        const white = new Color('#ffffff');
        const black = new Color('#000000');
        expect(white.contrast(black)).toBe(21);
    });

    it('should check accessibility', () => {
        const white = new Color('#ffffff');
        const black = new Color('#000000');
        expect(white.isAccessible(black, 'AA')).toBe(true);
        expect(white.isAccessible(black, 'AAA')).toBe(true);

        const gray = new Color('#888888');
        // Contrast between white and #888888 is approx 3.54
        expect(white.isAccessible(gray, 'AA', 'large')).toBe(true); // > 3.0
        expect(white.isAccessible(gray, 'AA', 'small')).toBe(false); // < 4.5
    });

    it('should generate complementary palette', () => {
        const c = new Color('hsl(0, 100%, 50%)'); // Red
        const palette = c.complementary();
        expect(palette.length).toBe(1);
        expect(palette[0].toHsl().h).toBe(180); // Cyan
    });

    it('should generate analogous palette', () => {
        const c = new Color('hsl(0, 100%, 50%)');
        const palette = c.analogous();
        expect(palette.length).toBe(2);
        // -30 (330) and +30
        const hues = palette.map(c => c.toHsl().h).sort((a, b) => a - b);
        expect(hues).toEqual([30, 330]);
    });

    it('should generate triadic palette', () => {
        const c = new Color('hsl(0, 100%, 50%)');
        const palette = c.triadic();
        expect(palette.length).toBe(2);
        const hues = palette.map(c => c.toHsl().h).sort((a, b) => a - b);
        expect(hues).toEqual([120, 240]);
    });

});
