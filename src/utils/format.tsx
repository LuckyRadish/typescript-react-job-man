import moment from "moment";

import { Status } from "../contexts/JobProvider";

export const hourlyFormat: (_: number) => string = (hourly) => "$" + hourly;

export const statusFormat: (_: Status) => JSX.Element = (status) => (
  <span
    className={
      status === Status.NotStarted
        ? "text-primary"
        : status === Status.InProgress
        ? "text-danger"
        : "text-success"
    }
  >
    {status}
  </span>
);

export const timeFormat: (_: Date) => string = (date) =>
  moment(date).format("L LT");
