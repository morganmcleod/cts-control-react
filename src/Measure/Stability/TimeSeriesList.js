import React, { useEffect } from "react";
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
import { setTimeSeriesList, selectTimeSeries } from './StabilitySlice'

import localDate from "../../Shared/LocalDate";

export default function TimeSeriesList(props) {
  const timeSeriesList = useSelector((state) => state.Stability.timeSeriesList);
  const selectedTimeSeries = useSelector((state) => state.Stability.selectedTimeSeries);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/ampstability/timeseries/list')
    .then(res => {
      dispatch(setTimeSeriesList(res.data.items));
    })
    .catch(error => {
      console.log(error);
    })
}, [dispatch]);

  const columns = [
    {
      id: 'key',
      label: 'key',
      minWidth: 20
    },
    {
      id: 'freqLO',
      label: 'freqLO',
      minWidth: 20
    },
    {
      id: 'pol',
      label: 'pol',
      minWidth: 20
    },
    {
      id: 'sideband',
      label: 'sideband',
      minWidth: 20
    },
    {
      id: 'timeStamp',
      label: 'time stamp',
      minWidth: 40,
      format: (value) => localDate(value)
    },
    {
      id: 'dataStatus',
      label: 'data status',
      minWidth: 40
    }
  ];
  
  const handleClick = (rowId) => {
    if (selectedTimeSeries && selectedTimeSeries === rowId)
      dispatch(selectTimeSeries(null));
    else
      dispatch(selectTimeSeries(rowId));
  }

  const isSelected = (rowId) => {
    return selectedTimeSeries === rowId;
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
