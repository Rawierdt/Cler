const { PermissionsBitField, EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'clsbc',
    description: 'Envía un mensaje embed personalizado.',
    async executePrefix(client, message, args) {
        const ownerId = '165598561675771904';

        if (message.author.id !== ownerId) {
            return message.reply('Solo el owner puede usar este comando.');
        }

        if (args.length < 2) {
            return message.reply('Formato: `bc "Título" {Descripción} {URL de imagen opcional}`.');
        }

        // Extraer título entre comillas
        const titleMatch = args.join(' ').match(/^"(.+?)"/);
        if (!titleMatch) {
            return message.reply('Por favor, encierra el título entre comillas.');
        }
        const title = titleMatch[1];

        // Remover título de los argumentos
        args = args.join(' ').replace(/^"(.+?)"\s*/, '').split(' ');

        // Detectar si la última parte es una URL de imagen
        const isImageUrl = url => /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
        let imageUrl = null;
        if (isImageUrl(args[args.length - 1])) {
            imageUrl = args.pop();
        }

        const description = args.join(' ');

        // Prioridad de nombres de canales
        const channelPriority = ['general', 'comandos', 'commands', 'bots', 'bot'];

        const guilds = client.guilds.cache;
        let successCount = 0;
        let errorCount = 0;

        for (const guild of guilds.values()) {
            try {
                let targetChannel = null;

                for (const channelName of channelPriority) {
                    targetChannel = guild.channels.cache.find(
                        channel =>
                            channel.name === channelName &&
                            channel.isTextBased() &&
                            channel.permissionsFor(client.user).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages])
                    );
                    if (targetChannel) break;
                }

                if (!targetChannel) {
                    targetChannel = guild.channels.cache.find(
                        channel =>
                            channel.isTextBased() &&
                            channel.permissionsFor(client.user).has([PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages])
                    );
                }

                if (!targetChannel) {
                    errorCount++;
                    console.warn(`No se pudo enviar mensaje en "${guild.name}".`);
                    continue;
                }

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
                    embed.setImage(imageUrl);
                }

                await targetChannel.send({ embeds: [embed] });
                successCount++;
            } catch (error) {
                errorCount++;
                console.error(`Error en "${guild.name}":`, error);
            }
        }

        message.reply(`Se enviaron mensajes a ${successCount} servidores. Errores en ${errorCount} servidores.`);
    },
};
