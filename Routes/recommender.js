const express = require("express");
const router = express.Router();

const Venue = require("../models/Venue");
const Cater = require("../models/Caters");
const Decor = require("../models/Decors");
const Photographer = require("../models/Photographer");

// PDF libs
const PDFDocument = require("pdfkit");
const QRCode = require("qr-image");
require("pdfkit-table"); // extends PDFDocument prototype with .table

// ------------------------------
// GET input form
// ------------------------------
router.get("/ai/recommender", (req, res) => {
  res.render("ai/recommender", { meta: {}, warning: null, error: null });
});

// ------------------------------
// POST generate recommendation sets
// ------------------------------
router.post("/ai/recommender", async (req, res) => {
  try {
    const { eventType, budget, guests, city, date } = req.body;

    const totalBudget = Number(budget) || 0;
    const numGuests = Number(guests) || 0;

    if (!eventType || !budget) {
      return res.render("ai/recommender", {
        meta: req.body,
        warning: "Enter event type and budget",
        error: null,
      });
    }

    const venueQuery = city ? { city } : {};
    const caterQuery = city ? { city } : {};
    const decorQuery = city ? { city } : {};
    const photogQuery = city ? { city } : {};

    const venues = await Venue.find(venueQuery).lean();
    const caters = await Cater.find(caterQuery).lean();
    const decors = await Decor.find(decorQuery).lean();
    const photographers = await Photographer.find(photogQuery).lean();

    const allSets = [];

    for (let v of venues) {
      const venueCost = v.pricePerDay || 0;

      for (let c of caters) {
        const caterCost = (c.pricePerPlate || 0) * numGuests;

        for (let d of decors) {
          const decorCost = d.priceRange?.max || d.priceRange?.min || 0;

          for (let p of photographers) {
            const photoCost = p.pricePerDay || 0;

            const totalCost = venueCost + caterCost + decorCost + photoCost;

            if (totalCost <= totalBudget) {
              allSets.push({
                totalCost,
                venue: v,
                caterer: c,
                decor: d,
                photographer: p,
              });
            }
          }
        }
      }
    }

    if (allSets.length === 0) {
      return res.render("ai/recommender", {
        meta: req.body,
        warning: "No combination fits this budget. Try increasing budget.",
        error: null,
      });
    }

    allSets.sort((a, b) => b.totalCost - a.totalCost);
    res.render("ai/recommenderResults", { meta: req.body, sets: allSets.slice(0, 5) });
  } catch (err) {
    console.error("Recommender Error:", err);
    res.render("ai/recommender", { meta: req.body, warning: null, error: "Server error. Try again." });
  }
});

