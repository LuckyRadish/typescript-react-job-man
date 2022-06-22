import React, {
  ChangeEventHandler,
  FormEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Form, FormControl, Row, Col, Button } from "react-bootstrap-v5";
import { makeStyles } from "@material-ui/core";

import useJobs, { IJobDescription } from "../../contexts/JobProvider";

const useStyles = makeStyles(() => ({
  form: {
    minWidth: 400,
  },
  label: {
    whiteSpace: "nowrap",
  },
  number: {
    maxWidth: 80,
  },
  button: {
    maxWidth: 100,
  },
}));

const initialValue = {
  title: "",
  client: "",
  hourly: 50,
};

const JobCreator: React.FC = () => {
  const classes = useStyles();
  const ref = useRef<HTMLInputElement | null>(null);

  const { createJob } = useJobs();
  const [newJob, setNewJob] = useState<IJobDescription>(initialValue);

  const isValid = useMemo(() => !!newJob.title && !!newJob.client, [newJob]);

  const handleChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    ({ target: { name, value } }) => {
      setNewJob((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  useEffect(() => ref.current?.focus(), []);

  const handleSubmit = useCallback<FormEventHandler>(
    (e) => {
      if (isValid) {
        e.preventDefault();
        createJob(newJob);
        setNewJob(initialValue);
        ref.current?.focus();
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [newJob]
  );

  return (
    <Form className={`${classes.form} mb-3`} onSubmit={handleSubmit}>
      <Row className="d-flex align-items-center mb-2">
        <Col className="mb-1" xs={4}>
          <label className={classes.label}>Project Name:</label>
        </Col>
        <Col className="mb-1" xs={8}>
          <FormControl
            name="title"
            type="text"
            placeholder="Job Manager"
            autoComplete="off"
            ref={ref}
            value={newJob.title}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row className="d-flex align-items-center mb-2">
        <Col className="mb-1" xs={4}>
          <label className={classes.label}>Client:</label>
        </Col>
        <Col className="mb-1" xs={8}>
          <FormControl
            name="client"
            type="text"
            placeholder="Radish"
            autoComplete="off"
            value={newJob.client}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row className="d-flex align-items-center mb-2">
        <Col className="mb-1" xs={4}>
          <label className={classes.label}>Hourly Rate ($):</label>
        </Col>
        <Col className="mb-1" xs={8}>
          <FormControl
            className={classes.number}
            name="hourly"
            type="number"
            autoComplete="off"
            min={1}
            step={1}
            value={newJob.hourly}
            onChange={handleChange}
          />
        </Col>
      </Row>
      <Row className="mb-2">
        <Col className="d-flex justify-content-end mb-1">
          <Button className={classes.button} type="submit" disabled={!isValid}>
            Create
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default JobCreator;
