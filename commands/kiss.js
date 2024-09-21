const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kiss',
    description: 'Envía un beso a otro usuario con un GIF aleatorio.',
    async executePrefix(message, args) {
        // Lista de enlaces de GIFs de besos (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
            'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif',
            'https://media.giphy.com/media/11k3oaUjSlFR4I/giphy.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Verificar si se mencionó a un usuario
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Por favor, menciona a un usuario para besar.');
        }

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === message.author.id) {
            return message.reply('¡No puedes besarte a ti mismo!, seria raro 😨');
        }
        if (user.id === message.client.user.id) {
            return message.reply('¡Lo siento, pero me negaré esta vez 😔!');
        }

        // Crear embed para el beso
        const besoEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('¡Beso!')
            .setDescription(`${message.author} le ha dado un beso a ${user}! 😘`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [besoEmbed] });
    },
};
