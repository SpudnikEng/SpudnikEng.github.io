# How to Preview and Edit HTML in Cursor

## Quick Start - Using npm (Recommended)

1. **Start the development server:**
   ```bash
   npm start
   ```
   This will:
   - Start a local server on port 8080
   - Automatically open your browser to `http://localhost:8080/index.html`
   - Serve all files from the HarvesterUI directory

2. **Make changes:**
   - Edit `index.html` or `lib.css` in Cursor
   - Save the file (Ctrl+S)
   - **Refresh your browser** (F5 or Ctrl+R) to see changes

3. **Stop the server:**
   - Press `Ctrl+C` in the terminal

## Alternative: Using Python

If you prefer Python, you can use:

```bash
# From the HarvesterUI directory
python -m http.server 8080
```

Then open: `http://localhost:8080/index.html` in your browser

## Alternative: Using Cursor's Built-in Preview

1. Open `index.html` in Cursor
2. Press `Ctrl+Shift+V` (or `Cmd+Shift+V` on Mac)
3. This opens a simple browser preview

**Note:** The built-in preview may have limitations with local file paths. The server method is recommended.

## Tips for Live Development

- Keep the browser and Cursor side-by-side
- Use browser DevTools (F12) to inspect elements
- Changes to CSS/HTML require a browser refresh
- The server will continue running until you stop it (Ctrl+C)

