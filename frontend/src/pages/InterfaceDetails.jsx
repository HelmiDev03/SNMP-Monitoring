import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Chart from "react-apexcharts";
import axios from "axios";
import { Button, Typography, Grid, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer, Box, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from '@mui/icons-material/Download';



const InterfaceDetail = () => {
  const { index } = useParams();
  const [startTime, setStartTime] = useState(null);
  const [running, setRunning] = useState(false);
  const [dataHistory, setDataHistory] = useState([]);
  const [prevData, setPrevData] = useState(null);
  const [seriesData, setSeriesData] = useState({
    sent: [],
    received: [],
    sentDelta: [],
    recvDelta: [],
    time: [],
  });
  const intervalRef = useRef(null);
  const seriesDataRef = useRef(seriesData); // Keeps a mutable ref to latest data
  useEffect(() => {
    seriesDataRef.current = seriesData;
  }, [seriesData]);

  const handleDownloadLog = () => {
    if (!startTime) return;
  
    const filename = `interface-${index}-log-${startTime.toISOString().replace(/[:.]/g, '-')}.txt`;
    
    let logContent = '';
    seriesData.time.forEach((time, idx) => {
      // Calculate exact timestamp for each measurement
      const measurementTime = new Date(startTime.getTime() + time * 1000);
      
      logContent += `${measurementTime.toISOString().replace('T', ' ').substring(0, 19)} | ` +
                    `Sent: ${seriesData.sent[idx]} bytes | ` +
                    `Recv: ${seriesData.received[idx]} bytes | ` +
                    `DeltaSent: ${seriesData.sentDelta[idx]} bytes | ` +
                    `DeltaRecvd: ${seriesData.recvDelta[idx]} bytes\n`;
    });
    
    // Create download
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

const fetchData = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/snmp/${index}`);
    const { sent, received } = res.data;
    const timestamp = seriesDataRef.current.time.length * 5;

    // Get last values from the REF (always up-to-date)
    const lastSent = seriesDataRef.current.sent.at(-1) ?? null;
    const lastReceived = seriesDataRef.current.received.at(-1) ?? null;

 

    const sentDelta = lastSent !== null ? sent - lastSent : 0;
    const recvDelta = lastReceived !== null ? received - lastReceived : 0;

    setSeriesData(prev => ({
      sent: [...prev.sent, sent],
      received: [...prev.received, received],
      sentDelta: [...prev.sentDelta, sentDelta],
      recvDelta: [...prev.recvDelta, recvDelta],
      time: [...prev.time, timestamp],
    }));

    setDataHistory(prev => [
      ...prev,
      { sent, received, sentDelta, recvDelta }
    ]);

  } catch (err) {
    console.error("SNMP fetch failed", err);
  }
};
  const handleStart = () => {
    if (running) return;
    setStartTime(new Date(new Date().getTime() + 60 * 60 * 1000));
    // Reset state
    setSeriesData({
      sent: [],
      received: [],
      sentDelta: [],
      recvDelta: [],
      time: [],
    });
    setDataHistory([]);
    setPrevData(null);

    setRunning(true);
    fetchData(); // First fetch immediately
    intervalRef.current = setInterval(fetchData, 5000);
  };

  const handleStop = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // Cleanup on unmount
  }, []);

  const chartOptions = (title, data) => ({
    options: {
      chart: {
        id: title,
        toolbar: { show: false },
      },
      xaxis: {
        categories: seriesData.time,
        title: { text: "Time (s)" },
      },
      yaxis: {
        title: { text: "Bytes" },
      },
      title: {
        text: title,
        align: "left",
      },
    },
    series: [{ name: title, data }],
  });

return (
    <div className="p-4">
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Interface #{index} Detail</Typography>
            {!running && seriesData.time.length > 0 && (
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleDownloadLog} 
                    startIcon={<DownloadIcon />}
                    sx={{ ml: 2 }}
                >
                    Download History Log
                </Button>
            )}
        </Box>

        <div className="my-4 flex gap-4">
            <Button variant="contained" onClick={handleStart} disabled={running}>
                Start
            </Button>
            <Button variant="outlined" onClick={handleStop} disabled={!running}>
                Stop
            </Button>
        </div>

        {running && dataHistory.length > 0 && (
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                    History 
                </Typography>
                <TableContainer component={Paper} sx={{ maxHeight: 400, overflow: 'auto' }}>
                    <Table stickyHeader size="small" aria-label="history log">
                        <TableHead>
                            <TableRow>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'common.white' }}>
                                    Sent (bytes)
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'common.white' }}>
                                    Received (bytes)
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'common.white' }}>
                                    Delta Sent
                                </TableCell>
                                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: 'primary.main', color: 'common.white' }}>
                                    Delta Received
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {dataHistory.map((data, idx) => (
                                <TableRow 
                                    key={idx}
                                    sx={{ 
                                        '&:nth-of-type(odd)': { backgroundColor: 'action.hover' },
                                        '&:last-child td, &:last-child th': { border: 0 }
                                    }}
                                >
                                    <TableCell align="center">{data.sent.toLocaleString()}</TableCell>
                                    <TableCell align="center">{data.received.toLocaleString()}</TableCell>
                                    <TableCell align="center" sx={{ color: data.sentDelta > 0 ? 'success.main' : 'text.secondary' }}>
                                        {data.sentDelta.toLocaleString()}
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: data.recvDelta > 0 ? 'success.main' : 'text.secondary' }}>
                                        {data.recvDelta.toLocaleString()}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )}

        {!running && seriesData.time.length > 0 && (
            <div className="mt-8 grid grid-cols-2 gap-4">
                <Chart {...chartOptions("Total Sent", seriesData.sent)} />
                <Chart {...chartOptions("Total Received", seriesData.received)} />
                <Chart {...chartOptions("Delta Sent", seriesData.sentDelta)} />
                <Chart {...chartOptions("Delta Received", seriesData.recvDelta)} />
            </div>
        )}
    </div>
);
};

export default InterfaceDetail;