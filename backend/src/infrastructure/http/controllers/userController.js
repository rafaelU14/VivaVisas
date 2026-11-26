import { AppDataSource } from '../../database/data-source.js';
import { Usuario } from '../../database/entities/Usuario.js';

export async function getUsers(req, res) {
  try {
    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const usuarios = await usuarioRepo.find({
      order: { id: 'DESC' },
    });
    return res.status(200).json(usuarios);
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

export async function createUser(req, res) {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: 'El nombre y correo electrónico son obligatorios.' });
    }

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const nuevoUsuario = usuarioRepo.create({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
    });
    const guardado = await usuarioRepo.save(nuevoUsuario);
    return res.status(201).json(guardado);
  } catch (error) {
    console.error('Error in createUser:', error);
    return res.status(500).json({ error: error.message || 'Error al crear usuario' });
  }
}
