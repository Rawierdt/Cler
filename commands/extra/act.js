const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const gifs = {
    kiss: [
        'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
        'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif',
        'https://media.giphy.com/media/11k3oaUjSlFR4I/giphy.gif',
        'https://i.gifer.com/YQzo.gif',
        'https://i.pinimg.com/originals/0b/39/ba/0b39ba7b0affa79d3d6eddbe5bea684a.gif',
        'https://d31xsmoz1lk3y3.cloudfront.net/games/imgur/eisk88U.gif',
        'https://i.pinimg.com/originals/13/06/73/1306732d3351afe642c9a7f6d46f548e.gif',
        'https://64.media.tumblr.com/ea7842aad07c00b098397bf4d00723c6/tumblr_n570yg0ZIv1rikkvpo1_500.gif',
    ],
    cry: [
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
    ],
    kill: [
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
    ],
    hug: [
        'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
        'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
        'https://64.media.tumblr.com/2be3818398fa62f2aff108e8f73618bb/tumblr_nvrggbVi5I1rw7ngmo1_500.gif',
        'https://i.gifer.com/Txh9.gif',
        'https://64.media.tumblr.com/f2a878657add13aa09a5e089378ec43d/tumblr_n5uovjOi931tp7433o1_500.gif',
        'https://i0.wp.com/drunkenanimeblog.com/wp-content/uploads/2018/03/tenor.gif',
        'https://i.pinimg.com/originals/23/4d/47/234d471b1068bc25d435c607224454c9.gif',
    ]
};

function getRandomColor() {
    // Genera un número hexadecimal aleatorio entre 0x000000 y 0xFFFFFF
    return Math.floor(Math.random() * 0xFFFFFF);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('act')
        .setDescription('Realiza acciones con GIFs.')
        .addSubcommand(subcommand =>
            subcommand
                .setName('kiss')
                .setDescription('😘 : Envía un beso a otro usuario.')
                .addUserOption(option =>
                    option.setName('usuario')
                    .setDescription('El usuario al que deseas besar')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('cry')
                .setDescription('😭 : Expresa que estás llorando.'))
        .addSubcommand(subcommand =>
            subcommand
                .setName('kill')
                .setDescription('🔪 : Envía un desvivir a otro usuario.')
                .addUserOption(option =>
                    option.setName('usuario')
                    .setDescription('El usuario al que deseas desvivir')
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('hug')
                .setDescription('🤗 : Envía un abrazo a otro usuario.')
                .addUserOption(option =>
                    option.setName('usuario')
                    .setDescription('El usuario al que deseas abrazar')
                    .setRequired(true))),

    async executeSlash(interaction) {
        const subcommand = interaction.options.getSubcommand();
        const user = interaction.options.getUser('usuario');
        const randomGif = gifs[subcommand][Math.floor(Math.random() * gifs[subcommand].length)];
        const randomColor = getRandomColor();

        if (user && user.id === interaction.user.id) {
            return interaction.reply('¡No puedes hacerlo contigo mismo!');
        }

        if (user && user.id === interaction.client.user.id) {
            return interaction.reply('¡Lo siento, no puedes hacer eso conmigo!');
        }

        const embed = new EmbedBuilder()
            .setColor(randomColor)
            .setTitle(`¡${subcommand.charAt(0).toUpperCase() + subcommand.slice(1)}!`)
            .setDescription(
                user
                    ? `${interaction.user} ha realizado **${subcommand}** a ${user}!`
                    : `${interaction.user} está **${subcommand}**!`
            )
            .setImage(randomGif)
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};
