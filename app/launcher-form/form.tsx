"use client";

import {
  getAllInstitutes,
  getCoursesByGuid,
  getUserProfilesByGuid,
} from "@/_features/apiServices";
import { useStateContext } from "@/_features/context";
import { getInvokeUrl } from "@/_features/helpers";
import CourseAndAssignment from "@/components/course-and-assignment";
import InstituteDetails from "@/components/institut-details";
import InstructorAndManager from "@/components/instructor-manager";
import ProviderUrl from "@/components/provider-url";
import {
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { NextPage } from "next";
import { useEffect } from "react";

export const LauncherForm: NextPage = (): JSX.Element => {
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

  const handleCreateUrl = () => {};

  const handleInvokeUrl = () => {
    const { newCourseAssignment, selectedInstitute, selectedProfile } = state;

    if (!selectedInstitute) return;
    console.log("handleInvokeUrl");
    if (newCourseAssignment) {
      const {
        newCourseAndAssignmentDetails: {
          assignmentId,
          assignmentTitle,
          courseId,
          courseName,
        },
        assignmentSchedulingDetails: { dueDate, duration, expDate },
        otherDetails: { email, phone },
      } = state;
      const payload: GenerateInvokeUrlPayload = {
        institute: selectedInstitute,
        course: undefined,
        quiz: undefined,
        profile: selectedProfile,
        courseId: courseId,
        courseName: courseName,
        assignmentId: assignmentId,
        assignmentName: assignmentTitle,
        studentId: "",
        assgnDueDt: dueDate,
        assgnExpDt: expDate,
        duration: duration,
        phone: phone,
        email: email,
        newCourseAndAssignment: newCourseAssignment,
      };
      const url = getInvokeUrl(payload);
      window.open(url, "_blank");
    } else {
      const {
        selectedCourses,
        selectedQuiz,
        selectedProfile,
        assignmentSchedulingDetails: { dueDate, duration, expDate },
        otherDetails: { email, phone },
      } = state;
      const payload: GenerateInvokeUrlPayload = {
        institute: selectedInstitute,
        course: selectedCourses,
        quiz: selectedQuiz,
        profile: selectedProfile,
        courseId: "",
        courseName: "",
        assignmentId: "",
        assignmentName: "",
        studentId: "",
        assgnDueDt: dueDate,
        assgnExpDt: expDate,
        duration: duration,
        phone: phone,
        email: email,
        newCourseAndAssignment: newCourseAssignment,
      };
      const url = getInvokeUrl(payload);
      window.open(url, "_blank");
    }
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
    <Grid container justifyContent="center" spacing={2} padding={5} rowGap={5}>
      <FormControl
        variant="outlined"
        sx={{ m: 1, minWidth: "50%" }}
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
        >
          {instituteOptions.map(
            (institute: InstituteDetails, index: number) => (
              <MenuItem value={institute.instituteId.toString()} key={index}>
                {institute.instituteName}
              </MenuItem>
            )
          )}
        </Select>
        <FormHelperText>Select an institute</FormHelperText>
      </FormControl>
      {state.selectedInstitute && (
        <InstituteDetails institute={state.selectedInstitute} />
      )}
      <Divider
        variant="middle"
        orientation="horizontal"
        component={"area"}
        sx={{ width: "100%" }}
        color="#997a8d"
      />
      <CourseAndAssignment />
      <Divider
        variant="middle"
        orientation="horizontal"
        component={"area"}
        sx={{ width: "100%" }}
        color="#997a8d"
      />
      <InstructorAndManager />
      <Divider
        variant="middle"
        orientation="horizontal"
        component={"area"}
        sx={{ width: "100%" }}
        color="#997a8d"
      />

      <ProviderUrl createUrl={handleCreateUrl} invokeUrl={handleInvokeUrl} />
    </Grid>
  );
};
