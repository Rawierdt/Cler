const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hug')
        .setDescription('Envía un abrazo a otro usuario.')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario al que deseas abrazar')
            .setRequired(true)),
            async executeSlash(interaction) {
        const gifs = [
            'https://media.giphy.com/media/l2QDM9Jnim1YVILXa/giphy.gif',
            'https://media.giphy.com/media/od5H3PmEG5EVq/giphy.gif',
            'https://64.media.tumblr.com/2be3818398fa62f2aff108e8f73618bb/tumblr_nvrggbVi5I1rw7ngmo1_500.gif',
            'https://i.gifer.com/Txh9.gif',
            'https://64.media.tumblr.com/f2a878657add13aa09a5e089378ec43d/tumblr_n5uovjOi931tp7433o1_500.gif',
            'https://i0.wp.com/drunkenanimeblog.com/wp-content/uploads/2018/03/tenor.gif',
            'https://i.pinimg.com/originals/23/4d/47/234d471b1068bc25d435c607224454c9.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Obtener el usuario seleccionado en el slash command
        const user = interaction.options.getUser('usuario');

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === interaction.user.id) {
            return interaction.reply('<a:lexqul:1289409296408383604> : ¡No puedes hacer eso a ti mismo!, sería raro 😨');
        }
        if (user.id === interaction.client.user.id) {
            return interaction.reply('<a:lexqul:1289409296408383604> : ¡Lo siento, pero no me negaré esta vez! <:bow:1287542831920971826>');
        }

        const hugEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('<a:61623heartbeat:1287542624588267642> ¡Abrazo! <a:61623heartbeat:1287542624588267642>')
            .setDescription(`<a:heartarrow_purple:1287542898266607669> ${interaction.user} le ha dado un abrazo a ${user}! <a:doodleheart:1287542612898611301>`)
            .setImage(randomGif)
            .setTimestamp();

        interaction.reply({ embeds: [hugEmbed] });
    },
};
