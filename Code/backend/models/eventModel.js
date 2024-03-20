const mongoose = require("mongoose");

const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    start: {
      type: Date,
      required: true,
    },
    end: {
      type: Date,
      required: false,//Fix booking and make it required
    },
    user: String,
    status: String,
    description: String,
    timezone: String,
    start_date: String,
    end_date: String,
    start_time: String,
    end_time: String,
    background: String,
    change_id: String,
    massageType: String,
    phone: String,
  },
  { timestamps: true, _id: true }
);

module.exports = mongoose.models.Event || mongoose.model("Event", eventSchema);
