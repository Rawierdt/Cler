module.exports = {
    name: 'dm',
    description: 'Envía un mensaje directo a un usuario.',
    aliases: ['dm'],
    async executePrefix(client, message, args) {
        const allowedId = '165598561675771904';
        const author = `${message.author}`;

        // Verificar si el autor del mensaje tiene el ID permitido
        if (message.author.id !== allowedId) {
            return message.channel.send(`${author} **:x: | Te atrapé!**`);
        }

        if (message.deletable) message.delete();

        // Obtener el mensaje sin la mención
        const mentionMessage = args.slice(1).join(' ');

        // Intentar obtener el usuario mencionado
        const mentiondm = message.mentions.users.first();
        
        // Si no se menciona a nadie, intenta obtener el ID del primer argumento
        let targetUser;
        if (mentiondm) {
            targetUser = mentiondm;
        } else if (args.length > 0) {
            const userId = args[0]; // Asumimos que el primer argumento es el ID
            targetUser = await client.users.fetch(userId).catch(() => null);
        }

        // Si se encontró el usuario, enviar el mensaje
        if (targetUser) {
            targetUser.send(mentionMessage);
        } else {
            message.channel.send(`${author} **:x: | No se pudo enviar el mensaje. Asegúrate de mencionar a un usuario o de usar un ID válido.**`);
        }
    },
};
