const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('softban')
    .setDescription('🛡️ : Realiza un softban a un miembro, banea por 7 días y borra mensajes recientes.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas softbanear')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del softban')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers), // Permisos de baneo

  name: 'softban', // Nombre para comandos con prefijo
  description: 'Realiza un softban a un miembro del servidor.',

  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    await this.softbanMember(interaction, member, reason);
  },

  async executePrefix(message, args) {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    if (!member) {
      return message.reply('<:440warning:1287542257985126501> |Por favor menciona a un usuario válido.');
    }
    await this.softbanMember(message, member, reason);
  },

  async softbanMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar permisos de baneo (solo para prefijos)
    if (!isInteraction && !context.member.permissions.has('BAN_MEMBERS')) {
      return context.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para banear miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: '<:440warning:1287542257985126501> | Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (!member.bannable) {
      return context.reply({ content: '<a:denyxbox:1287542408082358292> | No puedo banear a este miembro.', ephemeral: true });
    }

    try {
      // Intentar enviar un mensaje directo al usuario antes de banearlo
      try {
        await member.send(`Has sido softbaneado del servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      // Realizar el softban (baneo temporal y eliminar mensajes)
      await member.ban({ days: 7, reason }); // Banea por 7 días y elimina mensajes recientes

      // Desbanear después de aplicar el softban
      await context.guild.members.unban(member.id, '<a:7checkbox:1287542421386690570> | Softban completado');

      // Crear embed para notificar al canal
      const softbanEmbed = new EmbedBuilder()
        .setColor(0xffa500) // Naranja
        .setTitle('<a:1302moderatorprogramsalumnia:1287542225399709737> **SOFTBAN**')
        .setDescription(`${member.user.tag} ha sido softbaneado del servidor.`)
        .addFields(
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${context.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Miembro', value: `${member.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Softban ejecutado', iconURL: context.user.displayAvatarURL() });

      // Enviar el embed como respuesta
      await context.reply({ embeds: [softbanEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha softbaneado a ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al aplicar el softban a este miembro.', ephemeral: true });
    }
  },
};
