import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
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

// Inicializar la conexión a Neon con TypeORM y luego levantar el servidor Express
AppDataSource.initialize()
  .then(() => {
    console.log(' Conexión a Neon PostgreSQL exitosa con TypeORM');
    app.listen(PORT, () => {
      console.log(` Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('❌ Error al conectar con la base de datos Neon:', error);
  });
