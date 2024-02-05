"use client";

import { useStateContext } from "@/_features/context";
import {
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
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
        <Grid item container xs={12} lg={6} justifyContent={"end"}>
          <FormControl>
            <InputLabel id="duration-test">Duration of test</InputLabel>
            <Select
              size="small"
              labelId="duration-test"
              fullWidth
              slotProps={{
                input: {
                  width: "100%",
                },
              }}
              sx={{ width: "100%" }}
              id="duration-test-select"
              value={state.assignmentSchedulingDetails.duration}
              onChange={(event) => {
                dispatch({
                  type: "SET_ASSGN_DURATION",
                  payload: event.target.value,
                });
              }}
              label="Duration of test"
            >
              <MenuItem value={15}>15 minutes</MenuItem>
              <MenuItem value={30}>30 minutes</MenuItem>
              <MenuItem value={60}>60 minutes</MenuItem>
              <MenuItem value={90}>90 minutes</MenuItem>
            </Select>
            <FormHelperText>Select duration of test in mins.</FormHelperText>
          </FormControl>
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
      {/* <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "60%",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
        }}
      >
        <TextField
          size="small"
          helperText="Enter your name"
          variant="outlined"
          label="Your Name"
          disabled
        />
        <TextField
          size="small"
          helperText="Enter your email"
          variant="outlined"
          label="Your Email"
          disabled
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label="Copy email to me"
          disabled
        />
      </Box> */}
    </Box>
  );
};

export default InstructorAndManager;
