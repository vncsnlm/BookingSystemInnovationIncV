import { createSlice } from "@reduxjs/toolkit";
//Find how get all events from database works, and change it to send user ID

const initialState = {
  event: {},
  events: [],
};

export const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    setEventData(state, action) {
      state.event = action.payload;
    },
    fetchEventsStart() {},
    setEvents(state, action) {
      state.events = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { setEventData, setEvents, fetchEventsStart, setSchedules } =
  eventsSlice.actions;

export default eventsSlice.reducer;
