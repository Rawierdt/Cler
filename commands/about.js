const { EmbedBuilder } = require('discord.js');
let dev = process.env.DEV;

module.exports = {
    name: "about",
    description: "Acerca de Cler",
    aliases: ["about"],
    async executePrefix(client, message, args) {
        const embedDatos = new EmbedBuilder()
            .setTitle("**✿ Acerca de Cler ✿**")
            .setColor(0xC6EB0E)
            .setDescription("Cler es una bot en español multipropósitos, moderación, diversión y aprendizaje acerca de temas relacionados, *Cler recibe actualizaciones gratuitas el 20 de cada mes*.")
            .setThumbnail(client.user.avatarURL())
            .setFooter({ text: "Tengo frio..." })
            .addFields(
                { name: "❯ Creator/Dev", value: dev, inline: true },
                { name: "❯ Prefix", value: "c!", inline: true },
                { name: "❯ Versión", value: "v4.6.2", inline: true },
                { name: "❯ Artista de la imagen", value: "kureihii", inline: true },
                { name: "❯ Artista de las cartas", value: "Karite-Kita-Neko", inline: true },
                { name: "❯ Soundtrack", value: "[Eight Beat Berserker ー KISIDA KYODAN & THE AKEBOSI ROCKETS](https://www.youtube.com/watch?v=PWbg7ShjOPk)", inline: true },
                { name: "❯ Voces TTS", value: "Amazon AWS Polly", inline: true },
                { name: "❯ Otros links", value: "[Invitar](https://discord.com/api/oauth2/authorize?client_id=774150617546883073&permissions=8&scope=bot) | [GitHub](https://github.com/Rawierdt) | [Web](https://bit.ly/3Jze6DI) | [Donar](https://www.paypal.me/nexdrak)", inline: true }
            );

        message.reply({ embeds: [embedDatos] });
    }
};
