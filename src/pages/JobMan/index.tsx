import React, { useCallback, useEffect } from "react";
import { Container } from "react-bootstrap-v5";

import JobCreator from "../../components/JobCreator";
import JobList from "../../components/JobList";
import useJobs from "../../contexts/JobProvider";

const JobMan: React.FC = () => {
  const { jobs, setJobs } = useJobs();

  const saveToLocalStorage = useCallback(() => {
    window.localStorage.setItem("job-man", JSON.stringify(jobs));
  }, [jobs]);

  const loadFromLocalStorage = useCallback(() => {
    const ls = window.localStorage.getItem("job-man");
    try {
      if (ls === null) {
        throw new Error();
      }
      setJobs(JSON.parse(ls));
    } catch (err) {
      window.localStorage.removeItem("job-man");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadFromLocalStorage, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(saveToLocalStorage, [jobs]);

  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-4">Job Manager</h1>
      <JobCreator />
      <JobList />
    </Container>
  );
};

export default JobMan;
