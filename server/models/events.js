const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: String,
  club: String,
  date: String,
  time: String,
  location: String,
  description: String,
  image: String
});

const EventModel = mongoose.model('Event', eventSchema);
module.exports = EventModel;