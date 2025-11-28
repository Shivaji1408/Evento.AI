const mongoose = require('mongoose');
const Guest = require('../models/Guests');

const guests = [
  
  // {
  //   name: 'Sumit Sahu',
  //   phoneNumber: '9175776316',
  //   email: 'sumit.sahu@example.com',
  //   address: '123, Green Park, Mumbai',
  //   circle: 'Family Circle',
  //   profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219983.png', // Male avatar
  //   rsvp: 'Pending'
  // },
  // {
  //   name: 'Uday Kushwah',
  //   phoneNumber: '9123456780',
  //   email: 'uday.kushwah@example.com',
  //   address: '45, Marine Drive, Mumbai',
  //   circle: 'Friends Circle',
  //   profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219983.png', // Male avatar
  //   rsvp: 'Pending'
  // },
  // {
  //   name: 'Aman Kushwah',
  //   phoneNumber: '9988776655',
  //   email: 'aman.kushwah@company.com',
  //   address: 'Office 304, Business Tower, Jaipur',
  //   circle: 'Work Circle',
  //   profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219983.png', // Male avatar
  //   rsvp: 'Pending'
  // },
  // {
  //   name: 'Priya Goyal',
  //   phoneNumber: '9012345678',
  //   email: 'priya.goyal@example.com',
  //   address: '12, Lakeside Colony, Udaipur',
  //   circle: 'Family Circle',
  //   profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219986.png', // Female avatar
  //   rsvp: 'Pending'
  // },
  {
    name: 'Shiv Kumar',
    phoneNumber: '7455088039',
    email: 'shiv.kumar@office.com',
    address: 'Office 102, Tech Park, Bangalore',
    circle: 'Work Circle',
    profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219983.png', // Male avatar
    rsvp: 'Pending'
  }
  // {
  //   name: 'Charul Singh',
  //   phoneNumber: '9123678901',
  //   email: 'charul.singh@example.com',
  //   address: 'Township, Mathura',
  //   circle: 'Family Circle',
  //   profilePic: 'https://cdn-icons-png.flaticon.com/512/219/219986.png', // Female avatar
  //   rsvp: 'Declined'
  // }
];

async function seedGuest() {
  await Guest.insertMany(guests);
  console.log("Guest data seeded successfully!");
}

module.exports = seedGuest;
