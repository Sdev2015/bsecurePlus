"use client";
import dayjs from "dayjs";
import React, { ReactNode, createContext, useContext, useReducer } from "react";

const initialState: InitialState = {
  institute: undefined,
  courses: undefined,
  quizzes: undefined,
  profiles: undefined,
  selectedInstitute: undefined,
  selectedCourses: undefined,
  selectedQuiz: undefined,
  selectedProfile: undefined,
  newCourseAssignment: false,
  newCourseAndAssignmentDetails: {
    courseName: "",
    courseId: "",
    assignmentId: "",
    assignmentTitle: "",
  },
  assignmentSchedulingDetails: {
    dueDate: dayjs().toISOString(),
    expDate: dayjs().add(7, "days").toISOString(),
    duration: "15",
  },
  otherDetails: {
    jobUrl: "",
    phone: "",
    email: "",
  },
  students: [
    { email: "", phone: "", firstName: "", lastName: "", invokeUrl: "" },
    { email: "", phone: "", firstName: "", lastName: "", invokeUrl: "" },
    { email: "", phone: "", firstName: "", lastName: "", invokeUrl: "" },
  ],
};
const StateContext = createContext<
  { state: InitialState; dispatch: React.Dispatch<ReducerActions> } | undefined
>(undefined);

const stateReducer = (
  state: InitialState,
  action: ReducerActions
): InitialState => {
  switch (action.type) {
    case "ADD_ALL_INSTITUTES":
      return { ...state, institute: action.payload };

    case "ADD_ALL_COURSES":
      return { ...state, courses: action.payload };
    case "ADD_ALL_QUIZZES":
      return { ...state, quizzes: action.payload };
    case "ADD_INSTRUCTORS_MANAGERS":
      return { ...state, profiles: action.payload };
    case "ADD_NEW_COURSE_ASSIGNMENT":
      return { ...state, newCourseAssignment: action.payload };
    case "SELECT_INSTITUTE":
      return {
        ...state,
        selectedInstitute: action.payload,
        courses: undefined,
        quizzes: undefined,
        profiles: undefined,
      };
    case "SELECT_COURSE":
      return { ...state, selectedCourses: action.payload, quizzes: undefined };
    case "SELECT_QUIZ":
      return { ...state, selectedQuiz: action.payload };
    case "SELECT_INSTRUCTOR_MANAGER":
      return { ...state, selectedProfile: action.payload };
    case "SET_COURSE_ID":
      return {
        ...state,
        newCourseAndAssignmentDetails: {
          ...state.newCourseAndAssignmentDetails,
          courseId: action.payload,
        },
      };
    case "SET_COURSE_NAME":
      return {
        ...state,
        newCourseAndAssignmentDetails: {
          ...state.newCourseAndAssignmentDetails,
          courseName: action.payload,
        },
      };
    case "SET_ASSGN_ID":
      return {
        ...state,
        newCourseAndAssignmentDetails: {
          ...state.newCourseAndAssignmentDetails,
          assignmentId: action.payload,
        },
      };
    case "SET_ASSGN_NAME":
      return {
        ...state,
        newCourseAndAssignmentDetails: {
          ...state.newCourseAndAssignmentDetails,
          assignmentTitle: action.payload,
        },
      };
    case "SET_ASSGN_DUE_DATE":
      return {
        ...state,
        assignmentSchedulingDetails: {
          ...state.assignmentSchedulingDetails,
          dueDate: action.payload,
        },
      };
    case "SET_ASSGN_EXP_DATE":
      return {
        ...state,
        assignmentSchedulingDetails: {
          ...state.assignmentSchedulingDetails,
          expDate: action.payload,
        },
      };
    case "SET_ASSGN_DURATION":
      return {
        ...state,
        assignmentSchedulingDetails: {
          ...state.assignmentSchedulingDetails,
          duration: action.payload,
        },
      };
    case "SET_JOB_URL":
      return {
        ...state,
        otherDetails: {
          ...state.otherDetails,
          jobUrl: action.payload,
        },
      };
    case "SET_PHONE":
      return {
        ...state,
        otherDetails: {
          ...state.otherDetails,
          phone: action.payload,
        },
      };
    case "SET_EMAIL":
      return {
        ...state,
        otherDetails: {
          ...state.otherDetails,
          email: action.payload,
        },
      };
    case "ADD_UPDATE_STUDENT":
      return { ...state, students: action.payload };
    default:
      return state;
  }
};

const useStateContext = () => {
  const context = useContext(StateContext);
  if (!context) {
    throw new Error("useStateContext must be used within a ContextProvider");
  }
  return context;
};

interface CounterProviderProps {
  children: ReactNode;
}

const ContextProvider: React.FC<CounterProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <StateContext.Provider value={{ state, dispatch }}>
      {children}
    </StateContext.Provider>
  );
};

export { ContextProvider, StateContext, useStateContext };

