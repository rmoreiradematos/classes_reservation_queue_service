import { IRecurrenceDetails } from "../../application/interfaces/IRecurrence";

export default class DailyRecurrence {
  room_id: number;
  user_id: string;
  title: string;
  details: IRecurrenceDetails;
  start_date: Date;
  end_date: Date;
  period?: string;
  hour_start?: string;
  hour_end?: string;
  interval?: number;
  constructor(
    room_id: number,
    user_id: string,
    title: string,
    details: IRecurrenceDetails,
    start_date: Date,
    end_date: Date,
    period?: string,
    hour_start?: string,
    hour_end?: string,
    interval?: number
  ) {
    this.room_id = room_id;
    this.user_id = user_id;
    this.title = title;
    this.details = details;
    this.start_date = start_date;
    this.end_date = new Date(end_date);
    this.period = period;
    this.hour_start = hour_start;
    this.hour_end = hour_end;
    this.interval = interval;
  }

  createReservations() {
    const reservations = [];
    let currentDate = new Date(this.start_date);

    switch (this.period) {
      case "morning":
        this.hour_start = "08:00:00";
        this.hour_end = "12:00:00";
        break;
      case "afternoon":
        this.hour_start = "13:00:00";
        this.hour_end = "17:00:00";
        break;
      case "night":
        this.hour_start = "18:00:00";
        this.hour_end = "22:00:00";
        break;
    }

    while (currentDate <= this.end_date) {
      reservations.push({
        title: this.title,
        class_id: Number(this.room_id),
        owner: this.user_id,
        dateStart: new Date(
          currentDate.toISOString().split("T")[0] + "T" + this.hour_start
        ),
        dateEnd: new Date(
          currentDate.toISOString().split("T")[0] + "T" + this.hour_end
        ),
      });
      currentDate.setDate(currentDate.getDate() + (this.interval || 1));
    }

    return reservations;
  }
}
