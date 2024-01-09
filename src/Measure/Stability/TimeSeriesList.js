import React, { useEffect, useCallback, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';

import {
  Box,
  Table,
  TableCell,
  TableBody,
  TableRow,
  TableContainer,
  TableHead
} from '@mui/material'

// HTTP and store
import axios from "axios";
import { setTimeSeriesList, selectTimeSeriesId } from './StabilitySlice'

import localDate from "../../Shared/LocalDate";

export default function TimeSeriesList(props) {
  const timeSeriesList = useSelector((state) => state.Stability.timeSeriesList);
  const refresh = useSelector((state) => state.Stability.refreshTimeSeriesList);
  const mode = useSelector((state) => state.Stability.mode);
  const lastRefresh = useRef(null);
  const lastMode = useRef(null);
  const selectedTimeSeriesId = useSelector((state) => state.Stability.selectedTimeSeriesId);
  const dispatch = useDispatch();

  const findSelected = useCallback(() => {
    const entry = Object.entries(timeSeriesList).find(item => item[1].key === selectedTimeSeriesId);
    return entry
  }, [selectedTimeSeriesId, timeSeriesList]);

  const fetch = useCallback(() => {
    const URL = (props.mode === 'phase') ? '/stability/phase/timeseries/list' : '/stability/amp/timeseries/list';
    axios.get(URL)
    .then(res => {
      dispatch(setTimeSeriesList(res.data.items));
      if (!findSelected())
        dispatch(selectTimeSeriesId(null));
    })
    .catch(error => {
      console.log(error);
    })
  }, [dispatch, props.mode, findSelected]);

  useEffect(() => {
    if (refresh !== lastRefresh.current) {
      lastRefresh.current = refresh;
      fetch();
    } else if (mode !== lastMode.current) {
      lastMode.current = mode;
      fetch();
    }
  }, [fetch, refresh, mode]);

  const columns = [
    {
      id: 'key',
      label: 'key',
      minWidth: 15
    },
    {
      id: 'freqLO',
      label: 'freqLO',
      minWidth: 15
    },
    {
      id: 'pol',
      label: 'pol',
      minWidth: 15
    },
    {
      id: 'sideband',
      label: 'sideband',
      minWidth: 15
    },
    {
      id: 'timeStamp',
      label: 'time stamp',
      minWidth: 60,
      format: (value) => localDate(value)
    }
  ];
  
  const handleClick = (rowId) => {
    if (selectedTimeSeriesId && selectedTimeSeriesId === rowId)
      dispatch(selectTimeSeriesId(null));
    else
      dispatch(selectTimeSeriesId(rowId));
  }

  const isSelected = (rowId) => {
    return selectedTimeSeriesId === rowId;
  }

  return (
    <Box style={{ height: "25vh", maxHeight: "25vh", overflowX: "hidden" }} overflow="scroll">
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>          
            { columns.map((column) => (
              <TableCell
                key={column.id}
                align="left"
                style={{ minWidth: column.minWidth }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          { timeSeriesList.map((row) => {
            const isRowSelected = isSelected(row.key);
            return (
              <TableRow 
                hover
                key={"row" + row.key}
                role="checkbox"
                selected={isRowSelected}
                aria-checked={isRowSelected}
                sx={{ cursor: 'pointer' }}
                onClick={(e) => handleClick(row.key)}
              >                
                { columns.map((column) => (
                  <TableCell 
                    key={"cell " + column.id + ' ' + row.key}
                    align="left"
                  >
                    { column.format ? column.format(row[column.id]) : row[column.id]
                    }
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>        
    </TableContainer>
    </Box>
  );
}
