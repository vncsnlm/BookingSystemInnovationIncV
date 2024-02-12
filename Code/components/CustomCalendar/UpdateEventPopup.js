//To update event
import React from "react";
import {
  Container,
  Dialog,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import PrimaryButton from "components/Common/Buttons/PrimaryButton";
import { useDispatch, useSelector } from "react-redux";
import { format } from "date-fns";
import { fetchEventsStart } from "redux/events/eventsSlice";
import BaseDialog from "components/Common/Dialog";

import { useUser } from '@auth0/nextjs-auth0/client';

const mapState = ({ eventsData }) => ({
  event: eventsData.event,
});