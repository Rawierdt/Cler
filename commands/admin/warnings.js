const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('megadb'); // Asegúrate de que esta línea esté correcta

// Crear o cargar la base de datos de advertencias
const warnDB = new db.crearDB('warnings'); // Utilizando el nombre del archivo sin extensión

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('Muestra las advertencias de un miembro.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del cual deseas ver las advertencias.')
        .setRequired(true)
    ),

  async executeSlash(interaction) {
    // Verificar si el usuario tiene permisos de moderar miembros
    if (!interaction.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return interaction.reply({ content: 'No tienes permisos para usar este comando.', ephemeral: true });
    }

    const member = interaction.options.getMember('user');
    
    // Asegurarse de que el usuario sea válido
    if (!member) {
      return interaction.reply({ content: '<:databaseerror:1287543007117054063> | Usuario no encontrado.', ephemeral: true });
    }

    // Obtener las advertencias del miembro
    let warnings;
    try {
      const allWarnings = await warnDB.get('warnings'); // Obtener todo el objeto de advertencias
      warnings = allWarnings[member.id] || []; // Acceder a las advertencias del usuario
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      warnings = [];
    }

    if (warnings.length === 0) {
      return interaction.reply({ content: `Este usuario no tiene advertencias.`, ephemeral: true });
    }

    // Crear un embed para mostrar las advertencias
    const warningEmbed = new EmbedBuilder()
      .setColor(0xffcc00) // Amarillo
      .setTitle(`Advertencias de ${member.user.tag}`)
      .setDescription(warnings.map((warn, index) => 
        `**${index + 1}.** Razón: ${warn.reason}\nModerador: ${warn.moderator}\nFecha: ${new Date(warn.timestamp).toLocaleDateString()}`
      ).join('\n\n'))
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: 'Advertencias', iconURL: member.user.displayAvatarURL() });

    // Enviar el embed como respuesta
    await interaction.reply({ embeds: [warningEmbed] });
  },

  async executePrefix(message, args) {
    // Verificar si el usuario tiene permisos de moderar miembros
    if (!message.member.permissions.has(PermissionFlagsBits.ModerateMembers)) {
      return message.reply('<:win11erroicon:1287543137505378324> | No tienes permisos para usar este comando.');
    }

    // Obtener el miembro mencionado
    const member = message.mentions.members.first();
    
    if (!member) {
      return message.reply('<:440warning:1287542257985126501> | Por favor menciona a un usuario válido.');
    }

    // Obtener las advertencias del miembro
    let warnings;
    try {
      const allWarnings = await warnDB.get('warnings'); // Obtener todo el objeto de advertencias
      warnings = allWarnings[member.id] || []; // Acceder a las advertencias del usuario
    } catch (error) {
      console.error('Error al obtener advertencias:', error);
      warnings = [];
    }

    if (warnings.length === 0) {
      return message.reply(`<:databaseerror:1287543007117054063> | Este usuario no tiene advertencias.`);
    }

    // Crear un embed para mostrar las advertencias
    const warningEmbed = new EmbedBuilder()
      .setColor(0xffcc00) // Amarillo
      .setTitle(`Advertencias de ${member.user.tag}`)
      .setDescription(warnings.map((warn, index) => 
        `**${index + 1}.** Razón: ${warn.reason}\nModerador: ${warn.moderator}\nFecha: ${new Date(warn.timestamp).toLocaleDateString()}`
      ).join('\n\n'))
      .setThumbnail(member.user.displayAvatarURL())
      .setTimestamp()
      .setFooter({ text: 'Advertencias', iconURL: member.user.displayAvatarURL() });

    // Enviar el embed como respuesta
    await message.reply({ embeds: [warningEmbed] });
  },
};
