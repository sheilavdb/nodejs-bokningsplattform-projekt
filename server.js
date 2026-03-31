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

console.log(" FILE STARTED");

const app = express();
const server = http.createServer(app)
const io = new Server(server);

app.set("io", io);

// Middleware
app.use(express.json());
app.use(morgan('dev'));

// Serva HTML filer
app.use(express.static('public'));

// Anslut till databas MONGODB
try{
  await connectDB();
  console.log("MongoDB connected");
} catch (error) {
  console.log("MongoDB failed", error)
}

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

// Api route
app.get('/api', (req, res) => {
  res.json({ message: 'Bokningsplattform API' });
});

const PORT = process.env.PORT || 5000;

console.log(" Ready to listen");
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server körs på http://localhost:${PORT}`);
});