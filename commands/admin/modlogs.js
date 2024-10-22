const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { query } = require('../../db'); // Asumiendo que query ya está implementado para PostgreSQL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('modlogs')
    .setDescription('⚔️ : Muestra el historial de moderación de un usuario.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del cual deseas ver los registros de moderación')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Solo miembros con permisos de moderación pueden usar este comando

  name: 'modlogs', // Nombre del comando para el prefijo
  description: 'Muestra el historial de moderación de un usuario.',

  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');

    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'No tienes permiso para ver los registros de moderación.', ephemeral: true });
    }

    await this.getModLogs(interaction, member);
  },

  async executePrefix(message, args) {
    const member = message.mentions.members.first();

    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('No tienes permiso para ver los registros de moderación.');
    }

    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    await this.getModLogs(message, member);
  },

  async getModLogs(context, member) {
    try {
      // Consulta SQL para obtener los eventos de moderación
      const modLogsQuery = `
        SELECT action, reason, date, moderator_id
        FROM moderation_events
        WHERE user_id = $1 AND guild_id = $2
        ORDER BY date DESC;
      `;

      const modLogs = await query(modLogsQuery, [member.user.id, context.guild.id]);

      if (modLogs.rows.length === 0) {
        return context.reply({ content: 'Este usuario no tiene registros de moderación.', ephemeral: true });
      }

      // Crear un embed para mostrar los registros
      const modLogsEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Rojo para eventos de moderación
        .setTitle(`Historial de Moderación para ${member.user.tag}`)
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Consulta de ModLogs', iconURL: context.user.displayAvatarURL() });

      // Iterar sobre los eventos y agregarlos al embed
      modLogs.rows.forEach((log, index) => {
        const moderatorTag = `<@${log.moderator_id}>`;
        modLogsEmbed.addFields({
          name: `Evento #${index + 1} (${log.action.toUpperCase()})`,
          value: `**Moderador:** ${moderatorTag}\n**Razón:** ${log.reason || 'No especificada'}\n**Fecha:** ${new Date(log.date).toLocaleString()}`,
          inline: false,
        });
      });

      // Responder con el embed
      await context.reply({ embeds: [modLogsEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} consultó los modlogs de ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(`[ERROR] Hubo un error al consultar los modlogs para ${member.user.tag}:`, error);
      context.reply({ content: 'Hubo un error al consultar los registros de moderación.', ephemeral: true });
    }
  }
};

module.exports.help = {
  name: 'modlogs',
  description: 'Muestra el historial de moderación de un usuario.',
  usage: 'modlogs <user>',
};
