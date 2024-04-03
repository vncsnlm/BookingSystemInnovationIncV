import React, { useState, useEffect } from "react";
import { Container, DialogTitle, TextField, Typography, Select, MenuItem } from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, addMinutes, isValid } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";
import { useUser } from '@auth0/nextjs-auth0/client';
import { set } from "mongoose";
 
const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});
 
const UpdateEventPopup = ({ event_main, open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
 
  const [ID, setID] = useState(event_main ? event_main._id : '');
  const [startTimeAndDate, setStartTimeAndDate] = useState(event_main ? event_main.start : new Date());
  const [endTimeAndDate, setEndTimeAndDate] = useState(event_main ? event_main.end : addMinutes(new Date(), 60));
  const [title, setTitle] = useState(event_main ? event_main.title : '');
  const [backgroundColor, setBackgroundColor] = useState(event_main ? event_main.background : '#000000');
  const [selectedDuration, setSelectedDuration] = useState(60); // Duration is either 60 or 120
  const [selectedMassageType, setSelectedMassageType] = useState(event_main ? event_main.massageType : 'Unselected'); // Default to first type
 
  //const isValidStart = isValid(startTimeAndDate);
  const [formattedStartDate, setFormattedStartDate] = useState(event_main.start && format(event_main.start, "eeee, MMMM dd, yyyy "));
  const [from_time, setFromTime] = useState("Unselected");
  const [to_time, setToTime] = useState("Unselected");

  const [eventLenght, setEventLenght] = useState(30);
 
  useEffect(() => {
    if (event_main) {
      setID(event_main._id);
      setStartTimeAndDate(event_main.start);
      setEndTimeAndDate(event_main.end);
      setTitle(event_main.title);
      setBackgroundColor(event_main.background);
      setSelectedMassageType(event_main.massageType);
 
      setFromTime(event_main.start && format(event_main.start, "hh:mma"))
      setToTime(event_main.end && format(event_main.end, "hh:mma"))
    }
  }, [event_main]);
  useEffect(() => {
    // This will run when `selectedMassageType` or `startTimeAndDate` changes
    const type = massageTypes.find(type => type.id === selectedMassageType);
    if (type) {
      const newEndTime = addMinutes(new Date(startTimeAndDate), type.duration);
      setEndTimeAndDate(newEndTime);
      // Automatically update selectedDuration based on massage type
      setSelectedDuration(type.duration);
    }
  }, [selectedMassageType, startTimeAndDate]);

  const changeEndTime = (length) => {
    //alert(`You change the lenght of the massage to ${length}`);
    //alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    const resetTimeAndDate = new Date(startTimeAndDate);//Reset time
    resetTimeAndDate.setMinutes(startTimeAndDate.getMinutes() + length);
    setEndTimeAndDate(resetTimeAndDate)
    //Uncommit later
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    //alert(to_time)//This give the previous time, not the new set time
    setEventLenght(length)
    //event.end = endTimeAndDate;
  };


  const changeMassageTypeAndTime = (id) => {
    alert(id)
    console.log(id)
    for (const massageType of massageTypes) {
      if (massageType.id === id) {
        setSelectedMassageType(massageType.name)
        changeEndTime(Number(massageType.duration))
        //alert(massageType.duration)
        //alert(endTimeAndDate)
        return null;
      }
    }
    return null;
  }
 
  const handleUpdateEvent = () => {
    const userEmail = user ? user.email : "not_signed_in";
    const duration = selectedDuration; // Make sure to validate this is either 60 or 120
 
    alert(selectedMassageType);
    const updatedEvent = {
      change_id: ID,
      status: "Update",
      title,
      start: event_main.start,//Selecting time here does not work
      end: endTimeAndDate,
      description: `Updated by user ${userEmail}, Duration: ${duration} minutes`,
      background: backgroundColor,
      user: userEmail,
      massageType: selectedMassageType,
    };
 
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })
    .then(response => response.json())
    .then(() => {
      handleClose();
      dispatch(fetchEventsStart());
    })
    .catch(error => console.error('Error updating event:', error));
  };
 
  const handleCancelEvent = () => {
    if (ID) {
      const userEmail = user ? user.email : "not_signed_in";
      const data = {
        change_id: ID,
        status: "Cancel",
        title,
        start: startTimeAndDate,
        end: endTimeAndDate,
        description: "Booking cancelled by user " + userEmail,
        background: "#ff0000",
        user: userEmail,
        massageType: selectedMassageType,
      };
 
      fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(res => res.json())
      .then(() => {
        handleClose();
        dispatch(fetchEventsStart());
      })
      .catch(error => {
        console.error("Error cancelling event:", error);
      });
    }
  };
 
  return (
    <BaseDialog open={open} handleClose={handleClose}>
      <Container sx={{ padding: "24px" }}>
        <DialogTitle>Update Booking</DialogTitle>
        <Typography>{`${formattedStartDate}, from ${from_time} to ${to_time}`}</Typography>
        <TextField
          fullWidth
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 2 }}
        />
 
        <Typography sx={{ mt: 2 }}>Massage Type:</Typography>
        <Select
          value={selectedMassageType}
          onChange={(e) => changeMassageTypeAndTime(e.target.value)} // Pass e.target.value directly
          fullWidth
          sx={{ mb: 2 }}
        >
          {massageTypes.map((type) => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>

        <Typography>Event Color:</Typography>
        <input
          type="color"
          value={backgroundColor}
          onChange={(e) => setBackgroundColor(e.target.value)}
          style={{ width: "100%", height: "40px", marginTop: "8px" }}
        />
        <Typography sx={{ mt: 2 }}>Adjust Duration:</Typography>
        <Select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(parseInt(e.target.value))}
          fullWidth
          sx={{ mb: 2 }}
        >
          {[60, 120].map(duration => (
            <MenuItem key={duration} value={duration}>
              {duration} minutes
            </MenuItem>
          ))}
        </Select>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <PrimaryButton onClick={handleUpdateEvent} disabled={!title}>Update Booking</PrimaryButton>
          <PrimaryButton onClick={handleCancelEvent} sx={{ ml: 2 }}>Cancel Booking</PrimaryButton>
        </div>
      </Container>
    </BaseDialog>
  );
};
 
const massageTypes = [
  { id: 'swedish', name: "Swedish", duration: 60 },
  { id: 'deepTissue', name: "Deep Tissue", duration: 60 },
  { id: 'sports', name: "Sports", duration: 90 },
  // Add more as needed
];

//Do not remove this line
export default UpdateEventPopup;