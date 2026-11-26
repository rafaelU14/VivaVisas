import * as clientRepository from '../../database/repositories/clientRepository.js';

export async function createClient(req, res) {
  try {
    const { nombres, apellidos, identificacion, telefono, email } = req.body;

    if (!nombres || !apellidos || !telefono || !email) {
      return res.status(400).json({
        error: 'Los campos nombres, apellidos, teléfono y correo electrónico son obligatorios.',
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'El formato de correo electrónico es inválido.' });
    }

    const duplicate = await clientRepository.findDuplicateClient(email.trim(), identificacion?.trim());
    if (duplicate) {
      return res.status(409).json({
        error: 'Ya existe un cliente registrado con ese correo electrónico o número de identificación.',
      });
    }

    const newClient = await clientRepository.createClient({
      nombres,
      apellidos,
      identificacion,
      telefono,
      email,
    });

    return res.status(201).json(newClient);
  } catch (error) {
    console.error('Error in createClient:', error);
    return res.status(500).json({ error: 'Error interno del servidor al registrar cliente.' });
  }
}

export async function getClients(req, res) {
  try {
    const { page, limit, search } = req.query;
    const result = await clientRepository.getClients({ page, limit, search });
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error in getClients:', error);
    return res.status(500).json({ error: 'Error interno del servidor al consultar clientes.' });
  }
}

export async function getClientById(req, res) {
  try {
    const { id } = req.params;
    const client = await clientRepository.getClientById(id);

    if (!client) {
      return res.status(404).json({ error: 'Cliente no encontrado o inactivo.' });
    }

    return res.status(200).json(client);
  } catch (error) {
    console.error('Error in getClientById:', error);
    return res.status(500).json({ error: 'Error interno del servidor al consultar cliente.' });
  }
}

export async function updateClient(req, res) {
  try {
    const { id } = req.params;
    const { nombres, apellidos, identificacion, telefono, email } = req.body;

    if (!nombres || !apellidos || !telefono || !email) {
      return res.status(400).json({
        error: 'Los campos nombres, apellidos, teléfono y correo electrónico son obligatorios.',
      });
    }

    const existingClient = await clientRepository.getClientById(id);
    if (!existingClient) {
      return res.status(404).json({ error: 'Cliente no encontrado o inactivo.' });
    }

    const duplicate = await clientRepository.findDuplicateClient(email.trim(), identificacion?.trim(), id);
    if (duplicate) {
      return res.status(409).json({
        error: 'Ya existe otro cliente registrado con ese correo electrónico o número de identificación.',
      });
    }

    const updated = await clientRepository.updateClient(id, {
      nombres,
      apellidos,
      identificacion,
      telefono,
      email,
    });

    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error in updateClient:', error);
    return res.status(500).json({ error: 'Error interno del servidor al actualizar cliente.' });
  }
}

export async function deleteClient(req, res) {
  try {
    const { id } = req.params;
    const deleted = await clientRepository.softDeleteClient(id);

    if (!deleted) {
      return res.status(404).json({ error: 'Cliente no encontrado o ya inactivo.' });
    }

    return res.status(200).json({ message: 'Cliente dado de baja lógica exitosamente.', id });
  } catch (error) {
    console.error('Error in deleteClient:', error);
    return res.status(500).json({ error: 'Error interno del servidor al dar de baja al cliente.' });
  }
}