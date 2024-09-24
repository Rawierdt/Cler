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
            .setTitle(`¡Feliz cumpleaños, ${mentionedUser.username}! 🎉`)
            .setImage('https://cdn.discordapp.com/attachments/663931999798689843/1287276732541435998/image.png')
            .setColor(color)
            .setFooter({ text: "● Comando Secreto 3/10 ● " });

        // Responder con el embed
        message.channel.send({ embeds: [embed] });
    }
};
