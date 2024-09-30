const { EmbedBuilder } = require('discord.js');
let color = "5e10f8";  // O usa parseInt("5e10f8", 16) si prefieres el valor numérico
let dev = process.env.DEV;

module.exports = {
    name: "fc",
    description: "happy birthday embed",
    aliases: ["fc"],
    async executePrefix(client, message, args) {
        if (message.deletable) message.delete();

        // Verificar si se menciona a alguien
        const mentionedUser = message.mentions.users.first();
        if (!mentionedUser) {
            return message.reply("Por favor, menciona a alguien para desearle un feliz cumpleaños.");
        }

        // Crear el embed
        const embed = new EmbedBuilder()
            .setTitle(`${mentionedUser.username}! Feliz cumpleaños!`)
            .setDescription(`🎁 Asegúrate de desearle un excelente día y darle un fuerte abrazo.\n <a:lf:1289409156754702417> <a:le:1289409008922263584> <a:ll:1289408851891720264> <a:li:1289409215613505608> <a:lz:1289409226694856768> | <a:lc:1289408784044920956> <a:lu:1289409274530889802> <a:lm:1289409204079300729> <a:lp:1289409084138852484> <a:ll:1289408851891720264> <a:le:1289409008922263584>`)
            .setImage('https://cdn.discordapp.com/attachments/663931999798689843/1287276732541435998/image.png')
            .setColor(0xffff00)
            .setFooter({ text: "● Comando Secreto 4/6 ● " });

        // Responder con el embed
        message.channel.send({ embeds: [embed] });
    }
};