// ------------------------------
// GET summary (no booking save) -- include full details in items
// ------------------------------
router.get("/ai/recommender/summary", async (req, res) => {
  try {
    const { venueId, catererId, decorId, photographerId, eventName, eventDate, city, guests, budget } = req.query;

    const venue = venueId ? await Venue.findById(venueId).lean() : null;
    const caterer = catererId ? await Cater.findById(catererId).lean() : null;
    const decor = decorId ? await Decor.findById(decorId).lean() : null;
    const photographer = photographerId ? await Photographer.findById(photographerId).lean() : null;

    const items = [];
    let total = 0;

    if (venue) {
      const price = venue.pricePerDay || 0;
      items.push({
        kind: "Venue",
        refId: venue._id,
        name: venue.name,
        price,
        details: {
          address: venue.address,
          city: venue.city,
          state: venue.state,
          capacity: venue.capacity,
          contactNumber: venue.contactNumber,
          email: venue.email,
          amenities: venue.amenities || [],
          pricePerDay: venue.pricePerDay,
          imageUrl: venue.imageUrl || null,
        },
      });
      total += price;
    }

    if (caterer) {
      const price = (caterer.pricePerPlate || 0) * (Number(guests) || 0);
      items.push({
        kind: "Caterer",
        refId: caterer._id,
        name: caterer.name,
        price,
        details: {
          cuisineType: caterer.cuisineType,
          contactNumber: caterer.contactNumber,
          email: caterer.email,
          pricePerPlate: caterer.pricePerPlate,
          specialties: caterer.specialties || [],
          city: caterer.city,
          imageUrl: caterer.imageUrl || null,
        },
      });
      total += price;
    }

    if (decor) {
      const cost = decor.priceRange?.max || decor.priceRange?.min || 0;
      items.push({
        kind: "Decor",
        refId: decor._id,
        name: decor.name,
        price: cost,
        details: {
          style: decor.style,
          contactNumber: decor.contactNumber,
          email: decor.email,
          priceRange: decor.priceRange || {},
          servicesOffered: decor.servicesOffered || [],
          city: decor.city,
          imageUrl: decor.imageUrl || null,
        },
      });
      total += cost;
    }

    if (photographer) {
      const price = photographer.pricePerDay || 0;
      items.push({
        kind: "Photographer",
        refId: photographer._id,
        name: photographer.name,
        price,
        details: {
          serviceType: photographer.serviceType,
          contactNumber: photographer.contactNumber,
          email: photographer.email,
          pricePerDay: photographer.pricePerDay,
          specialties: photographer.specialties || [],
          city: photographer.city,
          imageUrl: photographer.imageUrl || null,
        },
      });
      total += price;
    }

    res.render("ai/bookingSummary", {
      booking: {
        eventName,
        eventDate,
        city,
        guests,
        budget,
        items,
        totalCost: total,
      },
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).render("error", { err: err.message });
  }
});

// ------------------------------
// PREMIUM PDF GENERATION (UPDATED & IMPROVED)
// ------------------------------
router.post("/ai/recommender/pdf", async (req, res) => {
  try {
    const encoded = req.body.bookingData;
    if (!encoded) return res.status(400).send("Missing booking data for PDF.");

    const booking = JSON.parse(decodeURIComponent(encoded));

    // Prepare QR payload (full summary in QR)
    const qrPayload = {
      Event: booking.eventName,
      Date: booking.eventDate,
      City: booking.city,
      Guests: booking.guests,
      TotalCost: booking.totalCost
    };

    const qr = QRCode.imageSync(JSON.stringify(qrPayload), { type: "png" });

    const doc = new PDFDocument({ size: "A4", margin: 40 });
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Evento_Summary_${Date.now()}.pdf`
    );
    doc.pipe(res);

    // 📘 HEADER BAR
    doc.rect(0, 0, doc.page.width, 90).fill("#0d47a1");
    doc.fill("#fff")
      .fontSize(28)
      .font("Helvetica-Bold")
      .text("EVENTO", 40, 25);

    doc.fontSize(12)
      .font("Helvetica")
      .text("AI-Powered Event Planning & Vendor Recommendations", 40, 60);

    // 🔵 REPLACE EVENTO CIRCLE WITH QR CODE (TOP-RIGHT)
    doc.image(qr, doc.page.width - 130, 15, { width: 90 });

    // Move below header
    doc.moveDown(4);

    // TITLE
    doc.fillColor("#0d47a1")
      .fontSize(22)
      .font("Helvetica-Bold")
      .text("Event Summary", { align: "left" });

    doc.moveDown(1);

    // EVENT DETAILS
    doc.fillColor("#000").fontSize(12);

    doc.text(`Event Name: ${booking.eventName}`);
    doc.text(`Event Date: ${booking.eventDate}`);
    doc.text(`City: ${booking.city}`);
    doc.text(`Guests: ${booking.guests}`);

    doc.moveDown(1);

    // Divider
    doc.strokeColor("#d9d9d9")
      .lineWidth(1)
      .moveTo(40, doc.y)
      .lineTo(doc.page.width - 40, doc.y)
      .stroke();

    doc.moveDown(1.5);

    // SELECTED SERVICES
    doc.fillColor("#0d47a1")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Selected Services");

    doc.moveDown(0.5);

    for (let it of booking.items) {
      doc.fontSize(14)
        .fillColor("#000")
        .font("Helvetica-Bold")
        .text(`${it.kind}: ${it.name}`);

      doc.fontSize(12)
        .fillColor("#444")
        .text(`Price: ₹${it.price}`);

      const d = it.details || {};

      // Add details if they exist in the model
      if (d.address) doc.text(`Address: ${d.address}`);
      if (d.city) doc.text(`City: ${d.city}`);
      if (d.capacity) doc.text(`Capacity: ${d.capacity}`);
      if (d.amenities?.length) doc.text(`Amenities: ${d.amenities.join(", ")}`);
      if (d.cuisineType) doc.text(`Cuisine Type: ${d.cuisineType}`);
      if (d.specialties?.length) doc.text(`Specialties: ${d.specialties.join(", ")}`);
      if (d.servicesOffered?.length) doc.text(`Services Offered: ${d.servicesOffered.join(", ")}`);
      if (d.priceRange)
        doc.text(`Price Range: ₹${d.priceRange.min} – ₹${d.priceRange.max}`);
      if (d.serviceType) doc.text(`Service Type: ${d.serviceType}`);
      if (d.contactNumber) doc.text(`Contact: ${d.contactNumber}`);
      if (d.email) doc.text(`Email: ${d.email}`);

      doc.moveDown(1);
    }

    // TOTAL COST
    doc.fillColor("#0d47a1")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Budget Summary");

    doc.moveDown(0.5);

    doc.fontSize(14)
      .fillColor("#000")
      .text(`Total Estimated Cost: ₹${booking.totalCost}`);

    doc.moveDown(1);

    // PROFESSIONAL NEXT STEPS
    doc.fillColor("#0d47a1")
      .fontSize(18)
      .font("Helvetica-Bold")
      .text("Professional Next Steps");

    doc.moveDown(0.5);

    const steps = [
      "Contact each vendor directly to confirm their availability for your selected date.",
      "Request venue images, catering menu samples, décor themes, & photography portfolios.",
      "Schedule physical venue visit and food tasting before final confirmation.",
      "Negotiate advance payment, cancellation policy, and event-day deliverables.",
      "Use Evento AI to generate invitations and automate guest reminders.",
      "Set up a detailed budget plan using Evento’s Budget Planner to track expenses.",
      "Discuss event timeline with decorators and photographers for smooth coordination.",
      "Confirm logistics like parking, electricity backup, seating layout & stage requirements."
    ];

    doc.fontSize(11).fillColor("#444");

    steps.forEach((s, i) => {
      doc.text(`${i + 1}. ${s}`, { align: "left" });
    });

    doc.moveDown(1.5);

    // FOOTER
    doc.fontSize(10)
      .fillColor("#888")
      .text("Generated by EVENTO AI — Your Smart Event Planning Assistant", {
        align: "center",
      });

    doc.end();
  } catch (err) {
    console.error("PDF Error:", err);
    res.status(500).send("PDF generation failed.");
  }
});


module.exports = router;
