import { IRecurrenceDetails } from "../../application/interfaces/IRecurrence";

export default class WeeklyRecurrence {
  room_id: number;
  user_id: string;
  title: string;
  details: IRecurrenceDetails;
  start_date: Date;
  end_date: Date;
  period?: string;
  hour_start?: string;
  hour_end?: string;

  constructor(
    room_id: number,
    user_id: string,
    title: string,
    details: IRecurrenceDetails,
    start_date: Date,
    end_date: Date,
    period?: string,
    hour_start?: string,
    hour_end?: string
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
  }

  getNextDayOfWeek(date: Date, dayOfWeek: number) {
    const resultDate = new Date(date.getTime());
    resultDate.setDate(date.getDate() + ((7 - date.getDay() + dayOfWeek) % 7));
    return resultDate;
  }

  createReservations() {
    const reservations = [];
    const daysOfWeek = this.details.days_of_week.map((day) =>
      day.toLowerCase()
    );
    let currentDate = new Date(this.start_date);
    currentDate.setMinutes(currentDate.getMinutes() + currentDate.getTimezoneOffset());

    let endDate = new Date(this.end_date);
    endDate.setMinutes(endDate.getMinutes() + endDate.getTimezoneOffset());

    console.log(
      this.start_date,
      this.end_date,
      new Date(this.start_date),
      daysOfWeek
    );
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

    while (currentDate <= endDate) {
      const day = currentDate
        .toLocaleString("en-US", { weekday: "long" })
        .toLowerCase();
      if (daysOfWeek.includes(day)) {
        reservations.push({
          title: this.title,
          classId: Number(this.room_id),
          owner: this.user_id,
          dateStart: new Date(
            currentDate.toISOString().split("T")[0] + "T" + this.hour_start
          ),
          dateEnd: new Date(
            currentDate.toISOString().split("T")[0] + "T" + this.hour_end
          ),
        });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return reservations;
  }
}
