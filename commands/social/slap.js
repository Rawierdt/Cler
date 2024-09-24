const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'slap',
    description: 'Abofetea a otro usuario con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de abrazos (puedes agregar más enlaces)
        const gifs = [
                "https://i.gifer.com/9Ky7.gif", //Introducimos el link del gif
                "https://i.gifer.com/8Z0s.gif", 
                "https://i.gifer.com/K06.gif", 
                "https://i.gifer.com/DjuN.gif", 
                "https://i.gifer.com/WpWp.gif", 
                "https://i.gifer.com/Et1g.gif", 
                "https://i.gifer.com/cCX.gif", 
                "https://c.tenor.com/t4YJbUwHSgQAAAAM/boob-slap.gif", 
                "https://c.tenor.com/l8xQkGbIuJwAAAAM/anime-slap.gif",
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Verificar si se mencionó a un usuario
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Por favor, menciona a un usuario para atacar.');
        }

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === message.author.id) {
            return message.reply('¡No puedes golpearte a ti mismo!, seria muy tonto 😄');
        }
        if (user.id === message.client.user.id) {
            return message.reply('¡Eso duele 😔!');
        }

        // Crear embed para el abrazo
        const slapEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('🤚🏻 ¡!!!!! 🤚🏻')
            .setDescription(`${message.author} le ha dado un golpe a ${user}! 🤗`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [slapEmbed] });
    },
};
