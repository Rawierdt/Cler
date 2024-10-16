require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clsleave',
  description: 'Hace que el bot salga de un servidor específico usando su ID.',
  aliases: ['clsleave'],
  async executePrefix(client, message, args) {
    const dev = process.env.OWNER; // Obtén la ID del owner desde el archivo .env

    // Verifica si el usuario es el owner
    if (message.author.id !== dev) {
      return message.channel.send('Solo el owner del bot puede usar este comando.');
    }

    // Verifica si se ha proporcionado una ID de servidor
    if (!args[0]) {
      return message.channel.send('Por favor, proporciona una ID de servidor.');
    }

    const serverId = args[0];
    const guild = client.guilds.cache.get(serverId);

    if (!guild) {
      return message.channel.send('El bot no se encuentra en el servidor con esa ID.');
    }

    try {
      await guild.leave();
      return message.channel.send(`El bot ha salido del servidor: ${guild.name} (ID: ${serverId}).`);
    } catch (error) {
      console.error(`No se pudo salir del servidor ${serverId}:`, error);
      return message.channel.send('Hubo un error al intentar salir del servidor.');
    }
  },
};
