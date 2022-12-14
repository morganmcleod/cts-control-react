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
    
    // If valid, set a timer to do final save:
    if (e.currentTarget.value > 0) {
    // if timer is running, clear it:
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
      // Start timer:
      timer.current = setTimeout(() => {        
        // Stop the timer before writing:
        clearTimeout(timer.current);
        timer.current = null;  
        // Final save:
        props.onSave(e);
      }, props.timeout ?? 1000);
    }
  }

  return (
    <OutlinedInput
      name={props.name}
      size="small"
      margin="none"
      className="component-input"
      style={props.style}
      onChange={e => {onChange(e)}}
      value={value}
    />
  );
}
