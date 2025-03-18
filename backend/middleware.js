const { JWT_SECRET } = require("./config");
const jwt = require("jsonwebtoken");

if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is missing! Set it in config.js or .env file.");
}

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(403).json({ message: "Authorization token missing or invalid" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        if (!decoded.userId) {
            return res.status(403).json({ message: "Invalid token payload" });
        }

        req.userId = decoded.userId;

        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
};

module.exports = {
    authMiddleware,
};
