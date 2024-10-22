const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { query } = require('../../db'); // Importar el conector de PostgreSQL

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🛡️ : Banea a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas banear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del baneo')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Permisos de baneo

  name: 'ban', // Nombre para comandos con prefijo
  description: 'Banea a un miembro del servidor.',
  
  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    await this.banMember(interaction, member, reason);
  },
  
  async executePrefix(message, args) {

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';
    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }
    await this.banMember(message, member, reason);
  },

  async banMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar permisos de baneo (solo en prefijos)
    if (!isInteraction && !context.member.permissions.has(PermissionFlagsBits.BanMembers)) {
      return context.reply({ content: 'No tienes permiso para banear miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: 'Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (!member.bannable) {
      return context.reply({ content: 'No puedo banear a este miembro.', ephemeral: true });
    }

    try {
      // Intentar enviar un mensaje directo al usuario antes de banearlo
      try {
        await member.send(`Has sido baneado del servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      // Bannear al miembro
      await member.ban({ reason });

      // Loguear el baneo en la tabla 'bans'
      const banQuery = `
        INSERT INTO bans (user_id, moderator_id, reason, timestamp)
        VALUES ($1, $2, $3, NOW());
      `;
      const banValues = [member.user.id, context.user.id, reason];
      await query(banQuery, banValues);

      // Loguear el evento de moderación en 'moderation_events'
      const logQuery = `
        INSERT INTO moderation_events (guild_id, user_id, moderator_id, event_type, reason, event_date)
        VALUES ($1, $2, $3, 'ban', $4, NOW());
      `;
      const logValues = [context.guild.id, member.user.id, context.user.id, reason];
      await query(logQuery, logValues);

      // Crear embed para notificar al canal
      const banEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Rojo
        .setTitle('BANEO')
        .setDescription(`${member.user.tag} ha sido baneado del servidor.`)
        .addFields(
          { name: 'Moderador', value: `${context.user.tag}`, inline: true },
          { name: 'Miembro', value: `${member.user.tag}`, inline: true },
          { name: 'Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Baneo ejecutado', iconURL: context.user.displayAvatarURL() });

      // Enviar el embed como respuesta
      await context.reply({ embeds: [banEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha baneado a ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al banear a este miembro.', ephemeral: true });
    }
  },
};

module.exports.help = {
  name: 'ban',
  description: 'Banea a un miembro del servidor.',
  usage: 'ban <user> <reason>',
};
