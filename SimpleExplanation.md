# How ColorAlchemy Works (Simple Guide)

Think of this tool like a **Universal Translator** for colors.

## 1. The "Universal Language" (RGB)
Computers speak in "Red, Green, Blue" (RGB). Humans speak in many ways:
- "Red"
- "#ff0000" (Hex code)
- "hsl(0, 100%, 50%)" (Hue, Saturation, Lightness)

When you give a color to this utility, the first thing it does is **translate it into simple Red, Green, and Blue numbers**.
- **You give it:** `hsl(0, 100%, 50%)`
- **It saves:** `Red: 255, Green: 0, Blue: 0`

It *only* remembers these three numbers. This is its "source of truth."

## 2. Converting (The Calculator)
When you ask it to convert a color (like "Give me the CMYK for this"), it doesn't look it up in a book. It uses a **mathematical formula** on those saved Red, Green, and Blue numbers to calculate the answer right at that moment.

## 3. The "Lightening" Trick (Manipulation)
Computers are actually bad at "lightening" Red/Green/Blue numbers directly—the color often gets washed out.

So, when you say "Lighten this color by 10%," the utility does a smart trick:
1. It temporarily looks at the color as **HSL** (Hue, Saturation, **Lightness**).
2. It takes the **"L"** (Lightness) number and adds 10 to it.
3. It converts that result *back* into Red/Green/Blue and saves it.

This ensures the color gets brighter in a way that looks natural to the human eye.

## 4. The "Mathematical Eye" (Accessibility)
To check if text is readable on a background, the tool simulates a human eye.
- Humans see **Green** as much brighter than **Blue**.
- The tool uses a special formula (from the Web Accessibility Guidelines) to give every color a "Brightness Score" from 0.0 to 1.0.
- It compares the score of your text vs. your background.
- If the difference is big enough, it gives you a "Pass" (Accessible). If they are too similar, it gives you a "Fail."
