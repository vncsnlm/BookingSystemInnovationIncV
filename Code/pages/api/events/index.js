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
  //This is probably unneeded, suppose to allow cors, but does not help
  //res.setHeader("Access-Control-Allow-Credentials", true);
  //res.setHeader("Access-Control-Allow-Origin", "*"); // Set to your specific domain in production
  //res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, UPDATE, TEST");
  //res.setHeader("Access-Control-Allow-Headers", "Content-Type");

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

  //Add ID verification if allowed to make changes or not
  //Probably only needed for post, but not delete or update since does not work

  switch (method) {
    case "GET":
      //console.log("Get")
      await getEvents(req, res);
      break;
    case "POST":
      //console.log("Post")
      //console.log(req.body.status)//Get this wokring and then updates should work
      const { status, user, description, start, end } = req.body;
      //console.log("Here is status")
      console.log(status)

      //Backend verification here
      //Uncomment out the lines in below section to activate verification
      if(user == "not_signed_in"){
        //res.status(403).json({ success: false });
        //break;
      }
      if(description == ""){//Description should be filled by the frontend
        //res.status(400).json({ success: false });
        //break;
      }
      if(start == null || end == null){
        res.status(400).json({ success: false });
        break;
      }
      const startTimeAndDateString = start.toISOString();
      const endTimeAndDateString = end.toISOString();
      if(startTimeAndDateString >= endTimeAndDateString){//Start time should be before end time
        res.status(400).json({ success: false });
        break;
      }

      //console.log(res)
      if(status == "Update" || status == "Cancel"){
        console.log(status)

        //Add verification here
        
        await updateEvent(req, res);
        break;
      }else if(status == "Delete"){
        console.log("Delete")
        await deleteEvent(req, res);
        break;
      }
      ///////////////////////////////////Flag
      console.log("POST Create")
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
