# Editing your portfolio

## Change text, projects, and certificates

Open `index.html` and search for the visible text you want to replace. For example, search for `Hi, I’m Arpan.`, `Smart health monitoring node`, or `IoT Fundamentals`. Change the text between HTML tags and leave the surrounding tags in place.

Sections are identified by IDs such as `projects`, `certificates`, `story`, and `contact`. Copy an entire `<article>...</article>` block inside a project's or certificate's grid to add another item. Replace its title and description with your own details.

The top navigation and doors link to these IDs. If you rename an ID, also change every matching `href="#..."` link.

## Change your email and social links

Search `index.html` for `mailto:` and update both the email in the link and its visible text:

```html
<a href="mailto:you@example.com">you@example.com</a>
```

Replace the LinkedIn link with your profile URL. The current LinkedIn link opens the general LinkedIn homepage. Update the GitHub link if needed. The contact section uses email links; it does not store form submissions.

## Change the colors and fonts

At the start of `style.css`, edit the variables in `:root` for the light theme:

```css
--bg: #e8e4e0;       /* Page background */
--ink: #262222;      /* Main text */
--muted: #7a706d;    /* Secondary text */
--surface: #f0ece7;  /* Raised surfaces */
--accent: #75635d;   /* Accent color */
```

The `html[data-mode=dark]` rule controls dark-theme colors. Keep enough contrast between text and its background.

The font link in the `<head>` of `index.html` loads Onest and DM Mono from Google Fonts. Update that link and the `--display` and `--mono` CSS variables if you choose different fonts.

## Change the skill calendar

Search `script.js` for `const skills` and edit the four labels:

```js
const skills = ['Embedded systems', 'IoT & sensors', 'C & Python', 'Biomedical devices'];
```

Also update the initial `.calendar-word` text in `index.html` so it matches the first skill. If you change the number of skills, update the `/ 04` total in both the HTML and the calendar counter code.

## Change the engineer card

The visible identity card is inside `.identity-card` in `index.html`. The engineer-card popup is the `<dialog class="ability-dialog">` near the bottom of that file. Edit the name, university, and skills in both places.

To add your own photo, create an `images` folder next to `index.html`, put your image in it, and insert an image where you want it:

```html
<img class="profile-photo" src="images/arpan.jpg" alt="Arpan Debnath" width="600" height="800">
```

Add a matching rule in `style.css`:

```css
.profile-photo {
  display: block;
  width: 100%;
  max-width: 320px;
  height: auto;
  border-radius: 16px;
}
```

If you replace the whole `.identity-scene`, keep the `.ability-button` button to continue opening the engineer-card dialog, or remove the related dialog-opening code in `script.js` as well.

## Update page previews and your domain

At the top of `index.html`, edit the `<title>`, description, social title and description metadata, and canonical link when your name, focus, or domain changes.

## Check your changes

Refresh the page, resize the browser to phone and desktop widths, and check the skill calendar, theme cord, engineer-card popup, mobile menu, and door links. Press Escape to close the popup or menu. Check all contact links before publishing.
