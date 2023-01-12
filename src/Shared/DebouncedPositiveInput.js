import React, { useState, useRef } from "react";
import OutlinedInput from '@mui/material/OutlinedInput';

export default function DebouncedPositiveInput(props) {
  // input debouncing timer
  const timer = useRef(null);

  // initialize value
  const [value, setValue] = useState("\t");

  // Because props.value is going to be zero on first render,
  // we need to update value in the control when a realistic value is seen
  if (value === "\t" && props.value > 0) {
    setValue(props.value);
  }
  
  const onChange = (e) => {// Clear any existing timer
    // Save the changed value so that UI is responsive:
    setValue(e.currentTarget.value);
    
    // If not valid return:
    if (e.currentTarget.value < 0 || e.currentTarget.value === '' || isNaN(e.currentTarget.value))
      return;

    // if timer is running, clear it:
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    // set a timer to do the final save:
    timer.current = setTimeout(() => {        
      // Stop the timer before writing:
      clearTimeout(timer.current);
      timer.current = null;  
      // Final save:
      props.onSave(e);
    }, props.timeout ?? 1000);
  }

  return (
    <OutlinedInput
      error={value < 0 || value === '' || isNaN(value)}
      name={props.name}
      size="small"
      margin="none"      
      style={props.style}
      onChange={e => {onChange(e)}}
      value={value}
      className="smallinput"
    />
  );
}
