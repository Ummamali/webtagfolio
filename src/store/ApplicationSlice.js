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
          boxes: [],
          provisionalSuggestions: { loadStatus: 0, items: [] },
          provisionalBox: null,
          originalPBox: null,
          selectedSuggestionIds: [],
          overallSuggestions: {
            loadStatus: { people: 0, object: 0 },
            suggestions: {
              object: { list: [], selectedIdcs: [] },
              people: { list: [], selectedIdcs: [] },
            },
          },
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
      state.imageUpload.data[thisImageIndex].originalPBox =
        action.payload.originalPBox;
    },
    provisionalBoxDestroyed: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].provisionalBox = null;
      state.imageUpload.data[thisImageIndex].originalPBox = null;
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
    pBoxSaved: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      const box = state.imageUpload.data[thisImageIndex].originalPBox;
      const tags = state.imageUpload.data[
        thisImageIndex
      ].selectedSuggestionIds.map(
        (idx) =>
          state.imageUpload.data[thisImageIndex].provisionalSuggestions.items[
            idx
          ]
      );
      state.imageUpload.data[thisImageIndex].boxes.push({
        box: box,
        tags: tags,
      });
    },
    suggestionsLoading: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].overallSuggestions.loadStatus[
        action.payload.tagType
      ] = 1;
    },
    suggestionsLoaded: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      for (const sug of action.payload.suggestions) {
        state.imageUpload.data[thisImageIndex].overallSuggestions.suggestions[
          action.payload.tagType
        ].list.push(sug);
      }
      state.imageUpload.data[thisImageIndex].overallSuggestions.loadStatus[
        action.payload.tagType
      ] = 2;
    },
    overallSuggestionGotSelected: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].overallSuggestions.suggestions[
        action.payload.tagType
      ].selectedIdcs.push(action.payload.idx);
    },
    overallSuggestionGotUnselected: (state, action) => {
      const thisImageIndex = state.imageUpload.data.findIndex(
        (item) => item.name === action.payload.imageName
      );
      state.imageUpload.data[thisImageIndex].overallSuggestions.suggestions[
        action.payload.tagType
      ].selectedIdcs = state.imageUpload.data[
        thisImageIndex
      ].overallSuggestions.suggestions[
        action.payload.tagType
      ].selectedIdcs.filter((item) => item !== action.payload.idx);
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
  pBoxSaved,
  suggestionsLoading,
  suggestionsLoaded,
  overallSuggestionGotSelected,
  overallSuggestionGotUnselected,
} = appSlice.actions;

export function loadOverallFacesThunk(imageFile, imageName) {
  return (dispatch) => {
    async function contactServer() {
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(taggingEngine.urls.recognizeAllFaces, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        const resObj = await res.json();
        const combinedNewSuggestions = Array.from(
          new Set([
            ...resObj.predictions.confident,
            ...resObj.predictions.blurry,
          ])
        );
        dispatch(
          suggestionsLoaded({
            imageName: imageName,
            tagType: "people",
            suggestions: combinedNewSuggestions,
          })
        );
      }
    }

    dispatch(suggestionsLoading({ imageName: imageName, tagType: "people" }));
    console.log("analyzing faces...");
    contactServer().catch((err) => console.log);
  };
}

export function loadOverallObjectsThunk(imageFile, imageName) {
  return (dispatch) => {
    async function contactServer(algo) {
      console.log(`[${algo}] analyzing for objects...`);
      const formData = new FormData();
      formData.append("image", imageFile);
      const res = await fetch(
        `${taggingEngine.urls.overallObjectTags}/${algo}`,
        {
          method: "POST",
          body: formData,
        }
      );
      if (res.ok) {
        const resObj = await res.json();
        dispatch(
          suggestionsLoaded({
            imageName: imageName,
            tagType: "object",
            suggestions: resObj.predictions,
          })
        );
      }
    }

    dispatch(suggestionsLoading({ imageName: imageName, tagType: "object" }));
    contactServer("RESNET").catch((err) => console.log);
    // .then(() => contactServer("DENSENET"))
  };
}

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
