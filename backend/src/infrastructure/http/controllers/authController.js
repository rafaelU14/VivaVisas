import { ILike } from 'typeorm';
import { AppDataSource } from '../../database/data-source.js';
import { Usuario } from '../../database/entities/Usuario.js';
import { signToken } from '../middlewares/authMiddleware.js';
import { comparePassword } from '../utils/passwordService.js';

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

    if (usuario.status === false) {
      return res.status(403).json({ error: 'Cuenta inactiva. Contacte al administrador.' });
    }

    const isMatch = await comparePassword(password.trim(), usuario.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.' });
    }

    usuario.lastLogin = new Date();
    await usuarioRepo.save(usuario);

    const token = signToken({
      id: usuario.id,
      nombre: usuario.nombre,
      email: usuario.email,
      role: usuario.role,
    });

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error('Error in login:', error);
    return res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.' });
  }
}
