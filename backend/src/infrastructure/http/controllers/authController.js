import { ILike } from 'typeorm';
import { AppDataSource } from '../../database/data-source.js';
import { Usuario } from '../../database/entities/Usuario.js';
import { signToken } from '../middlewares/authMiddleware.js';

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.' });
    }

    const cleanEmail = email.trim();
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const usuario = await usuarioRepo.findOne({
      where: { email: ILike(cleanEmail) },
    });

    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas. Usuario no registrado.' });
    }

    const expectedPassword = process.env.ADMIN_PASSWORD || 'Admin123*';
    if (password.trim() !== expectedPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    const token = signToken({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.' });
  }
}
