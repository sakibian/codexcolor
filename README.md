# CodexColor

A modern color utility library for developers and designers.

## Features

- Color conversion between multiple formats (HEX, RGB, HSL, HSV)
- Color manipulation (lighten, darken, saturate, etc.)
- Color palette generation
- Accessibility contrast checking
- Color harmony calculations

## Installation

```bash
npm install codexcolor
```

## Usage

```javascript
import { Color } from 'codexcolor';

const color = new Color('#3498db');
console.log(color.toRGB()); // rgb(52, 152, 219)
console.log(color.lighten(0.2)); // Lighten by 20%
```

## License

MIT
