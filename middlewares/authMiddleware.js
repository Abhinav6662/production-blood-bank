const JWT = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send({
        success: false,
        message: 'Authorization header missing or invalid',
      });
    }

    const token = authHeader.split(" ")[1];

    JWT.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).send({
          success: false,
          message: 'Authentication failed',
        });
      } else {
        req.userId = decoded.userId;
        next();
      }
    });

  } catch (error) {
    console.log("Auth Middleware Error:", error);
    return res.status(401).send({
      success: false,
      message: 'Authentication error',
      error,
    });
  }
};
