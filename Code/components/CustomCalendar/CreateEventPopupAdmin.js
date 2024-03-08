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


const CreateEventPopUp = ({ handleClose, open }) => {
  var { event } = useSelector(mapState);
  var startTimeAndDate = event.start;//Here make both of these varibles var, const with useState does not work
  var endTimeAndDate = event.end;
  const [from_time, setFromTime] = useState(startTimeAndDate && format(startTimeAndDate, "hh:mma"));
  const formattedStartDate = startTimeAndDate && format(startTimeAndDate, "eeee, MMMM dd, yyyy ");
  const [to_time, setToTime] = useState(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
  const [title, setTitle] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [massageLenght, setMassageLenght] = useState("Unselected");
  const dispatch = useDispatch();

  const { user, isLoading } = useUser();

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
      //Do both of what the below functions do
    }else if(length == "end day"){
      //make endTimeAndDate the end of the day
    }else if(length == "start day"){
      //make startTimeAndDate the start of the day
    }
    
    alert(`You change the lenght of the massage to ${newTimeAndDate}`);
    endTimeAndDate = newTimeAndDate;
    setMassageLenght(length);
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    //event.end = endTimeAndDate;
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();

    alert(startTimeAndDate)
    alert(endTimeAndDate)

    if(!title){
      return;
    }

    //Save the user
    var userEmail = "___default"
    if(!user){
      //alert("Please sign in")
      userEmail = "not_signed_in"
    }else{
      userEmail = user.email
    }

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
    handleClose();
  };

  const handleCloseAndReset = (e) => {
    setHasSelectLenght(false)
    handleClose()
  }

  return (
    <BaseDialog open={open} handleClose={handleClose} scroll={`body`} title={`Add Event`}>
      <DialogTitle
        style={{
          fontSize: "21px",
          fontWeight: "bold",
          marginTop: "-24px",
        }}
      >
        Create booking
      </DialogTitle>
      <Container
        sx={{
          background: "white",
          top: "30%",
          left: "10%",
          minWidth: "450px",
          paddingBottom: "64px",
        }}
      >
        <div>Hello</div>
        {formattedStartDate && (
          <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
            {formattedStartDate}, {from_time} - {to_time}
          </Typography>
        )}
        <TextField
          fullWidth
          required
          sx={{ marginTop: "16px" }}
          placeholder="Client name or null"
          label="Client name or null"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {/*Replace following div with massage type selector*/}
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
        <div>Change start time</div>
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
              Selected color: <b>insert selected lenght</b>
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
            onClick={handleCreateEvent}
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
