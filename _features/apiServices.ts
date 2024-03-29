import axios from "axios";
import {
  createCourseUrl,
  createQuizUrl,
  createUserProfileOnlyUrl,
  getAllCoursesUrl,
  getAllInstitutesUrl,
  getAllQuizzesByGuidCourseIdUrl,
  getUserProfilesByGuidUrl,
} from "./apiPaths";

const apiClient = axios.create({
  baseURL: "https://canvas-lms.examd.org/canvaslms/api/v1",
});

const getAllInstitutes = async () => {
  return await apiClient.get(getAllInstitutesUrl);
};

const getCoursesByGuid = async (guid: string) => {
  return await apiClient.get(getAllCoursesUrl(guid));
};

const getQuizzesByGuidCourseId = async (guid: string, courseId: number) => {
  return await apiClient.get(getAllQuizzesByGuidCourseIdUrl(guid, courseId));
};

const getUserProfilesByGuid = async (guid: string) => {
  return await apiClient.get(getUserProfilesByGuidUrl(guid));
};

const createUserProfile = async (payload: UserProfile) => {
  return await apiClient.post(createUserProfileOnlyUrl, { ...payload });
};

const createCourse = async (payload: CreateCourse) => {
  return await apiClient.post(createCourseUrl, { ...payload });
};

const createQuiz = async (payload: CreateQuiz) => {
  return await apiClient.post(createQuizUrl, { ...payload });
};

export {
  createCourse,
  createQuiz, createUserProfile, getAllInstitutes,
  getCoursesByGuid,
  getQuizzesByGuidCourseId,
  getUserProfilesByGuid
};

