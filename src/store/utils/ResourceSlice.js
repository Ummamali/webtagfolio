// A special kind of async clice that loads resources from backend, may cache them in local storage and then reload the cacahed resources

// Here the resource is considered a REST API Resource
import { createSlice } from "@reduxjs/toolkit";

// stateSignature ==> {loadStatus: number, dataItems: Array, source: 'LS' | 'BACKEND'}

export function createResourceSlice({
  name,
  pagination = { pageNumber: 0, pageSize: 10 },
  caching = true,
  additionalInitialState = {},
  additionalReducers = {},
}) {
  return createSlice({
    name: name,
    initialState: {
      loadStatus: 0,
      dataItems: [],
      caching: caching,
      ...additionalInitialState,
    },
    reducers: {
      gotLoaded: (state, action) => {
        // gets the new dataitems from the action.payload and pushes them to the dataItems array
        state.dataItems.push(action.payload);
        state.loadStatus = 2;
      },
      startedLoading: (state) => {
        state.loadStatus = 1;
      },
      failedLoading: (state) => {
        state.loadStatus = 3;
      },
      ...additionalReducers,
    },
  });
}

export function generateResourceLocalloadThunk(
  sliceName,
  sliceActions,
  idGetter, // given any resource item from dataItems, should return its unique identifier
  endpoint
) {
  return (headers = {}) => {
    return (dispatch, getState) => {
      const sliceState = getState()[sliceName];
      const loadStatus = sliceState.loadStatus;
      if (loadStatus !== 1) {
        // we will get the last updated array of each object
        /*
        Last updated array array should look like this
        [
          {identifier: any (we will get it from idGetter), lastUpdated: timestamp},.....
        ]
        */
        let lastUpdates = localStorage.getItem(
          `_resource_${sliceName}_lastUpdated`
        );
        lastUpdates = lastUpdates !== null ? JSON.parse(lastUpdates) : [];
        // load the items from cache if present
        let items = localStorage.getItem(`_resource_${sliceName}_items`);
        items = items !== null ? JSON.parse(items) : [];
        // send all the last updates to backend
        if (lastUpdates.length > 0) {
          async function getUpdatesFromBackend() {
            /*
              This function sends and array of object of interface {id: any, lastUpdated: timestamp}
              and expects to get an array of updated items if any got updated or an object of kind {id: any, deleted: true} if the object of id got deleted
            */
            const res = await fetch(endpoint, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                ...headers,
              },
              body: JSON.stringify(lastUpdates),
            });
            if (res.ok) {
              const resObj = await res.json();
              for (const item of resObj) {
              }
            } else {
              throw new Error();
            }
          }
        }

        dispatch(sliceActions.gotLoaded(items));
      } else {
        console.log(`Local Load silenced for resource ${sliceName}`);
      }
    };
  };
}

export function genarateResourceFetchedThunk(
  sliceName,
  sliceActions,
  endpoint,
  fetchCount = 10
) {
  return (headers = {}, queryParams = {}, fetchCount = fetchCount) => {
    return (dispatch, getState) => {
      const sliceState = getState()[sliceName];
      const loadStatus = sliceState.loadStatus;
      // if resource is currently not loading, proceed
      if (loadStatus !== 1) {
        async function loadResource() {
          const pageParams = {
            start: sliceState.items.length(),
            fetchCount: fetchCount,
          };
          const urlSearchParamsStr = new URLSearchParams({
            ...pageParams,
            ...queryParams,
          }).toString();
          const res = await fetch(endpoint + urlSearchParamsStr, {
            headers: headers,
          });
          // is response if ok then we got the resource, otherwise we got an error
          if (res.ok) {
            // Make sure that the body of the response must be a string of resources
            const resObj = await res.json();
            dispatch(sliceActions.gotLoaded(resObj));
          } else {
            throw new Error();
          }
        }

        // now loading the resource
        loadResource().catch(() => dispatch(sliceActions.failedLoading()));
      } else {
        console.log(`Fetch silenced for resource ${sliceName}`);
      }
    };
  };
}
