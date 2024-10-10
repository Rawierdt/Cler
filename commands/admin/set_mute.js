const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('set_mute')
    .setDescription('Configura el rol de mute para el servidor.')
    .addRoleOption(option => 
      option.setName('role')
        .setDescription('El rol que deseas configurar como rol de mute.')
        .setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator), // Permisos de administrador requeridos

  name: 'set_mute', // Nombre para comandos con prefijo
  description: 'Configura el rol de mute para el servidor.',

  async executeSlash(interaction) {
    const role = interaction.options.getRole('role');

    // Guardar el rol en la base de datos
    await this.setMuteRole(interaction.guild.id, role.id);

    // Crear embed de confirmación
    const embed = new EmbedBuilder()
      .setColor(0x00ff00) // Verde
      .setTitle('Rol de Mute Configurado')
      .setDescription(`El rol **${role.name}** ha sido configurado como el rol de mute para este servidor.`)
      .setTimestamp()
      .setFooter({ text: 'Configuración completada', iconURL: interaction.user.displayAvatarURL() });

    // Responder con el embed
    await interaction.reply({ embeds: [embed] });

    // Log en consola
    console.log(`[LOG] ${interaction.user.tag} configuró el rol de mute (${role.name}) para el servidor ${interaction.guild.name}`);
  },

  async executePrefix(message, args) {
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);

    if (!role) {
      return message.reply('Por favor menciona un rol válido o proporciona una ID de rol válida.');
    }

    // Verificar si tiene permisos de administrador
    if (!message.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return message.reply('No tienes permiso para configurar el rol de mute.');
    }

    // Guardar el rol en la base de datos
    await this.setMuteRole(message.guild.id, role.id);

    // Crear embed de confirmación
    const embed = new EmbedBuilder()
      .setColor(0x00ff00) // Verde
      .setTitle('Rol de Mute Configurado')
      .setDescription(`El rol **${role.name}** ha sido configurado como el rol de mute para este servidor.`)
      .setTimestamp()
      .setFooter({ text: 'Configuración completada', iconURL: message.author.displayAvatarURL() });

    // Responder con el embed
    await message.reply({ embeds: [embed] });

    // Log en consola
    console.log(`[LOG] ${message.author.tag} configuró el rol de mute (${role.name}) para el servidor ${message.guild.name}`);
  },

  // Función para guardar el rol de mute en la base de datos
  async setMuteRole(guildId, roleId) {
    const queryText = `
      INSERT INTO muted_roles (guild_id, muted_role_id)
      VALUES ($1, $2)
      ON CONFLICT (guild_id) DO UPDATE SET muted_role_id = $2;
    `;

    try {
      await query(queryText, [guildId, roleId]);
      console.log(`[LOG] Rol de mute guardado para el servidor con ID ${guildId}: ${roleId}`);
    } catch (error) {
      console.error(`[ERROR] No se pudo guardar el rol de mute para el servidor con ID ${guildId}: ${error}`);
    }
  }
};

module.exports.help = {
  name: 'set_mute',
  description: 'Configura el rol de mute para el servidor.',
  usage: 'set_mute <role>',
};