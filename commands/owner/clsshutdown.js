require('dotenv').config();
const { pool } = require('../../db'); // Importamos el pool desde db.js

module.exports = {
  name: 'clsshutdown',
  description: 'Apaga el bot de forma segura y cierra la conexión con la base de datos.',
  async executePrefix(client, message) {
    const dev = process.env.OWNER;

    if (!dev) {
      console.error('ID del owner no está configurado en .env');
      return message.channel.send('Error de configuración: Falta el ID del owner.');
    }

    if (message.author.id !== dev) {
      return message.channel.send('Solo el owner del bot puede usar este comando.');
    }

    try {
      // Envía un mensaje de confirmación ANTES de destruir la instancia del cliente
      await message.channel.send('Apagando el bot de forma segura...');

      // Cierra el pool de conexiones de la base de datos
      await pool.end();
      console.log('Conexión con la base de datos cerrada.');

      // Destruye la instancia del cliente de Discord
      await client.destroy();
      console.log('El bot se ha apagado de forma segura.');

      // Como el cliente está destruido, ya no enviamos más mensajes aquí

    } catch (error) {
      console.error('Error al apagar el bot:', error);

      // Manejo de errores si ocurre algo inesperado
      return message.channel.send(`Hubo un error al intentar apagar el bot:\n\`\`\`${error.message}\`\`\``);
    }
  },
};
