const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'jumbo',
    description: 'Envía el emoji del server pero en grande.',
    aliases: ['jumbo'],
    async executePrefix(message, args) {
        if (!args[0]) {
            return message.reply(":x: | Ingresa un emoji");
        }

        let emoji = message.guild.emojis.cache.find(x => x.name === args[0].split(":")[1]);
        if (!emoji) {
            return message.reply(':x: | ¿Emoji?, Recuerda que solo emojis del servidor');
        }

        const embed = new EmbedBuilder()
            .setImage(emoji.url);

        message.reply({ embeds: [embed] });
    },
};
