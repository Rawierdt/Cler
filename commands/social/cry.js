const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'cry',
    description: 'Expresa que estás llorando con un GIF aleatorio.',
    async executePrefix(client, message, args) {
        // Lista de enlaces de GIFs de llorar (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
            'https://i.pinimg.com/originals/0f/7b/43/0f7b43b390702ac6b3280a8999f38b2d.gif',
            'https://i.pinimg.com/originals/10/84/48/108448f2b373e79f243d609dfde99a13.gif',
            'https://i.pinimg.com/originals/b9/01/6c/b9016c33357dc0589090e0d1eaf957e7.gif',
            'https://i.pinimg.com/originals/2a/83/6d/2a836d4b367c44e7c8675da5b860b691.gif',
            'https://gifdb.com/images/high/miss-kobayashi-kanna-kamui-anime-girl-crying-4njt5cp77q06fwoc.gif',
            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNzJhMnl1NjBhY3h3dHBkZWhsczk3NTBqNG9mZjVzeW5jMWduNHBwciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cxTOMfjEyMwNmu6de5/giphy.webp',
            'https://i.imgur.com/DHawcrE.gif',
            'https://i.pinimg.com/originals/d4/96/7f/d4967fd1672fecb50f7f7c400ddef92c.gif',
            'https://i.pinimg.com/originals/84/fd/c8/84fdc85a9869baf84a32465e5331a71e.gif',
            'https://i.makeagif.com/media/9-11-2015/vCJp92.gif'
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
