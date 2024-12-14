const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Traducir')
    .setType(ApplicationCommandType.Message),
  async executeContextMenu(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const message = interaction.targetMessage;

    try {
      const response = await fetch(
        `https://api.allorigins.win/raw?url=${encodeURIComponent(
          `http://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(message.content)}`
        )}`
      );

      const translationData = await response.json();
      const translation = translationData[0][0][0];

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Traducción')
        .addFields(
          { name: 'Texto original', value: message.content || 'Texto vacío' },
          { name: 'Traducción', value: translation || 'No se pudo traducir.' }
        )
        .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('Error al traducir:', error);
      await interaction.editReply({ content: 'No se pudo traducir el mensaje. Intenta nuevamente más tarde.' });
    }
  },
};
