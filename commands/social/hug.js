const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'hug',
    description: 'Envía un abrazo a otro usuario con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de abrazos (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
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
            .setTitle('¡Abrazo!')
            .setDescription(`${message.author} le ha dado un abrazo a ${user}! 🤗`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [abrazoEmbed] });
    },
};
