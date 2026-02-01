# Ralph Dashboard

Simple web dashboard to track Ralph Loop projects.

## Features

- 🔄 View active projects with progress
- ✅ See completed projects
- 📱 Mobile-friendly dark theme
- 🔁 Auto-refresh every 60 seconds

## Usage

### Local
```bash
cd src
python3 -m http.server 8765
# Open http://localhost:8765
```

### GitHub Pages
Push to GitHub, enable Pages on main branch, set folder to `/docs` or root.

## Files

- `index.html` - Main page
- `style.css` - Dark theme styles
- `app.js` - Load and render projects
- `projects.json` - Project data (updated by Sam)

## Data Schema

```json
{
  "lastUpdated": "ISO timestamp",
  "projects": [
    {
      "id": "project-id",
      "name": "Project Name",
      "description": "What it does",
      "status": "active|completed|stuck",
      "currentTask": 5,
      "totalTasks": 10,
      "startedAt": "ISO timestamp",
      "updatedAt": "ISO timestamp",
      "completedAt": "ISO timestamp or null"
    }
  ]
}
```
