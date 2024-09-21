const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cry',
    description: 'Expresa que estás llorando con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de llorar (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Crear embed para el llanto
        const cryEmbed = new EmbedBuilder()
            .setColor(0x1E90FF)
            .setTitle('😭 ¡Estoy llorando! 😭')
            .setDescription(`${message.author} está llorando.`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [cryEmbed] });
    },
};
