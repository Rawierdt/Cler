module.exports = {
    name: 'dm',
    description: 'only staff',
    aliases: ['dm'],
    async executePrefix(message, args) {
        const allowedId = '165598561675771904';
        const author = `${message.author}`;
        
        // Verificar si el autor del mensaje tiene el ID permitido
        if (message.author.id !== allowedId) {
            return message.channel.send(`${author} **:x: | Te atrapé!**`);
        }
        
        if (message.deletable) message.delete();
        
        const mentiondm = message.mentions.users.first();
        const mentionMessage = args.join(' '); // Usar args para obtener el mensaje sin la mención
        
        if (mentiondm) {
            mentiondm.send(mentionMessage);
        } else {
            message.channel.send(`${author} **:x: | No se pudo enviar el mensaje.**`);
        }
    },
};
