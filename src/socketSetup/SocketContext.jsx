import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { getAccessToken } from "../utils/storageFunction";

export const socket = io(import.meta.env.VITE_APP_API_URL, {
  auth: { token: getAccessToken() },
  transports: ["websocket", "polling"],
  secure: true,
  autoConnect: false,
});

const SocketContext = createContext(socket);

export const SocketProvider = ({ children }) => (
  <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
);

export const useSocket = () => useContext(SocketContext);
