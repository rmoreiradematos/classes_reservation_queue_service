import { IRecurrenceDetails } from "../../application/interfaces/IRecurrence";

export default class MonthlyRecurrence {
  room_id: number;
  user_id: number;
  details: IRecurrenceDetails;
  start_date: Date;
  end_date: Date;
  period?: string;
  hour_start?: string;
  hour_end?: string;

  constructor(
    room_id: number,
    user_id: number,
    details: IRecurrenceDetails,
    start_date: Date,
    end_date: Date,
    period?: string,
    hour_start?: string,
    hour_end?: string
  ) {
    this.room_id = room_id;
    this.user_id = user_id;
    this.details = details;
    this.start_date = start_date;
    this.end_date = new Date(end_date);
    this.period = period;
    this.hour_start = hour_start;
    this.hour_end = hour_end;
  }

  getDayNameFromNumber(dayNumber: number) {
    const date = new Date(2021, 0, dayNumber);
    return date.toLocaleString("en-US", { weekday: "long" }).toLowerCase();
  }

  createReservations() {
    const reservations = [];
    const { day_of_month, week_of_month } = this.details;
    const targetDayName = this.getDayNameFromNumber(day_of_month);
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
      const month = currentDate.getMonth();
      const year = currentDate.getFullYear();
      let weekCount = 0;
      while (currentDate.getMonth() === month) {
        const day = currentDate
          .toLocaleString("en-US", { weekday: "long" })
          .toLowerCase();
        if (day === targetDayName) {
          weekCount++;
          if (weekCount === week_of_month) {
            reservations.push({
              classId: Number(this.room_id),
              owner: Number(this.user_id),
              dateStart: new Date(
                currentDate.toISOString().split("T")[0] + "T" + this.hour_start
              ),
              dateEnd: new Date(
                currentDate.toISOString().split("T")[0] + "T" + this.hour_end
              ),
            });
            break;
          }
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      currentDate = new Date(year, month + 1, 1);
    }

    return reservations;
  }
}
