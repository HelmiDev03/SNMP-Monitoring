import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  TextField,
  CircularProgress,
} from "@mui/material";
import { FaEdit } from "react-icons/fa";

const Settings = () => {
  const [data, setData] = useState(null);
  const [editingContact, setEditingContact] = useState(false);
  const [editingLocation, setEditingLocation] = useState(false);
  const [newContact, setNewContact] = useState("");
  const [newLocation, setNewLocation] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:8000/snmp_data")
      .then((response) => {
        setData(response.data);
        setNewContact(response.data.contact);
        setNewLocation(response.data.location);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  const saveContact = () => {
    axios
      .put("http://localhost:8000/snmp_data/", { contact: newContact })
      .then(() => {
        setData({ ...data, contact: newContact });
        setEditingContact(false);
      })
      .catch((error) => console.error("Error updating contact:", error));
  };

  const saveLocation = () => {
    axios
      .put("http://localhost:8000/snmp_data/", { location: newLocation })
      .then(() => {
        setData({ ...data, location: newLocation });
        setEditingLocation(false);
      })
      .catch((error) => console.error("Error updating location:", error));
  };

  if (!data) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress size={50} />
      </Box>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
              System Settings
            </Typography>
      <Box>
        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Description</Typography>
            <Typography variant="body2">{data.description}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Uptime</Typography>
            <Typography variant="body2">{data.uptime}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Contact</Typography>
            {editingContact ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newContact}
                  onChange={(e) => setNewContact(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="outlined" onClick={saveContact}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2">{data.contact}</Typography>
                <Button
                  startIcon={<FaEdit />}
                  variant="outlined"
                  onClick={() => setEditingContact(true)}
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Name</Typography>
            <Typography variant="body2">{data.name}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Location</Typography>
            {editingLocation ? (
              <>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  sx={{ mb: 1 }}
                />
                <Button variant="outlined" onClick={saveLocation}>
                  Save
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body2">{data.location}</Typography>
                <Button
                  startIcon={<FaEdit />}
                  variant="outlined"
                  onClick={() => setEditingLocation(true)}
                  sx={{ mt: 1 }}
                >
                  Edit
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        <Card sx={{ mb: 2, backgroundColor: "#e0e0e0" }}>
          <CardContent>
            <Typography variant="h6">Services</Typography>
            <Typography variant="body2">{data.services}</Typography>
          </CardContent>
        </Card>
      </Box>
    </div>
  );
};

export default Settings;
