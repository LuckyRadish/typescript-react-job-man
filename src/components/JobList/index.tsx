import React, { MouseEvent, useCallback, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Paper,
} from "@material-ui/core";

import { hourlyFormat, statusFormat, timeFormat } from "../../utils";
import { JobHandler, Status } from "../../contexts/JobProvider";
import { StartButton, FinishButton, RemoveButton } from "../ActionButtons";
import useJobs from "../../contexts/JobProvider";
import { Button, Modal } from "react-bootstrap-v5";

type Order = "asc" | "desc";

interface IRow {
  id:
    | "id"
    | "title"
    | "client"
    | "hourly"
    | "status"
    | "createdAt"
    | "updatedAt";
  label: string;
  format?: (_: any) => string | JSX.Element;
}

const headRows: IRow[] = [
  { id: "id", label: "ID" },
  { id: "title", label: "Title" },
  { id: "client", label: "Client" },
  { id: "hourly", label: "Hourly", format: hourlyFormat },
  { id: "status", label: "Status", format: statusFormat },
  { id: "createdAt", label: "Created At", format: timeFormat },
  { id: "updatedAt", label: "Updated At", format: timeFormat },
];

enum ConfirmText {
  Start = "You're starting this job!",
  Finish = "You're finishing this job!",
  Remove = "You're removing this job!",
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    whiteSpace: "nowrap",
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
    borderRadius: 0,
    boxShadow: "0 0 10px rgb(0 0 0 / 30%)",
  },
  table: {
    minWidth: 750,
  },
  tableWrapper: {
    overflowX: "auto",
  },
}));

const JobList: React.FC = () => {
  const classes = useStyles();
  const { jobs, startJob, finishJob, removeJob } = useJobs();
  const [order, setOrder] = useState<Order>("desc");
  const [orderBy, setOrderBy] = useState<string>("id");
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [confirmText, setConfirmText] = useState<ConfirmText>();
  const [handleAction, setActionHandler] = useState<() => void>(() => {});

  const showModal = useCallback(() => setModalVisible(true), []);
  const closeModal = useCallback(() => setModalVisible(false), []);

  const handleYes = useCallback(() => {
    closeModal();
    handleAction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleAction]);

  const handleStart = useCallback<JobHandler>((id) => {
    setConfirmText(ConfirmText.Start);
    setActionHandler(() => () => startJob(id));
    showModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFinish = useCallback<JobHandler>((id) => {
    setConfirmText(ConfirmText.Finish);
    setActionHandler(() => () => finishJob(id));
    showModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemove = useCallback<JobHandler>((id) => {
    setConfirmText(ConfirmText.Remove);
    setActionHandler(() => () => removeJob(id));
    showModal();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRequestSort = useCallback<(e: MouseEvent, prop: string) => void>(
    (e, prop) => {
      setOrder(orderBy === prop && order === "desc" ? "asc" : "desc");
      setOrderBy(prop);
    },
    [orderBy, order]
  );

  const cmp = useCallback(
    (a: { [k: string]: any }, b: { [k: string]: any }) =>
      (order === "asc" ? 1 : -1) *
      (a[orderBy] > b[orderBy] ? 1 : a[orderBy] < b[orderBy] ? -1 : 0),
    [order, orderBy]
  );

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.tableWrapper}>
          <Table className={classes.table} size="medium">
            <TableHead>
              <TableRow>
                {headRows.map((row, index) => (
                  <TableCell
                    key={index}
                    sortDirection={orderBy === row.id ? order : false}
                  >
                    <TableSortLabel
                      active={orderBy === row.id}
                      direction={order}
                      onClick={(e) => handleRequestSort(e, row.id)}
                    >
                      {row.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length > 0 ? (
                [...jobs].sort(cmp).map((row, index) => (
                  <TableRow key={index} hover tabIndex={-1}>
                    {headRows.map(({ id, format }, index) => (
                      <TableCell key={index}>
                        <div className="d-flex align-items-center">
                          <span className="me-3">
                            {!format ? row[id].toString() : format(row[id])}
                          </span>
                        </div>
                      </TableCell>
                    ))}
                    <TableCell>
                      {row.status === Status.NotStarted && (
                        <StartButton onClick={() => handleStart(row.id)} />
                      )}
                      {row.status === Status.InProgress && (
                        <FinishButton onClick={() => handleFinish(row.id)} />
                      )}
                      <RemoveButton onClick={() => handleRemove(row.id)} />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    className="text-center"
                    colSpan={headRows.length + 1}
                  >
                    No items to display
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Paper>
      <Modal show={modalVisible} onHide={closeModal}>
        <Modal.Header>
          <Modal.Title>Job Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>{confirmText}</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleYes}>
            Yes
          </Button>
          <Button variant="primary" onClick={closeModal}>
            No
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobList;
