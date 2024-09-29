const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: "capybara",
    description: "capybara embed",
    aliases: ["capybara"],
    async executePrefix(client, message, args) {
        if (message.deletable) message.delete();
        const embed = new EmbedBuilder()
            .setImage('https://i.redd.it/coz72i73uf881.jpg')
            .setColor(0x5e10f8)
            .setFooter({ text: "● Comando Secreto 1/10 ● " });

        message.channel.send({ embeds: [embed] });
    }
};
