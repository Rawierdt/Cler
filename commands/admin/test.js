const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('🧪 : Un comando de prueba'),

    name: 'test', // Nombre para comandos con prefijo
    description: 'Comando de prueba.',

  /**
   * Responde al comando slash /test con un mensaje de prueba.
   * @param {import('discord.js').Interaction} interaction La interacci n que activ  el comando.
   * @returns {Promise<void>}
   */
  async executeSlash(interaction) {
    await interaction.reply({ content: '<:onlinestatus:1287542461710864396> Funcionando Correctamente. | **52 Comandos Disponibles**', ephemeral: true });
  },
};

module.exports.help = {
  name: 'test',
  description: 'Comando de prueba.',
};