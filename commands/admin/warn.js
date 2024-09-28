const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('megadb');
const warnDB = new db.crearDB('warnings'); // Usar crearDB para inicializar la base de datos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Advierte a un miembro del servidor.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario que deseas advertir')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón de la advertencia')
        .setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Permisos de advertencia

  name: 'warn', // Nombre para comandos con prefijo
  description: 'Advierte a un miembro del servidor.',
  
  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    await this.warnMember(interaction, member, reason);
  },
  
  async executePrefix(message, args) {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';
    if (!member) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }
    await this.warnMember(message, member, reason);
  },

  async warnMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar si tiene permisos de advertencia (solo en prefijos)
    if (!isInteraction && !context.member.permissions.has('MODERATE_MEMBERS')) {
      return context.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para advertir miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: '<:440warning:1287542257985126501> | Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    try {
      // Intentar enviar un mensaje directo al usuario
      try {
        await member.send(`<a:1302moderatorprogramsalumnia:1287542225399709737> Has recibido una advertencia en el servidor ${context.guild.name} por ${context.user.tag}. Razón: ${reason}`);
      } catch (error) {
        console.log(`[LOG] No se pudo enviar un mensaje directo a ${member.user.tag}.`);
      }

      // Registrar advertencia en MegaDB
      if (!await warnDB.has(`warnings.${member.id}`)) {
        await warnDB.set(`warnings.${member.id}`, []);
      }
      await warnDB.push(`warnings.${member.id}`, { 
        reason: reason, 
        moderator: context.user.tag, 
        timestamp: new Date().toISOString() 
      });

      // Crear embed para notificar al canal
      const warnEmbed = new EmbedBuilder()
        .setColor(0xffff00) // Amarillo
        .setTitle('<a:1302moderatorprogramsalumnia:1287542225399709737> **ADVERTENCIA**')
        .setDescription(`${member.user.tag} ha recibido una advertencia.`)
        .addFields(
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${context.user.tag}`, inline: true },
          { name: '<:discordcopyid:1287542182080679997> Miembro', value: `${member.user.tag}`, inline: true },
          { name: '<:discordeditprofile:1287542190926467094> Razón', value: reason, inline: false }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: '<a:7checkbox:1287542421386690570> | Advertencia registrada', iconURL: context.user.displayAvatarURL() });

      // Enviar el embed como respuesta
      await context.reply({ embeds: [warnEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha advertido a ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al advertir a este miembro.', ephemeral: true });
    }
  },
};
