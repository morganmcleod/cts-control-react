import React, { useRef } from "react";
import { useSelector } from 'react-redux';
import axios from "axios";
import { Box } from '@mui/material';
import useContainerDimensions from "../../Shared/UseContainerDimensions";

export default function TimeSeriesGraph(props) {
  const selectedTimeSeriesId = useSelector((state) => state.Stability.selectedTimeSeriesId);
  const timeSeriesList = useSelector((state) => state.Stability.timeSeriesList);

  let imgURL = axios.defaults.baseURL;
  if (selectedTimeSeriesId && timeSeriesList) {
    imgURL += ((props.mode === 'phase') ? '/stability/phase/timeseries/plot/{}' : '/stability/amp/timeseries/plot/{}').replace('{}', selectedTimeSeriesId);
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
          alt={props.mode + " time series plot"}
          onError={onImage404}
        />
      }
    </div>
  );
}

