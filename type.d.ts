type InstituteDetails = {
  instituteId: number;
  lmsName: string;
  launchUrl: string;
  lmsToken: string;
  status: number;
  invokeUrl: string;
  lmsAccessurl: string;
  instituteName: string;
  campusName: string;
  updatedBy: string;
  instituteType: string;
  instituteUrl: string;
  lmsVersion: string;
  accountId: string;
  developersKey: string;
  configurationKey: string;
  sharedSecret: string;
  ltiClientid: string;
  ltiXml: string;
  ltiXmlurl: string;
  firstName: string;
  contactLastname: string;
  contactPhone: string;
  fax: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  createUser: string;
  createDate: number;
  modifyUser: string;
  modifyDate: number;
  guid: string;
};

type InstitutesList = InstituteDetails[];

type InstitutesById = {
  [key: string]: InstituteDetails;
};

type UserProfile = {
  idLtiStudentProfile: string;
  guid: string;
  idUser: string;
  firstName: string;
  lastName: string;
  email: string;
  idFileIndex1: string;
  idFileIndex2: string;
  idFileName1: string;
  idFileName2: string;
  status: number;
  createUser: string;
  createDate: string;
  modifyUser: string;
  modifyDate: string;
  otp: string;
  otpCreateDate: string;
  idApprovalStatus: number;
  userType: string;
};

type AppState = {
  institutes: InstitutesById | undefined;
  allCourses: { [key: string]: CourseDetail } | undefined;
  selectedInstitute: InstituteDetails | undefined;
  selectedCourse: CourseDetail | undefined;
  error: {
    show: boolean;
    message: string;
  };
  instructorsOrManagers: { [key: string]: UserProfile } | undefined;
  selectedInstructorOrManager: UserProfile | undefined;
};

type CourseAndAssignmentState = {
  selectedCourse: undefined;
  selectedAssignment: QuizDetail | undefined;
  customValues: undefined;
  allQuizzes: { [key: string]: QuizDetail } | undefined;
  addNewCourseAssignment: boolean;
};

type SelectCourse = { type: "SELECT_COURSE"; payload: any };
type SelectAssignment = { type: "SELECT_ASSIGNMENT"; payload: any };
type AddCustomValues = { type: "ADD_VALUES"; payload: any };
type AddNewCourseAssignment = {
  type: "ADD_NEW_COURSE_ASSIGNMENT";
  payload: boolean;
};

type AddAllInstitutesAction = {
  type: "ADD_ALL_INSTITUTES";
  payload: { [key: string]: InstituteDetails };
};

type AddAllCoursesAction = {
  type: "ADD_ALL_COURSES";
  payload: { [key: string]: CourseDetail };
};

type AddAllQuizzesAction = {
  type: "ADD_ALL_QUIZZES";
  payload: { [key: string]: QuizDetail } | undefined;
};

type SetCourseIdAction = {
  type: "SET_COURSE_ID";
  payload: string;
};

type SetCourseNameAction = {
  type: "SET_COURSE_NAME";
  payload: string;
};

type SetAssignmentIdAction = {
  type: "SET_ASSGN_ID";
  payload: string;
};

type SetAssignmentNameAction = {
  type: "SET_ASSGN_NAME";
  payload: string;
};

type SetAssignmentDueDateAction = {
  type: "SET_ASSGN_DUE_DATE";
  payload: string;
};

type SetAssignmentExpDateAction = {
  type: "SET_ASSGN_EXP_DATE";
  payload: string;
};

type SetAssignmentDurationAction = {
  type: "SET_ASSGN_DURATION";
  payload: string;
};

type SetJobUrlAction = {
  type: "SET_JOB_URL";
  payload: string;
};

type SetPhoneAction = {
  type: "SET_PHONE";
  payload: string;
};

type SetEmailAction = {
  type: "SET_EMAIL";
  payload: string;
};

type SetErrorAction = {
  type: "SET_ERROR";
  payload: {
    show: boolean;
    message: string;
  };
};

type SelectInstitute = {
  type: "SELECT_INSTITUTE";
  payload: InstituteDetails;
};

type SelectCourse = {
  type: "SELECT_COURSE";
  payload: CourseDetail;
};

type SelectQuiz = {
  type: "SELECT_QUIZ";
  payload: QuizDetail;
};

type TestTakerDetail = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  url: string;
};

type AddAllInstructorsManagers = {
  type: "ADD_INSTRUCTORS_MANAGERS";
  payload: { [key: string]: UserProfile } | undefined;
};

type SelectInstructorManager = {
  type: "SELECT_INSTRUCTOR_MANAGER";
  payload: UserProfile;
};

type EmailScafholding = {
  testName: string;
  instituteName: string;
  candidateName: string;
  courseName: string;
  duration: string;
  testExpiryDate: string;
  testLink: string;
  instituteContactName: string;
};

type CourseDetail = {
  message: string;
  code: number;
  responseStatus: "CONTINUE";
  data: {};
  errorData: {};
  id: string;
  course: string;
  guid: string;
  section: string;
  shortName: string;
  longName: string;
  description: string;
  courseId: number;
  status: number;
  startDate: string;
  endDate: string;
  createdDate: string;
};

