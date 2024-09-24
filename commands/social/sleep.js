const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'sleep',
    description: 'Expresa que estás durmiendo con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de llorar (puedes agregar más enlaces)
        const gifs = [
            'https://steamuserimages-a.akamaihd.net/ugc/787484160771567432/6462D89153618A33ACE1808FBFEC20D2F230AE49/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false',
            'https://s7.gifyu.com/images/anime-sleep-gif-6.gif',
            'https://i.gifer.com/XLJA.gif',
            'https://64.media.tumblr.com/537da419ae6e168acef58271f164a100/tumblr_nttioin8Hn1tmbw34o1_500.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Crear embed para el llanto
        const sleepEmbed = new EmbedBuilder()
            .setColor(0x1E90FF)
            .setTitle('💤 ¡Que sueño! 💤')
            .setDescription(`${message.author} está durmiendo.`)
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [sleepEmbed] });
    },
};
