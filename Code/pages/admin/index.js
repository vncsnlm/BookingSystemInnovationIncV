//This page is for admins to see all bookings and make changes
import CustomCalendar from "components/CustomCalendar/AdminSystem";
import Head from "next/head";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEventsStart } from "redux/events/eventsSlice";


export default function Home() {
  const dispatch = useDispatch();
  const mapState = ({ eventsData }) => ({
    events: eventsData.events,
  });
  const { events } = useSelector(mapState);

  const getAllEvents = () => {
    // fetch()
    dispatch(fetchEventsStart());
  };
  useEffect(() => {
    getAllEvents();
  }, []);
  
  const calendarEvents = events.map((item) => {
    const { start, end } = item;
    return {
      ...item,
      start: new Date(start),
      end: new Date(end),
    };
  });
  return (
    <div>
      <Head>
        <title>Admin booking system</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <CustomCalendar height={"100vh"} events={calendarEvents} />
    </div>
  );
}