type QuizDetail = {
  message: string;
  code: number;
  responseStatus: "CONTINUE";
  data: {};
  errorData: {};
  id: string;
  quizId: string;
  guid: string;
  courseId: number;
  section: string;
  shortName: string;
  longName: string;
  description: string;
  status: number;
  duration: number;
  allowedAttempts: number;
  dueDate: string;
  accessCode: number;
  startDate: string;
  endDate: string;
  createdDate: string;
  quizType: string;
};

type CourseAssignmentDetails = {
  courseName: string;
  courseId: string;
  assignmentId: string;
  assignmentTitle: string;
  courseStartDate: string;
};

type InstructorManagerDetails = {
  profile: string;
  assgnDate: string;
  assgnExpDate: string;
  jobUrl: string;
  phone: string;
  email: string;
  duration: string;
};

type NewCourseAndAssignmentDetails = {
  courseName: string;
  courseId: string;
  assignmentId: string;
  assignmentTitle: string;
};

type InstructorManagerDetailFieldErrors = {
  profile: boolean;
  assgnDate: boolean;
  assgnExpDate: boolean;
  jobUrl: boolean;
  phone: boolean;
  email: boolean;
  duration: boolean;
};

type AssignmentSchedule = {
  dueDate: string;
  expDate: string;
  duration: string;
};

type OtherDetails = {
  jobUrl: string;
  phone: string;
  email: string;
};

type AddUpdateStudentAction = {
  type: "ADD_UPDATE_STUDENT";
  payload: StudentDetails[];
};

type StudentDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  invokeUrl: string;
};

type NewCourse = { name: string; startDate: string; endDate: string };
type NewAssignment = {
  name: string;
  startDate: string;
  endDate: string;
  duration: string;
  url: string;
};

type AddNewCourseAction = {
  type: "ADD_NEW_COURSE";
  payload: NewCourse;
};

type AddNewAssignmentAction = {
  type: "ADD_NEW_ASSIGNMENT";
  payload: NewAssignment;
};

type ToogleNewCourseAction = {
  type: "TOOGLE_NEW_COURSE";
  payload: boolean;
};

type ToogleNewAssignmentAction = {
  type: "TOOGLE_NEW_ASSIGNMENT";
  payload: boolean;
};

type InitialState = {
  institute: { [key: string]: InstituteDetails } | undefined;
  courses: { [key: string]: CourseDetail } | undefined;
  quizzes: { [key: string]: QuizDetail } | undefined;
  profiles: { [key: string]: UserProfile } | undefined;
  selectedInstitute: InstituteDetails | undefined;
  selectedCourses: CourseDetail | undefined;
  selectedQuiz: QuizDetail | undefined;
  selectedProfile: UserProfile | undefined;
  newCourseAndAssignmentDetails: NewCourseAndAssignmentDetails;
  assignmentSchedulingDetails: AssignmentSchedule;
  otherDetails: OtherDetails;
  newCourseAssignment: boolean;
  students: StudentDetails[];
  newCourse: boolean;
  newAssignment: boolean;
  newCourseDetails: NewCourse;
  newAssignmentDetails: NewAssignment;
};

type GenerateInvokeUrlPayload = {
  institute: InstituteDetails;
  course: CourseDetail | undefined;
  quiz: QuizDetail | undefined;
  profile: UserProfile | undefined;
  courseId: string;
  courseStartDate: string;
  courseName: string;
  assignmentId: string;
  assignmentName: string;
  studentId: string;
  assgnDueDt: string;
  assgnExpDt: string;
  duration: string;
  phone: string;
  email: string;
  newCourseAndAssignment: boolean;
};

type CreateCourse = {
  courseId: number;
  guid: string;
  section: string;
  shortName: string;
  longName: string;
  description: string;
  status: number;
  startDate: string;
  endDate: string;
};

type CreateQuiz = {
  createdBy: string;
  quizId: string;
  guid: string;
  courseId: number;
  section: string;
  shortName: string;
  longName: string;
  description: string;
  status: number;
  duration: number;
  allowedAttempts: number;
  dueDate: string;
  accessCode: number;
  startDate: string;
  endDate: string;
  quizType: string;
};

type ReducerActions =
  | AddNewCourseAction
  | AddNewAssignmentAction
  | ToogleNewCourseAction
  | ToogleNewAssignmentAction
  | AddAllInstitutesAction
  | SelectInstitute
  | AddAllCoursesAction
  | SelectCourse
  | SetErrorAction
  | AddAllInstructorsManagers
  | SelectInstructorManager
  | SelectCourse
  | SelectAssignment
  | AddCustomValues
  | AddNewCourseAssignment
  | AddAllQuizzesAction
  | SelectQuiz
  | SetCourseIdAction
  | SetCourseNameAction
  | SetAssignmentIdAction
  | SetAssignmentNameAction
  | SetAssignmentDueDateAction
  | SetAssignmentExpDateAction
  | SetAssignmentDurationAction
  | SetJobUrlAction
  | SetPhoneAction
  | SetEmailAction
  | AddUpdateStudentAction;
