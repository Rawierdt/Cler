const { EmbedBuilder } = require('discord.js');

function generatePassword(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=";
    let password = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        password += charset[randomIndex];
    }
    return password;
}

let color = process.env.COLOR;
let dev = process.env.DEV;

module.exports = {
    name: "passwd",
    description: "Genera una contraseña segura",
    aliases: ["genpass", "password", "pass"],
    async executePrefix(client, message, args) {
        if (!args[0] || isNaN(args[0]) || args[0] <= 0) {
            return message.reply(":x: | Por favor, ingresa un número válido para la longitud de la contraseña.");
        }

        const length = parseInt(args[0]);
        const password = generatePassword(length);

        const embed = new EmbedBuilder()
            .setColor(0x5e10f8)
            .setTitle("Contraseña Segura Generada")
            .setDescription("```" + password + "```")
            .setFooter({ text: "● Comando Secreto 2/10 ● " });

        message.reply({ embeds: [embed] });
    }
};
