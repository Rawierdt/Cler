const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unwarn')
    .setDescription('Elimina una advertencia de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del cual deseas eliminar la advertencia.')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('index')
        .setDescription('El número de la advertencia que deseas eliminar.')
        .setRequired(true)),

  /**
   * Ejecuta el comando `/unwarn` con el parámetro `user` y `index`.
   * 
   * @param {import('discord.js').Interaction} interaction La interacción que activó el comando.
   * @returns {Promise<void>}
   */
  async executeSlash(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const member = interaction.options.getMember('user');
    const index = interaction.options.getInteger('index') - 1; // Ajustar el índice para el array

    if (!member) {
      return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    }

    try {
      // Obtener advertencias del miembro
      const warningsResult = await query('SELECT * FROM warnings WHERE user_id = $1 ORDER BY timestamp ASC', [member.id]);
      const warnings = warningsResult.rows;

      if (warnings.length === 0) {
        return interaction.reply({ content: 'Este usuario no tiene advertencias.', ephemeral: true });
      }

      if (index < 0 || index >= warnings.length) {
        return interaction.reply({ content: 'El número de advertencia es inválido.', ephemeral: true });
      }

      // Eliminar la advertencia específica por su ID
      const warningId = warnings[index].id;
      await query('DELETE FROM warnings WHERE id = $1', [warningId]);

      interaction.reply({ content: `Advertencia #${index + 1} eliminada correctamente de ${member.user.tag}.`, ephemeral: true });

    } catch (error) {
      console.error('Error al eliminar la advertencia:', error);
      interaction.reply({ content: 'Hubo un error al eliminar la advertencia.', ephemeral: true });
    }
  },

  /**
   * Ejecuta el comando `/unwarn <@miembro> <número>` para eliminar una advertencia de un miembro.
   * 
   * @param {import('discord.js').Message} message El mensaje que activó el comando.
   * @param {string[]} args Los argumentos proporcionados en el mensaje del comando.
   * @returns {Promise<void>}
   */
  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('No tienes permisos para usar este comando.');
    }

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();
    const index = parseInt(args[1]) - 1;

    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    if (isNaN(index)) {
      return message.reply('Por favor proporciona un número válido para la advertencia que deseas eliminar.');
    }

    try {
      // Obtener advertencias del miembro
      const warningsResult = await query('SELECT * FROM warnings WHERE user_id = $1 ORDER BY timestamp ASC', [member.id]);
      const warnings = warningsResult.rows;

      if (warnings.length === 0) {
        return message.reply('Este usuario no tiene advertencias.');
      }

      if (index < 0 || index >= warnings.length) {
        return message.reply('El número de advertencia es inválido.');
      }

      // Eliminar la advertencia específica por su ID
      const warningId = warnings[index].id;
      await query('DELETE FROM warnings WHERE id = $1', [warningId]);

      message.reply(`Advertencia #${index + 1} eliminada correctamente de ${member.user.tag}.`);

    } catch (error) {
      console.error('Error al eliminar la advertencia:', error);
      message.reply('Hubo un error al eliminar la advertencia.');
    }
  },
};

module.exports.help = {
  name: 'unwarn',
  description: 'Elimina una advertencia de un miembro del servidor.',
  usage: 'unwarn <user> <index>',
};