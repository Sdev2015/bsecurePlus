"use client";

import { createUserProfile } from "@/_features/apiServices";
import { useStateContext } from "@/_features/context";
import { generateUuid, getInvokeUrl } from "@/_features/helpers";
import { RestartAltOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  IconButton,
  TextField,
  TextareaAutosize,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box, styled } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useState } from "react";
import DialogComponent from "../dialog-component";

const textBoxSize = "20rem";
const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    min-width: 100%;
    font-family: 'IBM Plex Sans', sans-serif;
    font-size: 1rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 12px;
    border-radius: 12px 12px 0 12px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      outline: 0;
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

const UrlCreator: NextPage = (): JSX.Element => {
  const [testTakersCount, setTestTakersCount] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { state, dispatch } = useStateContext();

  const handleAddTestTakers = () => {
    const updatedList = [...state.students];

    for (let i = 0; i < testTakersCount; i++) {
      updatedList.push({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        invokeUrl: "",
      });
    }
    dispatch({ type: "ADD_UPDATE_STUDENT", payload: updatedList });
    setTestTakersCount(1);
  };

  const handleInfoChange = (
    value: string,
    idx: number,
    type: "FN" | "LN" | "EM" | "PH"
  ) => {
    let allTestTakers = [...state.students];
    const testTakerDetail = { ...allTestTakers[idx] };
    switch (type) {
      case "FN":
        testTakerDetail.firstName = value;
        break;
      case "LN":
        testTakerDetail.lastName = value;
        break;
      case "EM":
        testTakerDetail.email = value;
        break;
      case "PH":
        testTakerDetail.phone = value;
        break;
      default:
        break;
    }
    allTestTakers[idx] = { ...testTakerDetail };
    dispatch({ type: "ADD_UPDATE_STUDENT", payload: allTestTakers });
  };

  const handleReset = () => {
    const list: StudentDetails[] = Array.from({ length: 3 }).map((_) => ({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      invokeUrl: "",
    }));
    dispatch({ type: "ADD_UPDATE_STUDENT", payload: list });
  };

  const createProfile = useMutation({
    mutationFn: async (userDetail: UserProfile) => {
      return (await createUserProfile(userDetail)).data;
    },
    onSuccess: async (data: UserProfile[]): Promise<UserProfile[]> => {
      return data;
    },
    onError: async (err): Promise<boolean> => {
      console.log("Profile create error:: ", err);
      return false;
    },
  });

  const handleCreateProfile = async (
    user: StudentDetails,
    guid: string
  ): Promise<UserProfile[]> => {
    const id = generateUuid();
    const profilePayload: UserProfile = {
      idLtiStudentProfile: "",
      guid: guid,
      idUser: id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      idFileIndex1: "",
      idFileIndex2: "",
      idFileName1: "",
      idFileName2: "",
      status: 0,
      createUser: "System",
      createDate: dayjs().toISOString(),
      modifyUser: "",
      modifyDate: "",
      otp: "",
      otpCreateDate: "",
      idApprovalStatus: 0,
      userType: "StudentEnrollment",
    };
    const profile = await createProfile.mutateAsync(profilePayload);
    return profile;
  };

  const handleInvokeUrl = (idx: number) => {
    const student = { ...state.students[idx] };

    window.open(student.invokeUrl, "_blank");
  };

  const handleCreateUrl = async (idx: number) => {
    if (!state.selectedInstitute) return;
    let allTestTakers = [...state.students];
    setIsLoading(true);
    const testTakerDetail = { ...allTestTakers[idx] };
    const profile = await handleCreateProfile(
      testTakerDetail,
      state.selectedInstitute.guid
    );
    setIsLoading(false);
    const { newCourseAssignment } = state;
    const payload: GenerateInvokeUrlPayload = {
      institute: state.selectedInstitute,
      course: undefined,
      quiz: undefined,
      profile: undefined,
      courseId: "",
      courseName: "",
      assignmentId: "",
      assignmentName: "",
      studentId: profile[0].idUser,
      assgnDueDt: "",
      assgnExpDt: "",
      duration: "",
      phone: testTakerDetail.phone,
      email: testTakerDetail.email,
      newCourseAndAssignment: false,
    };

    if (newCourseAssignment) {
      const {
        newCourseAndAssignmentDetails: {
          courseId,
          courseName,
          assignmentId,
          assignmentTitle,
        },
        assignmentSchedulingDetails: { dueDate, duration, expDate },
      } = state;

      payload.courseId = courseId;
      payload.courseName = courseName;
      payload.assignmentId = assignmentId;
      payload.assignmentName = assignmentTitle;
      payload.assgnDueDt = dueDate;
      payload.assgnExpDt = expDate;
      payload.duration = duration;
    } else {
      const {
        selectedCourses,
        selectedQuiz,
        assignmentSchedulingDetails: { dueDate, duration, expDate },
      } = state;
      if (selectedCourses && selectedQuiz) {
        payload.course = selectedCourses;
        payload.quiz = selectedQuiz;
        payload.assgnDueDt = dueDate;
        payload.assgnExpDt = expDate;
        payload.duration = duration;
      }
    }

    testTakerDetail.invokeUrl = getInvokeUrl(payload);
    allTestTakers[idx] = testTakerDetail;
    dispatch({ type: "ADD_UPDATE_STUDENT", payload: allTestTakers });
  };

  let loaderMessage = "";

  if (isLoading) {
    loaderMessage = "Creating user profile. Please wait.";
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        gap: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 2,
          justifyContent: "center",
        }}
      >
        <Typography
          component={"h5"}
          fontSize={25}
          textAlign={"center"}
          fontWeight={500}
          gutterBottom
        >
          Test Taker&apos;s Information:
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          gap: 2,
          justifyContent: "end",
        }}
      >
        <Tooltip title={"Reset"}>
          <IconButton onClick={handleReset}>
            <RestartAltOutlined />
          </IconButton>
        </Tooltip>
        <TextField
          type="number"
          size="small"
          value={testTakersCount}
          onChange={(e) => setTestTakersCount(parseInt(e.target.value))}
          placeholder="Count"
          sx={{ width: "7rem" }}
        />
        <Tooltip title={"Add test taker"}>
          <IconButton onClick={handleAddTestTakers}>
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          marginX: "auto",
          height: "100%",
          gap: 3,
        }}
      >
        {state.students.map((item: StudentDetails, index: number) => {
          const canInvoke = state.students[index].invokeUrl;
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                gap: 3,
              }}
            >
              <TextField
                size="small"
                value={item.firstName}
                sx={{ width: textBoxSize }}
                label="First name"
                onChange={(e) => handleInfoChange(e.target.value, index, "FN")}
              />
              <TextField
                sx={{ width: textBoxSize }}
                size="small"
                value={item.lastName}
                label="Last name"
                onChange={(e) => handleInfoChange(e.target.value, index, "LN")}
              />
              <TextField
                sx={{ width: textBoxSize }}
                size="small"
                value={item.email}
                label="Email"
                onChange={(e) => handleInfoChange(e.target.value, index, "EM")}
              />
              <TextField
                sx={{ width: textBoxSize }}
                size="small"
                value={item.phone}
                label="Phone"
                onChange={(e) => handleInfoChange(e.target.value, index, "PH")}
              />
              <Button
                variant="contained"
                size="small"
                onClick={(e) => handleCreateUrl(index)}
              >
                Create Url
              </Button>
              <Button
                variant="contained"
                size="small"
                onClick={() => handleInvokeUrl(index)}
                disabled={canInvoke ? false : true}
              >
                Invoke Url
              </Button>
              {/* <Button variant="contained" size="small" disabled>
                Create email
              </Button> */}
            </Box>
          );
        })}
      </Box>
      <Typography
        component={"h5"}
        fontSize={25}
        textAlign={"center"}
        fontWeight={500}
        gutterBottom
      >
        Test Taker&apos;s url for proctoring:
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          gap: 3,
        }}
      >
        {/* <Button variant="contained" size="small" sx={{ marginX: "auto" }}>
          Invoke Url
        </Button> */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "80%",
            height: "100%",
            justifyContent: "center",
            gap: 5,
            marginX: "auto",
          }}
        >
          <TextField
            variant="outlined"
            size="small"
            label="Subject of the email"
            sx={{ width: "30%" }}
          />
          <TextField
            variant="outlined"
            size="small"
            label="Actual exam url"
            sx={{ width: "30%" }}
          />
          <Button
            variant="contained"
            disabled
            sx={{ textTransform: "none" }}
            size="small"
          >
            Email candidate
          </Button>
        </Box>
        <Textarea minRows={8} />
      </Box>
      <DialogComponent
        open={isLoading}
        close={() => setIsLoading(false)}
        message={loaderMessage}
        title={undefined}
      />
    </Box>
  );
};

export default UrlCreator;
