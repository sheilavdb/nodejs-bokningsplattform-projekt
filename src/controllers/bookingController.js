import Booking from "../models/Booking.js";
import Room from "../models/Room.js"
import logger from "../utils/logger.js"

export const createBooking = async (req, res)  => {
    try{
        const { roomId, startTime, endTime } = req.body;
        const userId = req.user.userId;
        logger.info(`Användare ${userId} försöker boka rum ${roomId}`);
        if(!roomId || !startTime || !endTime){
            return res.status(400).json({ message: "Fyll i alla fält" })
        }

        if(new Date(endTime) <= new Date(startTime)) {
            return res.status(400).json({ message: "Sluttid måste vara senare än starttid" });
        }

        const room = await Room.findById(roomId);
        if(!room) {
            return res.status(404).json({ message:"Rummet hittades inte" });
        }

        const existingBookings = await Booking.find({ roomId: roomId });
        const newStart = new Date(startTime);
        const newEnd = new Date(endTime);
        
        for (let booking of existingBookings) {
            const existingStart = new Date(booking.startTime);
            const existingEnd = new Date(booking.endTime);
                    
            if (newStart < existingEnd && newEnd > existingStart) {
                logger.warn(`Bokningskonflikt för rum ${roomId}`);
                return res.status(400).json({ message: "Rummet är redan bokat under denna tid" });
            }
        }

        const newBooking = await Booking.create({ roomId, userId, startTime, endTime });
        await newBooking.populate('roomId', 'name');
        await newBooking.populate('userId', 'username');

        logger.info(`Bokning skapad: ${newBooking._id}`);
        
        const io = req.app.get('io');
        io.emit('newBooking', {
            message: `${newBooking.userId.username} bokade ${newBooking.roomId.name}`,
            booking: {
                id: newBooking._id,
                roomName: newBooking.roomId.name,
                userName: newBooking.userId.username,
                startTime: newBooking.startTime,
                endTime: newBooking.endTime
            }
        })
        
        res.status(201).json({ message: "Bokning skapad", booking: newBooking })

    } catch (error) {
        logger.error(`Fel vid skapande av bokning: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
    }
};

export const getAllBookings = async (req, res) => { //funktion for admin, verifyToken och verifyAdmin
    try{
        const bookings = await Booking.find().populate('roomId', 'name capacity type').populate('userId', 'username'); 
        //populate= show info
        logger.info(`Alla bokningar hämtade`);
        res.status(200).json({ bookings });
    } catch (error) { 
        logger.error(`Fel vid hämtning av bokningar: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
    }
}

export const getMyBookings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const bookings = await Booking.find({ userId }).populate('roomId', 'name capacity type');
        logger.info(`Användare ${userId} hämtade sina bokningar`);
        res.status(200).json({ bookings });
    } catch (error) {
        logger.error(`Fel vid hämtning av bokningar: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });

    }
}

export const updateBooking = async (req, res) => {
    try{
        const bookingId = req.params.id;
        const { startTime, endTime } = req.body;
        const userRole = req.user.role;
        const userId = req.user.userId;

        const booking = await Booking.findById(bookingId);

        if (!booking) {
            logger.warn(`Bokning hittades inte: ${bookingId}`);
            return res.status(404).json({ message: "Bokning hittas inte"})
        }
        if (userRole === "Admin" || booking.userId.toString() === userId) {
            if (new Date(endTime) <= new Date(startTime)) {
                return res.status(400).json({ message:"sluttid måste vara senare än starttid" })
            }

            const existingBookings = await Booking.find({
                roomId: booking.roomId,
                _id: { $ne: bookingId}
            });

            const newStart = new Date(startTime);
            const newEnd = new Date(endTime);

            for (let booking of existingBookings) {
                const existingStart = new Date(booking.startTime);
                const existingEnd = new Date(booking.endTime);
                    
            if (newStart < existingEnd && newEnd > existingStart) {
                logger.warn(`Bokningskonflikt vid uppdatering`);
                return res.status(400).json({ message: "Rummet är redan bokat under denna tid" });
            }
        }

        const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        {startTime, endTime},
        {new:true}
    ).populate('roomId', 'name').populate('userId', 'username');
    
    logger.info(`Bokning uppdaterad: ${bookingId} user: ${userId}`);
    
    const io = req.app.get('io');
            io.emit('bookingUpdated', {
                message: `${updatedBooking.userId.username} uppdaterade bokning för ${updatedBooking.roomId.name}`,
                booking: {
                    id: updatedBooking._id,
                    roomName: updatedBooking.roomId.name,
                    username: updatedBooking.userId.username,
                    startTime: updatedBooking.startTime,
                    endTime: updatedBooking.endTime
                }
            });
    
    return res.status(200).json({ message: "Bokning Uppdaterad", booking: updatedBooking })

        } else {
            return res.status(403).json({ message:"Åtkomst nekad"});
        }

    } catch (error) {
        logger.error(`Fel vid uppdatering av bokning: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
    }
}

export const deleteBooking = async (req, res) => {
    try{
        const bookingId = req.params.id;
        const userRole = req.user.role;
        const userId = req.user.userId;

        const booking = await Booking.findById(bookingId)
            .populate('roomId', 'name')
            .populate('userId', 'username');
        
        if(!booking) {
            logger.warn(`Bokning hittades inte: ${bookingId}`);
            return res.status(404).json({ message: "Bokning hittades inte" })
        }
        
        if(userRole === "Admin" || booking.userId._id.toString() === userId ) {
            const deletedBooking= await Booking.findByIdAndDelete(bookingId);
            logger.info(`Bokning ${bookingId} raderad av ${userId}`);
            
            const io = req.app.get('io');
            io.emit('bookingDeleted', {
                message: `${booking.userId.username} raderade bokning för ${booking.roomId.name}`,
                bookingId: bookingId
            });
            
            return res.status(200).json({ message: "Bokning raderat", booking: deletedBooking});
        } else {
            return res.status(403).json({ message: 'Åtkomst nekad'});
        }
    } catch (error) {
            logger.error(`Fel vid radering av bokning: ${error.message}`);
            res.status(500).json({ message: "Serverfel", error: error.message });
    }
}