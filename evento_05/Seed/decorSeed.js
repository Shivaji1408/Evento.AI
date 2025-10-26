const mongoose = require('mongoose');
const Decorator = require('../models/Decors')

const decorators = [{
    name: "Uours Decors",
    style: "Traditional",
    contactNumber: "+91 9823456789",
    email: "uours.decors@example.com",
    priceRange: { min: 15000, max: 40000 },
    servicesOffered: ["Stage Decoration", "Lighting", "Flower Arrangement"],
    city: "Mumbai",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/project/212467/1662631855_image948.jpg?crop=6,153,1267,712",
  },
  {
    name: "Jazzy Moments Events",
    style: "Theme-based",
    contactNumber: "+91 9812233445",
    email: "jazzy.moment@example.com",
    priceRange: { min: 12000, max: 35000 },
    servicesOffered: ["Theme Decor", "Lighting", "Balloon Setup"],
    city: "Jaipur",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/475573/1543831587_js.jpg",
  },
  {
    name: "Velvet Touch Event Decor",
    style: "Modern",
    contactNumber: "+91 9876501234",
    email: "velvet.touch@example.com",
    priceRange: { min: 18000, max: 50000 },
    servicesOffered: ["Stage Decoration", "Ceiling Drapes", "Fairy Lighting"],
    city: "Udaipur",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/2814716/1746639672_image9878.jpg?crop=6,510,2034,1144",
  },
  {
    name: "Panigrahana Wedding Decors",
    style: "Traditional",
    contactNumber: "+91 9955667788",
    email: "vibrantvows@example.com",
    priceRange: { min: 20000, max: 55000 },
    servicesOffered: ["Mandap Setup", "Flower Arrangement", "Lighting"],
    city: "Bangalore",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/project/299009/1727682735_WhatsApp_Image_2024_09_30_at_1.21.09_PM.jpeg?crop=23,141,1250,703",
  },
  {
    name: "Wedding-Verse Decor",
    style: "Beach & Boho",
    contactNumber: "+91 9988776655",
    email: "wedding.verse@example.com",
    priceRange: { min: 10000, max: 30000 },
    servicesOffered: ["Beach Decor", "Lighting", "Table Centerpieces"],
    city: "Goa",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/3606235/1741074242_1740021675_479899636_18058108391315691_8530492591563391300_n.jpg?crop=7,180,1633,918",
  }
];

async function seedDecor(){
    await Decorator.insertMany(decorators)
    console.log("Data Seeded Successfully")
}

module.exports = seedDecor;