// A special kind of async clice that loads resources from backend, may cache them in local storage and then reload the cacahed resources

// Here the resource is considered a REST API Resource
import { createSlice } from "@reduxjs/toolkit";

// stateSignature ==> {loadStatus: number, dataItems: Array, source: 'LS' | 'BACKEND'}

export function createResourceSlice({
  name,
  additionalInitialState = {},
  additionalReducers = {},
}) {
  return createSlice({
    name: name,
    initialState: {
      loadStatus: 0,
      createStatus: { id: null, status: 0 },
      dataItems: [],
      lastCached: null,
      indicesMap: {},
      ...additionalInitialState,
    },
    reducers: {
      gotLoaded: (state, action) => {
        // gets the new dataitems from the action.payload and pushes them to the dataItems array
        action.payload.forEach((item) => {
          state.dataItems.push(item);
        });
        state.loadStatus = 2;
      },
      gotCached: (state, action) => {
        state.lastCached = action.payload;
      },
      indicesMapUpdated: (state, action) => {
        // gets an array of tuples (id, newIndex) and updates the mapping object
        action.payload.forEach(([id, idx]) => {
          state.indicesMap[id] = idx;
        });
      },
      startedLoading: (state) => {
        state.loadStatus = 1;
      },
      failedLoading: (state) => {
        state.loadStatus = 3;
      },
      startedCreating: (state) => {
        state.createStatus = 1;
      },
      failedCreating: (state, action) => {
        state.createStatus = { id: action.payload, status: 3 };
      },
      resourceCreated: (state, action) => {
        state.dataItems.push(action.payload.resource);
        state.indicesMap[action.payload.id] = state.dataItems.length - 1;
        state.createStatus = { id: action.payload.id, status: 2 };
      },
      ...additionalReducers,
    },
  });
}

export function generateCacherThunk(
  sliceName,
  sliceActions,
  idGetter = (obj) => obj.id
) {
  return () => {
    return (dispatch, getState) => {
      const sliceState = getState()[sliceName];

      const now = Date.now();

      localStorage.setItem(
        `_resource_${sliceName}_items`,
        JSON.stringify(sliceState.dataItems)
      );

      localStorage.setItem(`_resource_${sliceName}_cachedAt`, now);

      dispatch(sliceActions.gotCached(now));
    };
  };
}

export function generateCacheChecker(sliceName) {
  return () => {
    let lastUpdates = localStorage.getItem(
      `_resource_${sliceName}_lastUpdated`
    );
    let items = localStorage.getItem(`_resource_${sliceName}_items`);
    return lastUpdates === null || items === null;
  };
}

export function generateResourceLocalloadThunk(
  sliceName,
  sliceActions,
  idGetter, // given any resource item from dataItems, should return its unique identifier
  updatesEndpoint
) {
  /*
    Dispatch this thunk when you are sure there is data cached (doesnt matter if stale) in the local starage
    name of local storage ids to be picked are:
        * _resource_${sliceName}_lastUpdated
        * _resource_${sliceName}_items
  */
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

        let items = localStorage.getItem(`_resource_${sliceName}_items`);

        if (lastUpdates === null || items === null) {
          throw new Error("Cannot load cached data, Local Storage empty");
        }

        items = JSON.parse(items);
        lastUpdates = items.map((item) => ({
          id: idGetter(item),
          lastUpdated: item.lastUpdated,
        }));
        // load the items from cache if present
        // If there are items cached, send all the last updates to backend and update cached data. Otherwise

        async function getUpdatesFromBackend() {
          /*
              This function sends and array of object of interface {id: any, lastUpdated: timestamp}
              and expects to get an array of updated items if any got updated or an object of kind {id: any, deleted: true} if the object of id got deleted
            */
          const res = await fetch(updatesEndpoint, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...headers,
            },
            body: JSON.stringify(lastUpdates),
          });
          if (res.ok) {
            const resObj = await res.json();
            for (const updatedItem of resObj) {
              const idx = items.findIndex(
                (item) => idGetter(item) === idGetter(updatedItem)
              );
              if (updatedItem.deleted) {
                items.splice(idx, 1);
              } else {
                items[idx] = { ...updatedItem };
              }
            }
            dispatch(sliceActions.gotLoaded(items));
          } else {
            throw new Error();
          }
        }
        getUpdatesFromBackend().catch(() =>
          dispatch(sliceActions.failedLoading())
        );
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
  idGetter = (obj) => obj.id
) {
  return (headers = {}, queryParams = {}) => {
    return (dispatch, getState) => {
      const sliceState = getState()[sliceName];
      const loadStatus = sliceState.loadStatus;
      // if resource is currently not loading, proceed
      console.log(loadStatus);
      if (loadStatus !== 1 && loadStatus !== 2) {
        async function loadResource() {
          const dataItemsLength = sliceState.dataItems.length;

          const urlSearchParamsStr = new URLSearchParams({
            ...queryParams,
          }).toString();
          const res = await fetch(endpoint + "?" + urlSearchParamsStr, {
            headers: headers,
          });
          // is response if ok then we got the resource, otherwise we got an error
          if (res.ok) {
            // Make sure that the body of the response must be an array of resources
            const resObj = await res.json();
            dispatch(sliceActions.gotLoaded(resObj));
            dispatch(
              sliceActions.indicesMapUpdated(
                resObj.map((item, i) => [idGetter(item), dataItemsLength + i])
              )
            );
          } else {
            throw new Error();
          }
        }

        // now loading the resource
        loadResource().catch((err) => {
          console.error(err);
          dispatch(sliceActions.failedLoading());
        });
      } else {
        console.log(`Fetch silenced for resource ${sliceName}`);
      }
    };
  };
}

export function generateResourceCreatedThunk(
  sliceName,
  sliceActions,
  endpoint,
  idGetter = (obj) => obj.id
) {
  return (newResourceData, reqHeaders = {}) => {
    return (dispatch, getState) => {
      const sliceState = getState()[sliceName];
      const createStatus = sliceState.createStatus;
      if (createStatus !== 1) {
        async function contactBackendToCreate() {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", ...reqHeaders },
            body: JSON.stringify(newResourceData),
          });

          if (res.status === 201) {
            const newResourceObj = await res.json();
            dispatch(
              sliceActions.resourceCreated({
                id: idGetter(newResourceObj),
                resource: newResourceObj,
              })
            );
          } else {
            throw new Error("Failed to create resource");
          }
        }
        contactBackendToCreate().catch((err) =>
          dispatch(sliceActions.failedCreating(idGetter(newResourceObj)))
        );
      }
    };
  };
}
