const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clsbc',
    description: 'Envía un mensaje embed personalizado a todos los servidores donde está el bot.',
    async executePrefix(client, message, args) {
        // ID del owner
        const ownerId = '165598561675771904';

        // Verificar si el usuario es el owner
        if (message.author.id !== ownerId) {
            return message.reply('<a:denyxbox:1287542408082358292> | Este comando solo puede ser usado por el owner del bot.');
        }

        // Verificar si hay suficientes argumentos
        if (args.length < 2) {
            return message.reply('Por favor, usa el formato `bc {título} {descripción} {URL de imagen opcional}`.');
        }

        // Detectar si la última parte es una URL de imagen
        const isImageUrl = url => /\.(jpeg|jpg|png|gif|webp)$/i.test(url);

        let imageUrl = null;
        if (isImageUrl(args[args.length - 1])) {
            imageUrl = args.pop(); // Extraer la URL de imagen
        }

        // El primer argumento es el título, el resto es la descripción
        const title = args.shift();
        const description = args.join(' ');

        // Prioridad de nombres de canales
        const channelPriority = ['general', 'comandos', 'commands', 'bots', 'bot'];

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
                            channel.permissionsFor(client.user).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages])
                    );
                    if (targetChannel) break; // Detener la búsqueda si encuentra un canal
                }

                // Si no se encuentra un canal en la lista, usar cualquier canal accesible
                if (!targetChannel) {
                    targetChannel = guild.channels.cache.find(
                        channel =>
                            channel.isTextBased() &&
                            channel.permissionsFor(client.user).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages])
                    );
                }

                // Si no hay un canal accesible, continuar con el siguiente servidor
                if (!targetChannel) {
                    errorCount++;
                    console.warn(`No se pudo enviar un mensaje en el servidor "${guild.name}".`);
                    continue;
                }

                // Crear y enviar el embed
                const embed = new EmbedBuilder()
                    .setColor(0x00aeff)
                    .setTitle(title)
                    .setDescription(description)
                    .setTimestamp()
                    .setFooter({
                        text: client.user.username,
                        iconURL: client.user.displayAvatarURL()
                    });

                if (imageUrl) {
                    embed.setImage(imageUrl); // Agregar imagen si existe
                }

                await targetChannel.send({ embeds: [embed] });
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
