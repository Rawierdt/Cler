const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

// avatar.js
module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('Muestra el avatar de un usuario.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('El usuario del que deseas ver el avatar.')),

  name: 'avatar', // Nombre para comandos con prefijo
  description: 'Muestra el avatar de un usuario.',

  async executeSlash(interaction) {
    const user = interaction.options.getUser('user') || interaction.user; // Si no se proporciona un usuario, usa el que ejecutó el comando
    
    const avatarEmbed = new EmbedBuilder()
      .setColor(0x00AE86) // Color del embed
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 })) // Muestra el avatar
      .setTimestamp()
      .setFooter({ text: 'Solicitado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    await interaction.reply({ embeds: [avatarEmbed] });
  },

  async executePrefix(message, args) {
    const member = message.mentions.members.first() || message.member; // Si no se menciona a nadie, usa al que ejecutó el comando
    const avatarEmbed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`${member.user.username}'s Avatar <:flamespurple:1287542491200884736>`)
      .setImage(member.user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setTimestamp()
      .setFooter({ text: 'Solicitado por ' + message.author.tag, iconURL: message.author.displayAvatarURL() });

    await message.reply({ embeds: [avatarEmbed] });
  },
};
