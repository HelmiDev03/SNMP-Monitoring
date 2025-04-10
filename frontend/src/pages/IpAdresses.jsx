import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
} from "@mui/material";

const IpAddresses = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:8000/ipaddress")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch IP address data", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
        IP Addresses
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>Index</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>IP Address</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>Interface Index</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>Net Mask</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>Broadcast Address</strong>
                </TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}>
                  <strong>Reassembly Max Size</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.entries(data).map(([index, iface]) => (
                <TableRow key={index}>
                  <TableCell>{index}</TableCell>
                  <TableCell>{iface.ipAddress}</TableCell>
                  <TableCell>{iface.ifIndex}</TableCell>
                  <TableCell>{iface.netMask}</TableCell>
                  <TableCell>{iface.bcastAddr}</TableCell>
                  <TableCell>{iface.reasmMaxSize}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default IpAddresses;
