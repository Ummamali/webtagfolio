import { useReducer, useMemo } from "react";

// this hook is to be used with FormGroup components to invalidate the inputs

// actions
export const vActions = {
  SET: (payload) => ({ type: "SET", payload }),
  RESET: (payload) => ({ type: "RESET", payload }),
  RESETALL: (payload) => ({ type: "RESETALL", payload }),
};

function validityReducer(state, action) {
  if (action.type === "SET") {
    const stateCp = { ...state };
    const groupObject = stateCp[action.payload.identity];
    stateCp[action.payload.identity] = {
      ...groupObject,
      ...action.payload.new,
    };
    return stateCp;
  } else if (action.type === "RESET") {
    const stateCp = { ...state };
    stateCp[action.payload.identity].vStatus = 0;
    return stateCp;
  } else if (action.type === "RESETALL") {
    const stateCp = { ...state };
    for (const vObject of Object.values(stateCp)) {
      vObject.vStatus = 0;
    }
    return stateCp;
  } else {
    console.warn("Found invalid action for reducer");
    return state;
  }
}
export default function useValidator(
  identityList,
  validatorPredicates,
  asyncList = []
) {
  /* 
  Inputs:
  >>>>> identity list: object ---> {[identity]: [error-message]}
  >>>>> validatorPredicates: object ----> {[identity]: predicateFunc}
      Note: the predicateFunc should return an object {*isValid: boolean, msg: String | null}
      Though it is not necessary to return a msg, if msg has a falsy value default error msg provided from identityList will be used
  >>>>> asyncList: [identity (String)] array for identities that are validated asynchronously
   the validator will check if the predicate lies in async array to use then and catch accordingly. Make sure to make that function async
   */

  // Initial value will be calculated only for the first time
  const initialValue = useMemo(() => {
    const answer = {};
    for (const [identity, message] of Object.entries(identityList)) {
      answer[identity] = { vStatus: 0, msg: message };
    }
    return answer;
  }, []);

  const [validityStatuses, dispatchValidity] = useReducer(
    validityReducer,
    initialValue
  );

  // this is the majic function which will validate
  function validate(identity, value) {
    /* 
    The validate function returns a value(boolean) if the validator is synchronous
    and will return a promise(will resolve to a boolean) if the vaidator is asynchronous 

    Dont worry if you are just interested in validation, validation will be done automatically

    */
    const vFunc = validatorPredicates[identity];
    if (asyncList.includes(identity)) {
      return new Promise((resolve) => {
        // async validation
        dispatchValidity(
          vActions.SET({ identity: identity, new: { vStatus: 1 } })
        );
        vFunc(value)
          .then((validityResponse) => {
            const isValid = validityResponse.isValid;
            const newMessage = validityResponse.msg
              ? validityResponse.msg
              : identityList[identity];
            const newStatus = isValid ? 2 : 3;
            dispatchValidity(
              vActions.SET({
                identity: identity,
                new: { vStatus: newStatus, msg: newMessage },
              })
            );
            resolve(isValid);
          })
          .catch((error) => {
            dispatchValidity(
              vActions.SET({
                identity: identity,
                new: { vStatus: 3, msg: "Network Error: Failed to validate" },
              })
            );
            // the rejection has been handled above so the returned value is false
            resolve(false);
          });
      });
    } else {
      // synchronous validation
      const validityResponse = vFunc(value);
      const isValid = validityResponse.isValid;
      const newMessage = validityResponse.msg
        ? validityResponse.msg
        : identityList[identity];
      const newStatus = isValid ? 2 : 3;
      dispatchValidity(
        vActions.SET({
          identity: identity,
          new: { vStatus: newStatus, msg: newMessage },
        })
      );
      return isValid;
    }
  }
  return [validityStatuses, dispatchValidity, validate];
}
// =============================================================================
// Some utility functions to be used

export function getDefaultValidator(validateCore) {
  /*
  Returns a blur event handler which will validate on blur:
    --validateCore should be the same function as returned by the hook
  */
  return (e) => {
    const target = e.target;
    validateCore(target.dataset.identity, target.value);
  };
}

export function getDefaultResetValidator(dispatchValidator) {
  /*
  Returns a focus event handler which will reset validate on focus:
    --dispatch should be the same function as returned by the hook
  */
  return (e) => {
    const identity = e.target.dataset.identity;
    dispatchValidator(vActions.RESET({ identity }));
  };
}

export function syncValidateAll(currentValues, validate) {
  // returns whether the given values are valid or not
  const validations = [];
  for (const [identity, value] of Object.entries(currentValues)) {
    validations.push(validate(identity, value));
  }
  return !validations.includes(false);
}
