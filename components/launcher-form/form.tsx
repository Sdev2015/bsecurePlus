"use client";

import {
  getAllInstitutes,
  getCoursesByGuid,
  getUserProfilesByGuid,
} from "@/_features/apiServices";
import { useStateContext } from "@/_features/context";
import {
  generateRandom4DigitNumber,
  generateUuid,
  getInvokeUrl,
} from "@/_features/helpers";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useEffect, useState } from "react";
import CourseAndAssignment from "../course-and-assignment";
import SelectInstructor from "../select-instructor";
import UrlCreator from "../url-creator";

export const LauncherForm: NextPage = (): JSX.Element => {
  const [userFormType, setUserFormType] = useState<
    "PROCTOR" | "STUDENT" | undefined
  >(undefined);
  const { state, dispatch } = useStateContext();

  const getInstitutes = useMutation({
    mutationFn: async () => {
      return (await getAllInstitutes()).data;
    },
    onSuccess: (data: InstitutesList) => {
      const institutesById: { [key: string]: InstituteDetails } = {};
      data.forEach((institute: InstituteDetails) => {
        institutesById[institute.instituteId] = { ...institute };
      });
      dispatch({ type: "ADD_ALL_INSTITUTES", payload: institutesById });
    },
    onError: (err) => {
      console.debug("Fetch institute error:: ", err);
      dispatch({
        type: "SET_ERROR",
        payload: { show: true, message: "Failed to fetch institutes" },
      });
    },
  });

  const getCourses = useMutation({
    mutationFn: async (guid: string) => {
      return (await getCoursesByGuid(guid)).data;
    },
    onSuccess: (data: CourseDetail[]) => {
      const coursesById: { [key: string]: CourseDetail } = {};
      data.forEach((course: CourseDetail) => {
        coursesById[course.courseId] = { ...course };
      });
      dispatch({ type: "ADD_ALL_COURSES", payload: coursesById });
    },
    onError: (err) => {
      console.debug("Fetch course error:: ", err);
      dispatch({
        type: "SET_ERROR",
        payload: { show: true, message: "Failed to fetch courses" },
      });
    },
  });

  const getUserProfiles = useMutation({
    mutationKey: ["get-user-profiles"],
    mutationFn: async (guid: string) => {
      return (await getUserProfilesByGuid(guid)).data;
    },
    onSuccess: (data: UserProfile[]) => {
      const instructorOrManagers: { [key: string]: UserProfile } = {};
      data.forEach((profile: UserProfile) => {
        const roleType = profile.userType.toLowerCase();
        const isInstrOrMngr =
          roleType.indexOf("inst") !== -1 ||
          roleType.indexOf("manager") !== -1 ||
          roleType.indexOf("teacher") !== -1;
        if (isInstrOrMngr) {
          instructorOrManagers[profile.idUser] = { ...profile };
        }
      });
      dispatch({
        type: "ADD_INSTRUCTORS_MANAGERS",
        payload:
          Object.keys(instructorOrManagers).length === 0
            ? undefined
            : instructorOrManagers,
      });
    },
    onError: (err) => {
      console.debug("Fetch profiles error:: ", err);
      dispatch({
        type: "SET_ERROR",
        payload: { show: true, message: "Failed to fetch profiles" },
      });
    },
  });

  const handleInstituteSelect = async (value: string) => {
    if (state.institute) {
      const { guid } = state.institute[value];
      dispatch({
        type: "SELECT_INSTITUTE",
        payload: state.institute[value],
      });
      await Promise.all([
        getCourses.mutateAsync(guid),
        getUserProfiles.mutateAsync(guid),
      ]);
    }
  };

  const handleInvokeUrl = async () => {
    const {
      selectedInstitute,
      selectedProfile,
      newCourse,
      newAssignment,
      selectedCourses,
      selectedQuiz,
    } = state;

    if (!selectedInstitute || !selectedProfile) return;
    let payload: GenerateInvokeUrlPayload = {
      institute: selectedInstitute,
      course: undefined,
      quiz: undefined,
      profile: selectedProfile,
      courseId: "",
      courseName: "",
      assignmentId: "",
      assignmentName: "",
      studentId: "",
      assgnDueDt: "",
      assgnExpDt: "",
      duration: "",
      phone: "",
      email: selectedProfile.email,
      courseStartDate: "",
      newCourseAndAssignment: false,
    };
    if (newCourse) {
      const {
        newCourseDetails: { name, startDate },
        newAssignmentDetails,
      } = state;
      const courseId = generateRandom4DigitNumber();
      const quizId = generateRandom4DigitNumber();
      payload.courseId = courseId.toString();
      payload.courseName = name;
      payload.studentId = selectedProfile.idUser;
      payload.assignmentId = quizId.toString();
      payload.assignmentName = newAssignmentDetails.name;
      payload.assgnDueDt = newAssignmentDetails.startDate;
      payload.assgnExpDt = newAssignmentDetails.endDate;
      payload.duration = newAssignmentDetails.duration;
      payload.newCourseAndAssignment = true;
      payload.courseStartDate = startDate;
    } else {
      if (newAssignment) {
        const {
          newAssignmentDetails: { name, startDate, endDate, duration },
        } = state;
        payload.course = selectedCourses;
        payload.assignmentId = generateUuid();
        payload.assignmentName = name;
        payload.assgnDueDt = startDate;
        payload.assgnExpDt = endDate;
        payload.duration = duration;
      } else {
        payload.quiz = selectedQuiz;
        payload.course = selectedCourses;
        payload.courseStartDate =
          selectedCourses?.startDate || dayjs().toISOString();
      }
    }

    const url = getInvokeUrl(payload, state);
    window.open(url, "_blank");
  };

  useEffect(() => {
    getInstitutes.mutateAsync();
  }, []);

  let instituteOptions: InstitutesList = [];

  if (state.institute) {
    instituteOptions = Object.entries(state.institute).map(
      ([_, value]) => value
    );
  }

  return (
    <Grid
      container
      sx={{
        height: "100%",
        width: "100%",
      }}
      justifyContent={"center"}
      alignSelf={"center"}
      gap={5}
      marginY={5}
    >
      <Box
        sx={{
          width: "80%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <FormControl
          variant="outlined"
          sx={{
            m: 1,
            width: { xs: "90%", sm: "90%", md: "60%", lg: "50%" },
          }}
          size="small"
        >
          <InputLabel id="select-institute">Insitute</InputLabel>
          <Select
            value={state.selectedInstitute?.instituteName || undefined}
            onChange={(event) => {
              handleInstituteSelect(event.target.value);
            }}
            fullWidth
            label="Insitute"
            sx={{
              width: "100%",
              display: "flex",
              marginX: "auto",
            }}
          >
            {instituteOptions.map(
              (institute: InstituteDetails, index: number) => (
                <MenuItem value={institute.instituteId.toString()} key={index}>
                  {institute.instituteName}
                </MenuItem>
              )
            )}
          </Select>
          <FormHelperText>Select your institute</FormHelperText>
        </FormControl>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        height={"100%"}
        width={"80%"}
        flexWrap={"wrap"}
        gap={5}
      >
        <Box
          display={"flex"}
          flexDirection={"row"}
          width={"100%"}
          justifyContent={"space-between"}
          flexWrap={"wrap"}
          gap={{ xs: 5, sm: 5 }}
        >
          {!userFormType ? (
            <Typography variant="h6" color={"#008080"} fontWeight={700}>
              Configure proctoring for: {userFormType}
            </Typography>
          ) : (
            <Typography variant="h6" color={"#008080"} fontWeight={700}>
              Configuration for:{" "}
              {userFormType === "PROCTOR" ? "Instructor/ Manager" : "Student"}
            </Typography>
          )}
          {userFormType && (
            <Button
              variant="outlined"
              size="small"
              onClick={(_) => {
                if (userFormType === "PROCTOR") {
                  setUserFormType("STUDENT");
                  dispatch({ type: "TOOGLE_NEW_ASSIGNMENT", payload: false });
                  dispatch({ type: "TOOGLE_NEW_COURSE", payload: false });
                } else {
                  setUserFormType("PROCTOR");
                }
              }}
            >
              Configure proctoring for{" "}
              {userFormType === "PROCTOR" ? "student" : "proctor"}
            </Button>
          )}
        </Box>
        {!userFormType && (
          <Box
            display={"flex"}
            flexDirection={"row"}
            width={"100%"}
            height={"100%"}
            justifyContent={"space-between"}
            flexWrap={"wrap"}
            gap={5}
          >
            <Card
              variant="outlined"
              sx={{
                height: "150px",
                width: { xs: "100%", sm: "100%", md: "40%", lg: "40%" },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  setUserFormType("PROCTOR");
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontSize={20}
                  fontWeight={"bold"}
                >
                  Instructor / Manager
                </Typography>
              </CardActionArea>
            </Card>
            <Card
              variant="outlined"
              sx={{
                height: "150px",
                width: { xs: "100%", sm: "100%", md: "40%", lg: "40%" },
              }}
            >
              <CardActionArea
                sx={{
                  height: "100%",
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onClick={(e) => {
                  setUserFormType("STUDENT");
                }}
              >
                <Typography
                  variant="subtitle2"
                  fontSize={20}
                  fontWeight={"bold"}
                >
                  Student
                </Typography>
              </CardActionArea>
            </Card>
          </Box>
        )}
        {userFormType === "PROCTOR" && <SelectInstructor />}
        {userFormType && <CourseAndAssignment formType={userFormType} />}
        {userFormType === "STUDENT" && <UrlCreator />}
        {userFormType === "PROCTOR" && (
          <Button
            size="small"
            variant="contained"
            onClick={handleInvokeUrl}
            sx={{ width: "auto", marginX: "auto" }}
          >
            Invoke Url
          </Button>
        )}
      </Box>
    </Grid>
  );
};
