import React, {
  createContext,
  useCallback,
  useContext,
  useReducer,
  useState,
} from "react";

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

type Setter = (_: IJob[]) => void;
type CreateFunc = (_: IJobDescription) => void;
export type JobHandler = (_: number) => void;

interface IContext {
  jobs: IJob[];
  setJobs: Setter;
  createJob: CreateFunc;
  startJob: JobHandler;
  finishJob: JobHandler;
  removeJob: JobHandler;
}

const JobContext = createContext<IContext>({
  jobs: [],
  setJobs: () => {},
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
  const [jobs, dispatch] = useReducer<Reducer>(reducer, []);
  const [nextId, setNextId] = useState<number>(0);

  const setJobs = useCallback<Setter>((jobs) => {
    setNextId(jobs.length > 0 ? 1 + Math.max(...jobs.map(({ id }) => id)) : 0);
    dispatch({ type: ActionType.Set, payload: { jobs } });
  }, []);

  const createJob = useCallback<CreateFunc>(
    (newJob) => {
      dispatch({ type: ActionType.Create, payload: { id: nextId, ...newJob } });
      setNextId((prev) => prev + 1);
    },
    [nextId]
  );

  const startJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Start, payload: { id } }),
    []
  );

  const finishJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Finish, payload: { id } }),
    []
  );

  const removeJob = useCallback<JobHandler>(
    (id) => dispatch({ type: ActionType.Remove, payload: { id } }),
    []
  );

  return (
    <JobContext.Provider
      value={{ jobs, setJobs, createJob, startJob, finishJob, removeJob }}
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
