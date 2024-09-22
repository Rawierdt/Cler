const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'chiste',
    description: 'Muestra un chiste aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de chistes
        const chistes = [
            'https://i.ibb.co/Z6kk7g6/chiste1.png',
            'https://i.ibb.co/2c83cVd/chiste2.png',
            'https://i.ibb.co/Ntd8LjN/chiste3.png',
            'https://i.ibb.co/pfRVtkX/chiste4.png',
            'https://i.ibb.co/MDJDdxs/chiste5.png',
            'https://i.ibb.co/p2mNzbH/chiste6.png',
            'https://i.ibb.co/WcNttz5/chiste7.png',
            'https://i.ibb.co/Wn0YWc1/chiste8.png',
            'https://i.ibb.co/y4CFrgD/chiste9.png',
            'https://i.ibb.co/47CbNHc/chiste10.png',
            'https://i.ibb.co/DCtMwBk/chiste11.png',
            'https://i.ibb.co/ccFgHsK/chiste12.png',
            'https://i.ibb.co/RgdpKh3/chiste13.png',
            'https://i.ibb.co/C9F4Q24/chiste14.png',
            'https://i.ibb.co/wCb0RH4/chiste15.png',
            'https://i.ibb.co/xXjnz3Z/chiste16.png',
            'https://i.ibb.co/z7HR0sL/chiste17.png',
            'https://i.ibb.co/tHWcQyk/chiste18.png',
            'https://i.ibb.co/sKLGRhN/chiste19.png',
            'https://i.ibb.co/brSVwLZ/chiste20.png'
        ];
        const randomChiste = chistes[Math.floor(Math.random() * chistes.length)];
        // Crear embed para notificar al canal
        const chisteEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Chiste Aleatorio')
            .setImage(randomChiste)
            .setTimestamp();
        message.reply({ embeds: [chisteEmbed] });
    },
};
