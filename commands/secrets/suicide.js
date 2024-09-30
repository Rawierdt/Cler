const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'suicide',
    description: 'Expresa que te vas con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de llorar (puedes agregar más enlaces)
        const gifs = [
            'https://64.media.tumblr.com/fcdf3f549d4384772e2cea76df511b4f/tumblr_ngqx4yFrQs1u64c3bo1_500.gif',
            'https://i.pinimg.com/originals/9e/18/d2/9e18d2eed4b2559f44ddf5e22af45401.gif',
            'https://media.tenor.com/Rem8S4Y3o8sAAAAM/anime-suicide.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Crear embed para el llanto
        const sleepEmbed = new EmbedBuilder()
            .setColor(0x1E90FF)
            .setTitle('💤 bye, bye... 💤')
            .setDescription(`${message.author} está durmiendo.`)
            .setImage(randomGif)
            .setFooter({ text: "● Comando Secreto 2/6 ● " });

            message.channel.send({ embeds: [sleepEmbed] });
    },
};
