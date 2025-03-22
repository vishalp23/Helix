import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Avatar,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import axios from "axios";

interface UserProfileProps {
  open: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ open, onClose }) => {
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    company: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "error" | "warning" | "info" | "success";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (open) {
      const email = localStorage.getItem("email");
      if (email) {
        setLoading(true);
        axios
          .get(`/api/auth/user?email=${email}`)
          .then((res) => setProfileData(res.data))
          .catch(() =>
            setSnackbar({
              open: true,
              message: "Failed to fetch user data.",
              severity: "error",
            })
          )
          .finally(() => setLoading(false));
      }
    }
  }, [open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      await axios.put("/api/auth/update", profileData);
      setSnackbar({
        open: true,
        message: "Profile updated successfully!",
        severity: "success",
      });
      onClose();
    } catch {
      setSnackbar({ open: true, message: "Update failed.", severity: "error" });
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>User Profile</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
                <Avatar sx={{ width: 72, height: 72, mb: 2 }}>
                  {profileData.name ? profileData.name.charAt(0).toUpperCase() : "U"}
                </Avatar>
                <Typography variant="h6">
                  {profileData.name || "Unknown User"}
                </Typography>
              </Box>

              <TextField
                fullWidth
                label="Name"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profileData.email}
                margin="normal"
                disabled
              />
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={profileData.company}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={profileData.role}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleSave} color="primary" disabled={loading}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </>
  );
};

export default UserProfile;
