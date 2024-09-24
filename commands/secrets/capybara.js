const { EmbedBuilder } = require('discord.js');
let color = "5e10f8";  // O usa parseInt("5e10f8", 16) si prefieres el valor numérico
let dev = process.env.DEV;

module.exports = {
    name: "capybara",
    description: "capybara embed",
    aliases: ["capybara"],
    async executePrefix(client, message, args) {
        if (message.deletable) message.delete();
        const embed = new EmbedBuilder()
            .setImage('https://i.redd.it/coz72i73uf881.jpg')
            .setColor(color)
            .setFooter({ text: "● Comando Secreto 1/10 ● " });

        message.reply({ embeds: [embed] });
    }
};
