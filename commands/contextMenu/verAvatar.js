const { SlashCommandBuilder, ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Ver Avatar')
    .setType(ApplicationCommandType.User),
  async executeContextMenu(interaction) {
    const user = interaction.targetUser;

    await interaction.deferReply();

    const avatarEmbed = new EmbedBuilder()
      .setColor(0x00AE86)
      .setTitle(`${user.username}'s Avatar`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setTimestamp()
      .setFooter({ text: 'Solicitado por ' + interaction.user.tag, iconURL: interaction.user.displayAvatarURL() });

    await interaction.editReply({ embeds: [avatarEmbed] });
  },
};
