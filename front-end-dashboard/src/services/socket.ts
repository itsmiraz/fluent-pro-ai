import io, { Socket } from "socket.io-client";

let socket: Socket | undefined;


const baseUrl ="ws://localhost:5000"
export const initiateSocket = ({userEmail,token}:{userEmail: string, token: string})  => {
  // Check if the socket is already connected or in the process of connecting
  if (!socket || !socket.connected) {
    console.log('Initiating socket connection...');
    // console.log(`User Email: ${userEmail}`);
    
 
    // console.log(`Base URL: ${baseUrl}`);

    socket = io(`${baseUrl}`, {
      query: { userEmail },
      auth: { token }, // Uncomment if token is needed
      transports: ['websocket'], 
    });

    socket.on('connect', () => {
      console.log('Connected to the WebSocket server');
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from the WebSocket server');
    });

    socket.on('connect_error', (err) => {
      console.error('Connection Error:', err);
    });

    socket.on('error', (err) => {
      console.error('Socket Error:', err);
    });
  } else {
    console.log('Socket already initiated');
  }
};

export const getSocket = () => socket;
