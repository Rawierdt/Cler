const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'say',
    description: 'Permite a un administrador hacer que el bot diga algo en un canal específico.',
    async executePrefix(client, message, args) {
        // Verificar si el mensaje proviene de un servidor
        if (!message.guild) {
            return message.channel.send('<a:denyxbox:1287542408082358292> | Este comando solo puede usarse en un servidor.');
        }

        // Verificar si el usuario tiene permisos de administrador
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply('<a:denyxbox:1287542408082358292> | Lo siento, necesitas permisos de administrador para usar este comando.');
        }

        // Verificar si hay un mensaje para decir
        if (!args.length) {
            return message.reply('Por favor, proporciona un mensaje para que el bot lo diga.');
        }

        // Obtener el canal si se especifica
        let targetChannel = message.mentions.channels.first();
        if (targetChannel) {
            // Verificar si el canal pertenece a la misma guild
            if (targetChannel.guild.id !== message.guild.id) {
                return message.reply('<a:denyxbox:1287542408082358292> | No puedes usar este comando en canales de otra guild.');
            }
            args.shift(); // Eliminar la mención del canal de los argumentos
        } else {
            targetChannel = message.channel; // Usar el canal actual si no se especifica otro
        }

        // Unir los argumentos en una sola cadena de texto
        const sayMessage = args.join(' ');

        // Eliminar el comando del mensaje del usuario
        message.delete().catch(err => console.error(err));

        // Enviar el mensaje como el bot en el canal especificado
        targetChannel.send(sayMessage);
    },
};