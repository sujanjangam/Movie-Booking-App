import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_API_URL || "https://movie-booking-api-r4nm.onrender.com");

export default socket;
