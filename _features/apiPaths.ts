const getAllInstitutesUrl = "/canvas-institute-details";
const getAllCoursesUrl = (guid: string) => `/lti-course-by-guid-id/${guid}`;
const getAllQuizzesByGuidCourseIdUrl = (guid: string, courseId: number) =>
  `/lti-quiz-by-guid-by-course-id/${guid}/${courseId}`;
const getUserProfilesByGuidUrl = (guid: string) =>
  `/lti-user-profile-guid/${guid}`;
const createUserProfileOnlyUrl = "/saveLtiStudentProfileOnly";

const createCourseUrl = "/lti-course";

const createQuizUrl = "/lti-quiz";

export {
  createCourseUrl,
  createQuizUrl, createUserProfileOnlyUrl, getAllCoursesUrl,
  getAllInstitutesUrl,
  getAllQuizzesByGuidCourseIdUrl,
  getUserProfilesByGuidUrl
};

