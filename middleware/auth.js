const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    
    // Also check for Authorization Bearer token
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      throw new Error("No token provided");
    }

    const { userId, isAdmin } = jwt.verify(token, process.env.TOKEN_KEY);

    req.body = {
      ...req.body,
      userId,
      isAdmin,
    };

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
};

const optionallyVerifyToken = (req, res, next) => {
  try {
    let token = req.headers["x-access-token"];
    
    // Also check for Authorization Bearer token
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) return next();

    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    req.body.userId = decoded.userId;

    next();
  } catch (err) {
    return next();
  }
};

module.exports = { verifyToken, optionallyVerifyToken };
