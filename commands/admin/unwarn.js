const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('megadb');

// Crear o cargar la base de datos de advertencias
const warnDB = new db.crearDB('warnings'); // Utilizando el nombre del archivo sin extensión

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Elimina una advertencia de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del cual deseas eliminar la advertencia.')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('El número de la advertencia que deseas eliminar.')
        .setRequired(true)
    ),

  async executeSlash(interaction) {
    // Verificar si el usuario tiene permisos de moderar miembros
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const member = interaction.options.getMember('user');
    const index = interaction.options.getInteger('index') - 1; // Restamos 1 para ajustar al índice de array

    if (!member) {
      return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    }

    // Obtener las advertencias del miembro
    let warnings;
    try {
      const allWarnings = await warnDB.get('warnings');
      warnings = allWarnings[member.id] || [];
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      return interaction.reply({ content: 'Hubo un error al acceder a las advertencias.', ephemeral: true });
    }

    if (warnings.length === 0) {
      return interaction.reply({ content: `Este usuario no tiene advertencias.`, ephemeral: true });
    }

    if (index < 0 || index >= warnings.length) {
      return interaction.reply({ content: `El número de advertencia es inválido.`, ephemeral: true });
    }

    // Eliminar la advertencia del índice especificado
    warnings.splice(index, 1);

    // Actualizar la base de datos
    try {
      await warnDB.set(`warnings.${member.id}`, warnings);
    } catch (error) {
      console.error('Error al eliminar advertencia:', error);
      return interaction.reply({ content: 'Hubo un error al actualizar las advertencias.', ephemeral: true });
    }

    return interaction.reply({ content: `Advertencia #${index + 1} eliminada correctamente de ${member.user.tag}.`, ephemeral: true });
  },

  async executePrefix(message, args) {
    // Verificar si el usuario tiene permisos de moderar miembros
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('No tienes permisos para usar este comando.');
    }

    const member = message.mentions.members.first();
    const index = parseInt(args[1]) - 1; // Restamos 1 para ajustar al índice de array

    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    if (isNaN(index)) {
      return message.reply('Por favor proporciona un número válido para la advertencia que deseas eliminar.');
    }

    // Obtener las advertencias del miembro
    let warnings;
    try {
      const allWarnings = await warnDB.get('warnings');
      warnings = allWarnings[member.id] || [];
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      return message.reply('Hubo un error al acceder a las advertencias.');
    }

    if (warnings.length === 0) {
      return message.reply(`Este usuario no tiene advertencias.`);
    }

    if (index < 0 || index >= warnings.length) {
      return message.reply(`El número de advertencia es inválido.`);
    }

    // Eliminar la advertencia del índice especificado
    warnings.splice(index, 1);

    // Actualizar la base de datos
    try {
      await warnDB.set(`warnings.${member.id}`, warnings);
    } catch (error) {
      console.error('Error al eliminar advertencia:', error);
      return message.reply('Hubo un error al actualizar las advertencias.');
    }

    return message.reply(`Advertencia #${index + 1} eliminada correctamente de ${member.user.tag}.`);
  },
};
