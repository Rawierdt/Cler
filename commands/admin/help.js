const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra la lista de comandos disponibles.'),

  name: 'help', // Nombre para comandos con prefijo
  description: 'Muestra la lista de comandos disponibles.',

  async executeSlash(interaction) {
    await this.sendHelpMessage(interaction.user);
  },

  async executePrefix(message, args) {
    await this.sendHelpMessage(message.author);
  },

  async sendHelpMessage(user) {
    // Crear un embed con la lista de comandos
    const helpEmbed = new EmbedBuilder()
      .setColor(0x0099ff) // Azul
      .setTitle('Comandos disponibles')
      .setDescription('Aquí tienes la lista de comandos que puedes usar:')
      .addFields(
        { name: '/kick', value: 'Expulsa a un miembro del servidor.', inline: true },
        { name: '/ban', value: 'Banea a un miembro del servidor.', inline: true },
        { name: '/softban', value: 'Banea a un miembro por 7 días y borra sus mensajes.', inline: true },
        { name: '/warn', value: 'Advierte a un miembro.', inline: true },
        { name: '/unwarn', value: 'Elimina una advertencia de un miembro.', inline: true },
        { name: '/set_mute', value: 'Configura el rol de mute para el servidor.', inline: true },
        { name: '/mute', value: 'Silencia a un miembro.', inline: true },
        { name: '/unmute', value: 'Elimina el silencio de un miembro.', inline: true },
        { name: '/clear', value: 'Elimina un número específico de mensajes.', inline: true },
        { name: '/help', value: 'Muestra la lista de comandos disponibles.', inline: true }
      )
      .setFooter({ text: 'Utiliza los comandos con cuidado.' })
      .setTimestamp();

    // Enviar el embed como mensaje directo al usuario
    await user.send({ embeds: [helpEmbed] }).catch(err => {
      console.error(`[ERROR] No se pudo enviar el mensaje de ayuda a ${user.tag}: ${err}`);
    });
  },
};
