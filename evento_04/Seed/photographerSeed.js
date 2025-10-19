const mongoose = require('mongoose');
const Photographer = require('../models/Photographer')

const photographers=[
   {
    name: "SnapStories",
    serviceType: "Photography",
    contactNumber: "+91 9876543210",
    email: "snap.stories@example.com",
    pricePerDay: 90000,
    specialties: ["Wedding", "Candid", "Pre-Wedding"],
    city: "Mumbai",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/106502/1759063958_aniket_pawar_professional_snapstories_photography_packages_pre_wedding_couple_photoshoot_best_top_10_budget_wedding_photographers_in_mumbai_thane_instagram_csvfile_28092025__18_.jpg?crop=11,226,2024,1138",
  },
  {
    name: "Tailoredtales",
    serviceType: "Videography",
    contactNumber: "+91 9823456781",
    email: "tailored.tales@example.com",
    pricePerDay: 50000,
    specialties: ["Corporate", "Event Highlights", "Documentary"],
    city: "Jaipur",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/3846938/1754048333_KR3_8656.jpg?crop=7,69,2032,1143",
  },
  {
    name: "Just Focus",
    serviceType: "Both",
    contactNumber: "+91 9811122233",
    email: "just.focus@example.com",
    pricePerDay: 55000,
    specialties: ["Wedding", "Destination", "Cinematic"],
    city: "Udaipur",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/project/256973/1690377266_NPM08997.JPG?crop=5,742,2037,1146",
  },
  {
    name: "The Feeling Makers",
    serviceType: "Photography",
    contactNumber: "+91 9988776655",
    email: "feeling.makers@example.com",
    pricePerDay: 20000,
    specialties: ["Portrait", "Lifestyle", "Candid"],
    city: "Goa",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/4229680/1743854945_1000128541.jpg?crop=5,846,2037,1146",
  },
  {
    name: "Photomist",
    serviceType: "Videography",
    contactNumber: "+91 9900990099",
    email: "photomist@example.com",
    pricePerDay: 40000,
    specialties: ["Fashion", "Music Video", "Event Highlights"],
    city: "Bangalore",
    imageUrl: "https://image.wedmegood.com/resized/450X/uploads/member/41043/1750250696_XH2S3215.jpg?crop=13,232,2013,1132",
  }
]

async function seedPhotographer(){
    await Photographer.insertMany(photographers)
    console.log("Data Seeded Successfully")
}

module.exports = seedPhotographer;