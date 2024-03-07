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
      const { status, user } = req.body;
      //console.log("Here is status")
      console.log(status)
      //console.log(res)
      if(status == "Update" || status == "Cancel"){
        console.log("Update")

        //Basic verify the incoming data
        //Basic authenication at this stage, deactivate as not needed in development
        /*if(!user){
          res.status(400).json({ success: false });
          break
        }
        if(user == "" || user == undefined){
          res.status(400).json({ success: false });
          break
        }
        //Basic authenication at this stage, need to check against valid user ID
        if(user == "not_signed_in" || user == "___default"){
          //res.status(400).json({ success: false });
          //break
        }*/

        //await getEvent(req, res);put ID and double check if it is cancelled
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
