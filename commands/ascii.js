const { EmbedBuilder } = require('discord.js');
const figlet = require('figlet');
let color = process.env.COLOR;
let dev = process.env.DEV;

module.exports = {
    name: "ascii",
    description: "Convierte el texto ingresado en arte ASCII",
    aliases: ["ascii"],
    async executePrefix(client, message, args) {
        if (!args[0]) return message.reply(":x: | Ingresa un texto");
        if (args.join(" ").length > 15) return message.reply(":x: | El texto no puede contener más de 15 caracteres");

        figlet(args.join(" "), (err, data) => {
            if (err) {
                console.log('Algo salió mal con figlet');
                console.dir(err);
                return;
            }
            const embed = new EmbedBuilder()
                .setColor(color || '#0099ff')
                .setDescription("```" + data + "```");

            message.reply({ embeds: [embed] });
        });
    }
};
