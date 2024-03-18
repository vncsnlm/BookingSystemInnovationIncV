import React from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
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

  useEffect(() => {
    setFromTime(startTimeAndDate && format(startTimeAndDate, "hh:mma"));
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
  })

  const changeEndTime = ({ length }) => {
    //alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    const newTimeAndDate = new Date(endTimeAndDate);//Reset time

    //if change lenght here
    if(length == "+30"){
      newTimeAndDate.setMinutes(endTimeAndDate.getMinutes() + 30);
    }else if(length == "-30"){
      newTimeAndDate.setMinutes(endTimeAndDate.getMinutes() - 30);
    }else if(length == "+60"){
      newTimeAndDate.setMinutes(endTimeAndDate.getMinutes() + 60);
    }else if(length == "-60"){
      newTimeAndDate.setMinutes(endTimeAndDate.getMinutes() - 60);
    }else if(length == "all day"){
      startTimeAndDate.setHours(0)
      startTimeAndDate.setMinutes(0)
      endTimeAndDate.setHours(23)
      endTimeAndDate.setMinutes(59)
      //Do both of what the below functions do
    }else if(length == "end day"){
      //make endTimeAndDate the end of the day
      endTimeAndDate.setHours(23)
      endTimeAndDate.setMinutes(59)
    }else if(length == "start day"){
      startTimeAndDate.setHours(0)
      startTimeAndDate.setMinutes(0)
      //make startTimeAndDate the start of the day
    }

    //alert(endTimeAndDate);
    
    //alert(`You change the lenght of the massage to ${newTimeAndDate}`);
    endTimeAndDate = newTimeAndDate;
    setMassageLenght(length);
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    //event.end = endTimeAndDate;
  };

  const handleCreateEvent = (e) => {
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
            {formattedStartDate}, Time: {from_time} to {to_time}
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

const colorsList = [
  "#624b4b",
  "#bc2020",
  "#bc20b6",
  " #420b40",
  "#1fad96",
  "#3538ed",
  " #1c474a",
  "#32bb30",
  "#cae958",
  "#dc3e09",
];
const potentialLenght = [
  "all day",
  "start day",
  "end day",
  "+30",
  "-30",
  "+60",
  "-60",
]
