# Evento.AI

## This is the live project link

This is the live project link: https://evento-ai.onrender.com/

---

## Project Overview

Evento.AI is an event planning web application (Node.js + Express) with MongoDB for data storage. It provides functionality for managing venues, caterers, decors, photographers, guests and bookings, and includes simple AI routes for recommendations and scheduling.

## Quick start

- Install dependencies:

```powershell
npm install
```

- Create a `.env` file in the project root with your environment variables (MongoDB URI, PORT, any API keys).

- Run locally:

```powershell
npm start
# or if you prefer nodemon (already used in development):
npx nodemon ./app.js
```

Server runs by default on `http://localhost:3000` (adjust `PORT` in `.env`).

## Repository structure

- `app.js` - Application entry point, Express server setup and middleware.
- `package.json` - Project metadata and scripts.
- `vercel.json` - Vercel deployment configuration.

- `models/` - Mongoose models for domain entities:
  - `Booking.js` - Booking schema and logic.
  - `Budget.js` - Budget data.
  - `Caters.js` - Caterer profiles.
  - `Decors.js` - Decor options.
  - `Guests.js` - Guest lists and invites.
  - `Photographer.js` - Photographers data.
  - `Rating.js` - Ratings for vendors/venues.
  - `Venue.js` - Venue schema.

- `Routes/` - Express route handlers (controllers):
  - `ai.js`, `aiChat.js`, `aiIndex.js`, `aiScheduler.js` - AI-related endpoints (recommendations, chatbot, scheduler).
  - `booking.js` - Booking flow endpoints (online booking, payment, success pages).
  - `budget.js` - Budget-related routes and calculators.
  - `caters.js`, `decor.js`, `photographers.js`, `venue.js` - CRUD endpoints for those resources.
  - `guests.js` - Guest management (invite/send/success flows).
  - `home.js` - Main landing/home routes.
  - `recommender.js` - Recommendation-related routes.

- `views/` - EJS templates for server-side rendering. Organized into subfolders:
  - `ai/` - AI pages and chatbot templates.
  - `booking/` - Booking pages (online, payment, success).
  - `caters/`, `decors/`, `photographer/`, `venue/` - Resource-specific views (index, show, edit, new).
  - `guests/` - Guest-related views (invite, send, success).
  - `home/` and `layouts/` - Common layout templates (e.g., `boilerplate.ejs`).

- `Seed/` - Seed scripts used to populate the database with initial data:
  - `caterSeed.js`, `decorSeed.js`, `guests.js`, `photographerSeed.js`, `venueSeed.js`.

- `public/` - Static assets (JS/CSS/images) served to clients:
  - `js/` contains client-side scripts such as `budget.js`, `chatbot.js`.
  - `pofilePics/` - profile picture assets (note: folder name appears to be `pofilePics`).

## Notes & environment

- Database: MongoDB (connection string should be provided in `.env`).
- The project uses `dotenv` to load environment variables; do not commit `.env`.
- `vercel.json` is configured for deployment on Vercel (build target `app.js`). Add your Vercel/production domain to the Live Project link above when available.

## Troubleshooting

- If the server restarts frequently, confirm file watchers or seed scripts are not changing files on start.
- Check the console logs for `MongoDB Connected Successfully` to confirm DB connection.

## Contributing

- Create an issue or pull request. Follow existing code style.

## License

- Add a license file if you plan to open-source the repo.

---

If you'd like, I can update the Live Project link with the actual deployed URL, improve descriptions per-file, or generate a `CONTRIBUTING.md` and `LICENSE`.
