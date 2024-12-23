const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clsbc',
    description: 'Permite al owner enviar un mensaje a todos los servidores donde esté el bot.',
    async executePrefix(client, message, args) {
        // ID del owner
        const ownerId = '165598561675771904';

        // Verificar si el usuario es el owner
        if (message.author.id !== ownerId) {
            return message.reply('<a:denyxbox:1287542408082358292> | Este comando solo puede ser usado por el owner del bot.');
        }

        // Verificar si hay argumentos (mensaje para enviar)
        if (!args.length) {
            return message.reply('Por favor, proporciona un mensaje o una URL de imagen para enviar a todos los servidores.');
        }

        // Unir los argumentos en un solo mensaje
        const broadcastMessage = args.join(' ');

        // Prioridad de nombres de canales
        const channelPriority = ['bots', 'bot', 'comandos', 'commands', 'general'];

        // Función para verificar si es una URL de imagen
        const isImageUrl = url => {
            return /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
        };

        // Recorrer todos los servidores del cliente
        const guilds = client.guilds.cache;
        let successCount = 0;
        let errorCount = 0;

        for (const guild of guilds.values()) {
            try {
                let targetChannel = null;

                // Buscar un canal según la prioridad
                for (const channelName of channelPriority) {
                    targetChannel = guild.channels.cache.find(
                        channel =>
                            channel.name === channelName &&
                            channel.isTextBased() &&
                            channel.permissionsFor(client.user).has(['ViewChannel', 'SendMessages'])
                    );
                    if (targetChannel) break; // Detener la búsqueda si encuentra un canal
                }

                // Si no se encuentra un canal en la lista, usar cualquier canal accesible
                if (!targetChannel) {
                    targetChannel = guild.channels.cache.find(
                        channel =>
                            channel.isTextBased() &&
                            channel.permissionsFor(client.user).has(['ViewChannel', 'SendMessages'])
                    );
                }

                // Si no hay un canal accesible, continuar con el siguiente servidor
                if (!targetChannel) {
                    errorCount++;
                    console.warn(`No se pudo enviar un mensaje en el servidor "${guild.name}".`);
                    continue;
                }

                // Verificar si el mensaje contiene una URL de imagen
                if (isImageUrl(broadcastMessage)) {
                    // Crear y enviar el embed con la imagen
                    const embed = new EmbedBuilder()
                        .setColor(0x00aeff)
                        .setImage(broadcastMessage)
                        .setFooter({ text: `Enviado por ${message.author.tag}`, iconURL: message.author.displayAvatarURL() });

                    await targetChannel.send({ embeds: [embed] });
                } else {
                    // Enviar el mensaje como texto plano
                    await targetChannel.send(broadcastMessage);
                }

                successCount++;
            } catch (error) {
                errorCount++;
                console.error(`Error al enviar mensaje en el servidor "${guild.name}":`, error);
            }
        }

        // Informar al owner sobre el resultado
        message.reply(
            `Se enviaron mensajes a ${successCount} servidores. Hubo errores en ${errorCount} servidores.`
        );
    },
};
