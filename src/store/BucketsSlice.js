import { resources } from "../../backend";
import {
  createResourceSlice,
  genarateResourceFetchedThunk,
  generateResourceCreatedThunk,
} from "./utils/ResourceSlice";

const bucketIdGetter = (bucket) => bucket.name;

const bucketsSlice = createResourceSlice({
  name: "buckets",
});

// Action creators are generated for each case reducer function
export const bucketsActions = bucketsSlice.actions;

export const loadBucketsThunk = genarateResourceFetchedThunk(
  "buckets",
  bucketsActions,
  resources.buckets.url,
  bucketIdGetter
);

export const createBucketThunk = generateResourceCreatedThunk(
  "buckets",
  bucketsActions,
  resources.buckets.url,
  bucketIdGetter
);

export default bucketsSlice;
