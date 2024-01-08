import jwt from 'jsonwebtoken';

export const verificarToken = (req, res, next) => {
  const token = req.header('Authorization'); 
  if (!token) {
    return res.status(401).json({ mensaje: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); 
    req.usuario = decoded.usuario; 
    next();
  } catch (error) {
    res.status(401).json({ mensaje: 'Token no válido' });
  }
};
