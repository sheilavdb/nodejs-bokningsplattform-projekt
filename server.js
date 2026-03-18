import 'dotenv/config';
import express from 'express';
import http from "http";
import { Server } from "socket.io";
import logger from "./src/utils/logger.js"
import morgan from 'morgan';
import connectDB from "./src/config/db.js";
import authRoutes from "./src/routes/authRoutes.js"
import roomRoutes from './src/routes/roomRoutes.js'
import bookingRoutes from './src/routes/bookingRoutes.js'

const app = express();
const server = http.createServer(app)
const io = new Server(server);

app.set("io". io);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Anslut till databas MONGODB
connectDB();

// Socket connection
io.on('connection', (socket) => {
  logger.info(`En användare anslöt:, ${socket.id}`);
  
  socket.on('disconnect', () => {
    logger.info(`Användare kopplade bort: ${socket.id}`);
  });
}); 

// Routes
app.use('/auth', authRoutes);
app.use('/rooms', roomRoutes);
app.use('/bookings', bookingRoutes)

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Bokningsplattform API' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server körs på port ${PORT}`);
});