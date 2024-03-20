import React, { useState, useEffect } from "react";
import {
  Container,
  DialogTitle,
  TextField,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch } from "react-redux";
import { format, addMinutes, isValid, parseISO } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";
import { useUser } from '@auth0/nextjs-auth0/client';

const massageTypes = [
  { id: 'swedish', name: 'Swedish', duration: 60 },
  { id: 'deepTissue', name: 'Deep Tissue', duration: 60 },
  { id: 'sports', name: 'Sports', duration: 90 },
  // Add more types as needed
];

const UpdateEventPopup = ({ event_main, open, handleClose }) => {
  const dispatch = useDispatch();
  const { user } = useUser();

  const [ID, setID] = useState(event_main ? event_main._id : '');
  const [startTimeAndDate, setStartTimeAndDate] = useState(event_main ? parseISO(event_main.start) : new Date());
  const [endTimeAndDate, setEndTimeAndDate] = useState(event_main ? parseISO(event_main.end) : new Date());
  const [title, setTitle] = useState(event_main ? event_main.title : '');
  const [backgroundColor, setBackgroundColor] = useState(event_main ? event_main.background : '#000000');
  const [selectedMassageType, setSelectedMassageType] = useState(event_main ? event_main.massageType : "Unselected");//event_main && event_main.massageType ? event_main.massageType : massageTypes[0].id
  
  useEffect(() => {
    if (event_main) {
      setID(event_main._id);
      setStartTimeAndDate(parseISO(event_main.start));
      setEndTimeAndDate(parseISO(event_main.end));
      setTitle(event_main.title);
      setBackgroundColor(event_main.background);
      setSelectedMassageType(event_main.massageType || massageTypes[0].id);
    }
  }, [event_main]);

  const handleUpdateEvent = () => {
    const userEmail = user ? user.email : "not_signed_in";
    const updatedEndTime = isValid(startTimeAndDate) ? addMinutes(startTimeAndDate, selectedMassageType ? massageTypes.find(type => type.id === selectedMassageType).duration : 60) : new Date();

    const data = {
      change_id: ID,
      status: "Update",
      title,
      start: event_main.start,
      end: event_main.end,
      description: `Booking updated by user ${userEmail}, Duration: ${selectedMassageType ? massageTypes.find(type => type.id === selectedMassageType).duration : 60} mins, Massage Type: ${selectedMassageType}`,
      background: backgroundColor,
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
      console.error("Error updating event:", error);
    });
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
        <Typography>
          {isValid(startTimeAndDate) && isValid(endTimeAndDate) ? 
              `${format(startTimeAndDate, 'eeee, MMMM dd, yyyy')}, ${format(startTimeAndDate, 'hh:mma')} - ${format(endTimeAndDate, 'hh:mma')}` :
              'Invalid Date'}
        </Typography>
        <TextField
          fullWidth
          required
          label="Client Name or Reserved"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ my: 2 }}
        />
        <Typography>Massage Type:</Typography>
        <Select
          value={selectedMassageType}
          onChange={(e) => setSelectedMassageType(e.target.value)}
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
        <div style={{ display: "flex", justifyContent: "center", marginTop: "24px" }}>
          <PrimaryButton onClick={handleUpdateEvent} disabled={!title}>Update Booking</PrimaryButton>
          <PrimaryButton onClick={handleCancelEvent}>Cancel Booking</PrimaryButton>
        </div>
      </Container>
    </BaseDialog>
  );
};

const massages = [
  'Swedish', 
  'Deep Tissue', 
  'Sports',
];

export default UpdateEventPopup;
