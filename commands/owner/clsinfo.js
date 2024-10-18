require('dotenv').config();
const { EmbedBuilder } = require('discord.js');

module.exports = {
  name: 'clsinfo',
  description: 'Muestra información del bot.',
  aliases: ['clsinfo'],
  async executePrefix(client, message, args) {
    const dev = process.env.OWNER; // Obtén la ID del owner desde el archivo .env

    // Verifica si el usuario es el owner
    if (message.author.id !== dev) {
      return message.channel.send('Solo el owner del bot puede usar este comando.');
    }

    const botOwner = client.users.cache.get(dev);
    const serverCount = client.guilds.cache.size;
    const userCount = client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0); // Suma el número de usuarios en todos los servidores
    const shardCount = client.shard ? client.shard.count : '1'; // Asegúrate de que tu bot esté configurado para shards si usas esto

    // Obtén las IDs de los servidores
    const serverIds = client.guilds.cache.map(guild => `${guild.name} (ID: ${guild.id})`).join('\n');

    const embed = new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle('Información del Bot')
      .setDescription('Detalles sobre en cuántos servidores está y más.')
      .addFields(
        { name: 'Owner del Bot', value: `${botOwner.tag} (${botOwner.id})` },
        { name: 'Número de servidores', value: `${serverCount}` },
        { name: 'Número de usuarios', value: `${userCount}` },
        { name: 'Número de shards', value: `${shardCount}` },
        { name: 'Servidores', value: `${serverIds}` }
      )
      .setFooter({ text: `Solicitado por ${message.author.tag}` })
      .setTimestamp();

    await message.channel.send({ embeds: [embed] });
  },
};
