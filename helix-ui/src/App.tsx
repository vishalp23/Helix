import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import ChatBar from "./components/chatBar";
import Workspace from "./components/Workspace";
import Header from "./components/Header";
import AuthForm from "./components/AuthForm";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

interface ChatMessage {
  sender: string;
  text: string;
}

export interface Task {
  id: number;
  description: string;
}

interface WorkspacePayload {
  tasks: Task[];
}

// Socket setup
const socket: Socket = io("http://localhost:5000", {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
});

// Themes
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#b692f6" },
    secondary: { main: "#c0a3f8" },
    background: { default: "#cccacf", paper: "#ffffff" },
    text: { primary: "#224c57", secondary: "#865bc7" },
  },
  shape: { borderRadius: 16 },
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: "#FFC107" },
    secondary: { main: "#7FFD700" },
    background: { default: "#2C2C2C", paper: "black" },
    text: { primary: "#EAEAEA", secondary: "#aaa" },
  },
  shape: { borderRadius: 16 },
});

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [workspaceTasks, setWorkspaceTasks] = useState<Task[]>([]);
  const handleToggleTheme = () => setIsDarkMode(!isDarkMode);

  useEffect(() => {
    socket.on("connect", () => console.log("Connected to server:", socket.id));

    socket.on("ai_response", (data: string) =>
      setChatMessages((prev) => [...prev, { sender: "Helix", text: data }])
    );

    socket.on("workspace_update", (data: WorkspacePayload) =>
      setWorkspaceTasks(data.tasks || [])
    );

    socket.on("disconnect", () => console.log("Disconnected from server"));

    return () => {
      socket.off("connect");
      socket.off("ai_response");
      socket.off("workspace_update");
      socket.off("disconnect");
    };
  }, []);

  const sendMessage = (message: string) => {
    setChatMessages((prev) => [...prev, { sender: "User", text: message }]);
    socket.emit("user_message", message);
  };

  return (
    <BrowserRouter>
      <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
        <Routes>
          {/* <Route path="/auth" element={<AuthForm />} /> */}
          <Route
            path="/workspace"
            element={
              <Box
                sx={{
                  bgcolor: "background.default",
                  minHeight: "100vh",
                  display: "flex",
                  flexDirection: "column",
                  p: { xs: 1, md: 2 },
                  boxSizing: "border-box",
                }}
              >
                <Header onToggleTheme={handleToggleTheme} isDarkMode={isDarkMode} />

                <Box
                  sx={{
                    display: "flex",
                    flex: 1,
                    borderRadius: 0.5,
                    overflow: "hidden",
                    mt: { xs: 1, md: 2 },
                    gap: { xs: 1, md: 2 },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", md: "40%" },
                      display: "flex",
                      flexDirection: "column",
                      borderRadius: 1,
                    }}
                  >
                    <ChatBar messages={chatMessages} onSend={sendMessage} />
                  </Box>
                  <Box sx={{ flex: 1, overflow: "auto", borderRadius: 0.5 }}>
                    <Workspace tasks={workspaceTasks} />
                  </Box>
                </Box>
              </Box>
            }
          />
          <Route path="*" element={<AuthForm />} /> {/* fallback route */}
        </Routes>
      </ThemeProvider>
    </BrowserRouter>
  );
};

export default App;
