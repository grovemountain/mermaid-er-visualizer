# Mermaid Database Visualizer

## Setup and Build Instructions

1. First time setup:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```
This will create the `dist` directory with `bundle.js`

3. Start the server:
```bash
npm start
```

## Development

For development with hot reload:
```bash
npm run dev
```

## Project Structure

Make sure you have these files in your directory:
- `/src/index.js` - Main application code
- `/index.html` - Main HTML file
- `/webpack.config.js` - Webpack configuration
- `/package.json` - Project dependencies
- `/diagrams/` - Your Mermaid diagram files

## Usage

Access the visualizer at:
http://localhost:8080?files=diagrams/your-diagram.mmd&exclude=EntityToExclude