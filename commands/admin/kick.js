const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('Expulsa a un miembro del servidor.')
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
    const member = message.mentions.members.first();
    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    // El resto del mensaje puede contener el motivo, si se proporciona
    const reason = args.slice(1).join(' ') || 'No se proporcionó ninguna razón.';
    await this.kickMember(message, member, reason);
  },

  async kickMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar si tiene permisos de expulsión (solo en prefijos)
    if (!isInteraction && !context.member.permissions.has('KICK_MEMBERS')) {
      return context.reply({ content: 'No tienes permiso para expulsar miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: 'Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (!member.kickable) {
      return context.reply({ content: 'No puedo expulsar a este miembro.', ephemeral: true });
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

      // Crear embed para notificar al canal
      const kickEmbed = new EmbedBuilder()
        .setColor(0xff0000) // Rojo
        .setTitle('Miembro Expulsado')
        .setDescription(`${member.user.tag} ha sido expulsado del servidor.`)
        .addFields(
          { name: 'Moderador', value: `${context.user.tag}`, inline: true },
          { name: 'Miembro', value: `${member.user.tag}`, inline: true },
          { name: 'Razón', value: reason, inline: false }
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
