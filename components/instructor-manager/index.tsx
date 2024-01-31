"use client";

import { useStateContext } from "@/_features/context";
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import { NextPage } from "next";
import { useState } from "react";

const InstructorAndManager: NextPage = (): JSX.Element => {
  const { state, dispatch } = useStateContext();
  const [fieldErrors, setFieldErrors] =
    useState<InstructorManagerDetailFieldErrors>({
      profile: false,
      assgnDate: false,
      assgnExpDate: false,
      jobUrl: false,
      phone: false,
      email: false,
      duration: false,
    });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100%",
        width: "100%",
        gap: 5,
      }}
    >
      <FormControl size="small" sx={{ m: 1, width: "50%" }}>
        <InputLabel id="instructor-manager">Instructor/ Manager</InputLabel>
        <Select
          labelId="instructor-manager"
          id="instructor-manager-select"
          value={state.selectedProfile?.idUser}
          label="Instructor/ Manager"
          onChange={(e) => {
            if (state.profiles)
              dispatch({
                type: "SELECT_INSTRUCTOR_MANAGER",
                payload: state.profiles[e.target.value],
              });
          }}
        >
          {!state.profiles ? (
            <MenuItem value={""}>No profiles</MenuItem>
          ) : (
            Object.entries(state.profiles).map(
              ([key, value], index: number) => {
                const role = value.userType.toLowerCase();
                const roleText =
                  role.indexOf("instr") !== -1 || role.indexOf("teacher") !== -1
                    ? "Teacher"
                    : "Manager";
                return (
                  <MenuItem value={key} key={index}>
                    <Box
                      sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography variant="subtitle1">
                        {value.firstName} {value.lastName}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        sx={{ marginLeft: "auto" }}
                      >
                        {roleText}
                      </Typography>
                    </Box>
                  </MenuItem>
                );
              }
            )
          )}
        </Select>
        <FormHelperText>Select an instructor/ manager</FormHelperText>
      </FormControl>
      <Grid
        container
        rowSpacing={2}
        columnSpacing={10}
        direction={"row"}
        justifyContent={"center"}
        width={"50%"}
        alignItems={"center"}
      >
        <Grid item container xs={12} lg={6} justifyContent={"end"}>
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
      <Box
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
      </Box>
    </Box>
  );
};

export default InstructorAndManager;
