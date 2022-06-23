import React, { useEffect } from "react";
import { Container } from "react-bootstrap-v5";

import JobCreator from "../../components/JobCreator";
import JobList from "../../components/JobList";
import useJobs from "../../contexts/JobProvider";

const JobMan: React.FC = () => {
  const { jobs, loadFromLocalStorage, saveToLocalStorage } = useJobs();

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
