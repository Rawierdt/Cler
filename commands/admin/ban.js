const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('Banea a un miembro del servidor.')
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
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';
    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }
    await this.banMember(message, member, reason);
  },

  async banMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar si tiene permisos de baneo (solo en prefijos)
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
        await member.send(`Has sido baneado del servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      // Bannear al miembro
      await member.ban({ reason });

      // Crear embed para notificar al canal
      const banEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Rojo
        .setTitle('<a:1302moderatorprogramsalumnia:1287542225399709737> **BANEO**')
        .setDescription(`${member.user.tag} ha sido baneado del servidor.`)
        .addFields(
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${context.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Miembro', value: `${member.user.tag}`, inline: true },
          { name: '<:discordeditprofile:1287542190926467094> Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: '<a:7checkbox:1287542421386690570> | Baneo ejecutado', iconURL: context.user.displayAvatarURL() });

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
