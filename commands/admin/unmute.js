const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const db = require('megadb'); // Requerimos megadb
const muteRoleDB = new db.crearDB('muteRoles'); // Cargamos la base de datos donde se guardó el rol de mute por servidor

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('Desmuta a un miembro del servidor.')
    .addUserOption(option => 
      option.setName('user')
        .setDescription('El usuario que deseas desmutear')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers), // Permisos de moderar miembros requeridos

  name: 'unmute', // Nombre para comandos con prefijo
  description: 'Desmuta a un miembro del servidor.',

  async executeSlash(interaction) {
    const member = interaction.options.getMember('user');
    const muteRoleId = await this.getMuteRole(interaction.guild.id);

    if (!muteRoleId) {
      return interaction.reply({ content: 'El rol de mute no está configurado para este servidor. Usa /set_mute para configurarlo.', ephemeral: true });
    }

    const muteRole = interaction.guild.roles.cache.get(muteRoleId);

    if (!muteRole) {
      return interaction.reply({ content: 'El rol de mute no se pudo encontrar en este servidor.', ephemeral: true });
    }

    await this.unmuteMember(interaction, member, muteRole);
  },

  async executePrefix(message, args) {
    const member = message.mentions.members.first();
    const muteRoleId = await this.getMuteRole(message.guild.id);

    if (!muteRoleId) {
      return message.reply('El rol de mute no está configurado para este servidor. Usa `set_mute` para configurarlo.');
    }

    const muteRole = message.guild.roles.cache.get(muteRoleId);

    if (!muteRole) {
      return message.reply('El rol de mute no se pudo encontrar en este servidor.');
    }

    await this.unmuteMember(message, member, muteRole);
  },

  async unmuteMember(context, member, muteRole) {
    const isInteraction = !!context.isCommand;

    // Verificar permisos en prefijo
    if (!isInteraction && !context.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return context.reply({ content: 'No tienes permiso para desmutear miembros.', ephemeral: true });
    }

    if (!member) {
      return context.reply({ content: 'Por favor selecciona a un miembro válido.', ephemeral: true });
    }

    if (!member.roles.cache.has(muteRole.id)) {
      return context.reply({ content: 'Este miembro no está silenciado.', ephemeral: true });
    }

    try {
      // Eliminar el rol de mute
      await member.roles.remove(muteRole);

      // Crear embed para notificar el unmute
      const unmuteEmbed = new EmbedBuilder()
        .setColor(0x00ff00) // Verde
        .setTitle('Miembro Desmuteado')
        .setDescription(`${member.user.tag} ha sido desmuteado.`)
        .addFields(
          { name: 'Moderador', value: `${context.user.tag}`, inline: true },
          { name: 'Miembro', value: `${member.user.tag}`, inline: true }
        )
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Unmute ejecutado', iconURL: context.user.displayAvatarURL() });

      // Responder con el embed
      await context.reply({ embeds: [unmuteEmbed] });

      // Log en consola
      console.log(`[LOG] ${context.user.tag} ha desmuteado a ${member.user.tag} en ${context.guild.name}`);
    } catch (error) {
      console.error(error);
      context.reply({ content: 'Hubo un error al desmutear a este miembro.', ephemeral: true });
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
