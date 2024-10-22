const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('deletenote')
    .setDescription('❌ : Elimina una nota específica de un usuario.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del que deseas eliminar la nota.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  name: 'deletenote',
  description: 'Elimina la nota asociada a un usuario.',

  // Ejecución para Slash Command
  async executeSlash(interaction) {
    const user = interaction.options.getUser('user');
    await this.deleteNote(interaction, user, interaction.guild.id, interaction.user.id);
  },

  // Ejecución para comandos con prefijo
  async executePrefix(message, args) {
    if (args.length === 0 || !message.mentions.users.size) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    const user = message.mentions.users.first();
    await this.deleteNote(message, user, message.guild.id, message.author.id);
  },

  // Lógica para eliminar la nota
  async deleteNote(context, user, guildId, moderatorId) {
    try {
      // Verificar si existe una nota de ese moderador para el usuario
      const result = await query(
        `SELECT id FROM user_notes 
         WHERE guild_id = $1 AND user_id = $2 AND moderator_id = $3`,
        [guildId, user.id, moderatorId]
      );

      if (result.rows.length === 0) {
        return context.reply('No tienes ninguna nota para este usuario.');
      }

      // Eliminar la nota
      await query(
        `DELETE FROM user_notes 
         WHERE id = $1`,
        [result.rows[0].id]
      );

      await context.reply(`Nota eliminada para **${user.tag}**.`);
      console.log(`[LOG] ${moderatorId} eliminó una nota de ${user.tag} en ${guildId}`);
    } catch (error) {
      console.error('Error al eliminar la nota:', error);
      context.reply('Hubo un error al eliminar la nota.');
    }
  }
};

module.exports.help = {
  name: 'deletenote',
  description: 'Elimina la nota de un usuario.',
  usage: 'deletenote <user>',
};
