//Note how to verify bookings
//Might make a global component

if(user == "not_signed_in" || user == ""){
    //res.status(403).json({ success: false });
    //break;
  }
  if(description == ""){//Description should be filled by the frontend
    //res.status(400).json({ success: false });
    //break;
  }
  const startTimeAndDateString = start.toISOString();
  const endTimeAndDateString = end.toISOString();
  if(startTimeAndDateString >= endTimeAndDateString){//Start time should be before end time
    //res.status(400).json({ success: false });
    //break;
  }
  if(start == null || end == null){
    alert("Please select a start and end time")
    return
  }