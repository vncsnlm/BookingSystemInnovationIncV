import dbConnect from "utils/mongoDbConnect";
import {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
} from "backend/controllers/eventController";

export default async function handler(req, res) {
  const { method } = req;
  console.log("Got a request")
  //console.log(req)//Is req an accepted method, print too much data tho
  await dbConnect();

  switch (method) {
    case "GET":
      console.log("Get")
      await getEvents(req, res);
      break;
    case "POST":
      console.log("Post")
      await createEvent(req, res);
      break;
    case "DELETE":
      console.log("Delete")
      await deleteEvent(req, res);
      break;
    case "UPDATE":
      console.log("Update")
      await updateEvent(req, res);
      break;
    default:
      console.log("Unknown")
      res.status(400).json({ success: false });
      break;
  }
}
