import { createSlice } from "@reduxjs/toolkit";
import { taggingEngine } from "../../backend";
import { resolve } from "path";
import { bucketsActions } from "./BucketsSlice";

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

export function uploadImagesThunk(imageNames, bucketName, router) {
  return (dispatch, getState) => {
    const loadedImagesList = getState().app.imageUpload.data;
    const token = getState().user.token;
    const imageIndices = {};
    for (const imageName of imageNames) {
      imageIndices[imageName] = loadedImagesList.findIndex(
        (item) => item.name === imageName
      );
    }
    async function sendData() {
      console.log("Sending data for multiple images");
      const newItems = Object.values(imageIndices).map((index) => {
        // Destructure the object, omitting the specified property
        const obj = loadedImagesList[index];
        const newObj = { title: obj.name, boxes: obj.boxes };
        const objectTags =
          obj.overallSuggestions.suggestions.object.selectedIdcs.map(
            (i) => obj.overallSuggestions.suggestions.object.list[i]
          );
        const peopleTags =
          obj.overallSuggestions.suggestions.people.selectedIdcs.map(
            (i) => obj.overallSuggestions.suggestions.people.list[i]
          );
        newObj["tags"] = { objects: objectTags, people: peopleTags };
        return newObj;
      });
      const res = await fetch(taggingEngine.urls.uploadmultipleData, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/json" },
        body: JSON.stringify({ bucketName: bucketName, newItems: newItems }),
      });
      if (res.ok) {
        const resObj = await res.json();
        return resObj;
      }
    }

    async function uploadFilesToBackend(itemsCreated) {
      const files = Object.values(imageIndices).map(
        (i) => loadedImagesList[i].file
      );
      // Create FormData object
      const formData = new FormData();

      // Append each file to FormData
      files.forEach((file) => {
        formData.append("images", file);
      });

      // Send FormData to backend using fetch API
      const response = await fetch(
        taggingEngine.urls.uploadmultipleImageFiles + "/" + bucketName,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: token,
          },
        }
      );

      if (response.ok) {
        const resObj = await response.json();
        if (resObj.success) {
          dispatch(flashedSuccess("Image has been uploaded"));
          dispatch(
            bucketsActions.newMediaAdded({
              bucketname: bucketName,
              mediaItems: itemsCreated,
            })
          );
          router.back();
        }
      } else {
        throw new Error("unable to save image");
      }
    }

    sendData()
      .then(async (resObj) => {
        if (resObj.dataSaved) {
          await uploadFilesToBackend(resObj.itemsCreated);
        } else {
          throw new Error("Unable to upload image(s)");
        }
      })
      .catch((err) => dispatch(flashedError("Unable to upload image(s)")));
  };
}

export default appSlice.reducer;
