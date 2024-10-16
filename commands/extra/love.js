const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
let color = process.env.COLOR;
let dev = process.env.DEV;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('love')
        .setDescription('💘 Calcula tu compatibilidad amorosa.')
        .addUserOption(option =>
            option.setName('user')
                .setDescription('Usuario con el que quieres hacer match')
                .setRequired(true)),
    async executeSlash(interaction) {
        const user = interaction.options.getUser('usuario');

        if (user.id === interaction.user.id) {
            return interaction.reply("<a:heartarrow_purple:1287542898266607669> **El amor por ti mismo es infinito, comparte un poco** <:73433caringhand:1287542803861213247>");
        }

        if (user.id === interaction.client.user.id) {
            return interaction.reply("**Lo siento, pero no eres de mi agrado >n<** :sob:");
        }

        const random = Math.floor(Math.random() * 100);
        let heard = '';
        if (random < 10) {
            heard = ':woman_gesturing_no: **Negativo** *No son compatibles en lo absoluto, será mejor dar la vuelta y continuar el recorrido...* :woman_gesturing_no:';
        } else if (random < 40) {
            heard = '<:4912brokenheart:1287542928062943374> *Podrían perfectamente ser amigos, pero solo eso...* <:4912brokenheart:1287542928062943374>';
        } else if (random < 75) {
            heard = '<:mileyheart:1287542639805075518> *Podrían intentarlo, aunque como mejores amigos será lo suficiente...* <:mileyheart:1287542639805075518>';
        } else {
            heard = ':sparkling_heart: **Son perfectamente compatibles, su relación podría durar varios años...** :sparkling_heart:';
        }

        let responses = [
            `El porcentaje de ${interaction.user.username} & ${user.username} es:`,
            `Según el Tarot ${interaction.user.username} & ${user.username} son un:`,
            `Yo calculo que ${interaction.user.username} & ${user.username} da un:`,
            `Según mis cálculos ${interaction.user.username} & ${user.username} da un:`,
            `Según mi calculadora ${interaction.user.username} & ${user.username} son un:`,
            `Según los astros, ${interaction.user.username} & ${user.username} son un:`
        ];
        let msg = responses[Math.floor(Math.random() * responses.length)];

        const embed = new EmbedBuilder()
            .setTitle(`Nombre del ship: ${interaction.user.username.slice(0, -2) + user.username.slice(2)}`)
            .setAuthor({ name: `${msg}` })
            .setThumbnail("https://i.ibb.co/C5PnW62/6c8944a7fcaade2713616a936686e29d.gif")
            .setFooter({ text: "Love · Cler", iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`${random} % ${heard}`)
            .setColor(0xff4d4d);

        await interaction.reply({ embeds: [embed] });
    }
};
