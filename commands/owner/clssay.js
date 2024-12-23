const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'clssay',
    description: 'Permite al owner hacer que el bot diga algo en un canal específico.',
    async executePrefix(client, message, args) {
        // ID del owner
        const ownerId = '165598561675771904';

        // Verificar si el usuario es el owner
        if (message.author.id !== ownerId) {
            return message.reply('<a:denyxbox:1287542408082358292> | Este comando solo puede ser usado por el owner del bot.');
        }

        // Verificar si hay argumentos (mensaje para enviar)
        if (!args.length) {
            return message.reply('Por favor, proporciona un mensaje para que el bot lo diga.');
        }

        let targetChannel;
        const channelId = args[0];

        // Verificar si se proporcionó un ID de canal válido
        if (client.channels.cache.has(channelId)) {
            targetChannel = client.channels.cache.get(channelId);
            args.shift(); // Eliminar el ID del canal de los argumentos
        } else {
            // Usar el canal actual si no se especificó un canal válido
            targetChannel = message.channel;
        }

        // Unir los argumentos restantes en una sola cadena de texto
        const sayMessage = args.join(' ');

        // Intentar enviar el mensaje al canal especificado
        try {
            await targetChannel.send(sayMessage);
            // Eliminar el comando del canal actual (opcional)
            if (message.channel.id !== targetChannel.id) {
                message.delete().catch(err => console.error('Error al eliminar el comando:', err));
            }
        } catch (error) {
            console.error('Error al enviar el mensaje:', error);
            return message.reply('<a:denyxbox:1287542408082358292> | Ocurrió un error al intentar enviar el mensaje. Asegúrate de que el bot tenga permisos en el canal especificado.');
        }
    },
};
