import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Typography } from "@mui/material";
import BaseDialog from "components/Common/Dialog";
import { fetchEventsStart } from "redux/events/eventsSlice";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";

const DeleteEventPopup = ({ target_event, open, handleClose }) => {
  const dispatch = useDispatch();
  const [eventId, setEventId] = useState(target_event ? target_event._id : null);

  useEffect(() => {
    if (target_event) {
      setEventId(target_event._id);
    }
  }, [target_event]);

  const handleRemoveEvent = () => {
    if (eventId) {
      const data = { id: eventId };
      fetch("/api/events", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then(() => {
          handleClose(); // Close the dialog after successful deletion
          dispatch(fetchEventsStart()); // Refresh the events list
        })
        .catch((error) => {
          console.error("Error deleting event:", error);
          alert("Failed to delete the event."); // Provide feedback in case of error
        });
    } else {
      alert("No event selected for deletion."); // Feedback when no event is selected
    }
  };

  return (
    <BaseDialog open={open} handleClose={handleClose}>
      <div style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "480px",
          flexDirection: "column",
          padding: "8px",
          marginTop: "16px",
        }}>
        <Typography fontSize={`20px`} fontWeight={`700`} paddingBottom="16px">
          Are you sure you want to delete this event?
        </Typography>
        <div style={{ justifyContent: "center", display: "flex" }}>
          <PrimaryButton onClick={handleRemoveEvent}>Confirm Deletion</PrimaryButton>
          <PrimaryButton onClick={handleClose} style={{ marginLeft: '10px' }}>Cancel</PrimaryButton>
        </div>
      </div>
    </BaseDialog>
  );
};

export default DeleteEventPopup;
