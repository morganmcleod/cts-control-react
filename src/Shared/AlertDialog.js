import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog(props) {
  const {open, title, children, onClose } = props;
  
  const handleClose = (confirm) => {
    onClose(confirm);
  };

  return (
    <Dialog
      open={open}
      onClose={() => handleClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"      
    >
      <DialogTitle id="alert-dialog-title" color="secondary">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" variant="h6" color="contrastText">
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" color="primary" onClick={() => handleClose(true)} autoFocus>OK</Button>
        <Button variant="contained" color="error" onClick={() => handleClose(false)}>CANCEL</Button>
      </DialogActions>
    </Dialog>
  );
}