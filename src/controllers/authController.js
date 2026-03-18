import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import logger from "../utils/logger.js";
import User from "../models/User.js";

export const register = async (req, res) => {
    try{
        const { username, password, role} = req.body;
        logger.info(`${username} har startat registrering`)

        const existingUser = await User.findOne({ username });
        if(existingUser) {
            logger.warn(`Användarnamn ${username} finns redan`)
            return res.status(400).json({ message: 'Användarnamn finns redan' });
        }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await User.create({ 
                username, 
                password: hashedPassword, 
                role: role || "User" 
            });

            logger.info(`Användare skapat: ${username} ${user._id}`)
            res.status(201).json({
                message: "Användare skapad",
                userId: user._id
            })

    } catch (error) {
        logger.error(`Fel vid registrering: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username });
        if (!user) {
            logger.warn(`Inlog misslyckat för ${username}, användaren finns inte`)
            return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            logger.warn(`Inloggning misslyckat för ${username}, fel lösenord`)
            return res.status(401).json({ message: 'Fel användarnamn eller lösenord' });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        logger.info(`Inloggning lyckat: ${username}, ${user._id}`);
        res.status(200).json({ 
            message: 'Inloggad',
            token: token,
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        logger.error(`Inloggning misslyckat: ${error.message}`);
        res.status(500).json({ message: "Serverfel", error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try{
        const users = await User.find().select('-password');
        logger.info(`Alla användare hämtade`);
        res.status(200).json({ users });
    } catch (error) {
        logger.error(`Fel vid hämtning av användare, ${error.message}`)
        res.status(500).json({ message: "Serverfel", error: error.message})
    }
}

export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        logger.info(`Raderar användare: ${id}`);
        const deletedUser = await User.findByIdAndDelete(id)
    if (!deletedUser) {
        logger.warn(`Användare hittades inte: ${id}`)
        return res.status(404).json({ message: "Användare hittades inte" });
    }
    logger.info(`Användare raderad: ${id}`)
    res.status(200).json({ message: "Användare raderat", room: deletedUser });

  } catch (error) {
    logger.error(`Fel vid radering av användare, ${error.message}`)
    res.status(500).json({ message: "Serverfel", error: error.message });
  }
}