import React, { createContext, useCallback, useContext } from "react";
// @ts-ignore
import createPersistedReducer from "use-persisted-reducer";
// @ts-ignore
import createPersistedState from "use-persisted-state";

const usePersistedJobsReducer = createPersistedReducer("jobs");
const usePersistedNextIdState = createPersistedState("nextId");

export enum Status {
  NotStarted = "Not started",
  InProgress = "In progress",
  Finished = "Finished",
}

export interface IJobDescription {
  title: string;
  client: string;
  hourly: number;
}

export interface IJob extends IJobDescription {
  id: number;
  status: Status;
  createdAt: Date;
  updatedAt: Date;
}

export type JobCreator = (_: IJobDescription) => void;
export type JobHandler = (_: number) => void;

interface IContext {
  jobs: IJob[];
  createJob: JobCreator;
  startJob: JobHandler;
  finishJob: JobHandler;
  removeJob: JobHandler;
}

const JobContext = createContext<IContext>({
  jobs: [],
  createJob: () => {},
  startJob: () => {},
  finishJob: () => {},
  removeJob: () => {},
});

enum ActionType {
  Set = "Set",
  Create = "Create",
  Start = "Start",
  Finish = "Finish",
  Remove = "Remove",
}

type Reducer = (
  state: IJob[],
  action: { type: ActionType; payload?: any }
) => IJob[];

const reducer: Reducer = (state, { type, payload }) => {
  switch (type) {
    case ActionType.Set:
      return payload?.jobs;

    case ActionType.Create:
      return [
        ...state,
        {
          ...payload,
          status: Status.NotStarted,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

    case ActionType.Start:
      return state.map((job) =>
        job.id === payload?.id
          ? { ...job, status: Status.InProgress, updatedAt: new Date() }
          : job
      );

    case ActionType.Finish:
      return state.map((job) =>
        job.id === payload?.id
          ? { ...job, status: Status.Finished, updatedAt: new Date() }
          : job
      );

    case ActionType.Remove:
      return state.filter((job) => job.id !== payload?.id);

    default:
      return state;
  }
};

export const JobProvider: React.FC<any> = (props) => {
  const [jobs, dispatch] = usePersistedJobsReducer<Reducer>(reducer, []);
  const [nextId, setNextId] = usePersistedNextIdState<number>(0);

  const createJob = useCallback<JobCreator>(
    (newJob) => {
      dispatch({ type: ActionType.Create, payload: { id: nextId, ...newJob } });
      setNextId(nextId + 1);
    }, // eslint-disable-next-line react-hooks/exhaustive-deps
    [nextId]
  );

  const startJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Start, payload: { id } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const finishJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Finish, payload: { id } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const removeJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Remove, payload: { id } }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <JobContext.Provider
      value={{ jobs, createJob, startJob, finishJob, removeJob }}
      {...props}
    />
  );
};

const useJobs = () => {
  if (!JobContext) {
    throw new Error("useJobs() must be invoked inside a JobProvider.");
  }
  return useContext(JobContext);
};

export default useJobs;
