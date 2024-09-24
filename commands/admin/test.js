const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('test')
    .setDescription('Un comando de prueba'),

    name: 'test', // Nombre para comandos con prefijo
    description: 'Comando de prueba.',

  async executeSlash(interaction) {
    await interaction.reply({ content: '<:onlinestatus:1287542461710864396> Funcionando Correctamente.', ephemeral: true });
  },
};
