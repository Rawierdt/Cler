const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { query } = require('../../db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('⚔️ : Muestra las advertencias de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del cual deseas ver las advertencias.')
        .setRequired(true)),

  async executeSlash(interaction) {
    // Verificar permisos
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const member = interaction.options.getMember('user');

    if (!member) {
      return interaction.reply({ content: 'Usuario no encontrado.', ephemeral: true });
    }

    try {
      // Obtener advertencias del miembro desde PostgreSQL
      const warningsResult = await query('SELECT * FROM warnings WHERE user_id = $1 ORDER BY timestamp ASC', [member.id]);
      const warnings = warningsResult.rows;

      if (warnings.length === 0) {
        return interaction.reply({ content: 'Este usuario no tiene advertencias.', ephemeral: true });
      }

      // Crear embed para mostrar las advertencias
      const warningEmbed = new EmbedBuilder()
        .setColor(0xffcc00) // Amarillo
        .setTitle(`Advertencias de ${member.user.tag}`)
        .setDescription(warnings.map((warn, index) =>
          `**${index + 1}.** Razón: ${warn.reason}\nModerador: <@${warn.moderator_id}>\nFecha: ${new Date(warn.timestamp).toLocaleDateString()}`
        ).join('\n\n'))
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Advertencias', iconURL: member.user.displayAvatarURL() });

      // Enviar el embed
      await interaction.reply({ embeds: [warningEmbed] });
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      interaction.reply({ content: 'Hubo un error al obtener las advertencias.', ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('No tienes permisos para usar este comando.');
    }

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply('Por favor menciona a un usuario válido.');
    }

    try {
      // Obtener advertencias del miembro desde PostgreSQL
      const warningsResult = await query('SELECT * FROM warnings WHERE user_id = $1 ORDER BY timestamp ASC', [member.id]);
      const warnings = warningsResult.rows;

      if (warnings.length === 0) {
        return message.reply('Este usuario no tiene advertencias.');
      }

      // Crear embed para mostrar las advertencias
      const warningEmbed = new EmbedBuilder()
        .setColor(0xffcc00) // Amarillo
        .setTitle(`Advertencias de ${member.user.tag}`)
        .setDescription(warnings.map((warn, index) =>
          `**${index + 1}.** Razón: ${warn.reason}\nModerador: <@${warn.moderator_id}>\nFecha: ${new Date(warn.timestamp).toLocaleDateString()}`
        ).join('\n\n'))
        .setThumbnail(member.user.displayAvatarURL())
        .setTimestamp()
        .setFooter({ text: 'Advertencias', iconURL: member.user.displayAvatarURL() });

      // Enviar el embed
      await message.reply({ embeds: [warningEmbed] });
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      message.reply('Hubo un error al obtener las advertencias.');
    }
  },
};

module.exports.help = {
  name: 'warnings',
  description: 'Muestra las advertencias de un miembro.',
  usage: 'warnings <user>',
};
