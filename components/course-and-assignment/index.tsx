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
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation } from "@tanstack/react-query";
import dayjs, { Dayjs } from "dayjs";
import { NextPage } from "next";

type CourseAndAssignmentProps = {
  formType: "PROCTOR" | "STUDENT";
};

const CourseAndAssignment: NextPage<CourseAndAssignmentProps> = ({
  formType,
}): JSX.Element => {
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
      <Typography variant="h6" color={"#008080"} fontWeight={700} gutterBottom>
        Course & assignment
      </Typography>
      <Box
        display={"flex"}
        flexDirection={{ xs: "column", sm: "column", md: "row", lg: "row" }}
        height={"100%"}
        width={"100%"}
        alignItems={"start"}
        justifyContent={"center"}
        gap={{ xs: 3, sm: 3, md: 5, lg: 10 }}
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
          <Box
            display={"flex"}
            flexDirection={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
            }}
            justifyContent={"space-between"}
            height={"100%"}
            width={"100%"}
            alignItems={"start"}
            gap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
          >
            <Typography
              variant="subtitle2"
              fontSize={{ xs: 18, sm: 18, md: 20, lg: 20 }}
            >
              Course
            </Typography>
            <Box
              display={"flex"}
              flexDirection={"row"}
              width={"auto"}
              gap={{ xs: 1, sm: 2, md: 1, lg: 2 }}
              justifyContent={"start"}
              alignItems={"center"}
              sx={{ borderColor: "#c6c1c2" }}
              borderRadius={2}
              border={0.5}
              paddingX={2}
              flexWrap={"wrap"}
            >
              <FormControlLabel
                control={<Checkbox />}
                label="Choose existing"
                value={state.newCourse ? false : true}
                checked={state.newCourse ? false : true}
                onChange={() => {
                  dispatch({
                    type: "TOOGLE_NEW_COURSE",
                    payload: false,
                  });
                }}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Create new"
                value={state.newCourse ? true : false}
                checked={state.newCourse ? true : false}
                disabled={formType === "STUDENT"}
                onChange={() => {
                  dispatch({
                    type: "TOOGLE_NEW_COURSE",
                    payload: true,
                  });
                  dispatch({
                    type: "TOOGLE_NEW_ASSIGNMENT",
                    payload: true,
                  });
                }}
              />
            </Box>
          </Box>
          {!state.newCourse ? (
            <Box
              display={"flex"}
              flexDirection={{
                xs: "column",
                sm: "column",
                md: "row",
                lg: "row",
              }}
              width={"100%"}
              justifyContent={"start"}
              height={"100%"}
              alignItems={"start"}
              gap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
            >
              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "90%", md: "30%", lg: "50%" },
                }}
                size="small"
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
            </Box>
          ) : (
            <Grid
              container
              columnSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}
              width={"100%"}
              alignContent={"center"}
              justifyContent={"center"}
              rowGap={2}
              marginLeft={0}
            >
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <TextField
                  label="Course name"
                  variant="outlined"
                  size="small"
                  helperText="Enter course name"
                  fullWidth
                  value={state.newCourseDetails?.name}
                  onChange={(e) => {
                    dispatch({
                      type: "ADD_NEW_COURSE",
                      payload: {
                        ...state.newCourseDetails,
                        name: e.target.value,
                      },
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <DatePicker
                  label="Start date"
                  slotProps={{
                    textField: {
                      helperText: "Select course start date",
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  value={dayjs(state.newCourseDetails.startDate)}
                  onChange={(value: Dayjs | undefined | null) => {
                    if (value) {
                      dispatch({
                        type: "ADD_NEW_COURSE",
                        payload: {
                          ...state.newCourseDetails,
                          startDate: value.toISOString(),
                        },
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <DatePicker
                  label="End date"
                  slotProps={{
                    textField: {
                      helperText: "Select course end date",
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  value={dayjs(state.newCourseDetails.endDate)}
                  onChange={(value: Dayjs | undefined | null) => {
                    if (value) {
                      dispatch({
                        type: "ADD_NEW_COURSE",
                        payload: {
                          ...state.newCourseDetails,
                          endDate: value.toISOString(),
                        },
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
          <Box
            display={"flex"}
            flexDirection={{
              xs: "column",
              sm: "column",
              md: "column",
              lg: "row",
            }}
            justifyContent={"space-between"}
            height={"100%"}
            width={"100%"}
            alignItems={"start"}
            gap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
          >
            <Typography
              variant="subtitle2"
              fontSize={{ xs: 18, sm: 18, md: 20, lg: 20 }}
            >
              Assignment
            </Typography>
            <Box
              display={"flex"}
              flexDirection={"row"}
              width={"auto"}
              gap={1}
              justifyContent={"start"}
              alignItems={"center"}
              borderRadius={2}
              border={0.5}
              paddingX={2}
              flexWrap={"wrap"}
            >
              <FormControlLabel
                control={<Checkbox />}
                label="Choose existing"
                disabled={state.newCourse}
                value={state.newAssignment ? false : true}
                checked={state.newAssignment ? false : true}
                onChange={() => {
                  dispatch({
                    type: "TOOGLE_NEW_ASSIGNMENT",
                    payload: false,
                  });
                }}
              />
              <FormControlLabel
                control={<Checkbox />}
                label="Create new"
                value={state.newAssignment ? true : false}
                checked={state.newAssignment ? true : false}
                disabled={formType === "STUDENT"}
                onChange={() => {
                  dispatch({
                    type: "TOOGLE_NEW_ASSIGNMENT",
                    payload: true,
                  });
                }}
              />
            </Box>
          </Box>
          {!state.newAssignment ? (
            <Box
              display={"flex"}
              flexDirection={{
                xs: "column",
                sm: "column",
                md: "column",
                lg: "row",
              }}
              width={"100%"}
              justifyContent={"start"}
              height={"100%"}
              alignItems={"start"}
              gap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
            >
              <FormControl
                variant="outlined"
                sx={{
                  width: { xs: "100%", sm: "90%", md: "30%", lg: "50%" },
                }}
                size="small"
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
              columnSpacing={{ xs: 2, sm: 2, md: 3, lg: 3 }}
              width={"100%"}
              alignContent={"center"}
              justifyContent={"start"}
              rowGap={{ xs: 2, sm: 2, md: 3, lg: 3 }}
              marginLeft={0}
            >
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <TextField
                  label="Assignment name"
                  variant="outlined"
                  size="small"
                  helperText="Enter assignment name"
                  fullWidth
                  value={state.newAssignmentDetails?.name}
                  onChange={(e) => {
                    dispatch({
                      type: "ADD_NEW_ASSIGNMENT",
                      payload: {
                        ...state.newAssignmentDetails,
                        name: e.target.value,
                      },
                    });
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <DatePicker
                  label="Start date"
                  slotProps={{
                    textField: {
                      helperText: "Select assignment start date",
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  value={dayjs(state.newAssignmentDetails.startDate)}
                  onChange={(value: Dayjs | undefined | null) => {
                    if (value) {
                      dispatch({
                        type: "ADD_NEW_ASSIGNMENT",
                        payload: {
                          ...state.newAssignmentDetails,
                          startDate: value.toISOString(),
                        },
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
                <DatePicker
                  label="End date"
                  slotProps={{
                    textField: {
                      helperText: "Select assignment end date",
                      size: "small",
                      fullWidth: true,
                    },
                  }}
                  value={dayjs(state.newAssignmentDetails.endDate)}
                  onChange={(value: Dayjs | undefined | null) => {
                    if (value) {
                      dispatch({
                        type: "ADD_NEW_ASSIGNMENT",
                        payload: {
                          ...state.newAssignmentDetails,
                          endDate: value.toISOString(),
                        },
                      });
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={4} paddingLeft={0}>
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
                    value={state.newAssignmentDetails.duration}
                    onChange={(event) => {
                      dispatch({
                        type: "ADD_NEW_ASSIGNMENT",
                        payload: {
                          ...state.newAssignmentDetails,
                          duration: event.target.value.toString(),
                        },
                      });
                    }}
                    label="Duration of test"
                  >
                    <MenuItem value={15}>15 minutes</MenuItem>
                    <MenuItem value={30}>30 minutes</MenuItem>
                    <MenuItem value={60}>60 minutes</MenuItem>
                    <MenuItem value={90}>90 minutes</MenuItem>
                  </Select>
                  <FormHelperText>
                    Select duration of test in mins.
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={8}
                paddingLeft={0}
                justifySelf={"start"}
              >
                <TextField
                  label="Description/ Url"
                  variant="outlined"
                  size="small"
                  helperText="Enter assignment url"
                  fullWidth
                  value={state.newAssignmentDetails?.url}
                  onChange={(e) => {
                    dispatch({
                      type: "ADD_NEW_ASSIGNMENT",
                      payload: {
                        ...state.newAssignmentDetails,
                        url: e.target.value,
                      },
                    });
                  }}
                />
              </Grid>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default CourseAndAssignment;
