const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('megadb'); // Requerimos megadb
const muteRoleDB = new db.crearDB('muteRoles'); // Cargamos la base de datos donde se guardó el rol de mute por servidor

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('Silencia a un miembro del servidor por un tiempo definido.')
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
      context.reply({ content: 'Hubo un error al silenciar a este miembro.', ephemeral: true });
    }
  },

  // Función para obtener el rol de mute desde la base de datos
  async getMuteRole(guildId) {
    try {
      const muteRoleId = await muteRoleDB.get(`${guildId}.muteRole`);
      return muteRoleId;
    } catch (error) {
      console.error(`[ERROR] No se pudo obtener el rol de mute para el servidor con ID ${guildId}: ${error}`);
      return null;
    }
  }
};
