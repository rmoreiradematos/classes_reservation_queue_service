export interface IRecurrence {
  type: string;
  details: IRecurrenceDetails;
}

export interface IRecurrenceDetails {
  days_of_week: Array<string>;
  day_of_month: number;
  week_of_month: number;
}
