const { EmbedBuilder } = require('discord.js');
const fetch = require('node-fetch');

module.exports = {
  name: 'lyrics',
  description: 'Muestra las letras de una canción.',
  aliases: ['letra'],

  async executePrefix(client, message, args) {
    if (args.length < 2) {
      return message.channel.send('Por favor, proporciona el nombre del artista y la canción.');
    }

    const artist = args[0];
    const title = args.slice(1).join(' ');

    try {
      const response = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
      const data = await response.json();

      if (data.error) {
        return message.channel.send('No se encontraron letras para esa canción.');
      }

      const lyricsEmbed = new EmbedBuilder()
        .setColor(0x0099ff) // Azul
        .setTitle(`Letras de ${title} por ${artist}`)
        .setDescription(data.lyrics)
        .setFooter({ text: `Solicitado por ${message.author.username}` })
        .setTimestamp();

      await message.channel.send({ embeds: [lyricsEmbed] });
    } catch (error) {
      console.error(error);
      message.channel.send('Hubo un error al intentar obtener las letras.');
    }
  },
};
