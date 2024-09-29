const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'jumbo',
    description: 'Envía el emoji del server pero en grande.',
    aliases: ['jumbo'],
    async executePrefix(client, message, args) {
        if (!args[0]) {
            return message.reply("<a:denyxbox:1287542408082358292> | Ingresa un emoji");
        }

        let emoji = message.guild.emojis.cache.find(x => x.name === args[0].split(":")[1]);
        if (!emoji) {
            return message.reply('<a:denyxbox:1287542408082358292> | ¿Emoji?, Recuerda que solo emojis del servidor');
        }

        const embed = new EmbedBuilder()
            .setImage(emoji.url);

        message.reply({ embeds: [embed] });
    },
};
