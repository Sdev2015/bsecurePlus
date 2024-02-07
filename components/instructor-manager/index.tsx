"use client";

import { useStateContext } from "@/_features/context";
import {
  Grid,
  TextField
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { NextPage } from "next";

const InstructorAndManager: NextPage = (): JSX.Element => {
  const { state, dispatch } = useStateContext();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        gap: 5,
      }}
      width={"100%"}
    >
      <Grid
        container
        rowSpacing={2}
        columnSpacing={{ xs: 0, sm: 0, md: 5, lg: 10 }}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Grid item container xs={12} lg={6} justifyContent={"center"}>
          <DatePicker
            label="Assignment Date/Time"
            sx={{ width: "100%" }}
            value={dayjs(state.assignmentSchedulingDetails.dueDate)}
            onChange={(value: Dayjs | undefined | null) => {
              if (value) {
                dispatch({
                  type: "SET_ASSGN_DUE_DATE",
                  payload: value.toISOString(),
                });
              }
            }}
            slotProps={{
              textField: {
                helperText: "Select assignment due date",
                size: "small",
              },
            }}
          />
        </Grid>
        <Grid item container xs={12} lg={6}>
          <TextField
            size="small"
            label="Job url"
            fullWidth
            helperText="Job description url"
            value={state.otherDetails.jobUrl}
            onChange={(event) => {
              dispatch({ type: "SET_JOB_URL", payload: event.target.value });
            }}
          />
        </Grid>
        <Grid item container xs={12} lg={6} justifyContent={"end"}>
          <DatePicker
            label="Exp. Date/Time"
            sx={{ width: "100%" }}
            slotProps={{
              textField: {
                helperText: "Select assignment expiration date",
                size: "small",
              },
            }}
            value={dayjs(state.assignmentSchedulingDetails.expDate)}
            onChange={(value: Dayjs | undefined | null) => {
              if (value) {
                dispatch({
                  type: "SET_ASSGN_EXP_DATE",
                  payload: value.toISOString(),
                });
              }
            }}
          />
        </Grid>
        <Grid item container xs={12} lg={6}>
          <TextField
            size="small"
            label="Phone"
            fullWidth
            helperText="Enter phone number"
            type="number"
            inputMode="tel"
            value={state.otherDetails.phone}
            onChange={(event) => {
              dispatch({ type: "SET_PHONE", payload: event.target.value });
            }}
          />
        </Grid>
        <Grid item container xs={12} lg={6}>
          <TextField
            size="small"
            label="Email"
            fullWidth
            helperText="Enter email"
            type="email"
            inputMode="email"
            value={state.otherDetails.email}
            onChange={(event) => {
              dispatch({
                type: "SET_EMAIL",
                payload: event.target.value,
              });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default InstructorAndManager;
