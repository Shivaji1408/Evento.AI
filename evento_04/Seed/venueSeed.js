const mongoose = require('mongoose');
const Venue = require('../models/Venue');
const venues = [
  {
    name: "Grand Hall",
    address: "123 Main Street",
    city: "Mumbai",
    state: "Maharashtra",
    capacity: 500,
    contactNumber: "9876543210",
    email: "grandhall@example.com",
    amenities: ["WiFi", "Projector", "Air Conditioning", "Parking"],
    pricePerDay: 50000,
    imageUrl: "https://cdn0.weddingwire.in/vendor/9728/3_2/1280/jpg/banquet-halls-tiaraa-banquets-stage-decor_15_389728-163670128562837.webp",
  },
  {
    name: "Ocean View Banquet",
    address: "45 Beach Road",
    city: "Goa",
    state: "Goa",
    capacity: 300,
    contactNumber: "9123456780",
    email: "oceanview@example.com",
    amenities: ["Sea View", "Catering", "WiFi", "Sound System"],
    pricePerDay: 75000,
    imageUrl: "https://www.eternalweddingz.in/storage/venue_images/tfPMmzBuZzR9VjYHGab5qRlf3cJlaoUe8ZsTeJ3a.webp",
  },
  {
    name: "Skyline Conference Center",
    address: "78 Corporate Avenue",
    city: "Bengaluru",
    state: "Karnataka",
    capacity: 200,
    contactNumber: "9988776655",
    email: "skylineconf@example.com",
    amenities: ["Projector", "WiFi", "Video Conferencing", "Parking"],
    pricePerDay: 40000,
    imageUrl: "https://cdn.augrav.com/online/jewels/2016/02/Samad-House-Deluxe-Bangalore-for-maarige-hall.jpg",
  },
  {
    name: "Heritage Palace",
    address: "12 Heritage Street",
    city: "Jaipur",
    state: "Rajasthan",
    capacity: 600,
    contactNumber: "9012345678",
    email: "heritagepalace@example.com",
    amenities: ["Banquet Hall", "Parking", "WiFi", "Air Conditioning", "Catering"],
    pricePerDay: 90000,
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWr2ZINkDL3jcy9gJyzSv52VV8qCBUKDzwTw&s",
  },
  {
    name: "Lakeview Resort",
    address: "22 Fateh Sagar Road",
    city: "Udaipur",
    state: "Rajasthan",
    capacity: 350,
    contactNumber: "9123456789",
    email: "lakeviewresort@example.com",
    amenities: ["Lake View", "Catering", "WiFi", "Parking", "Swimming Pool"],
    pricePerDay: 80000,
    imageUrl: "https://shaandaarevents.com/wp-content/uploads/2023/05/The-Oberoi-Udaivilas.jpg",
  }

];

async function seedVenue(){
    await Venue.insertMany(venues);
    console.log("Data Seeded Successfully !")
 }

module.exports = seedVenue;
