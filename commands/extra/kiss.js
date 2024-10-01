const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kiss')
        .setDescription('Envía un beso a otro usuario con un GIF aleatorio.')
        .addUserOption(option => 
            option.setName('usuario')
            .setDescription('El usuario al que deseas besar')
            .setRequired(true)),
    async executeSlash(interaction) {
        // Lista de enlaces de GIFs de besos (puedes agregar más enlaces)
        const gifs = [
            'https://media.giphy.com/media/G3va31oEEnIkM/giphy.gif',
            'https://media.giphy.com/media/FqBTvSNjNzeZG/giphy.gif',
            'https://media.giphy.com/media/11k3oaUjSlFR4I/giphy.gif',
            'https://i.gifer.com/YQzo.gif',
            'https://i.pinimg.com/originals/0b/39/ba/0b39ba7b0affa79d3d6eddbe5bea684a.gif',
            'https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExMHVwN2s5dWk4bGhjaGVmNmszbGQwZ2ZvZzh5cndlZHNoMm5keGQwcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/zkppEMFvRX5FC/giphy.webp',
            'https://d31xsmoz1lk3y3.cloudfront.net/games/imgur/eisk88U.gif',
            'https://i.pinimg.com/originals/13/06/73/1306732d3351afe642c9a7f6d46f548e.gif',
            'https://64.media.tumblr.com/ea7842aad07c00b098397bf4d00723c6/tumblr_n570yg0ZIv1rikkvpo1_500.gif',
            // Agrega más enlaces de GIFs aquí
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

        // Obtener el usuario seleccionado en el slash command
        const user = interaction.options.getUser('usuario');

        // Verificar si el usuario mencionado es el mismo que envió el mensaje o el bot
        if (user.id === interaction.user.id) {
            return interaction.reply('<a:lexqul:1289409296408383604> : ¡No puedes besarte a ti mismo!, sería raro 😨');
        }
        if (user.id === interaction.client.user.id) {
            return interaction.reply('<a:lexqul:1289409296408383604> : ¡Lo siento, pero no eres mi tipo! <:bow:1287542831920971826>');
        }

        // Crear embed para el beso
        const besoEmbed = new EmbedBuilder()
            .setColor(0xFF69B4)
            .setTitle('¡Beso!')
            .setDescription(`<a:heartarrow_white1:1287542081732218900> ${interaction.user} le ha dado un beso a ${user}! <a:8048minecraftheartrainbow:1287542054804656238>`)
            .setImage(randomGif)
            .setTimestamp();

        interaction.reply({ embeds: [besoEmbed] });
    },
};
