# Pankaj Dhakad - Personal Website

A multi-page personal academic website built with plain HTML, CSS, and JavaScript.

## Pages

- Home
- Research
- Publications
- Random Photos
- Contact

## Local Preview

Open `index.html` in your browser, or run a simple local server.

## Add Your Photos

1. Put your images in `assets/photos/`.
2. Use any file names you want (example: `davis-sunset.jpg`, `macro_23.png`, etc.).
3. On the live GitHub Pages site, `photos.html` automatically picks and shows 50 random images per load.

## Publish on GitHub Pages (recommended)

### Option A: User Site (best for personal homepage)

1. Create a repository named `dhakadpankaj.github.io` under your GitHub account.
2. Upload all files from this project to the root of that repository.
3. In GitHub, go to repository `Settings` -> `Pages`.
4. Under `Build and deployment`, choose:
   - Source: `Deploy from a branch`
   - Branch: `main` and folder `/ (root)`
5. Save and wait 1-2 minutes.
6. Your site will be live at `https://dhakadpankaj.github.io`.

## Git Setup And Push Commands

Run these commands in your project folder after Git is installed:

```powershell
git init -b main
git add .
git commit -m "Initial personal website"
git remote add origin https://github.com/DhakadPankaj/dhakadpankaj.github.io.git
git push -u origin main
```

If `origin` already exists, use:

```powershell
git remote set-url origin https://github.com/DhakadPankaj/dhakadpankaj.github.io.git
git push -u origin main
```

### Option B: Project Site

1. Create a repository (example: `myweb`) under your GitHub account.
2. Upload this project to that repository.
3. Go to `Settings` -> `Pages`.
4. Set source to branch `main` and folder `/ (root)`.
5. Your site URL will be:
   `https://dhakadpankaj.github.io/myweb/`

## Suggested Next Edits

- Add a downloadable CV PDF link on the Home or Contact page.
- Add ORCID, Google Scholar, and lab profile links.
- Replace photo placeholders with your own photography.
