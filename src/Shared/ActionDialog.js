import React, { useEffect, useState } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { 
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';

export default function ActionDialog(props) {
  const {open, title, children, onClose } = props;

  const [actionData, setActionData] = useState([])
    
  const options = {retryOnError: true, shouldReconnect: (closeEvent) => true};

  const { 
    readyState: actionReady,
    lastMessage: actionMessage 
  } = useWebSocket("ws://localhost:8000/action/action_ws", options);

  useEffect(() => {
    // websocket handler for action message
    if (actionReady === ReadyState.OPEN) {
      if (actionMessage !== null) {
        try {
          const action = JSON.parse(actionMessage.data);
          setActionData(actionData + [action.paOutput, action.sisCurrent]);
        } catch (err) {
          console.log(err);
        }
      }
    }
  }, [actionReady, actionMessage, actionData]);

  const handleClose = () => {
    onClose();
    setActionData([])
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
        <DialogContentText id="alert-dialog-description" variant="h6" color="contrastText">
          {actionData}
          {children}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => handleClose()}>CLOSE</Button>
      </DialogActions>
    </Dialog>
  );
}