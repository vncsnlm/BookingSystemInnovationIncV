//To update event
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
import { format } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";

import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

const UpdateEventPopup = ({ event_main, open, handleClose }) => {
  const dispatch = useDispatch();

  const [hasSelectLenght, setHasSelectLenght] = useState(false);//To make sure user has selected a lenght for the massage
  //more of these varibles may need to be converted to let
  var { event } = useSelector(mapState);
  var startTimeAndDate = event_main.start;
  var endTimeAndDate = event_main.end;
  var from_time = startTimeAndDate && format(startTimeAndDate, "hh:mma");
  const formattedStartDate = startTimeAndDate && format(startTimeAndDate, "eeee, MMMM dd, yyyy ");
  const [to_time, setToTime] = useState(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
  const [title, setTitle] = useState(event_main.title);
  const [backgroundColor, setBackgroundColor] = useState(event_main.background);
  const [massageLenght, setMassageLenght] = useState(30);
  //const dispatch = useDispatch();

  const handleRemoveEvent = () => {
    const data = {
      id: event_main._id,
    };
    fetch("/api/events", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((json) => {
        handleClose();

        dispatch(fetchEventsStart());
      });
  };

  const handleUpdateEvent = () =>{
    //this will update the bookings
  }

  return (
    <BaseDialog open={open} handleClose={handleClose}>
      <Container
        sx={{
          background: "white",
          top: "30%",
          left: "10%",
          minWidth: "450px",
          paddingBottom: "64px",
        }}
      >
        {formattedStartDate && (
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
            {formattedStartDate}, {from_time} - {to_time}
          </Typography>
        )}
        <TextField
          fullWidth
          required
          sx={{ marginTop: "16px" }}
          placeholder="Your name"
          label="Your name"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div>
          <div style={{ paddingTop: "16px" }}>
            <label style={{ fontWeight: 700, fontSize:"1.2rem" }}>Select Event Color</label>
            <div style={{ display: "flex",marginTop:'12px',marginBottom:'4px' }}>
              {colorsList.map((item) => {
                return (
                  <div
                    key={item}
                    style={{
                      background: item,
                      width: "20px",
                      height: "20px",
                      marginRight: "8px",
                    }}
                    onClick={() => setBackgroundColor(item)}
                  ></div>
                );
              })}
            </div>

            <input
              type={"color"}
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
              style={{
                width: "100%",
                marginTop: "4px",
                border: "none",
                background: "none",
              }}
            />
            <Typography>
              Selected color: <b>{backgroundColor}</b>
            </Typography>
          </div>
        </div>
        <div>
        
            <div>Change duration
              <div style={{ display: 'flex', marginTop: '12px', marginBottom: '4px' }}>
                {potentialLenght.map((item) => (
                <button
                  key={item}
                  style={{
                  marginRight: '8px',
                  padding: '8px', // Add padding for better styling
                  cursor: 'pointer', // Add cursor pointer for better UX
                }}
                onClick={() => changeEndTime({length:item})}//Why it has to call length like this, I have no clue, but it has to be like this.
                >
                {item}
                </button>
                ))}
              </div>
            <div>
              Selected lenght: <b>{massageLenght} minutes</b>
            </div>
            </div>
        </div>
        

        <div
          style={{
            display: "flex",
            padding: "8px",
            justifyContent: "center",
            paddingTop: "32px",
          }}
        >
          <PrimaryButton
            onClick={handleUpdateEvent}
            sx={{
              // paddingRight: "32px",
              // paddingLeft: "32px",
              width:"200px"
            }}
            disabled={!title}
          >
            Confirm
          </PrimaryButton>
        </div>
      </Container>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          maxWidth: "480px",
          flexDirection: "column",
          paddingLeft: "8px",
          paddingRight: "8px",
          marginTop: "16px",
        }}
      >
        <Typography fontSize={`20px`} fontWeight={`700`} paddingBottom="16px">
          Do you really want to delete this event?
        </Typography>

        <div
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <PrimaryButton title={`Confirm`} onClick={handleRemoveEvent}>
            Confirm
          </PrimaryButton>
        </div>
      </div>
    </BaseDialog>
  );
};

export default UpdateEventPopup;

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
  30,
  60,
  90
]