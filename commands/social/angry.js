const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'angry',
    description: 'Expresa que estás enojado con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        const gifs = [
            "https://c.tenor.com/kaRCm9ELxKgAAAAC/menhera-chan-chibi.gif", // Introducimos el link del gif
            "https://c.tenor.com/ikKAd57zDEwAAAAM/anime-mad.gif", 
            "https://c.tenor.com/X3x3Y2mp2W8AAAAM/anime-angry.gif", 
            "https://c.tenor.com/NDmpWRgns9cAAAAC/angry-dog-noises.gif",
            "https://c.tenor.com/MFE4gVXHNJMAAAAC/angry-anime.gif",
            "https://c.tenor.com/b76QnX1XVAcAAAAM/raiva-anime.gif",
            "https://c.tenor.com/h5FyOBwghNgAAAAM/nagataro-ijiranaide-nagatoro.gif",
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        const angryEmbed = new EmbedBuilder()
            .setColor(0xbb0104)
            .setTitle('😡 ¡Estoy enojado! 😡')
            .setDescription(`${message.author} está furioso.`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [angryEmbed] });
    },
};
