// =========================
// app.js (FINAL UPDATED)
// =========================

require('dotenv').config();

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const app = express();
const PORT = process.env.PORT || 8080;


// =========================
// ROUTE FILES
// =========================
const venueRoutes = require('./Routes/venue');
const caterRoutes = require('./Routes/caters');
const homeRoutes = require('./Routes/home');
const photographersRoutes = require('./Routes/photographers');
const decorRoutes = require('./Routes/decor');
const guestRoutes = require('./Routes/guests');
const budgetRoutes = require('./Routes/budget');

const aiRoutes = require('./Routes/ai');
const aiSchedulerRoutes = require('./Routes/aiScheduler');
const recommenderRoutes = require('./Routes/recommender');
const aiChatRoutes = require('./Routes/aiChat');
const aiIndexRoutes = require('./Routes/aiIndex');

const caterSeed = require('./Seed/caterSeed');
const decorSeed = require('./Seed/decorSeed');
const guests = require('./Seed/guests');
const photographerSeed = require('./Seed/photographerSeed');
const venueSeed = require('./Seed/venueSeed');

// caterSeed();
// decorSeed();
// guests();
// photographerSeed();
// venueSeed();


// =========================
// VIEW ENGINE & STATIC FILES
// =========================
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));


// =========================
// MIDDLEWARE
// =========================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// =========================
// SESSION & FLASH
// =========================
app.use(
  session({
    secret: "eventoSecretKey123",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
  })
);

app.use(flash());

// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});


// =========================
// DATABASE CONNECTION
// =========================
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/evento2")
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("DB Connection Error:", err);
    process.exit(1);
  });


// =========================
// MOUNT ROUTES
// =========================
app.use(homeRoutes);
app.use(venueRoutes);
app.use(caterRoutes);
app.use(photographersRoutes);
app.use(decorRoutes);
app.use('/guests', guestRoutes);
app.use(budgetRoutes);

app.use(aiIndexRoutes);
app.use(aiRoutes);
app.use(aiSchedulerRoutes);
app.use(recommenderRoutes);
app.use(aiChatRoutes);


// =========================
// 404 HANDLER
// =========================
app.use((req, res) => {
  res.status(404).render("error", { err: "Page not found (404)" });
});


// =========================
// GLOBAL ERROR HANDLER
// =========================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  const status = err.status || 500;
  res.status(status).render("error", { err: err.message || "Server Error" });
});


// =========================
// START SERVER
// =========================
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
