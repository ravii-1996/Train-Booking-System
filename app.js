const express = require('express');
const bodyparser = require('body-parser');
var app = express();

//import logic function..
const getSeatNumber = require('./logic');

// SEatBooking is a Model...
const SeatBooking = require('./model/BookingSeat');

// Import json Data which will load into the DB.
const json = require('./model/TrainData.json');

app.set('view-engine', 'ejs');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// Scheduler Run To refresh  DB data When the application Up..
SeatBooking.scheduler(json, function (err, result) {
  if (err)
    throw err;
  //console.log("Scheduler Executed...");
});

// render home page with fetching data from DB....
app.get('/', function (req, res) {
  SeatBooking.getData(function (err, result) {
    if (err)
      throw err;

    // passing tarinObj array which is used in ejs file to show the details.
    res.render('home.ejs', {
      trainObj: result
    });
  });

})

//when ticket try to book.
app.get('/booking', async function (req, res) {

  // Train OBJ is used to store the of particular train...
  let trainObj;
  // seatNumber array Which contains which Booking seat details along with the Compartment...
  let seatNumber = [];

  //Get data on the basis of train number which we get from request. 
  SeatBooking.getDataOfParticularTrain(req.query.trainNumber, function (err, result) {
    if (err)
      throw err;
    trainObj = result[0];

    //function which is called to get  the booking seatNumber details.. In this function train obj will update with new seat availability.
    seatNumber = getSeatNumber.getSeatNumber(trainObj, req.query.seatNumber);

    // Now updated train obj is set into the db...
    SeatBooking.updateOne({ train_number: req.query.trainNumber }, { $set: { seat: trainObj.seat, availability: trainObj.availability } }, function (err, result) {
      if (err)
        throw err;
      console.log("Updated Successfully", result);

      // pass train object and get seat to output file to show the details...
      res.render('output.ejs', {
        getSeat: seatNumber,
        trainObj: trainObj
      });
    })
  })
})

app.listen(process.env.PORT  ||3000);
console.log("Server is running on 3000");