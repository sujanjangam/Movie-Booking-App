import { io } from "socket.io-client";

const socket = io("https://movie-booking-api-r4nm.onrender.com");

export default socket;
