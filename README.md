# Pokédex

Pokédex is a static vanilla HTML/CSS/JavaScript project that displays Pokémon from all 9 generations using local JSON data. The site includes search, filter, expand/collapse UI controls, a dark mode toggle, and a modal that shows Pokémon TCG cards fetched from the official Pokémon TCG API.

## Key Features

- Full Pokédex listing for 9 generations
- Search by name or number
- Filter by Pokémon type and generation
- Expand/collapse generation sections
- Light/dark theme toggle
- Pokémon TCG card modal with persistent localStorage caching
- Modular front-end structure for easier maintenance

## Project Structure

- `index.html` — main static page
- `assets/css/` — split CSS modules:
  - `reset.css`
  - `variables.css`
  - `base.css`
  - `layout.css`
  - `theme.css`
  - `components.css`
  - `modal.css`
  - `scrollbar.css`
- `assets/js/` — modular JavaScript:
  - `app.js` — main application logic
  - `components/` — UI card component
  - `services/` — data loading and TCG API caching
  - `utils/` — helper utilities
- `data/` — local generation JSON files used by the app
- `tools/translation/` — translation and generation scripts moved out of the root

## Local Development

This is a static site and works best when served by a local web server.

### Using Python 3

1. Open a command prompt in the project root:
   ```powershell
   cd c:\Users\T-GAMER\Documents\pokedex
   python -m http.server 8000
   ```
2. Open your browser at `http://localhost:8000`

### Using Node.js http-server

If you have Node.js installed:

```powershell
npm install -g http-server
http-server -p 8000
```

Then open `http://localhost:8000`.

## Deployment

This project can be deployed as a static site to any web host.

### GitHub Pages

1. Push the repository to GitHub.
2. In the repository settings, enable **GitHub Pages** using the `main` branch root.
3. The site will be served from `https://<username>.github.io/<repository>/`.

### Static Hosting

Any static hosting provider works, such as Netlify, Vercel, or Azure Static Web Apps. Point the deployment root to the project folder containing `index.html`.

## Translation Tools

Translation scripts are now organized in `tools/translation/`:

- `force_translate_all.py`
- `generate_all_generations.py`
- `translate_descriptions.py`
- `translate_remaining.py`
- `translation_output.log`

These scripts are separate from the front-end site and do not affect client-side behavior.

## Notes

- The TCG modal caches card images in localStorage to improve load speed.
- Generated data is loaded from `data/generation-*.json` files.
- The site is built with no bundler or build step required.
