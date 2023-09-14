import React from 'react';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

export default function ActionDialog(props) {
  const { open, title, children, onClose } = props;

  const handleClose = () => {
    onClose();
  };
  
  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"      
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" component={'span'} variant="h6" color="contrastText">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => handleClose()}>CLOSE</Button>
      </DialogActions>
    </Dialog>
  );
}