import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
try {
    const authHeader = req.headers.authorization
    if(!authHeader) {
        logger.warn('Token saknas i request'); //för att kontrollera om någon försöker komma in som obehörig
        return res.status(401).json({ message: "Token saknas" });
    }

const token = authHeader.split(" ")[1];

const decoded = jwt.verify(token, process.env.JWT_SECRET);

req.user = decoded;
next();

} catch (error) {
    return res.status(401).json({ message: "Ogiltig token" });
}}

export const verifyAdmin = (req, res, next) => {
        const userRole = req.user.role
        if(userRole === "Admin") {
            next();
        } else {
            logger.warn(`Åtkomst nekad för: ${req.user.userId}`);
            return res.status(403).json({ message: "Åtkomst nekad"});
    }
};