# ArpanX FAQ database

ArpanX is a static, predefined FAQ chatbot. It does not call an AI or LLM API. Its public question-and-answer data lives in `data/arpanx-faq.json`.

## Editing answers

Edit the JSON file in the repository and commit the change. GitHub Pages publishes the updated data with the portfolio. The main chatbot code stays in `arpanx.js`.

Each entry uses this structure:

```json
{
  "id": 1,
  "category": "Education",
  "question": "Which university does Arpan attend?",
  "variations": ["Where does Arpan study?", "What is his university?"],
  "answer": "Arpan is pursuing B.Tech in Biomedical Engineering at Adamas University.",
  "followUps": ["What does Biomedical Engineering involve?", "What are his technical skills?"],
  "keywords": ["university", "college", "study", "Adamas"]
}
```

Use one of the category names already in the file. Give new entries a unique numeric ID. Add alternative phrasings and useful keywords to improve local matching. Keep answers grounded in facts already shared on the portfolio; use a clear “not listed” answer when a fact is unknown. Never add the private phone number.

## Who can edit the database?

Visitors can read the published JSON but the static site has no write endpoint. Changes are made through the GitHub repository, where repository write permissions control who can edit it. A protected admin dashboard would require an authenticated backend; a password embedded in a public static page would not protect the data.
