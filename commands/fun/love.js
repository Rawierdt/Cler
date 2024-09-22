const { EmbedBuilder } = require('discord.js');
let color = process.env.COLOR;
let dev = process.env.DEV;

module.exports = {
    name: "love",
    description: "love your match",
    aliases: ["love"],
    async executePrefix(client, message, args) {
        let users = message.mentions.users.first();
        if (!users) return message.reply("Menciona a alguien por favor! :heartpulse:");
        if (users === message.author) return message.channel.send(":heart_exclamation: **El amor por ti mismo es infinito, comparte un poco** :heart_exclamation:");
        if (users === client.user) return message.channel.send("**Lo siento, pero no eres de mi agrado >n<** :sob:");

        const random = Math.floor(Math.random() * 100);
        let heard = "";
        if (random < 10) {
            heard = ':woman_gesturing_no: **Negativo** *No son compatibles en lo absoluto, será mejor dar la vuelta y continuar el recorrido...* :woman_gesturing_no:';
        } else if (random < 40) {
            heard = ':broken_heart: *Podrían perfectamente ser amigos, pero solo eso...* :broken_heart:';
        } else if (random < 75) {
            heard = ':heart: *Podrían intentarlo, aunque como mejores amigos será lo suficiente...* :heart:';
        } else if (random < 101) {
            heard = ':sparkling_heart: **Son perfectamente compatibles, su relación podría durar varios años...** :sparkling_heart:';
        }

        let resp = [
            `El porcentaje de ${message.author.username} & ${users.username} es:`,
            `Según el Tarot ${message.author.username} & ${users.username} son un:`,
            `Yo calculo que ${message.author.username} & ${users.username} da un:`,
            `Según mis cálculos ${message.author.username} & ${users.username} da un:`,
            `Según mi calculadora ${message.author.username} & ${users.username} son un:`,
            `Me ví Euphoria y en ningun momento ${message.author.username} & ${users.username} son un:`,
            `Según mis algoritmos ${message.author.username} & ${users.username} es:`,
            `Según Elon Mox ${message.author.username} & ${users.username} son un:`,
            `${message.author.username} & ${users.username} son un (*¿Qué?, esperabas un chiste?*):`,
            `I asked to my ears and they told me that ${message.author.username} & ${users.username} is:`,
            `De acuerdo con San Javascript ${message.author.username} & ${users.username} es:`,
            `Si 2 + 2 son 4 porqué ${message.author.username} & ${users.username} son un:`,
            `Los astros me indican que ${message.author.username} & ${users.username} son un:`,
            `Según Afrodita ${message.author.username} & ${users.username} son:`,
            `Le pregunte a Messi y dice que ${message.author.username} & ${users.username} son un:`,
            `Según mi programador ${message.author.username} & ${users.username} son un:`,
            `AYUDAA!!!, me olbigan a calcular que ${message.author.username} & ${users.username} son un:`,
            `Según la diosa Ixchel dice que ${message.author.username} & ${users.username} son:`,
            `ChatGPT dicen que ${message.author.username} & ${users.username} son un:`,
            `Le pregunté a mi *inserte_texto_aqui* y dice que ${message.author.username} & ${users.username} es:`,
            `A mi parecer ${message.author.username} & ${users.username} son un:`
        ];
        let msg = resp[Math.floor(Math.random() * resp.length)];

        const embed = new EmbedBuilder()
            .setTitle('Nombre del ship: ' + message.author.username.slice(0, -2) + users.username.slice(2))
            .setAuthor({ name: `${msg}` })
            .setThumbnail("https://c.tenor.com/VhFHg1pUQRcAAAAC/heart-emoji.gif")
            .setFooter({ text: "Love · Cler", iconURL: message.author.displayAvatarURL() })
            .setDescription(`${random} % ${heard}`)
            .setColor(0xff4d4d);

        message.reply({ embeds: [embed] });
    }
};
