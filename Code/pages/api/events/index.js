import dbConnect from "utils/mongoDbConnect";
import {
  getEvents,
  getEvent,
  createEvent,
  deleteEvent,
  updateEvent,
} from "backend/controllers/eventController";

// Enable CORS for this API route
export const config = {
  api: {
    // Disable bodyParser: false, // Enable custom body parsing
  },
};

export default async function handler(req, res) {
  //MAybe this will allow CORS and delete and updates
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*"); // Set to your specific domain in production
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE, TEST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  //I am not sure if this is necessary
  if (req.method === "OPTIONS") {
    // Preflight request. Reply successfully:
    res.status(200).end();
    return;
  }

  const { method } = req;
  console.log("Got a request")
  console.log(method)
  //console.log(req)//Is req an accepted method, print too much data tho
  await dbConnect();

  switch (method) {
    case "GET":
      //console.log("Get")
      await getEvents(req, res);
      break;
    case "POST":
      //console.log("Post")
      
      ///////////////////////////Flag
      
      //console.log(req.body.status)//Get this wokring and then updates should work
      const { status } = req.body;
      console.log("Here is status")
      console.log(status)
      //console.log(res)
      
      if(status == "Update"){
        console.log("Update")
        await updateEvent(req, res);
        break;
      }else if(status == "Delete"){
        console.log("Update")
        await deleteEvent(req, res);
        break;
      }
      ///////////////////////////////////Flag
      await createEvent(req, res);
      break;
    case "DELETE":
      //console.log("Delete")
      await deleteEvent(req, res);
      break;
    case "UPDATE":
      //console.log("Update")
      await updateEvent(req, res);
      break;
    case "TEST":
      console.log("Test connection")
      break
    default:
      //console.log("Unknown request")
      res.status(400).json({ success: false });
      break;
  }
}
