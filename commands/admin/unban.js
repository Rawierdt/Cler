const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unban')
    .setDescription('Desbanea a un miembro.')
    .addStringOption(option =>
      option.setName('userid')
        .setDescription('El ID del usuario a desbanear.')
        .setRequired(true),
    ),

    name: 'unban', // Nombre para comandos con prefijo
    description: 'Desbanea a un miembro del servidor.',

  async executeSlash(interaction) {
    const userId = interaction.options.getString('userid');

    // Verificar permisos
    if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return interaction.reply({ content: 'No tienes permiso para desbanear usuarios.', ephemeral: true });
    }

    try {
      // Intentar obtener al usuario baneado
      const bannedUser = await interaction.guild.bans.fetch(userId);

      if (!bannedUser) {
        return interaction.reply({ content: `No se encontró a ningún usuario baneado con el ID ${userId}.`, ephemeral: true });
      }

      // Desbanear al usuario
      await interaction.guild.members.unban(userId);

      // Crear el embed de confirmación
      const unbanEmbed = new EmbedBuilder()
        .setTitle('🔓 Usuario Desbaneado')
        .setDescription(`El usuario ha sido desbaneado correctamente.`)
        .setColor('Green')
        .addFields(
          { name: '👤 Usuario', value: `${bannedUser.user.tag} (${bannedUser.user.id})`, inline: true },
          { name: '👮 Moderador', value: `${interaction.user.tag}`, inline: true }
        )
        .setTimestamp();

      // Enviar el embed de confirmación
      return interaction.reply({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error('Error al desbanear:', error);
      return interaction.reply({ content: `Hubo un error al intentar desbanear al usuario con ID ${userId}.`, ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    const userId = args[0];

    // Verificar permisos
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('No tienes permiso para desbanear usuarios.');
    }

    try {
      // Intentar obtener al usuario baneado
      const bannedUser = await message.guild.bans.fetch(userId);

      if (!bannedUser) {
        return message.reply(`No se encontró a ningún usuario baneado con el ID ${userId}.`);
      }

      // Desbanear al usuario
      await message.guild.members.unban(userId);

      // Crear el embed de confirmación
      const unbanEmbed = new EmbedBuilder()
        .setTitle('🔓 Usuario Desbaneado')
        .setDescription(`El usuario ha sido desbaneado correctamente.`)
        .setColor('Green')
        .addFields(
          { name: '👤 Usuario', value: `${bannedUser.user.tag} (${bannedUser.user.id})`, inline: true },
          { name: '👮 Moderador', value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      // Enviar el embed de confirmación
      return message.channel.send({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error('Error al desbanear:', error);
      return message.reply(`Hubo un error al intentar desbanear al usuario con ID ${userId}.`);
    }
  },
};
