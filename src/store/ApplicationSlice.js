import { createSlice } from "@reduxjs/toolkit";
import { taggingEngine } from "../../backend";
import { resolve } from "path";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    flash: { showing: false, msg: "Here is a sample message", type: "SUCCESS" },
    imageUpload: {
      marked: [],
      data: [],
    },
  },
  reducers: {
    flashed: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload.msg;
      state.flash.type = action.payload.type;
    },
    flashHidden: (state) => {
      state.flash.showing = false;
    },
    flashedError: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "FAILURE";
    },
    flashedSuccess: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "SUCCESS";
    },
    flashedInfo: (state, action) => {
      state.flash.showing = true;
      state.flash.msg = action.payload;
      state.flash.type = "INFO";
    },
    imagesAdded: (state, action) => {
      for (const { file, dimension } of action.payload) {
        state.imageUpload.data.push({
          name: file.name,
          file: file,
          originalDimension: dimension,
          tags: { object: [], people: [] },
          boxes: { object: [], people: [] },
          provisionalSuggestions: { loadStatus: 0, items: [] },
          provisionalBox: null,
          selectedSuggestionIds: [],
        });
      }
    },
    imageRemoved: (state, action) => {
      state.imageUpload.data = state.imageUpload.data.filter(
        (item) => item.name !== action.payload.imageName
      );
    },
    provisionalBoxCreated: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].provisionalBox =
        action.payload.box;
    },
    provisionalBoxDestroyed: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].provisionalBox = null;
      state.imageUpload.data[thisImageIndex].provisionalSuggestions = {
        loadStatus: 0,
        items: [],
      };
      state.imageUpload.data[thisImageIndex].selectedSuggestionIds = [];
    },
    suggestionGotSelected: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].selectedSuggestionIds.push(
        action.payload.idx
      );
    },
    suggestionGotUnselected: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].selectedSuggestionIds =
        state.imageUpload.data[thisImageIndex].selectedSuggestionIds.filter(
          (idx) => idx !== action.payload.idx
        );
    },
    userSuggested: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].provisionalSuggestions.items.push(
        action.payload.suggestion
      );
      state.imageUpload.data[thisImageIndex].selectedSuggestionIds.push(
        state.imageUpload.data[thisImageIndex].provisionalSuggestions.items
          .length - 1
      );
    },
    loadingProvisionalSuggestions: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[
        thisImageIndex
      ].provisionalSuggestions.loadStatus = 1;
    },
    provisionalSiggestionsLoaded: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].provisionalSuggestions.items.push(
        ...action.payload.newSuggestions
      );
      state.imageUpload.data[
        thisImageIndex
      ].provisionalSuggestions.loadStatus = 2;
    },
    tagAdded: (state, action) => {
      state.imageUpload.data[action.payload.imageName];
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  flashed,
  flashHidden,
  flashedError,
  flashedSuccess,
  flashedInfo,
  imagesAdded,
  imageRemoved,
  provisionalBoxCreated,
  provisionalBoxDestroyed,
  loadingProvisionalSuggestions,
  provisionalSiggestionsLoaded,
  suggestionGotSelected,
  suggestionGotUnselected,
  userSuggested,
} = appSlice.actions;

export function provisionalAskThunk(imageFile, imageName) {
  return (dispatch) => {
    async function contactServer() {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(taggingEngine.urls.recognizeSingleFAce, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const resObj = await res.json();
        const newSuggestions = [
          ...resObj.predictions.confident,
          ...resObj.predictions.blurry,
        ];
        console.log(newSuggestions);
        dispatch(
          appSlice.actions.provisionalSiggestionsLoaded({
            imageName,
            newSuggestions,
          })
        );
      }
    }

    dispatch(appSlice.actions.loadingProvisionalSuggestions({ imageName }));
    contactServer().catch((err) => console.log);
  };
}

export default appSlice.reducer;
