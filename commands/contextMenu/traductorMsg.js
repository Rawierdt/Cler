const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName('Traducir')
    .setType(ApplicationCommandType.Message),
  async executeContextMenu(interaction) {
    await interaction.deferReply();

    const message = interaction.targetMessage;
    const maxLength = 500;

    try {
      const splitText = (text, maxLength) => {
        const regex = new RegExp(`.{1,${maxLength}}`, 'g');
        return text.match(regex);
      };

      const translateText = async (text, targetLanguage) => {
        const response = await fetch(
          `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`
        );
        const translationData = await response.json();
        return translationData[0][0][0];
      };

      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=es&dt=t&q=${encodeURIComponent(message.content)}`
      );

      const translationData = await response.json();
      const detectedLanguage = translationData[2]; // Idioma detectado

      let targetLanguage = 'es';
      if (detectedLanguage === 'es') {
        targetLanguage = 'en';
      }

      const textParts = splitText(message.content, maxLength);
      const translatedPartsPromises = textParts.map(part => translateText(part, targetLanguage));
      const translatedParts = await Promise.all(translatedPartsPromises);
      const finalTranslation = translatedParts.join(' ');

      const embed = new EmbedBuilder()
        .setColor(0x0099ff)
        .setTitle('Traducción')
        .addFields(
          { name: 'Texto original', value: message.content || 'Texto vacío' },
          { name: 'Traducción', value: finalTranslation || 'No se pudo traducir.' }
        )
        .setFooter({ text: `Solicitado por ${interaction.user.tag}` })
        .setTimestamp();

      const reply = await interaction.editReply({ embeds: [embed] });

      setTimeout(() => {
        reply.delete().catch(console.error);
      }, 30000);
      
    } catch (error) {
      console.error('Error al traducir:', error);
      await interaction.editReply({ content: 'No se pudo traducir el mensaje. Intenta nuevamente más tarde.' });
    }
  },
};
