import React, { useState, useEffect } from "react";
import { Container, DialogTitle, TextField, Typography, Select, MenuItem } from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format, parseISO, addMinutes, isValid } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";
import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

const UpdateEventPopup = ({ event_main, open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useUser();
  
  const [ID, setID] = useState(event_main ? event_main._id : '');
  const [startTimeAndDate, setStartTimeAndDate] = useState(event_main ? parseISO(event_main.start) : new Date());
  const [endTimeAndDate, setEndTimeAndDate] = useState(event_main ? parseISO(event_main.end) : addMinutes(new Date(), 60));
  const [title, setTitle] = useState(event_main ? event_main.title : '');
  const [backgroundColor, setBackgroundColor] = useState(event_main ? event_main.background : '#000000');
  const [selectedDuration, setSelectedDuration] = useState(60); // Duration is either 60 or 120
  const [selectedMassageType, setSelectedMassageType] = useState(event_main ? event_main.massageType : 'Unselected'); // Default to first type

  //const isValidStart = isValid(startTimeAndDate);
  const [formattedStartDate, setFormattedStartDate] = useState(event_main.start && format(event_main.start, "eeee, MMMM dd, yyyy "));
  const [from_time, setFromTime] = useState("Unselected");
  const [to_time, setToTime] = useState("Unselected");
  
  useEffect(() => {
    if (event_main) {
      setID(event_main._id);
      setStartTimeAndDate(parseISO(event_main.start));
      setEndTimeAndDate(parseISO(event_main.end));
      setTitle(event_main.title);
      setBackgroundColor(event_main.background);
      setSelectedMassageType(event_main.massageType);

      setFromTime(event_main.start && format(event_main.start, "hh:mma"))
      setToTime(event_main.end && format(event_main.end, "hh:mma"))
    }
  }, [event_main]);

  const handleUpdateEvent = () => {
    const userEmail = user ? user.email : "not_signed_in";
    const duration = selectedDuration; // Make sure to validate this is either 60 or 120

    const updatedEvent = {
      change_id: ID,
      status: "Update",
      title,
      start: event_main.start,
      end: event_main.end,
      description: `Updated by user ${userEmail}, Duration: ${duration} minutes`,
      background: backgroundColor,
      user: userEmail,
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
      fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ change_id: ID, status: "Cancel", user: userEmail }),
      })
      .then(response => response.json())
      .then(() => {
        handleClose();
        dispatch(fetchEventsStart());
      })
      .catch(error => console.error('Error cancelling event:', error));
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
          label="Client Name or Reserved"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 2 }}
        />
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

export default UpdateEventPopup;
