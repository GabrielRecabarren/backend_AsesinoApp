import jwt from 'jsonwebtoken';
import "dotenv/config"

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization').split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    console.log(token);
    
    console.log(process.env.SECRET_KEY)
    const decoded = jwt.verify(token, process.env.SECRET_KEY); 
    req.usuario = decoded.usuario; 
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido', error: error.message });
  }
};
