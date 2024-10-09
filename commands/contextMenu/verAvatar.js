const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

// contextAvatar.js
module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Ver Avatar')
    .setType(ApplicationCommandType.User),
  async executeContextMenu(interaction) {
    const user = interaction.targetUser;

    // Deferir la respuesta para evitar el timeout
    await interaction.deferReply();

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x00AE86) // Color del embed
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 })) // Muestra el avatar
      .setTimestamp()
      .setFooter({ text: 'Solicitado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    // Editar la respuesta diferida con el embed
    await interaction.editReply({ embeds: [avatarEmbed] });
  },
};
