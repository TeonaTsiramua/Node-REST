import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
    });
  }
};
