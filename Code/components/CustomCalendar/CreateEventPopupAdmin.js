import React, { useState } from "react";
import { Container, DialogTitle, TextField, Typography, MenuItem, Select } from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format,isValid, parseISO, addMinutes } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";
import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

// Define the massage types
const massageTypes = [
  { id: 1, name: "Swedish", duration: 60 },
  { id: 2, name: "Deep Tissue", duration: 60 },
  { id: 3, name: "Sports", duration: 90 },
  // Add more as needed
];

const durationOptions = [
  { label: "1 Hour", value: 60 },
  { label: "2 Hours", value: 120 },
];

const CreateEventPopUp = ({ handleClose, open }) => {
  const { event } = useSelector(mapState);
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [selectedMassageType, setSelectedMassageType] = useState(massageTypes[0].id); // Default to first type
  const [selectedDuration, setSelectedDuration] = useState(60); // Default to 60 minutes
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const { user, isLoading } = useUser();

  const startTimeAndDate = event && event.start ? parseISO(event.start) : new Date();
  const endTimeAndDate = addMinutes(startTimeAndDate, selectedDuration);
  const isValidStart = isValid(startTimeAndDate);
  const formattedStartDate = isValidStart ? format(startTimeAndDate, "eeee, MMMM dd, yyyy ") : '';
  const from_time = isValidStart ? format(startTimeAndDate, "hh:mma") : '';
  const to_time = isValidStart ? format(endTimeAndDate, "hh:mma") : '';
  const handleCreateEvent = e => {
    e.preventDefault();

    var userEmail = user?.email || "not_signed_in";
    try {
      const schema = {
        title,
        status: "New",
        description: `Booking for ${massageTypes.find(type => type.id === selectedMassageType).name} massage created by user ${userEmail}. Duration: ${selectedDuration} minutes.`,
        user: userEmail,
        background: backgroundColor,
        start: startTimeAndDate,
        end: endTimeAndDate,
        massageType: selectedMassageType,
      };

      fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(schema),
      })
      .then(res => res.json())
      .then(() => {
        dispatch(fetchEventsStart());
        handleClose();
      });
    } catch (error) {
      console.error("Error creating event:", error);
    }
  };

  return (
    <BaseDialog open={open} handleClose={handleClose}>
      <Container sx={{
        background: "white",
        minWidth: "450px",
        paddingBottom: "64px",
      }}>
        {formattedStartDate && (
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
            {formattedStartDate}, {from_time} - {to_time}
          </Typography>
        )}
        <TextField
          fullWidth
          required
          sx={{ marginTop: "16px" }}
          placeholder="Client name"
          label="Client name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <Typography sx={{ mt: 2 }}>Massage Type:</Typography>
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
        <Typography sx={{ mt: 2 }}>Duration:</Typography>
        <Select
          value={selectedDuration}
          onChange={(e) => setSelectedDuration(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        >
          {durationOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
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
        <div style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "32px",
        }}>
          <PrimaryButton onClick={handleCreateEvent} disabled={!title || isLoading}>
            Confirm
          </PrimaryButton>
        </div>
      </Container>
    </BaseDialog>
  );
};

export default CreateEventPopUp;
