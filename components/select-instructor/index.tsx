"use client";

import { useStateContext } from "@/_features/context";
import {
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { NextPage } from "next";

const SelectInstructor: NextPage = (): JSX.Element => {
  const { state, dispatch } = useStateContext();
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"start"}
      height={"100%"}
      gap={2}
      width={"100%"}
    >
      <Typography variant="h6" color={"#008080"} fontWeight={700}>
        Select instructor/ manager
      </Typography>
      <FormControl
        size="small"
        sx={{
          m: 1,
          width: { xs: "90%", sm: "90%", md: "50%", lg: "50%" },
          marginX: "auto",
        }}
      >
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
    </Box>
  );
};

export default SelectInstructor;
