import React, { useState } from "react";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay, addMinutes } from "date-fns";
import enUS from "date-fns/locale/en-US";
import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { useDispatch } from "react-redux";
import CreateEventPopupAdmin from "./CreateEventPopupAdmin";
import UpdateEventPopupAdmin from "./AdminUpdateEventPopup";
import { fetchEventsStart, setEventData } from "redux/events/eventsSlice";

const locales = { "en-US": enUS };

const CustomCalendar = ({ events = [], height, style }) => {
  const calendarRef = React.createRef();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const [openRemoveDialog, setOpenRemoveDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const localizer = dateFnsLocalizer({ format, parse, startOfWeek, getDay, locales });
  const currentDate = new Date();
  const lastBookableDate = new Date(currentDate);
  lastBookableDate.setDate(currentDate.getDate() + 14); // Two weeks from now

  const customDayPropGetter = (date) => ({
    className: date < currentDate || date > lastBookableDate ? "disabled-day" : "",
    style: {
      cursor: date < currentDate || date > lastBookableDate ? "not-allowed" : "pointer",
      background: date < currentDate || date > lastBookableDate ? "rgba(184, 184, 184, 0.1)" : "",
    },
  });

  const setEventCellStyling = (event) => ({
    style: {
      background: event.background || "rgba(7, 97, 125, 0.1)",
      border: `1px solid ${event.background || "#07617D"}`,
      color: "#07617D",
      borderLeft: `3px solid ${event.background || "#07617D"}`,
      fontWeight: 600,
      fontSize: "11px",
    },
  });

  const handleSelect = ({ start, end }) => {
    if (start < currentDate || start > lastBookableDate) return;
    dispatch(setEventData({ start, end }));
    setOpenDialog(true);
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setOpenRemoveDialog(true);
  };

  return (
    <>
      <div className="">Admin sections</div>
      <button onClick={() => dispatch(fetchEventsStart())}>Refresh</button>
      <DragAndDropCalendar
        ref={calendarRef}
        localizer={localizer}
        popup
        events={events}
        selectable
        resizable
        longPressThreshold={1}
        eventPropGetter={setEventCellStyling}
        dayPropGetter={customDayPropGetter}
        onSelectSlot={handleSelect}
        onSelectEvent={handleEventSelect}
        views={{ week: true }}
        step={30}
        scrollToTime={new Date()}
        defaultView={"week"}
        style={{ marginRight: '20px', height: height || "68vh", ...style }}
      />
      <CreateEventPopupAdmin open={openDialog} handleClose={() => setOpenDialog(false)} />
      <UpdateEventPopupAdmin open={openRemoveDialog} handleClose={() => setOpenRemoveDialog(false)} event_main={selectedEvent} />
    </>
  );
};

export default CustomCalendar;
