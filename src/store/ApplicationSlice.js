import { createSlice } from "@reduxjs/toolkit";

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
      for (const file of action.payload) {
        state.imageUpload.data.push({
          name: file.name,
          file: file,
          tags: { object: [], people: {} },
          boxes: { object: [], people: {} },
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
      ].provisionalSuggestions.loadingStatus = 2;
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
      ].provisionalSuggestions.loadingStatus = 2;
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
  suggestionGotSelected,
  suggestionGotUnselected,
  userSuggested,
} = appSlice.actions;

export default appSlice.reducer;
