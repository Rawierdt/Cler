const { SlashCommandBuilder, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { query } = require('../../db');

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
      return interaction.reply({ content: '<:win11erroicon:1287543137505378324> | No tienes permiso para desbanear usuarios.', ephemeral: true });
    }

    try {
      // Intentar obtener al usuario baneado
      const bannedUser = await interaction.guild.bans.fetch(userId);

      if (!bannedUser) {
        return interaction.reply({ content: `<:440warning:1287542257985126501> | No se encontró a ningún usuario baneado con el ID ${userId}.`, ephemeral: true });
      }

      // Desbanear al usuario
      await interaction.guild.members.unban(userId);

      // Borrar el registro del baneo en la tabla 'bans'
      await query('DELETE FROM bans WHERE user_id = $1', [userId]);

      // Crear el embed de confirmación
      const unbanEmbed = new EmbedBuilder()
        .setTitle('<a:7621hypesquadeventsanimation:1287542126237847622> Usuario Desbaneado')
        .setDescription(`<a:7checkbox:1287542421386690570> | El usuario ha sido desbaneado correctamente.`)
        .setColor('Green')
        .addFields(
          { name: '<:discordcopyid:1287542182080679997> Usuario', value: `${bannedUser.user.tag} (${bannedUser.user.id})`, inline: true },
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${interaction.user.tag}`, inline: true }
        )
        .setTimestamp();

      // Enviar el embed de confirmación
      return interaction.reply({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error('Error al desbanear:', error);
      return interaction.reply({ content: `<a:denyxbox:1287542408082358292> | Hubo un error al intentar desbanear al usuario con ID ${userId}.`, ephemeral: true });
    }
  },

  async executePrefix(message, args) {
    const userId = args[0];

    // Verificar que se mencionó a un usuario
    if (args.length === 0 || !message.mentions.members.size) {
      return message.reply('<a:denyxbox:1287542408082358292> | Por favor menciona a un usuario válido.');
    }

    // Verificar permisos
    if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
      return message.reply('<:win11erroicon:1287543137505378324> | No tienes permiso para desbanear usuarios.');
    }

    try {
      // Intentar obtener al usuario baneado
      const bannedUser = await message.guild.bans.fetch(userId);

      if (!bannedUser) {
        return message.reply(`<:440warning:1287542257985126501> | No se encontró a ningún usuario baneado con el ID ${userId}.`);
      }

      // Desbanear al usuario
      await message.guild.members.unban(userId);

      // Borrar el registro del baneo en la tabla 'bans'
      await query('DELETE FROM bans WHERE user_id = $1', [userId]);

      // Crear el embed de confirmación
      const unbanEmbed = new EmbedBuilder()
        .setTitle('<a:7621hypesquadeventsanimation:1287542126237847622> Usuario Desbaneado')
        .setDescription(`<a:7checkbox:1287542421386690570> | El usuario ha sido desbaneado correctamente.`)
        .setColor('Green')
        .addFields(
          { name: '<:discordcopyid:1287542182080679997> Usuario', value: `${bannedUser.user.tag} (${bannedUser.user.id})`, inline: true },
          { name: '<a:9755discordstaffanimated:1287542237571321896> Moderador', value: `${message.author.tag}`, inline: true }
        )
        .setTimestamp();

      // Enviar el embed de confirmación
      return message.channel.send({ embeds: [unbanEmbed] });
    } catch (error) {
      console.error('Error al desbanear:', error);
      return message.reply(`<a:denyxbox:1287542408082358292> | Hubo un error al intentar desbanear al usuario con ID ${userId}.`);
    }
  },
};

module.exports.help = {
  name: 'unban',
  description: 'Desbanea a un miembro del servidor.',
  usage: 'unban <user id>',
};  
