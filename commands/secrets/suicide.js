const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'suicide',
    description: 'Expresa que te vas con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de llorar (puedes agregar más enlaces)
        const gifs = [

            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Crear embed para el llanto
        const sleepEmbed = new EmbedBuilder()
            .setColor(0x1E90FF)
            .setTitle('💤 bye, bye... 💤')
            .setDescription(`${message.author} está durmiendo.`)
            .setImage(randomGif)
            .setFooter({ text: "● Comando Secreto 4/10 ● " });

        message.reply({ embeds: [sleepEmbed] });
    },
};
