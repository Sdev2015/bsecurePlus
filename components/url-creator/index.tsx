"use client";

import { createUserProfile } from "@/_features/apiServices";
import { useStateContext } from "@/_features/context";
import {
  generateRandom4DigitNumber,
  generateUuid,
  getInvokeUrl,
} from "@/_features/helpers";
import { RestartAltOutlined } from "@mui/icons-material";
import AddIcon from "@mui/icons-material/Add";
import {
  Button,
  IconButton,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useMutation } from "@tanstack/react-query";
import dayjs from "dayjs";
import { NextPage } from "next";
import { useState } from "react";
import DialogComponent from "../dialog-component";

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
    const list: StudentDetails[] = Array.from({ length: 1 }).map((_) => ({
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
    const { newCourseAssignment, newCourse, newAssignment } = state;

    let payload: GenerateInvokeUrlPayload = {
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
      courseStartDate: "",
    };

    // if (newCourseAssignment) {
    //   const {
    //     newCourseAndAssignmentDetails: {
    //       courseId,
    //       courseName,
    //       assignmentId,
    //       assignmentTitle,
    //     },
    //     assignmentSchedulingDetails: { dueDate, duration, expDate },
    //   } = state;

    //   payload.courseId = courseId;
    //   payload.courseName = courseName;
    //   payload.assignmentId = assignmentId;
    //   payload.assignmentName = assignmentTitle;
    //   payload.assgnDueDt = dueDate;
    //   payload.assgnExpDt = expDate;
    //   payload.duration = duration;
    // } else {
    //   const {
    //     selectedCourses,
    //     selectedQuiz,
    //     assignmentSchedulingDetails: { dueDate, duration, expDate },
    //   } = state;
    //   if (selectedCourses && selectedQuiz) {
    //     payload.course = selectedCourses;
    //     payload.quiz = selectedQuiz;
    //     payload.assgnDueDt = dueDate;
    //     payload.assgnExpDt = expDate;
    //     payload.duration = duration;
    //   }
    // }

    if (newCourse) {
      const {
        newCourseDetails: { name, startDate },
        newAssignmentDetails,
      } = state;
      const courseId = generateRandom4DigitNumber();
      const quizId = generateRandom4DigitNumber();
      payload.courseId = courseId.toString();
      payload.courseName = name;
      payload.studentId = profile[0].idUser;
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
          selectedCourses,
        } = state;
        payload.course = selectedCourses;
        payload.assignmentId = generateUuid();
        payload.assignmentName = name;
        payload.assgnDueDt = startDate;
        payload.assgnExpDt = endDate;
        payload.duration = duration;
      } else {
        const { selectedQuiz, selectedCourses } = state;
        payload.quiz = selectedQuiz;
        payload.course = selectedCourses;
        payload.courseStartDate =
          selectedCourses?.startDate || dayjs().toISOString();
      }
    }

    testTakerDetail.invokeUrl = getInvokeUrl(payload, state);
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
          justifyContent: "space-between",
        }}
        gap={{ xs: 2 }}
        flexWrap={"wrap"}
      >
        <Typography variant="h6" color={"#008080"} fontWeight={700}>
          Test Taker&apos;s Information:
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 2,
            alignItems: "center",
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          gap: 3,
        }}
      >
        {state.students.map((item: StudentDetails, index: number) => {
          const canInvoke = state.students[index].invokeUrl;
          return (
            <Box
              display={"flex"}
              flexDirection={"column"}
              height={"100%"}
              gap={1}
              key={index}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  width: "100%",
                  gap: 3,
                }}
                flexWrap={"wrap"}
              >
                <TextField
                  size="small"
                  value={item.firstName}
                  sx={{ flexGrow: 1 }}
                  label="First name"
                  onChange={(e) =>
                    handleInfoChange(e.target.value, index, "FN")
                  }
                />
                <TextField
                  sx={{ flexGrow: 1 }}
                  size="small"
                  value={item.lastName}
                  label="Last name"
                  onChange={(e) =>
                    handleInfoChange(e.target.value, index, "LN")
                  }
                />
                <TextField
                  sx={{ flexGrow: 1 }}
                  size="small"
                  value={item.email}
                  label="Email"
                  onChange={(e) =>
                    handleInfoChange(e.target.value, index, "EM")
                  }
                />
                <TextField
                  sx={{ flexGrow: 1 }}
                  size="small"
                  value={item.phone}
                  label="Phone"
                  onChange={(e) =>
                    handleInfoChange(e.target.value, index, "PH")
                  }
                />
              </Box>
              <Box
                display={"flex"}
                flexDirection={"row"}
                width={"100%"}
                justifyContent={"end"}
                gap={2}
              >
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
              </Box>
            </Box>
          );
        })}
      </Box>
      {/* <Typography
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
      </Box> */}
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
