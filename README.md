# Arpan Debnath — Portfolio

The complete editable source for this portfolio is plain HTML, CSS, and JavaScript. No framework, package installation, API key, database, or build command is required.

## Download and open

Download `downloads/portfolio-source.zip` from this repository, or visit `/downloads/portfolio-source.zip` on the deployed site. Extract the ZIP, then open `index.html` in a modern browser. Keep `index.html`, `style.css`, and `script.js` in the same folder.

Open the extracted folder in an editor such as VS Code to make changes. Save your files and refresh the browser to see them. Google Fonts requires an internet connection; the page uses fallback fonts offline.

For a local HTTP preview, run this optional command inside the extracted folder:

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000. On Windows, `py -m http.server 8000` may be available instead.

## Files

| File | What to edit |
| --- | --- |
| `index.html` | Name, biography, headings, engineering sections, project and certificate descriptions, contact details, and links |
| `style.css` | Colors, fonts, spacing, layouts, card illustrations, door effects, and mobile styles |
| `script.js` | Clock, mobile menu, theme switch, skill calendar, engineer-card dialog, and footer year |
| `EDITING-GUIDE.md` | Examples and instructions for common changes |

All illustrations are made in HTML and CSS. There are no missing image files to download. This package contains the Arpan portfolio built in this project, inspired by the reference page's design direction.

## Publish changes

Edit and save the source files in your connected GitHub repository and push to `main` to trigger Netlify's automatic deployment. Alternatively, for a separate manual static deployment, upload the extracted folder containing `index.html`, `style.css`, and `script.js` to Netlify's manual deploy interface. Upload the extracted files, not the ZIP itself. This site needs no build command; the publish directory is the folder containing `index.html`.

The ZIP is a snapshot of the source at the time it was packaged. If you later edit the source, download the latest files from your repository or regenerate the ZIP to include those edits.
