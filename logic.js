/**
 * Assumption : 
 * If Group Booking (i.e ticket should be in a same row) not available then it will book ticket from the first compartment...
 */

const getSeatNumber = function (trainObj, noOfTickets) {
  // if available seat less than no of booking tickets then return null in array of seatNumber.
  if (trainObj.availability < noOfTickets)
    return null;

  let seatNumber = [];

  /**
   * There are two cases.. Ticket Booked in a group (i.e ticket should be in a same row) or not.
   */

  // First Case --- Ticket Booked in a Group...

  // Ideal case: Choose that row which is fully filled after booking.
  for(let i=0; i<trainObj.seat.length && noOfTickets >0; i++){
    if (trainObj.seat[i].available_seat == noOfTickets) {
      let end = i * 7 + parseInt(noOfTickets) + trainObj.seat[i].booked_seat;
      let start = end - parseInt(noOfTickets) + 1;
      for (let j = start; j <= end; j++) {
        seatNumber.push(trainObj.seat[i].compartment_name + "- " + j);
      }

      // Update the remaning details in trainOBJ now this trainObj has updated value if ticket booked in a group..... 
      trainObj.seat[i].available_seat = 0;
      trainObj.seat[i].booked_seat = trainObj.seat[i].booked_seat + parseInt(noOfTickets);
      trainObj.availability = trainObj.availability - parseInt(noOfTickets);

      // noOfTickets will used as a flag here... i.e if ticket booked in group then we dont proceed with the 2nd case...
      noOfTickets = 0;
      break;
    }
  }
  for (let i = 0; i < trainObj.seat.length && noOfTickets >0; i++) {

    /** 
     * First Check Schema for better Understanding..
     * First We traverse and check group seat (i.e ticket should be in a same row) available or not.
     * If available_seat of each compartment is > noOfTickets... then group ticket is allowed.
     * So we update the available seat of compartment, booked seat of compartment and the availabity of train.
    */
    if (trainObj.seat[i].available_seat >= noOfTickets) {

      /**
       * To get the seatNumber we are using simple mathematics.. just get the start and end point then fill seatNumber in an array..by traversing..
       */
      let end = i * 7 + parseInt(noOfTickets) + trainObj.seat[i].booked_seat;
      let start = end - parseInt(noOfTickets) + 1;
      for (let j = start; j <= end; j++) {
        seatNumber.push(trainObj.seat[i].compartment_name + "- " + j);
      }

      // Update the remaning details in trainOBJ now this trainObj has updated value if ticket booked in a group..... 
      trainObj.seat[i].available_seat = trainObj.seat[i].available_seat - noOfTickets;
      trainObj.seat[i].booked_seat = trainObj.seat[i].booked_seat + parseInt(noOfTickets);
      trainObj.availability = trainObj.availability - parseInt(noOfTickets);

      // noOfTickets will used as a flag here... i.e if ticket booked in group then we dont proceed with the 2nd case...
      noOfTickets = 0;
      break;
    }
  }

  /**
   * Second Case ---
   * There is again two case 1st case -- May be compartment is full or not full for  un-grouped ticket.
   * example
   * suppose in 1st compartment 4 seat has already booked and 3 seat reamning .. if some one want to book 5 seat then 3 seats from 1st compartment and 2 seats 2nd compartment. In this case 2nd compartment is not full.
   */
  for (let i = 0; noOfTickets > 0; i++) {
    if (trainObj.seat[i].available_seat >= noOfTickets) {


      //same logic as 1st case... if compartment seat availablity > noOfTickets
      let end = i * 7 + parseInt(noOfTickets) + trainObj.seat[i].booked_seat;
      let start = end - parseInt(noOfTickets) + 1;
      for (let j = start; j <= end; j++) {
        seatNumber.push(trainObj.seat[i].compartment_name + "- " + j);
      }

      trainObj.seat[i].available_seat = trainObj.seat[i].available_seat - noOfTickets;
      trainObj.seat[i].booked_seat = trainObj.seat[i].booked_seat + parseInt(noOfTickets);
      trainObj.availability = trainObj.availability - parseInt(noOfTickets);
      noOfTickets = 0;
    }

    // 2nd b case if compartment seat availablity < noOfTickets
    /**
     * example..
     * in 1st comprtmnt - 4 booked and 3 vacant 
     * in 2nd compartmnt - 5 booked and 2 vacant
     * now user want to 4 tickets then..
     * for 1st compartment--- noOfTickets =4 , and available_seat = 3 so first fill 3 then next 1 will in next compartment....
     */
    else if (trainObj.seat[i].available_seat < noOfTickets && trainObj.seat[i].available_seat > 0) {

      // find the start and end point from where seat booking happens..
      let end = i * 7 + trainObj.seat[i].available_seat + trainObj.seat[i].booked_seat;
      let start = end - trainObj.seat[i].available_seat + 1;
      for (let j = start; j <= end; j++) {
        seatNumber.push(trainObj.seat[i].compartment_name + "- " + j);
      }

      // update the trainObj with the new availablity..
      trainObj.seat[i].booked_seat = trainObj.seat[i].booked_seat + trainObj.seat[i].available_seat;
      trainObj.availability = trainObj.availability - trainObj.seat[i].available_seat;
      noOfTickets = noOfTickets - trainObj.seat[i].available_seat;
      // for this compartment vacant seat =0
      trainObj.seat[i].available_seat = 0;
    }
  }

  return seatNumber;
}
module.exports.getSeatNumber = getSeatNumber;