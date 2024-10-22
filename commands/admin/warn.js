const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('🛡️ : Advierte a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas advertir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón de la advertencia')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  name: 'warn',
  description: 'Advierte a un miembro del servidor.',

  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    await this.warnMember(interaction, member, reason);
  },

  async executePrefix(message, args) {
    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';

    await this.warnMember(message, member, reason);
  },

  async warnMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    if (!isInteraction && !context.member.permissions.has('MODERATE_MEMBERS')) {
      return context.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para advertir miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: '<:440warning:1287542257985126501> | Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    try {
      try {
        await member.send(`<a:1302moderatorprogramsalumnia:1287542225399709737> Has recibido una advertencia en el servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      const queryWarn = `
        INSERT INTO warnings (user_id, guild_id, moderator_id, reason, timestamp)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `;
      const valuesWarn = [
        member.id,
        context.guild.id,
        context.user.id,
        reason,
        new Date().toISOString()
      ];

      const warnResult = await query(queryWarn, valuesWarn);
      console.log('Advertencia registrada en PostgreSQL:', warnResult.rows[0]);

      const queryEvent = `
        INSERT INTO moderation_events (user_id, guild_id, moderator_id, action, reason, date, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      const valuesEvent = [
        member.id,
        context.guild.id,
        context.user.id,
        'warn',
        reason,
        new Date().toISOString(),
        new Date().toISOString()
      ];

      await query(queryEvent, valuesEvent);
      console.log('Evento de moderación registrado en PostgreSQL');

      const warnEmbed = new EmbedBuilder()
        .setColor(0xffff00)
        .setTitle('<a:1302moderatorprogramsalumnia:1287542225399709737> **ADVERTENCIA**')
        .setDescription(`${member.user.tag} ha recibido una advertencia.`)
        .addFields(
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${context.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Miembro', value: `${member.user.tag}`, inline: true },
          { name: '<:discordeditprofile:1287542190926467094> Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Advertencia registrada', iconURL: context.user.displayAvatarURL() });

      await context.reply({ embeds: [warnEmbed] });

      console.log(`[LOG] ${context.user.tag} ha advertido a ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al advertir a este miembro.', ephemeral: true });
    }
  },
};

module.exports.help = {
  name: 'warn',
  description: 'Advertir a un miembro del servidor.',
  usage: 'warn <user> <reason>',
};
