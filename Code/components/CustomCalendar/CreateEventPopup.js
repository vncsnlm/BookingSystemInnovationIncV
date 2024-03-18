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
  const { user } = useUser();

  // Process start and end time
  const startTime = event.start ? parseISO(event.start) : new Date();
  const endTime = event.end ? parseISO(event.end) : addMinutes(new Date(), 60); // Default to 60 minutes later
  const formattedStartDate = isValid(startTime) ? format(startTime, "eeee, MMMM dd, yyyy") : '';
  const from_time = isValid(startTime) ? format(startTime, "hh:mma") : '';
  const to_time = isValid(endTime) ? format(endTime, "hh:mma") : '';

  const handleCreateEvent = (e) => {
    e.preventDefault();

    // Get massage duration based on selected type
    const selectedType = massageTypes.find(type => type.id === selectedMassageType);
    const duration = selectedType ? selectedType.duration : 60; // Default duration is 60 minutes

    if (![60, 120].includes(duration)) {
      alert("Please select a valid duration (60 or 120 minutes).");
      return;
    }

    const userEmail = user?.email || "not_signed_in";
    const newEventData = {
      title,
      start: startTime,
      end: addMinutes(startTime, duration),
      user: userEmail,
      background: backgroundColor,
      massageType: selectedType.name,
      description: `Massage type: ${selectedType.name}, Duration: ${duration} minutes`
    };

    // Dispatch an action to create event
    dispatch(setEventData(newEventData));
    fetch("/api/events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newEventData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      dispatch(fetchEventsStart()); // Reload events from server
      handleClose();
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

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
