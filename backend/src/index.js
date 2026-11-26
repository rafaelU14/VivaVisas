import dotenv from 'dotenv';
import { ILike } from 'typeorm';
import app from './infrastructure/http/app.js';
import { AppDataSource } from './infrastructure/database/data-source.js';
import { Usuario } from './infrastructure/database/entities/Usuario.js';
import { hashPassword } from './infrastructure/http/utils/passwordService.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

AppDataSource.initialize()
  .then(async () => {
    console.log('Conexión a Neon PostgreSQL exitosa con TypeORM');

    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail) {
      const usuarioRepo = AppDataSource.getRepository(Usuario);
      const exists = await usuarioRepo.findOne({ where: { email: ILike(adminEmail) } });
      const hashedPassword = await hashPassword(process.env.ADMIN_PASSWORD || 'Admin123*');
      if (!exists) {
        const adminUser = usuarioRepo.create({
          nombre: process.env.ADMIN_NAME || 'Admin',
          email: adminEmail,
          password: hashedPassword,
          role: 'ADMIN',
          status: true,
        });
        await usuarioRepo.save(adminUser);
        console.log('Usuario inicial registrado desde .env');
      } else if (!exists.password) {
        exists.password = hashedPassword;
        exists.role = 'ADMIN';
        exists.status = true;
        await usuarioRepo.save(exists);
        console.log('Usuario administrador existente actualizado con password cifrado');
      }
    }

    app.listen(PORT, () => {
      console.log(`Servidor backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar con la base de datos:', error);
  });
