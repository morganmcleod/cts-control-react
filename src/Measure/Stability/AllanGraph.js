import React, { useRef } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { Box } from '@mui/material';
import useContainerDimensions from "../../Shared/UseContainerDimensions";

export default function AllanGraph(props) {
  const selectedTimeSeriesId = useSelector((state) => state.Stability.selectedTimeSeriesId);
  let imgURL = axios.defaults.baseURL;
  if (selectedTimeSeriesId) {
    imgURL += ((props.mode === 'phase') ? '/stability/phase/allan/plot/{}' : '/stability/amp/allan/plot/{}').replace('{}', selectedTimeSeriesId);
  }
  const componentRef = useRef();
  const width = useContainerDimensions(componentRef).width;

  const onImage404 = (e) => {
    e.target.src = '/images/selectfromlist.png';
  }

  return (
    <div ref={componentRef}>
      { selectedTimeSeriesId &&
        <Box      
          component="img"
          sx={{
            width: {width}
          }}
          src={imgURL} 
          alt={props.mode + " stability plot"}
          onError={onImage404}
        />
      }
    </div>
  );
}

