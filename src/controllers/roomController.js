import Room from "../models/Room.js"
import logger from "../utils/logger.js";
import client from "../config/redis.js";

export const createRoom = async (req, res) => {
    try{
        const { name, capacity, type } = req.body;

        if(!name || !capacity || !type) {
            return res.status(400).json({ message:"Fyll i alla fält"});
        }

        const room = await Room.create({ name, capacity, type });
        await client.del('rooms');
        logger.info(`Rum skapat: ${room.name}, ${room._id}`);
        res.status(201).json({ message: "Rum skapat", room })

    } catch (error) {
        logger.error(`Fel vid skapande av rum: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message});
    }
}

export const getAllRooms = async (req, res) => {
    try {
        const cachedRoomsData = await client.get('rooms');
        if(cachedRoomsData) {
            logger.info(`Rum hämtade från cache`);
            return res.status(200).json(JSON.parse(cachedRoomsData));
}

        const allRooms = await Room.find()
        
        const responseData = { rooms: allRooms };
        await client.setEx('rooms', 60, JSON.stringify(responseData));
        logger.info(`Alla rum hämtade från databas: ${allRooms.length} rooms`)
        res.status(200).json(responseData);

    } catch (error) {
        logger.error(`Fel vid hämtning av alla rum: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message})
    }
}

export const updateRoom = async (req, res) => {
    try{
        const { id } = req.params;
        const { name, capacity, type } = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(
            id, 
            { name, capacity, type }, 
            { new: true }
        );

        if(!updatedRoom) {
            logger.warn(`Rum hittades inte: ${id}`);
            return res.status(404).json({ message: "Rum hittades inte "});
        }
        await client.del('rooms');
        logger.info(`Rum uppdaterat: ${updatedRoom.name}, ${updatedRoom._id}`)
        res.status(200).json({ message: "Rum uppdaterat", room: updatedRoom });
    } catch (error) {
        logger.error(`Fel vid uppdatering av rum: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
        logger.warn(`Rum hittades inte: ${id}`);
        return res.status(404).json({ message: "Rum hittades inte" });
    }
    await client.del('rooms');
    logger.info(`Rum raderat: ${deletedRoom.name}, ${deletedRoom._id}`)
    res.status(200).json({ message: "Rum raderat", room: deletedRoom });

  } catch (error) {
    logger.error(`Fel vid radering av rum: ${error.message}`);
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
};