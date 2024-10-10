const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

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
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

  name: 'warn',
  description: 'Advierte a un miembro del servidor.',

  /**
   * Ejecuta el comando `/warn` en un mensaje slash.
   * @param {import('discord.js').Interaction} interaction - La interacción que
   *   ejecutó el comando.
   * @returns {Promise<void>}
   */
  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    await this.warnMember(interaction, member, reason);
  },

  /**
   * Ejecuta el comando `warn` en un mensaje prefix.
   * @param {import('discord.js').Message} message - El mensaje que ejecutó el comando.
   * @param {string[]} args - Los argumentos del comando.
   * @returns {Promise<void>}
   */
  async executePrefix(message, args) {
    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ') || 'No se proporcionó razón.';
    if (!member) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }
    await this.warnMember(message, member, reason);
  },

  /**
   * Advierte a un miembro del servidor.
   * @param {import('discord.js').Message | import('discord.js').Interaction} context El mensaje o interacción que activó el comando.
   * @param {import('discord.js').GuildMember} member El miembro a advertir.
   * @param {string} reason La razón de la advertencia.
   * @returns {Promise<void>}
   */
  async warnMember(context, member, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar permisos (solo en comandos con prefijo)
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

      // Registrar advertencia en PostgreSQL (tabla 'warnings')
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
        new Date().toISOString()  // Asegúrate de que 'timestamp' esté en la tabla
      ];

      const warnResult = await query(queryWarn, valuesWarn);
      console.log('Advertencia registrada en PostgreSQL:', warnResult.rows[0]);

      // Registrar el evento en la tabla 'moderation_events'
      const queryEvent = `
        INSERT INTO moderation_events (user_id, guild_id, moderator_id, action, reason, date, timestamp)
        VALUES ($1, $2, $3, $4, $5, $6, $7);
      `;
      const valuesEvent = [
        member.id,
        context.guild.id,
        context.user.id,
        'warn', // Aquí se establece el valor de action
        reason,
        new Date().toISOString(),  // Asegúrate de que 'date' esté en la tabla
        new Date().toISOString()   // Asegúrate de que 'timestamp' esté en la tabla
      ];

      await query(queryEvent, valuesEvent);
      console.log('Evento de moderación registrado en PostgreSQL');

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
        .setFooter({ text: 'Advertencia registrada', iconURL: context.user.displayAvatarURL() });

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

module.exports.help = {
  name: 'warn',
  description: 'Advertir a un miembro del servidor.',
  usage: 'warn <user> <reason>',
};
