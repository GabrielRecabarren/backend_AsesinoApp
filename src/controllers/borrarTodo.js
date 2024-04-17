import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function vaciarTodasLasTablas() {
  try {
    // Eliminar todos los mensajes
    await prisma.message.deleteMany();
    console.log('Todos los mensajes han sido eliminados correctamente.');

    // Eliminar todos los roles de usuarios en partidas
    await prisma.userRoleInGame.deleteMany();
    console.log('Todos los roles de usuarios en partidas han sido eliminados correctamente.');

    // Eliminar todos los juegos
    await prisma.game.deleteMany();
    console.log('Todos los juegos han sido eliminados correctamente.');

    // Eliminar todos los usuarios
    await prisma.user.deleteMany();
    console.log('Todos los usuarios han sido eliminados correctamente.');
  } catch (error) {
    console.error('Error al eliminar datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}
