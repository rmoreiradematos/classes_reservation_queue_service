import { IRecurrence } from "../../application/interfaces/IRecurrence";

import DailyRecurrence from "./dailyRecurrence";
import MonthlyRecurrence from "./monthlyRecurrence";
import WeeklyRecurrence from "./weeklyRecurrence";

export default class RecurrenceFactory {
  constructor() {}
  createRecurrence(
    room_id: number,
    user_id: string,
    title: string,
    start_date: Date,
    end_date: Date,
    { type, details }: IRecurrence,
    period?: string,
    hour_start?: string,
    hour_end?: string,
    interval?: number
  ) {
    switch (type) {
      case "daily":
        return new DailyRecurrence(
          room_id,
          user_id,
          title,
          details,
          start_date,
          end_date,
          period,
          hour_start,
          hour_end,
          interval
        );
      case "weekly":
        return new WeeklyRecurrence(
          room_id,
          user_id,
          title,
          details,
          start_date,
          end_date,
          period,
          hour_start,
          hour_end
        );
      case "monthly":
        return new MonthlyRecurrence(
          room_id,
          user_id,
          title,
          details,
          start_date,
          end_date,
          period,
          hour_start,
          hour_end
        );
      default:
        throw new Error("Invalid recurrence type");
    }
  }
}
