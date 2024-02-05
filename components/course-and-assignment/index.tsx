"use client";
import { getQuizzesByGuidCourseId } from "@/_features/apiServices";
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
  Typography
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { NextPage } from "next";
import InstructorAndManager from "../instructor-manager";

const CourseAndAssignment: NextPage = (): JSX.Element => {
  const { state, dispatch } = useStateContext();

  const getQuizzes = useMutation({
    mutationFn: async (params: { guid: string; courseId: number }) => {
      return (await getQuizzesByGuidCourseId(params.guid, params.courseId))
        .data;
    },
    onSuccess: (data: QuizDetail[]) => {
      if (data.length === 0) {
        dispatch({ type: "ADD_ALL_QUIZZES", payload: undefined });
        return;
      }
      const quizzesById: { [key: string]: QuizDetail } = {};
      data.forEach((quiz: QuizDetail) => {
        quizzesById[quiz.shortName] = { ...quiz };
      });
      dispatch({ type: "ADD_ALL_QUIZZES", payload: quizzesById });
    },
    onError: (err) => {
      console.debug("Fetch quiz error:: ", err);
      dispatch({ type: "SELECT_ASSIGNMENT", payload: undefined });
    },
  });

  const handleSelectCourse = async (courseName: string | undefined) => {
    if (courseName) {
      if (state.courses) {
        dispatch({ type: "SELECT_COURSE", payload: state.courses[courseName] });
        if (state.selectedInstitute) {
          await getQuizzes.mutateAsync({
            guid: state.selectedInstitute.guid,
            courseId: state.courses[courseName].courseId,
          });
        }
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        justifyContent: "center",
        alignItems: "start",
        gap: 2,
      }}
    >
      <Typography variant="h6" color={"#008080"} fontWeight={700}>
        Course, Assignment & Schedule
      </Typography>
      <Box
        display={"flex"}
        flexDirection={"row"}
        width={"auto"}
        gap={{ xs: 1, sm: 2, md: 8, lg: 15 }}
        justifyContent={"start"}
        alignItems={"center"}
        marginX={"auto"}
        borderRadius={2}
        border={0.5}
        paddingX={2}
        flexWrap={"wrap"}
      >
        <FormControlLabel
          control={<Checkbox />}
          label="Choose existing"
          value={state.newCourseAssignment ? false : true}
          checked={state.newCourseAssignment ? false : true}
          onChange={() => {
            dispatch({ type: "ADD_NEW_COURSE_ASSIGNMENT", payload: false });
          }}
        />
        <FormControlLabel
          control={<Checkbox />}
          label="Create new"
          value={state.newCourseAssignment ? true : false}
          checked={state.newCourseAssignment ? true : false}
          onChange={() => {
            dispatch({ type: "ADD_NEW_COURSE_ASSIGNMENT", payload: true });
          }}
        />
      </Box>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
        height={"100%"}
        width={"100%"}
        alignItems={"start"}
        justifyContent={"center"}
        gap={10}
        marginTop={3}
        paddingX={{ xs: 0, sm: 0, md: 5, lg: 5 }}
      >
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          width={
            !state.newCourseAssignment
              ? "100%"
              : { xs: "100%", sm: "100%", md: "60%", lg: "60%" }
          }
          gap={{ xs: 3, sm: 3, md: 5, lg: 5 }}
        >
          <Typography
            variant="subtitle2"
            fontSize={{ xs: 18, sm: 18, md: 20, lg: 20 }}
          >
            Course & assignment
          </Typography>
          {!state.newCourseAssignment ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "start",
                height: "100%",
                alignItems: "start",
              }}
              gap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
              flexWrap={"wrap"}
            >
              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "90%", md: "30%", lg: "100%" },
                }}
                size="small"
                disabled={
                  state.newCourseAssignment || !state.selectedInstitute
                    ? true
                    : false
                }
              >
                <InputLabel id="select-course">Course</InputLabel>
                <Select
                  value={state.selectedCourses?.longName}
                  onChange={(e) => {
                    handleSelectCourse(e.target.value);
                  }}
                  label="Course"
                >
                  {!state.courses ? (
                    <MenuItem value={""}>No Courses</MenuItem>
                  ) : (
                    Object.entries(state.courses).map(
                      ([key, value], index: number) => (
                        <MenuItem value={key} key={index}>
                          {value.longName}
                        </MenuItem>
                      )
                    )
                  )}
                </Select>
                <FormHelperText>Select course</FormHelperText>
              </FormControl>
              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "90%", md: "30%", lg: "100%" },
                }}
                size="small"
                disabled={
                  state.newCourseAssignment || !state.selectedInstitute
                    ? true
                    : false
                }
              >
                <InputLabel id="select-assignment">Assignment</InputLabel>
                <Select
                  value={state.selectedQuiz?.shortName}
                  onChange={(e) => {
                    if (state.quizzes)
                      dispatch({
                        type: "SELECT_QUIZ",
                        payload: state.quizzes[e.target.value],
                      });
                  }}
                  label="Assignment"
                >
                  {!state.quizzes ? (
                    <MenuItem value={""}>No Assignments</MenuItem>
                  ) : (
                    Object.entries(state.quizzes).map(
                      ([key, value], index: number) => (
                        <MenuItem value={key} key={index}>
                          {value.longName}
                        </MenuItem>
                      )
                    )
                  )}
                </Select>
                <FormHelperText>Select assignment</FormHelperText>
              </FormControl>
            </Box>
          ) : (
            <Grid
              container
              columnSpacing={{ xs: 0, sm: 0, md: 5, lg: 10 }}
              width={"100%"}
              alignContent={"center"}
              justifyContent={"center"}
              rowGap={2}
              marginLeft={0}
              // marginTop={5}
              flexWrap={"wrap"}
            >
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  disabled={state.newCourseAssignment ? false : true}
                  label="Course Id"
                  variant="outlined"
                  size="small"
                  helperText="Enter course Id"
                  value={state.newCourseAndAssignmentDetails.courseId}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_COURSE_ID",
                      payload: e.target.value,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} paddingLeft={0}>
                <TextField
                  disabled={state.newCourseAssignment ? false : true}
                  label="Assignment Id"
                  variant="outlined"
                  size="small"
                  helperText="Enter assignment Id"
                  fullWidth
                  value={state.newCourseAndAssignmentDetails.assignmentId}
                  onChange={(e) => {
                    dispatch({ type: "SET_ASSGN_ID", payload: e.target.value });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} paddingLeft={0}>
                <TextField
                  disabled={state.newCourseAssignment ? false : true}
                  label="Course Name"
                  variant="outlined"
                  size="small"
                  helperText="Enter course name"
                  value={state.newCourseAndAssignmentDetails.courseName}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_COURSE_NAME",
                      payload: e.target.value,
                    });
                  }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} paddingLeft={0}>
                <TextField
                  disabled={state.newCourseAssignment ? false : true}
                  label="Assignment Name"
                  variant="outlined"
                  size="small"
                  helperText="Enter assignement name"
                  fullWidth
                  value={state.newCourseAndAssignmentDetails.assignmentTitle}
                  onChange={(e) => {
                    dispatch({
                      type: "SET_ASSGN_NAME",
                      payload: e.target.value,
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} paddingLeft={0}>
                <DatePicker
                  label="Course date"
                  slotProps={{
                    textField: {
                      helperText: "Select course start date",
                      size: "small",
                      fullWidth: true,
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
            </Grid>
          )}
        </Box>
        <Box
          display={"flex"}
          flexDirection={"column"}
          height={"100%"}
          width={
            !state.newCourseAssignment
              ? "100%"
              : { xs: "100%", sm: "100%", md: "60%", lg: "60%" }
          }
          gap={{ xs: 3, sm: 3, md: 5, lg: 5 }}
        >
          <Typography
            variant="subtitle2"
            fontSize={{ xs: 18, sm: 18, md: 20, lg: 20 }}
          >
            Assignment schedule
          </Typography>
          <InstructorAndManager />
        </Box>
      </Box>
    </Box>
  );
};

export default CourseAndAssignment;
