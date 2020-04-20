const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://Ravii_1996:Qwerty%2397@cluster0-r98r8.mongodb.net/test" , { useNewUrlParser: true, useUnifiedTopology: true });
var Schema = mongoose.Schema;
const conn = mongoose.connection;
conn.on('connected', () => {
  console.log('MongoDB connected')
});

// check db is connected or not..
conn.on('error', (err) => {
  if (err) {
    console.log(err)
    throw err;
  }
});

// created compartment a nested schema of SeatSchema which contains compartment available_seat , compartment_name and already booked seat..

var Compartment = new Schema({
  compartment_name: {
    type: String,
    required: true
  },
  available_seat: {
    type: Number,
    required: true
  },
  booked_seat: {
    type: Number,
    required: true
  }
})

// SeatSchema is the main schema which contains train name , number , availbility and compartment details..

/**
 * Approach -- Train is divided into compartment each compartment has own seat availbility. We search Compartment to compartment for seat booking.
 */

 /**
  * We can also approach with 2D array for seat compartment. But it is much preferable when user want to book particular seat number. Like in Theatre.
  */
var SeatSchema = Schema({
  train_name: String,
  train_number: String,
  seat: {
    type: [Compartment],
    required: true
  },
  availability: {
    type: Number,
    required: true
  }
});

var SeatBooking = module.exports = mongoose.model('SeatBooking', SeatSchema);

// This scheduler first delete the entry and the insert the entry when app run first time.
module.exports.scheduler = async function (data, callback) {
  await SeatBooking.deleteMany(callback);
  SeatBooking.insertMany(data, callback);
}

// this is used to get trainobj of train on basis of train number
module.exports.getDataOfParticularTrain = async function (trainNumber, callback) {
  SeatBooking.find({ train_number: trainNumber }, callback);
}

// get all the data from db tpo render the list of train.
module.exports.getData = async function (callback) {
  SeatBooking.find({}, callback);
}
