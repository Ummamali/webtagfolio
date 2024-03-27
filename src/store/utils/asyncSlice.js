/*
  AsyncSlices are slices which depend upon data from the backend
  State Signature >>> {*loadStatus: 0|1|2|3, *data: Object (or other), isLoadedFromLS: boolean}
  Use Thunks to load Data. Once the data has been loaded, subsequent mutations will be done directly without contacting the server. Therefore, it is important that state is updated after the GOOD response from the backend!

  Dont know how to use this? Head to example case >>> https://github.com/Ummamali/photons/blob/master/src/store/contributorsSlice.js

  Following are the methods for These type of slices      
*/

// reducers
export const asyncSliceReducers = {
  replace: (state, action) => {
    /*
    action.payload >>>>>
     { new: Object (will be replaced with state.data),
       isLoadedFromLS: boolean (by default it is false unless you forcefull state it) }
    */
    for (const key in action.payload.new) {
      state.data[key] = action.payload.new[key];
    }
    //  whenever replaced, the async slice will be stated as "Successfully Loaded" ie. 2
    state.loadStatus = 2;
    state.isLoadedFromLS =
      action.payload.isLoadedFromLS !== undefined
        ? action.payload.isLoadedFromLS
        : false;
  },
  startLoading: (state) => {
    state.loadStatus = 1;
  },
  failedLoading: (state) => {
    state.loadStatus = 3;
  },
};

// initial state
export const asyncSliceInitial = {
  loadStatus: 0,
  data: {},
  isLoadedFromLS: false,
};

// asyncloaderThunk
export function generateAsyncThunk(sliceName, actionsObj, asyncLoader) {
  /* 
  Returns a thunk which gets object from asyncLoader and dispatches a replace to that slice
  Once slice has been loaded, the thunk will be silenced

  Signature:
   *actionsObject: {*startLoading, *failedLoading, *replace} action creators os that slice
   *asyncLoader: an async function which loads the data and raises exceptions on failure and returns the new state upon success (its loadFromServer)!!!!
   *sliceName: String that corresponds to the async slice name

   NOTE: make sure that asyncLoader returns an object on success because the replace core reducer will iterate through the new Object to populate the existing empty object
   */
  return (asyncArgs) => {
    return (dispatch, getState) => {
      const loadStatus = getState()[sliceName].loadStatus;
      if (loadStatus !== 2 && loadStatus !== 1) {
        // it means that the data has not been loaded from the server
        console.log("loading " + sliceName + " from backend");
        dispatch(actionsObj.startLoading());
        asyncLoader(asyncArgs)
          .then((newState) => {
            // if no error is thrown, data will be replaced! So throw the error when data is not in good <state>
            dispatch(actionsObj.replace({ new: newState }));
          })
          .catch((errorObj) => {
            console.log(errorObj);
            dispatch(actionsObj.failedLoading());
          });
      } else {
        console.log("loadFromServer silenced for " + sliceName);
      }
    };
  };
}
