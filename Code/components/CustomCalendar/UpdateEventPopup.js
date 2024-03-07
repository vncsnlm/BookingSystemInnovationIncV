//To update event
import React from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect} from "react";
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
  const [ID, setID] = useState(event_main._id)//To save goto
  const [startTimeAndDate, setStartTimeAndDate] = useState(event_main.start);
  const [endTimeAndDate, setEndTimeAndDate] = useState(event_main.end);
  const [from_time, setFromTime] = useState(startTimeAndDate && format(startTimeAndDate, "hh:mma"));
  const [formattedStartDate, setFormattedStartDate] = useState(startTimeAndDate && format(startTimeAndDate, "eeee, MMMM dd, yyyy "));
  const [to_time, setToTime] = useState(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
  //console.log("event_main.title:", event_main.title); need to reset the value with useEffect when event_main is updated
  const [title, setTitle] = useState(event_main.title);
  const [backgroundColor, setBackgroundColor] = useState(event_main.background);
  const [massageLenght, setMassageLenght] = useState(30);
  //const dispatch = useDispatch();

  //Reset values if event_main is changed or being reassigned
  useEffect(() => {
    if (event_main) {
      setID(event_main._id)
      setStartTimeAndDate(event_main.start);
      setEndTimeAndDate(event_main.end);
      setFromTime(event_main.start && format(event_main.start, 'hh:mma'));
      setFormattedStartDate(
        event_main.start && format(event_main.start, 'eeee, MMMM dd, yyyy ')
      );
      setToTime(event_main.end && format(event_main.end, 'hh:mma'));
      setTitle(event_main.title);
      setBackgroundColor(event_main.background);
      //setMassageLenght(event_main.lenght);
    }
  }, [event_main]);

  //No longer need in this section, can be used in admin side
  const handleRemoveEvent = () => {
    //alert(ID)//Ensure ID is defined
    if (ID) {
      //alert("Event ID is defined");
      const data = { 
        change_id: ID,
        title: title,
        status: "Delete", 
        start: startTimeAndDate, 
        end: endTimeAndDate,
        background: backgroundColor,
        user: event_main.user,
        description: event_main.description+" delete event by user ",//I start using the description event data storage
      };
      //alert(data)
      //console.log(data)
      //////////////////////////here
      const url = "/api/events";
      fetch(url, {
        method: "POST",//USing post work, but update and delete are not
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => {
          //console.log("Sending data")
          alert(res.ok)//Check if is something wrong with the res 
          //console.log("Response")
          if (!res.ok) {
            alert("Error")
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((json) => {
          handleClose();
          dispatch(fetchEventsStart({ url: "/api/events" }));
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleCancelEvent = () =>{
    try{
      if (ID) {
        //alert("Sending command to delete")
        const data = {
          change_id: ID,
          status: "Cancel",
          title: title,
          start: startTimeAndDate,
          end: endTimeAndDate,
          description: "",
          background: "#ff0000",
        };
        //alert("Sending command to delete")
        fetch("/api/events", {
          method: "POST",
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
      }
    } catch (error) {
      console.log(error);
    }
  }
  const testInfo = () =>{//All data should be working now
    alert(ID);
    //alert(event_main.title)
    //alert(title)
    //alert(event_main.start)
    //alert(event_main.end)
    //alert(event_main.background)
  }

  const changeEndTime = ({ length }) => {
    //alert(length+0)
    //alert(`You change the lenght of the massage to ${length}`);
    //alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    var newTimeAndDate = new Date(startTimeAndDate);//Reset time
    newTimeAndDate.setMinutes(startTimeAndDate.getMinutes() + length);
    alert(`You change the lenght of the massage to ${newTimeAndDate}`);
    setEndTimeAndDate(newTimeAndDate)
    setMassageLenght(length);
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    //event.end = endTimeAndDate;
  };

  const handleUpdateEvent = () =>{
    //this will update the bookings
    try{
    if (ID) {
      //alert("Sending command to delete")
      const data = {
        change_id: ID,
        status: "Update",
        title: title,
        start: startTimeAndDate,
        end: endTimeAndDate,
        description: "",
        background: backgroundColor,
      };
      //alert("Sending command to delete")
      fetch("/api/events", {
        method: "POST",
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
    }
  } catch (error) {
    console.log(error);
  }
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
        onChange={(e) => setTitle(e.target.value)/*alert("testing")*/}
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
            Update booking
          </PrimaryButton>
        </div>
      <div>
        <Typography fontSize={`20px`} fontWeight={`700`} paddingBottom="16px">
          Do you really want to cancel this event?
        </Typography>

        <div
          style={{
            justifyContent: "center",
            display: "flex",
          }}
        >
          <PrimaryButton title={`Confirm`} onClick={handleCancelEvent}>
            Cancel booking
          </PrimaryButton>
        </div>
      </div>
      </Container>
    </BaseDialog>
  );
};

//handleRemoveEvent
export default UpdateEventPopup;

const colorsList = [
  "#624b4b",
  "#bc2020",
  "#bc20b6",
  "#420b40",
  "#1fad96",
  "#3538ed",
  "#1c474a",
  "#32bb30",
  "#cae958",
  "#dc3e09",
];
const potentialLenght = [
  30,
  60,
  90
]