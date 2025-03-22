import React, { useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Snackbar,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
// Bonus Tip:
// For production or staging, you can move apiBaseUrl to an environment variable (like VITE_API_URL) and use import.meta.env for cleaner config.
const apiBaseUrl = "http://localhost:5000";

interface FormData {
  name?: string;
  email: string;
  password: string;
  company?: string;
  role?: string;
}

const AuthForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({ email: "", password: "" });
  const [isSignup, setIsSignup] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const url = isSignup ? `${apiBaseUrl}/api/auth/signup` : `${apiBaseUrl}/api/auth/login`;
      const response = await axios.post(url, formData);
      setSnackbar({ open: true, message: response.data.message, severity: "success" });

      if (!isSignup) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("email", response.data.email);
        navigate("/workspace");
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setSnackbar({
        open: true,
        message: error.response?.data?.error || "An unexpected error occurred.",
        severity: "error",
      });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: 400, boxShadow: 3 }}>
        <Typography variant="h5" textAlign="center" mb={3}>
          {isSignup ? "Sign Up" : "Log In"}
        </Typography>

        <ToggleButtonGroup
          color="primary"
          value={isSignup ? "signup" : "login"}
          exclusive
          onChange={(_, newVal) => setIsSignup(newVal === "signup")}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="login">Login</ToggleButton>
          <ToggleButton value="signup">Signup</ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <TextField
                fullWidth
                label="Name"
                name="name"
                value={formData.name || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Company"
                name="company"
                value={formData.company || ""}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Role"
                name="role"
                value={formData.role || ""}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          <TextField
            fullWidth
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
          />
          <TextField
            fullWidth
            type="password"
            label="Password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
          />

          <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 2 }}>
            {isSignup ? "Sign Up" : "Login"}
          </Button>
        </form>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity as "success" | "error"}>{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};
export default AuthForm;