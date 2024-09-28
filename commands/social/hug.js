const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hug',
    description: 'Envía un abrazo a otro usuario con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de abrazos (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
            'https://64.media.tumblr.com/2be3818398fa62f2aff108e8f73618bb/tumblr_nvrggbVi5I1rw7ngmo1_500.gif',
            'https://i.gifer.com/Txh9.gif',
            'https://64.media.tumblr.com/f2a878657add13aa09a5e089378ec43d/tumblr_n5uovjOi931tp7433o1_500.gif',
            'https://i0.wp.com/drunkenanimeblog.com/wp-content/uploads/2018/03/tenor.gif',
            'https://i.pinimg.com/originals/23/4d/47/234d471b1068bc25d435c607224454c9.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Verificar si se mencionó a un usuario
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Por favor, menciona a un usuario para abrazar.');
        }

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === message.author.id) {
            return message.reply('¡No puedes abrazarte a ti mismo!, seria muy triste 😥');
        }
        if (user.id === message.client.user.id) {
            return message.reply('¡Lo siento, pero no me gustan los abrazos 😔!');
        }

        // Crear embed para el abrazo
        const abrazoEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('<a:61623heartbeat:1287542624588267642> ¡Abrazo! <a:61623heartbeat:1287542624588267642>')
            .setDescription(`${message.author} le ha dado un abrazo a ${user}! 🤗`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [abrazoEmbed] });
    },
};
