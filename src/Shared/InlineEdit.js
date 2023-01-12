import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import './InlineEdit.css'

//MUI adatptation from https://www.emgoto.com/react-inline-edit/

export default function InlineEdit({ value, setValue, numeric }) {
  const [editingValue, setEditingValue] = useState(value);

  const onChange = (event) => setEditingValue(event.target.value);

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    } else if (event.key === "Escape") {
      setEditingValue(value);
    }
  }

  const onBlur = (event) => {
    const val = event.target.value.trim();
    if (val === "" || (numeric && isNaN(val))) {
      setEditingValue(value);
    } else {
      setValue(val)
    }
  }

  useEffect(() => {
    setEditingValue(value);
  }, [value]);

  return (
    <TextField
      size="small"
      variant="standard"
      value={editingValue}
      onChange={onChange}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      error={numeric && isNaN(editingValue)}
      InputProps={{
        disableUnderline: true,
        sx: { fontWeight: 'bold' }
      }}
    />
  );
};
