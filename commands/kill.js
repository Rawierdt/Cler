const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'kill',
    description: 'Desvives a otro usuario con un GIF aleatorio.',
    async executePrefix(message, args) {
        // Lista de enlaces de GIFs de abrazos (puedes agregar más enlaces)
        const gifs = [
            "http://pa1.narvii.com/5751/803ba83ee4101ad22bb57c9b54805937b9ead8aa_hq.gif", 
            "https://i.pinimg.com/originals/3c/ed/ee/3cedee4f8118855c83ea05463498f326.gif", 
            "https://thumbs.gfycat.com/ClassicSpectacularDoe-size_restricted.gif", 
            "https://c.tenor.com/-UbmVOLixPcAAAAC/killing-anime-girl.gif", 
            "https://i.pinimg.com/originals/6f/94/38/6f94382faa194f4db095d0201ccd2289.gif", 
            "https://pa1.narvii.com/6603/e63ca28a99b7302f6b86cdfa5845d1ae6dccd50a_hq.gif",
            "https://i.pinimg.com/originals/79/1f/4f/791f4f8ee82a2d11753eee904891e1bc.gif",
            "https://i.imgur.com/m8ZtlNO.gif",
            "https://c.tenor.com/VtahZzTm3gYAAAAd/yandere-roof.gif",
            "https://pa1.narvii.com/6325/070191683f9b53afee783d8233880fd397519935_hq.gif"
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Verificar si se mencionó a un usuario
        const user = message.mentions.users.first();
        if (!user) {
            return message.reply('Por favor, menciona a un usuario a desvivir.');
        }

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === message.author.id) {
            return message.reply('¡No puedes hacer eso!, seria muy catastrofico ☠️');
        }
        if (user.id === message.client.user.id) {
            return message.reply('¡Lo siento, pero soy immortal e invencible 😄!');
        }

        // Crear embed para el abrazo
        const killEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('¡Abrazo!')
            // .setDescription(`${message.author} le ha dado un abrazo a ${user}! 🤗`)
            .setDescription(
                "<" +
                "@" +
                `${message.author}` +
                ">" +
                "  m*tó a " +
                "<" +
                "@" +
                `${user}` +
                ">" +
                " :head_bandage::"
                )
            .setImage(randomGif)
            .setTimestamp();

        message.reply({ embeds: [killEmbed] });
    },
};
