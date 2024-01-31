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
} from "@mui/material";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";

const CourseAndAssignment: NextPage = (): JSX.Element => {
  const { state, dispatch } = useStateContext();
  const minWidth: string = "20%";

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
        alignItems: "center",
        gap: 5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          height: "100%",
          alignItems: "center",
          gap: 10,
        }}
      >
        <FormControl
          variant="outlined"
          sx={{ m: 1, minWidth: minWidth }}
          size="small"
          disabled={state.newCourseAssignment ? true : false}
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
          sx={{ m: 1, minWidth: minWidth }}
          size="small"
          disabled={state.newCourseAssignment ? true : false}
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
        <FormControlLabel
          sx={{ justifyContent: "flex-start" }}
          control={
            <Checkbox
              value={state.newCourseAssignment}
              onChange={(_, checked) => {
                dispatch({
                  type: "ADD_NEW_COURSE_ASSIGNMENT",
                  payload: checked,
                });
              }}
              sx={{
                "& .MuiSvgIcon-root": {
                  fontSize: 28,
                  height: "100%",
                },
                justifyContent: "flex-start",
              }}
            />
          }
          label={"New course and assignment"}
        />
      </Box>
      <Grid
        container
        columnSpacing={10}
        width={"50%"}
        alignContent={"center"}
        justifyContent={"start"}
        rowGap={2}
      >
        <Grid item xs={6}>
          <TextField
            disabled={state.newCourseAssignment ? false : true}
            label="Course Id"
            variant="outlined"
            size="small"
            helperText="Enter course Id"
            value={state.newCourseAndAssignmentDetails.courseId}
            onChange={(e) => {
              dispatch({ type: "SET_COURSE_ID", payload: e.target.value });
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <TextField
            disabled={state.newCourseAssignment ? false : true}
            label="Course Name"
            variant="outlined"
            size="small"
            helperText="Enter course name"
            value={state.newCourseAndAssignmentDetails.courseName}
            onChange={(e) => {
              dispatch({ type: "SET_COURSE_NAME", payload: e.target.value });
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
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
        <Grid item xs={6}>
          <TextField
            disabled={state.newCourseAssignment ? false : true}
            label="Assignment Name"
            variant="outlined"
            size="small"
            helperText="Enter assignement name"
            fullWidth
            value={state.newCourseAndAssignmentDetails.assignmentTitle}
            onChange={(e) => {
              dispatch({ type: "SET_ASSGN_NAME", payload: e.target.value });
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CourseAndAssignment;
