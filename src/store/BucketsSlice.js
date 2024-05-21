import { resources } from "../../backend";
import {
  createResourceSlice,
  genarateResourceFetchedThunk,
  generateResourceCreatedThunk,
} from "./utils/ResourceSlice";

const bucketIdGetter = (bucket) => bucket.name;

const bucketsSlice = createResourceSlice({
  name: "buckets",
  additionalReducers: {
    objectTagAdded: (state, action) => {
      state.dataItems[state.indicesMap[action.payload.bucketname]].items[
        action.payload.index
      ].tags.objects.push(action.payload.newTag);
    },
    peopleTagAdded: (state, action) => {
      state.dataItems[state.indicesMap[action.payload.bucketname]].items[
        action.payload.index
      ].tags.people.push(action.payload.newTag);
    },
    newMediaAdded: (state, action) => {
      const bucketIndex = state.indicesMap[action.payload.bucketname];
      state.dataItems[bucketIndex].items.push(...action.payload.mediaItems);
    },
  },
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
