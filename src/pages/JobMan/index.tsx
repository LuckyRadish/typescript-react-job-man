import React from "react";
import { Container } from "react-bootstrap-v5";

import JobCreator from "../../components/JobCreator";
import JobList from "../../components/JobList";

const JobMan: React.FC = () => {
  return (
    <Container className="d-flex flex-column align-items-center">
      <h1 className="my-4">Job Manager</h1>
      <JobCreator />
      <JobList />
    </Container>
  );
};

export default JobMan;
