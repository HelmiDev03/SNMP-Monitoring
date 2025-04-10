import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const Interfaces = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/active-interfaces");
        setData(response.data);
      } catch (err) {
        console.error("Failed to fetch interfaces", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <Typography variant="h4" gutterBottom>
      Interfaces Used Since Startup
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Index</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Description</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Type</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Status</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Speed</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>MTU</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Received(octets)</strong></TableCell>
                <TableCell sx={{ backgroundColor: "#19133c", color: "#fff" }}><strong>Transmitted(octets)</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data && typeof data === "object" &&
                Object.entries(data).map(([index, iface]) => (
                  <TableRow
                    key={index}
                    hover
                    onClick={() => navigate(`/interfaces/${index}`)}
                    sx={{ cursor: "pointer" }}
                  >
                    <TableCell>{index}</TableCell>
                    <TableCell>{iface.Description}</TableCell>
                    <TableCell>{iface.Type}</TableCell>
                    <TableCell>{iface.Status}</TableCell>
                    <TableCell>{iface.Speed}</TableCell>
                    <TableCell>{iface.MTU}</TableCell>
                    <TableCell>{iface.Received}</TableCell>
                    <TableCell>{iface.Transmitted}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Interfaces;
