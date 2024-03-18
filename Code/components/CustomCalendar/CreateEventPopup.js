import React, { useState } from "react";
import {
  Container,
  DialogTitle,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format, addMinutes, parseISO, isValid } from "date-fns";
import { fetchEventsStart, setEventData } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";

import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

const massageTypes = [
  { id: 'swedish', name: 'Swedish', duration: 60 },
  { id: 'deepTissue', name: 'Deep Tissue', duration: 60 },
  { id: 'sports', name: 'Sports', duration: 120 },
];

const CreateEventPopUp = ({ handleClose, open }) => {
  const { event } = useSelector(mapState);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [selectedMassageType, setSelectedMassageType] = useState('swedish');
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [massageLenght, setMassageLenght] = useState("Unselected");
  const dispatch = useDispatch();

  const { user, isLoading } = useUser();

  //This does not work
  //useEffect(() => {
    //changeEndTime({ length: 30 });//Intially the lenght will always be set at 30
  //}, [event]);

  const changeEndTime = ({ length }) => {
    //alert(`You change the lenght of the massage to ${length}`);
    //alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    const resetTimeAndDate = new Date(startTimeAndDate);//Reset time
    resetTimeAndDate.setMinutes(startTimeAndDate.getMinutes() + length);
    setEndTimeAndDate(resetTimeAndDate)
    //setMassageLenght(length);
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    //alert(to_time)//This give the previous time, not the new set time
    setMassageLenght(length)
    //event.end = endTimeAndDate;
    
    setHasSelectLenght(true)//There is a delay to the change
    alert("You selected a massage lenght")
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    // Get massage duration based on selected type
    const selectedType = massageTypes.find(type => type.id === selectedMassageType);
    const duration = selectedType ? selectedType.duration : 60; // Default duration is 60 minutes

    if (![60, 120].includes(duration)) {
      alert("Please select a valid duration (60 or 120 minutes).");
      return;
    }

    //Back up if to make sure user selects a lenght
    if(massageLenght == "Unselected"){
      alert("Please select a massage lenght")
      return
    }

    //alert("checking if a massage lenght is selected")
    //alert(hasSelectLenght)//!hasSelectLenght
    if(!hasSelectLenght){//Can only pass if true
      alert("Please select a lenght for the massage before creating booking")
      //alert(hasSelectLenght)
      return
    }
    setHasSelectLenght(false)

    //Verify that the event does not conflict with other events in the database
    //if(true){
      //const allEvents = fetchEventsStart({ url: "/api/events" })

      /*
      allEvents.forEach((singleEvent) => {
        //determine here
        if(singleEvent.startTimeAndDate < startTimeAndDate &&
          singleEvent.endTimeAndDate > endTimeAndDate){
          alert("This event conflicts with another event")
          return;
        }
      });*/
    //}

    ///////////////////////////////////testing infromation saving
    var userEmail = "___default"
    if(!user){
      alert("Please sign in")
      userEmail = "not_signed_in"
      //alert(userEmail)
    }else{
      userEmail = user.email
    }
    
    //////////////////////////////////testing
    //remember to fix the useremail below
    try {
      const schema = {
        title: title,
        status: "New",
        description: "Booking created by user "+String(userEmail)+" ", //I start using the description event data storage, change email with user id or something later
        user: String(userEmail),//User is being save, make sure to log in
        background: backgroundColor,
        start: startTimeAndDate,
        end: endTimeAndDate,
      };
      //Can use this so that only signned in users can create bookings, probably could just be replaced with return tho
      if(!user){
        alert("Your not logged in, please log in")//Should probably replace alert with something else
        //Turning it off for easier development, turn it on for production later
        //return
      }else{
        //testing
        //alert(user.email)
        //alert(schema.user)
      }

      //Booking verification here
      if(schema.end<schema.start){
        alert("Somehow the end time is after the start, please select a booking lenght to correct")
        return
      }
      if(schema.background = null){
        alert("status/backgound colour not selected")
      }
    
      const url = "/api/events";
      fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
      })
        .then((res) => res.json())
        .then((json) => {
          dispatch(fetchEventsStart({ url: "/api/events" }));
          setTitle("");
        });
    } catch (error) {
      console.log(error);
    }
    handleCloseAndReset();
  };

  //Needs to run when the user closes by clicking outside
  const handleCloseAndReset = (e) => {
    //Clear certain data
    //If needed add or remove data here
    setHasSelectLenght(false)
    //setTitle("")//Leaving like this so that it can be used later if user makes a mistake
    setMassageLenght("Unselected")
    //setBackgroundColor("#000000")

    //Handle closing of the dialog box
    handleClose()
  }

  return (
    <BaseDialog open={open} handleClose={handleClose}>
      <Container sx={{ padding: "24px" }}>
        <DialogTitle>Create a new booking</DialogTitle>
        <Typography>{formattedStartDate && `${formattedStartDate}, from ${from_time} to ${to_time}`}</Typography>
        <TextField
          fullWidth
          required
          label="Client Name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 2 }}
        />
        <Typography sx={{ mt: 2 }}>Massage Type:</Typography>
        <Select
          value={selectedMassageType}
          onChange={(e) => setSelectedMassageType(e.target.value)}
          fullWidth
        >
          {massageTypes.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>
        <Typography sx={{ mt: 2 }}>Event Color:</Typography>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          style={{ width: "100%", height: "40px", border: "none", marginTop: "8px" }}
        />
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <PrimaryButton onClick={handleCreateEvent} disabled={!title}>
            Confirm
          </PrimaryButton>
        </div>
      </Container>
    </BaseDialog>
  );
};

export default CreateEventPopUp;
