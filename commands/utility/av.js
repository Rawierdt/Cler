const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'av',
  description: 'Muestra el avatar de un usuario.',
  aliases: ['av'],

  async executePrefix(client, message, args) {
    // Obtén el usuario mencionado o el autor del mensaje
    const user = message.mentions.users.first() || message.author;

    // Crea el embed con el avatar del usuario
    const avatarEmbed = new EmbedBuilder()
      .setColor(0x0099ff) // Azul
      .setTitle(`Avatar de ${user.username}`)
      .setImage(user.displayAvatarURL({ dynamic: true, size: 512 }))
      .setFooter({ text: `ID: ${user.id}` })
      .setTimestamp();

    // Envía el embed al canal
    await message.channel.send({ embeds: [avatarEmbed] });
  },
};
