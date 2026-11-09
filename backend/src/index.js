import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { ILike } from 'typeorm';
import { AppDataSource } from './data-source.js';
import { Usuario } from './entities/Usuario.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors());
app.use(express.json());

// Repositorio de TypeORM para Usuario
const usuarioRepo = AppDataSource.getRepository(Usuario);

// Rutas
app.get('/', (req, res) => {
  res.json({ message: 'Backend de VivaVisas funcionando correctamente con TypeORM' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: AppDataSource.isInitialized ? 'conectada' : 'desconectada',
    timestamp: new Date().toISOString()
  });
});

// Obtener todos los usuarios (sin SQL)
app.get('/api/usuarios', async (req, res) => {
  try {
    const usuarios = await usuarioRepo.find({
      order: { id: 'DESC' }
    });
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Crear un nuevo usuario (sin SQL)
app.post('/api/usuarios', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: 'nombre y email son requeridos' });
    }

    const nuevoUsuario = usuarioRepo.create({ nombre, email });
    const guardado = await usuarioRepo.save(nuevoUsuario);
    res.status(201).json(guardado);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: error.message || 'Error al crear usuario' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
  
    if(!email || !password) {
      return res.status(400).json({ error: 'El correo y la contraseña son obligatorios.'});
    }

    const cleanEmail = email.trim();
    const usuario = await usuarioRepo.findOne({
      where: { email: ILike(cleanEmail) }
    });

    if (!usuario) {
      console.log(`[LOGIN] Usuario no encontrado para el correo: "${cleanEmail}"`);
      return res.status(401).json({ error: 'Credenciales inválidas. Usuario no registrado.'});
    }

    const expectedPassword = process.env.ADMIN_PASSWORD || 'Admin123*';
    if(password.trim() !== expectedPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas. Contraseña incorrecta.'});
    }

    return res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token: 'jwt-simulado-token-xyz',
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email
      }
    });
  } catch (error) {
    console.error('Error en /api/auth/login:', error);
    return res.status(500).json({ error: 'Error interno del servidor. Intenta de nuevo más tarde.'});
  }
});

// Inicializar la conexión a Neon con TypeORM y luego levantar el servidor Express
AppDataSource.initialize()
  .then(async () => {
    console.log(' Conexión a Neon PostgreSQL exitosa con TypeORM');

    // Registrar usuario inicial desde variables de entorno (.env) si está configurado
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const exists = await usuarioRepo.findOne({ where: { email: ILike(adminEmail) } });
      if (!exists) {
        const adminUser = usuarioRepo.create({
          nombre: process.env.ADMIN_NAME || 'Admin',
          email: adminEmail
        });
        await usuarioRepo.save(adminUser);
        console.log('✅ Usuario inicial registrado desde .env');
      }
    }

    app.listen(PORT, () => {
      console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos Neon:', error);
  });
