import React from "react";
import Box from '@mui/material/Box';

export default function TabPanel(props) {

  return (
    <div
      hidden={props.visibleTab !== props.index}
      id={`simple-tabpanel-${props.index}`}
    >
      {props.visibleTab === props.index && (          
        <Box padding="0px">
          {props.children}
        </Box>
      )}
    </div>
  );
}
