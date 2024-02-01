//component from https://dev.to/himohit/building-a-calendar-app-with-nextjs-mongodb-react-big-calendar-and-redux-5d6o

import { all, call } from "redux-saga/effects";
import eventsSagas from "./events/events.saga";


export default function* rootSaga() {
    yield all([call(eventsSagas)]);
}
