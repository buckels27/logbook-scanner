# Logbook Scanner

Scan paper flying logbook pages (Pooleys PPL format) and export to CSV for import into logbook.aero.

## Features

- 📷 Upload photos of logbook pages
- 🤖 AI-powered OCR extracts flight entries
- ✏️ Review and edit extracted data
- 📊 Export to CSV (logbook.aero format) or Excel
- ✅ Validation warnings for time mismatches and registration inconsistencies

## Deployment to Vercel

### 1. Create a GitHub repository

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/logbook-scanner.git
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Click "Deploy"

### 3. Add your Anthropic API key

1. In Vercel, go to your project → Settings → Environment Variables
2. Add a new variable:
   - Name: `ANTHROPIC_API_KEY`
   - Value: Your API key from [console.anthropic.com](https://console.anthropic.com)
3. Click "Save"
4. Redeploy the project (Deployments → ... → Redeploy)

### 4. Use the app

Your app will be live at `https://your-project-name.vercel.app`

## Local Development

To run locally, you'll need to set the environment variable:

```bash
export ANTHROPIC_API_KEY=your_key_here
npx vercel dev
```

## Cost

The app uses Claude Sonnet for OCR. Approximate cost is ~$0.003 per logbook page scanned.

## License

MIT
