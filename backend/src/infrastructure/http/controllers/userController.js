import { ILike } from 'typeorm';
import { AppDataSource } from '../../database/data-source.js';
import { Usuario } from '../../database/entities/Usuario.js';
import { hashPassword } from '../utils/passwordService.js';

export async function getUsers(req, res) {
  try {
    const { page = 1, limit = 10, search = '' } = req.query;
    const numericPage = Math.max(1, parseInt(page, 10) || 1);
    const numericLimit = Math.max(1, parseInt(limit, 10) || 10);
    const skip = (numericPage - 1) * numericLimit;

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const where = search && search.trim() !== ''
      ? [
          { nombre: ILike(`%${search.trim()}%`) },
          { email: ILike(`%${search.trim()}%`) },
        ]
      : {};

    const [usuarios, total] = await usuarioRepo.findAndCount({
      where,
      select: ['id', 'nombre', 'email', 'role', 'status', 'lastLogin', 'createdAt', 'updatedAt'],
      order: { id: 'DESC' },
      skip,
      take: numericLimit,
    });

    return res.status(200).json({
      total,
      page: numericPage,
      limit: numericLimit,
      totalPages: Math.ceil(total / numericLimit),
      usuarios,
    });
  } catch (error) {
    console.error('Error in getUsers:', error);
    return res.status(500).json({ error: 'Error al obtener usuarios' });
  }
}

export async function createUser(req, res) {
  try {
    const { nombre, email, password, role = 'ADVISOR', status = true } = req.body;

    const usuarioRepo = AppDataSource.getRepository(Usuario);
    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await usuarioRepo.findOne({ where: { email: cleanEmail } });
    if (existingUser) {
      return res.status(409).json({ error: 'Ya existe un usuario registrado con ese correo electrónico.' });
    }

    const hashedPassword = await hashPassword(password);
    const nuevoUsuario = usuarioRepo.create({
      nombre: nombre.trim(),
      email: cleanEmail,
      password: hashedPassword,
      role,
      status: Boolean(status),
    });

    const guardado = await usuarioRepo.save(nuevoUsuario);

    const { password: _, ...userWithoutPassword } = guardado;
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Error in createUser:', error);
    return res.status(500).json({ error: error.message || 'Error al crear usuario' });
  }
}
