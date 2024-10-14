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
                { name: "❯ <a:activedeveloperbadgeanimated:1287542344329203813> Dev", value: dev, inline: true },
                { name: "❯ <:onlinedesktop:1287542114124828812> Prefix", value: "c!", inline: true },
                { name: "❯ <:useapps:1287542291078189140> Versión", value: "v4.8.20", inline: true },
                { name: "❯ <a:9755discordstaffanimated:1287542237571321896> Artista de la imagen", value: "kureihii", inline: true },
                { name: "❯ <a:9755discordstaffanimated:1287542237571321896> Artista de las cartas", value: "Karite-Kita-Neko", inline: true },
                { name: "❯ <:765discordinfowhitetheme:1287542268328280197> Soundtrack", value: "[Eight Beat Berserker ー KISIDA KYODAN & THE AKEBOSI ROCKETS](https://www.youtube.com/watch?v=PWbg7ShjOPk)", inline: true },
                { name: "❯ <:765discordinfowhitetheme:1287542268328280197> Voces TTS", value: "Amazon AWS Polly", inline: true },
                { name: "❯ <:premiumbot:1287542278478368879> Precio", value: "Gratis por siempre desde 2020", inline: true },
                { name: "❯ <:completedaquest:1287542357083820096> Otros links", value: "[Invitar](https://discord.com/api/oauth2/authorize?client_id=774150617546883073&permissions=8&scope=bot) | [GitHub](https://github.com/Rawierdt) | [Web](https://bit.ly/3Jze6DI) | [Donar](https://www.paypal.me/nexdrak)", inline: true }
            );

        message.reply({ embeds: [embedDatos] });
    }
};
