import Event from "../models/eventModel";
import mongoose from "mongoose";

// get all Events
const getEvents = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });

  //This will not show cancelled events
  //const filteredEvents = events.filter((event) => event.background != "#ff0000");

  //This will change all booking titles to reserved when sent, this should be goo for you if user is signed out
  //Needs to know user ID, and then will not affact there booking
  const filteredEvents = events.filter((event) => {
    if ("UserID" != event.user) {
      //event.title = "Reserved"
    } 
    //Changes the colour of all event to black, can used for idenification purposes
    //event.background = "#000000";
  });

  res.status(200).json(events);
};

// get all Events with admin information, so it can show cancelled events
const getEventsAdmin = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });

  //Admin should be able to see all events, regardless if cancelled or not
  //const filteredEvents = events.filter((event) => event.background != "#ff0000");

  res.status(200).json(events);
};

// get all Events but remove all names from them
const getEventsByUser = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });
  
  //This will show cancelled events, but should be changed to show user cancelled events
  //const filteredEvents = events.filter((event) => event.background != "#ff0000");

  res.status(200).json(events);
};

//Show only booked times, probably best if user not logged in
const getEventsGeneral = async (req, res) => {
  const events = await Event.find({}).sort({ createdAt: -1 });

  //This will not show cancelled events
  const filteredEvents = events.filter((event) => event.background != "#ff0000");

  res.status(200).json(filteredEvents);
};

// get a single Event
const getEvent = async (req, res) => {
  const {
    query: { change_id },
  } = req;

  if (!mongoose.Types.ObjectId.isValid(change_id)) {
    return res.status(404).json({ error: "No such Event" });
  }

  const event = await Event.findById(change_id);

  if (!event) {
    return res.status(404).json({ error: "No such Event" });
  }

  res.status(200).json(event);
};

// create a new Event
const createEvent = async (req, res) => {
  const { title } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push("title");
  }
  if (emptyFields.length > 0) {
    return res
      .status(400)
      .json({ error: "Please fill in all fields", emptyFields });
  }

  // add to the database
  try {
    const event = await Event.create({
      ...req.body,
    });
    res.status(200).json({ result: event, status: "success" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// delete a Event
const deleteEvent = async (req, res) => {
  //console.log("Trying to delete event")
  try{
    const { change_id } = req.body;
    console.log("Checking if event is eligible for deletion")

    // console.log({ body: req.body, id: req.body.id });
    if (!mongoose.Types.ObjectId.isValid(change_id)) {
      console.log("Error")
      return res.status(400).json({
        error: "Invalid ObjectId provided",
      });
    }
    //json the change_id
    //const event_check = await Event.getEvent(change_id, res);

    const event = await Event.findOneAndDelete({ _id: change_id });

    if (!event) {
      return res.status(400).json({ error: "No such Event" });
    }

    res.status(200).json(event);
  }catch (error) {
    console.error("Error in deleteEvent:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update a Event
const updateEvent = async (req, res) => {
  console.log("Trying to updating event")
  const { change_id,status } = req.body;

  console.log(status)

  if (!mongoose.Types.ObjectId.isValid(change_id)) {
    return res.status(400).json({ error: "No such Event" });
  }

  const event = await Event.findOneAndUpdate(
    { _id: change_id },
    {
      ...req.body,
    }
  );

  if (!event) {
    return res.status(400).json({ error: "No such Event" });
  }

  res.status(200).json(event);
};

module.exports = {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
};
