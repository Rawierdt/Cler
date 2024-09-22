const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'bored',
    description: 'Expresa que estás aburrido con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        const gifs = [
            "https://c.tenor.com/viSO9tBe6SkAAAAC/bored-school.gif", //Introducimos el link del gif
            "https://c.tenor.com/_iJmK8Aic14AAAAd/bored-anime.gif", 
            "https://c.tenor.com/viXhLyvelpkAAAAM/tanaka-kun-sleepy.gif", 
            "https://c.tenor.com/UPzGJqrb8NEAAAAM/work-tired.gif",
            "https://c.tenor.com/KsASo3twwLUAAAAM/tired-loli.gif",
            "https://c.tenor.com/xsPCCkmOdzMAAAAC/bored-anime.gif",
            "https://c.tenor.com/aWk5RrGSa2AAAAAM/bored-misato.gif",
            "https://c.tenor.com/GZ6DChVZgWsAAAAd/kon-bored.gif",
            "https://c.tenor.com/FMAb_ivzA9AAAAAd/sad-bored.gif",
            "https://c.tenor.com/HwTVxkb7a-4AAAAd/lazy-anime.gif"
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        const boredEmbed = new EmbedBuilder()
            .setColor(0xbb0104)
            .setTitle('😴 ¡Estoy aburrido! 😴')
            // .setDescription(`${message.author} está aburrido.`)
            .setDescription(
                "<" +
                "@" +
                `${message.author}` +
                ">" +
                "  se aburré  " +
                " :sleepy:"
                )
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [boredEmbed] });
    },
};
