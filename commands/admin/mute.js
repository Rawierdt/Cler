const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🛡️ : Silencia a un miembro del servidor por un tiempo definido.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('El usuario que deseas silenciar')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('time')
        .setDescription('Tiempo en minutos para silenciar al usuario (opcional)'))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Razón del mute (opcional)'))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Permisos de moderar miembros requeridos

  name: 'mute', // Nombre para comandos con prefijo
  description: 'Silencia a un miembro del servidor.',

  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const time = interaction.options.getInteger('time');
    const reason = interaction.options.getString('reason') || 'No se proporcionó razón.';
    const muteRoleId = await this.getMuteRole(interaction.guild.id);

    if (!muteRoleId) {
      return interaction.reply({ content: 'El rol de mute no está configurado para este servidor. Usa /set_mute para configurarlo.', ephemeral: true });
    }

    const muteRole = interaction.guild.roles.cache.get(muteRoleId);

    if (!muteRole) {
      return interaction.reply({ content: 'El rol de mute no se pudo encontrar en este servidor.', ephemeral: true });
    }

    await this.muteMember(interaction, member, muteRole, time, reason);
  },

  async executePrefix(message, args) {

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();
    const time = args[1] ? parseInt(args[1], 10) : null; // El segundo argumento es el tiempo en minutos
    const reason = args.slice(2).join(' ') || 'No se proporcionó razón.';
    const muteRoleId = await this.getMuteRole(message.guild.id);

    if (!muteRoleId) {
      return message.reply('El rol de mute no está configurado para este servidor. Usa `set_mute` para configurarlo.');
    }

    const muteRole = message.guild.roles.cache.get(muteRoleId);

    if (!muteRole) {
      return message.reply('El rol de mute no se pudo encontrar en este servidor.');
    }

    await this.muteMember(message, member, muteRole, time, reason);
  },

  async muteMember(context, member, muteRole, time, reason) {
    const isInteraction = !!context.isCommand;

    // Verificar permisos en prefijo
    if (!isInteraction && !context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return context.reply({ content: 'No tienes permiso para silenciar miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: 'Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (member.roles.cache.has(muteRole.id)) {
      return context.reply({ content: 'Este miembro ya está silenciado.', ephemeral: true });
    }

    try {
      // Asignar el rol de mute
      await member.roles.add(muteRole);

      // Insertar en la base de datos `moderation_events` para logs
      const logQuery = `
        INSERT INTO moderation_events (user_id, moderator_id, action, reason, guild_id, event_type, date)
        VALUES ($1, $2, 'mute', $3, $4, 'mute', CURRENT_TIMESTAMP)
        RETURNING id;
      `;
      const logValues = [member.user.id, context.user.id, reason, context.guild.id];
      const logResult = await query(logQuery, logValues);
      const eventId = logResult.rows[0].id; // Obtener el ID del evento insertado

      // Insertar en la base de datos `mutes`
      const muteQuery = `
        INSERT INTO mutes (user_id, moderator_id, action, reason, date, event_id, time, guild_id)
        VALUES ($1, $2, 'mute', $3, CURRENT_TIMESTAMP, $4, $5, $6);
      `;
      const muteValues = [member.user.id, context.user.id, reason, eventId, time, context.guild.id];
      await query(muteQuery, muteValues);

      // Si se proporciona un tiempo, configurar el desmute automático
      if (time && !isNaN(time)) {
        setTimeout(async () => {
          if (member.roles.cache.has(muteRole.id)) {
            await member.roles.remove(muteRole);
            console.log(`[LOG] ${member.user.tag} ha sido desmuteado automáticamente después de ${time} minutos.`);
          }
        }, time * 60 * 1000); // Convertir minutos a milisegundos
      }

      // Crear embed para notificar el mute
      const muteEmbed = new EmbedBuilder()
        .setColor(0xffa500) // Naranja
        .setTitle('Miembro Silenciado')
        .setDescription(`${member.user.tag} ha sido silenciado.`)
        .addFields(
          { name: 'Moderador', value: `${context.user.tag}`, inline: true },
          { name: 'Miembro', value: `${member.user.tag}`, inline: true },
          { name: 'Razón', value: reason, inline: false },
          { name: 'Tiempo', value: time ? `${time} minutos` : 'Indefinido', inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Mute ejecutado', iconURL: context.user.displayAvatarURL() });

      // Responder con el embed
      await context.reply({ embeds: [muteEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha silenciado a ${member.user.tag} en ${context.guild.name} por ${time || 'Indefinido'} minutos.`);
    } catch (error) {
      console.error(error);
      context.reply({ content: '<a:denyxbox:1287542408082358292> | Hubo un error al silenciar a este miembro.', ephemeral: true });
    }
  },

  // Función para obtener el rol de mute desde la base de datos
  async getMuteRole(guildId) {
    const queryText = 'SELECT muted_role_id FROM muted_roles WHERE guild_id = $1;';
    try {
      const res = await query(queryText, [guildId]);
      if (res.rows.length > 0) {
        return res.rows[0].muted_role_id;
      }
      return null;
    } catch (error) {
      console.error(`[ERROR] No se pudo obtener el rol de mute para el servidor con ID ${guildId}: ${error}`);
      return null;
    }
  }
};

module.exports.help = {
  name: 'mute',
  description: 'Silencia a un miembro del servidor.',
  usage: 'mute <user> <time> <reason>',
};
