/* eslint-disable @typescript-eslint/no-explicit-any */
import app from './app';
import config from './app/config';
import readline from 'readline';
import mongoose from 'mongoose';
import { Server } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import axios from 'axios';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.databaseUrl as string);

    server = app.listen(config.port, () => {
      console.log(`app listening on port ${config.port}`);
    });

    // Initialize Socket.IO server on the same HTTP server
    const io = new SocketIOServer(server, {
      cors: {
        origin: '*', // Adjust for your frontend origin in production
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log(`Socket connected: ${socket.id}`);

      // You can access query parameters and auth here
      // const userEmail = socket.handshake.query.userEmail;
      // const token = socket.handshake.auth.token;

      socket.on('chatMessage', async (payload) => {
        try {
          const { messages, model } = payload;
          console.log(messages);
          const response = await axios.post(
            'http://localhost:11434/api/chat',
            {
              model: model || 'mistral',
              messages,
            },
            { responseType: 'stream' },
          );
          console.log(response?.data);

          const rl = readline.createInterface({
            input: response.data,
            crlfDelay: Infinity,
          });

          rl.on('line', (line: string) => {
            if (line.trim()) {
              try {
                const parsed = JSON.parse(line);
                console.log(parsed.message?.content);
                socket.emit('chatResponseChunk', parsed.message?.content || '');
              } catch (e) {
                console.error('Failed to parse line:', line);
              }
            }
          });

          rl.on('close', () => {
            socket.emit('chatResponseDone');
          });
        } catch (error: any) {
          console.error('Chat error:', error.message);
          socket.emit('chatError', { message: error.message });
        }
      });

      socket.on('disconnect', (reason) => {
        console.log(`Socket disconnected: ${socket.id}, reason: ${reason}`);
      });
    });
  } catch (err) {
    console.error(err);
  }
}

main();


process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});
