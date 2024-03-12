import React from "react";
import { useState, useEffect} from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";
//To save user information
import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});

const CreateEventPopUp = ({ handleClose, open }) => {
  const [hasSelectLenght, setHasSelectLenght] = useState(false);//To make sure user has selected a lenght for the massage
  //more of these varibles may need to be converted to let
  var { event } = useSelector(mapState);
  var startTimeAndDate = event.start;

  const [endTimeAndDate, setEndTimeAndDate] = useState(event.end);
  
  var from_time = startTimeAndDate && format(startTimeAndDate, "hh:mma");
  const formattedStartDate = startTimeAndDate && format(startTimeAndDate, "eeee, MMMM dd, yyyy ");
  const [to_time, setToTime] = useState(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
  const [title, setTitle] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("#000000");
  const [massageLenght, setMassageLenght] = useState("Unselected");
  const dispatch = useDispatch();

  //To save user information
  const { user, isLoading } = useUser();

  //This is used to compare if a booking conflicts with another booking
  const allEvents = useSelector(state => state.eventsData.events);

  const reloadEvents = () => {
    const fetchData = async () => {
      // Dispatch the action to fetch events when the component mounts
      await dispatch(fetchEventsStart());
    };

    fetchData();
  };

  const changeEndTime = ({ length }) => {
    //alert(`You change the lenght of the massage to ${length}`);
    //alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    const resetTimeAndDate = new Date(startTimeAndDate);//Reset time
    resetTimeAndDate.setMinutes(startTimeAndDate.getMinutes() + length);
    setEndTimeAndDate(resetTimeAndDate)
    //setMassageLenght(length);
    setToTime(endTimeAndDate && format(endTimeAndDate, "hh:mma"));
    alert(`You change the lenght of the massage to ${endTimeAndDate}`);
    //alert(to_time)//This give the previous time, not the new set time
    setMassageLenght(length)
    //event.end = endTimeAndDate;
    
    setHasSelectLenght(true)//There is a delay to the change
    alert("You selected a massage lenght")
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if(!title){
      return;
    }

    //Back up if to make sure user selects a lenght
    if(massageLenght == "Unselected"){
      alert("Please select a massage lenght")
      return
    }

    //alert("checking if a massage lenght is selected")
    //alert(hasSelectLenght)//!hasSelectLenght
    if(!hasSelectLenght){//Can only pass if true
      alert("Please select a lenght for the massage before creating booking")
      //alert(hasSelectLenght)
      return
    }

    //Verify that the event does not conflict with other events in the database
    reloadEvents();
    alert("Checking for conflicts in database")
    if (true) {
      console.log(startTimeAndDate.toDateString())
      const startTimeAndDateString = startTimeAndDate.toDateString();
      for (let i = 0; i < allEvents.length; i++) {
        const singleEvent = allEvents[i];
        if (singleEvent.start === startTimeAndDateString) {
          console.log("conflict")
          alert("This event conflicts with another event");
          return;
        }
      }
    }

    ///////////////////////////////////testing infromation saving
    var userEmail = "___default"
    if(!user){
      alert("Please sign in")
      userEmail = "not_signed_in"
      //alert(userEmail)
    }else{
      userEmail = user.email
    }

    setHasSelectLenght(false)
    
    //////////////////////////////////testing
    //remember to fix the useremail below
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
      if(schema.background = null){
        alert("status/backgound colour not selected")
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
    handleCloseAndReset();
  };

  //Needs to run when the user closes by clicking outside
  const handleCloseAndReset = (e) => {
    //Clear certain data
    //If needed add or remove data here
    setHasSelectLenght(false)
    //setTitle("")//Leaving like this so that it can be used later if user makes a mistake
    setMassageLenght("Unselected")
    //setBackgroundColor("#000000")

    //Handle closing of the dialog box
    handleClose()
  }

  return (
    <BaseDialog open={open} handleClose={handleCloseAndReset} scroll={`body`} title={`Add Event`}>
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
            {formattedStartDate}, {from_time}{/*} - {to_time}This does not display properly*/}
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

        {/*}///////////////////////////////////////////Flag this div for deletion, so be replaced with massage prices and selector*/}
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
        {/*}///////////////////////////////////////////Flag previous div for deletion, so be replaced with massage prices and selector*/}
        
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
  30,
  60,
  90
]
