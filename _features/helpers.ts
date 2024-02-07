import CryptoJS from "crypto-js";

export function generateMail(payload: EmailScafholding) {
  return `
    Subject: Invitation to Take Assessment Test for ${payload.testName} at ${payload.instituteName}
    
    Dear [Candidate's Name],
    
    I hope this email finds you well. We appreciate your interest in the ${payload.courseName} at ${payload.instituteName} and would like to invite you to the next stage of our hiring process.
    
    As part of our comprehensive evaluation, we have designed an assessment test to assess your skills and suitability for the role. The test is aimed at evaluating specific competencies essential for success in the [Course name].
    
    Test Details:
    Duration: [Specify the duration of the test]
    Instructions: [Not applicable]
    Submission Deadline: [Specify the deadline for submitting the completed test]
    
    Proctoring link:
    You can access the assessment test by clicking on the following link: [Include Test Link]. Please ensure that you start the proctoring process before you start the test.
    Accessing the Test:
    You can access the assessment test by clicking on the following link: [Include Test Link]. Please ensure that you complete the test within the stipulated time frame.
    
    Next Steps:
    Once you have completed the test, please reply to this email with the subject line "[Your Company] Assessment Test Completed - [Test Taker’s Full Name]". This will notify us to proceed with the review of your test results.
    
    Important Notes:
    
    Ensure a stable internet connection while taking the test.
    Complete the test in one sitting to ensure accuracy and fairness in evaluation.
    We appreciate your commitment to the hiring process and value the effort you invest in showcasing your skills. If you encounter any technical issues or have questions, feel free to reach out to [Instructor Name] at [Instructor email].
    
    Thank you for considering a career with [Institute Name]. We look forward to reviewing your assessment results.
    
    Best regards,
    
    [Your Name]
    [Institute Name]
    `;
}

/**
 * Calculates the number of digits in a given number without converting it to a string.
 * Returns 0 if the input is undefined or falsy.
 *
 * @param {number | undefined} phone - The number for which to determine the length.
 * @returns {number} - The length of the number (number of digits) or 0 if the input is undefined or falsy.
 * @example
 * const number = 12345;
 * const length = getNumberLength(number);
 * console.log(`The length of the number ${number} is ${length} digits.`);
 */
export function getNumberLength(phone: number | undefined): number {
  if (!phone) return 0;

  const absoluteValue = Math.abs(phone);

  const orderOfMagnitude = Math.floor(Math.log10(absoluteValue)) + 1;

  return orderOfMagnitude;
}

/**
 * Generates an invoke URL with the specified parameters.
 *
 * @param {GenerateInvokeUrlPayload} data - The payload containing necessary information.
 * @returns {string} The generated invoke URL.
 */
export function getInvokeUrl(
  data: GenerateInvokeUrlPayload,
  contextState: InitialState
): string {
  const queryParams = new URLSearchParams();
  const { profile, institute, courseId, assignmentId, course } = data;

  // Set common parameters
  queryParams.set("request_initiator", institute.guid);
  queryParams.set("api_domain", institute.guid);
  queryParams.set("api_base_url", institute.instituteUrl);
  queryParams.set("lms_provider_com", new URL(institute.instituteUrl).host);
  queryParams.set("account_name", institute.campusName);
  queryParams.set("account_id", institute.accountId);
  queryParams.set("assignment_points_possible", String(null));
  queryParams.set("loadInstructorPage", String(null));
  queryParams.set("landingPage", String(null));
  queryParams.set("toolConsumerGuid", institute.guid);
  queryParams.set("invokeUrl", institute.invokeUrl);

  // Set parameters based on whether it's a new course and assignment or not
  if (contextState.newCourse) {
    const { newCourseDetails, newAssignmentDetails } = contextState;
    queryParams.set("course_id", courseId);
    queryParams.set("course_name", newCourseDetails.name);
    queryParams.set("course_start_at", newCourseDetails.startDate);
    queryParams.set("assignment_id", assignmentId);
    queryParams.set("assignment_title", newAssignmentDetails.name);
    queryParams.set("assignment_unlock_at", newAssignmentDetails.startDate);
    queryParams.set("assignment_lock_at", newAssignmentDetails.endDate);
    queryParams.set("assignment_due_at", newAssignmentDetails.startDate);
    queryParams.set("assignment_duration", newAssignmentDetails.duration);
  } else {
    if (contextState.newAssignment) {
      const {
        newAssignmentDetails: { name, duration, endDate, startDate },
      } = contextState;
      if (course) {
        queryParams.set("course_id", course.courseId.toString());
        queryParams.set("course_name", course.longName);
        queryParams.set("course_start_at", course.startDate);
        queryParams.set("assignment_id", assignmentId);
        queryParams.set("assignment_title", name);
        queryParams.set("assignment_unlock_at", startDate);
        queryParams.set("assignment_lock_at", endDate);
        queryParams.set("assignment_due_at", startDate);
        queryParams.set("assignment_duration", duration);
      }
    } else {
      const { selectedCourses, selectedQuiz } = contextState;
      if (selectedCourses && selectedQuiz) {
        queryParams.set("course_id", selectedCourses.courseId.toString());
        queryParams.set("course_name", selectedCourses.longName);
        queryParams.set("course_start_at", selectedCourses.startDate);
        queryParams.set("assignment_id", selectedQuiz.quizId);
        queryParams.set("assignment_title", selectedQuiz.longName);
        queryParams.set("assignment_unlock_at", selectedQuiz.startDate);
        queryParams.set("assignment_lock_at", selectedQuiz.endDate);
        queryParams.set("assignment_due_at", selectedQuiz.dueDate);
        queryParams.set(
          "assignment_duration",
          selectedQuiz.duration.toString()
        );
      }
    }
  }

  // Set parameters based on the user profile
  if (!profile) {
    const { studentId } = data;
    queryParams.set("membership_roles", "StudentEnrollment");
    queryParams.set("user_id", studentId);
    queryParams.set("person_name_full", "Nina");
    queryParams.set("person_name_given", "Mukhopadhaya");
    queryParams.set("person_name_family", "Mukhopadhaya");
    queryParams.set("person_email_primary", "nina.mukhopadhaya@gmail.com");
    queryParams.set("loginId", studentId);
  } else {
    const { userType, idUser, firstName, lastName, email } = profile;
    queryParams.set("membership_roles", userType);
    queryParams.set("user_id", idUser);
    queryParams.set("person_name_full", `${firstName} ${lastName}`);
    queryParams.set("person_name_given", firstName);
    queryParams.set("person_name_family", firstName);
    queryParams.set("person_email_primary", email);
    queryParams.set("loginId", profile.idUser);
  }

  return `https://bsecure.examd.org/bsecure/config/?${queryParams.toString()}`;
}

/**
 * Generates a random UUID (Universally Unique Identifier).
 *
 * @function
 * @returns {string} The generated UUID as a hexadecimal string.
 */
export function generateUuid(): string {
  const uuid = CryptoJS.lib.WordArray.random(16).toString(CryptoJS.enc.Hex);
  return uuid;
}

/**
 * Generates a random 4-digit number.
 * @returns {number} A random 4-digit number.
 */
export function generateRandom4DigitNumber(): number {
  return Math.floor(1000 + Math.random() * 9000);
}
