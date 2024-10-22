const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('🛡️ : Expulsa a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas expulsar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón para expulsar al miembro')
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers), // Permisos de expulsión

  name: 'kick', // Este es el nombre para los comandos con prefijo
  description: 'Expulsa a un miembro del servidor.',
  
  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó ninguna razón.';
    await this.kickMember(interaction, member, reason);
  },
  
  async executePrefix(message, args) {

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('<:440warning:1287542257985126501> | Por favor menciona a un usuario válido.');
    }

    // El resto del mensaje puede contener el motivo, si se proporciona
    const reason = args.slice(1).join(' ') || 'No se proporcionó ninguna razón.';
    await this.kickMember(message, member, reason);
  },

  async kickMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar si tiene permisos de expulsión (solo en prefijos)
    if (!isInteraction && !context.member.permissions.has(PermissionFlagsBits.KickMembers)) {
      return context.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para expulsar miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: '<:440warning:1287542257985126501> | Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (!member.kickable) {
      return context.reply({ content: '<a:denyxbox:1287542408082358292> | No puedo expulsar a este miembro.', ephemeral: true });
    }

    try {
      // Intentar enviar un mensaje directo al usuario antes de expulsarlo
      try {
        await member.send(`Has sido expulsado del servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      // Expulsar al miembro
      await member.kick(reason);

      // Registrar el kick en la tabla 'kicks'
      const kickQuery = `
        INSERT INTO kicks (user_id, moderator_id, reason, timestamp)
        VALUES ($1, $2, $3, NOW());
      `;
      const kickValues = [member.user.id, context.user.id, reason];
      await query(kickQuery, kickValues);

      // Registrar el evento en 'moderation_events'
      const logQuery = `
        INSERT INTO moderation_events (guild_id, user_id, moderator_id, event_type, reason, event_date)
        VALUES ($1, $2, $3, 'kick', $4, NOW());
      `;
      const logValues = [context.guild.id, member.user.id, context.user.id, reason];
      await query(logQuery, logValues);

      // Crear el embed para notificar al canal
      const kickEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Rojo
        .setTitle('Miembro Expulsado')
        .setDescription(`${member.user.tag} ha sido expulsado del servidor.`)
        .addFields(
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${context.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Miembro', value: `${member.user.tag}`, inline: true },
          { name: '<:discordeditprofile:1287542190926467094> Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Expulsión ejecutada', iconURL: context.user.displayAvatarURL() });

      // Enviar el embed como respuesta
      await context.reply({ embeds: [kickEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha expulsado a ${member.user.tag} en ${context.guild.name} por ${reason}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al expulsar a este miembro.', ephemeral: true });
    }
  },
};

module.exports.help = {
  name: 'kick',
  description: 'Expulsa a un miembro del servidor.',
  usage: 'kick <user> <reason>',
};
