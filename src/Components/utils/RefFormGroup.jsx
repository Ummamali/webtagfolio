import React, { forwardRef } from "react";

/* Following are the validity states (vStatuses)
      0 =====> Not sure whether valid or invalid
      1 =========> Loading......
      2 =====> Good (tick will be shown)
      3 ====> Invalid (cross will be shown) 
*/

const RefFormGroup = forwardRef((props, ref) => {
  /*
    Referenced Form Group:
    A form group to easily get data from the user using the input and giving feedback on validation
  
    Props:
      {
        >>>> vData: {vStatus: 0|1|2|3, msg: String}
         (This object is present in first element of the useValidator Hook returned List )
        >>>> hideIcons: hides the icons on input element if true
        >>>> className: the class names to be applied on the parent div
        >>>> id: the id of the input element for label and also for data-identity prop
        NOTE: id should be same as you are using for the validator hook 
        >>>> label: Label
        >>>> labelCls: classes for label element
        >>>> type: The type for the input element
        >>>> inputCls: {normal (classes applied always), loading (classes applied when loading), valid (classes applied when input is surely valid), invalid (applied when surely invalid), errorMessage (class attribute for the small error message element)}
        >>>> forInputEl: Object (the props that you want to give directly to the input element)
        You can give following props to the refComponent and it will forward to the input el
          placeholder, autoComplete, min, max
      
        >>>> validate: function(e)
          (this should be an event handler, and will be called upon blur)
        >>>>  resetValidity function(e)
          (this should be an event handler, and will be called upon focus)
        NOTE: Above two handler will have input element as targets, with a special dataset value of 'identity', use this to know which input is the point of interest
      }

    How This Component Looks Like (copy this and provide appropriate props):
        <RefFormGroup
          vData={}
          id=""
          label=""
          type="text"
          placeholder=""
          autoComplete="off"
          validate={}
          resetValidity={}
          ref={}
        />

    Stylings:
      Give custom classes to the group with className prop
      The returned parent has three elements, you can select them as:
        -- label
        -- .input-contain
        -- p.invalid-msg
  
  */
  const isInvalid = props.vData.vStatus === 3;
  const isLoading = props.vData.vStatus === 1;

  const inputCls = props.inputCls;
  let additionalCls = "";

  if (isInvalid) {
    additionalCls = inputCls.invalid;
  } else if (isLoading) {
    additionalCls = inputCls.loading;
  }

  return (
    <div className={"form-group " + (props.className ? props.className : "")}>
      <label
        htmlFor={props.id}
        className={"block text-gray-500 mb-1 " + props.labelCls}
      >
        {props.label}
      </label>
      <div className="relative input-contain">
        <input
          type={props.type}
          id={props.id}
          className={inputCls.normal + " " + additionalCls}
          ref={ref}
          placeholder={props.placeholder}
          autoComplete={props.autoComplete}
          min={props.min}
          max={props.max}
          data-identity={props.id}
          onFocus={props.resetValidity}
          onBlur={props.validate}
          {...props.forInputEl}
        />
        {isInvalid && (
          <small className={inputCls.errorMessage}>{props.vData.msg}</small>
        )}
      </div>
    </div>
  );
});

export default RefFormGroup;
