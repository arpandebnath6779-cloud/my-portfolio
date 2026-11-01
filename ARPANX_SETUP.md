# ArpanX setup

ArpanX has a static browser interface and a Netlify serverless function that calls the OpenAI Responses API. The browser never receives the OpenAI API key.

## Deploy

1. Connect this GitHub repository to a Netlify site. The repository's netlify.toml builds the static portfolio into dist and deploys netlify/functions/arpanx.mjs as a function.
2. In Netlify Project configuration > Environment variables, set OPENAI_API_KEY and give it the Functions scope (or all scopes). Optionally set OPENAI_MODEL; the default is gpt-6-luna.
3. Trigger a fresh deploy after saving the key. The function URL is /.netlify/functions/arpanx.
4. To keep using GitHub Pages as the frontend, add this before arpanx.js in index.html, replacing the URL with the Netlify site's actual function URL:
   <script>window.ARPANX_API_URL = "https://YOUR-SITE.netlify.app/.netlify/functions/arpanx";</script>
   Then redeploy GitHub Pages. The allowed origins already include https://arpandebnath6779-cloud.github.io. Add any other frontend origin to the comma-separated ALLOWED_ORIGINS value in Netlify and redeploy.

If the whole site is served by Netlify, the default same-origin API path works with no extra browser configuration. GitHub Pages only serves static files and cannot run the function, so it cannot host the AI endpoint or keep the provider key secret.

## Local development

Install Netlify CLI, then run netlify dev at the repository root. Put OPENAI_API_KEY in a local .env file; .env is ignored by Git. Never commit a real API key or put it in browser JavaScript.

## Update portfolio facts

Edit netlify/functions/knowledge-base.mjs. The current information intentionally has no phone number and uses Arpan's work email. Request size, role, origin, and per-IP limits are enforced. The in-memory rate limit is best-effort per warm function instance, not a global quota.
