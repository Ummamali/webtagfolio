import {
  createResourceSlice,
  generateCacheChecker,
  generateResourceLocalloadThunk,
  genarateResourceFetchedThunk,
  generateCacherThunk,
} from "./utils/ResourceSlice";

const sliceName = "students";
export const StudentsSlice = createResourceSlice({
  name: sliceName,
});

export const studentsActions = StudentsSlice.actions;

export const studentsIsCached = generateCacheChecker(sliceName);

export const cacheStudents = generateCacherThunk(sliceName, studentsActions);

export const loadCachedStudents = generateResourceLocalloadThunk(
  sliceName,
  studentsActions,
  (stObj) => stObj.id,
  "http://127.0.0.1:3300/getUpdated"
);

export const fetchStudents = genarateResourceFetchedThunk(
  sliceName,
  studentsActions,
  "http://127.0.0.1:3300/",
  2
);
