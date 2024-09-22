const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Muestra la lista de comandos disponibles.'),
    
  name: 'help', // Nombre para comandos con prefijo
  description: 'Muestra la lista de comandos disponibles.',

  async executeSlash(interaction) {
    await this.sendHelpMessage(interaction.user);
    await interaction.reply({ content: '📩 He enviado la lista de comandos a tus mensajes privados.', ephemeral: true });
  },

  async executePrefix(client, message, args) {
    // Verificar que el autor del mensaje es válido y tiene el método send
    if (!message.author || typeof message.author.send !== 'function') {
        return;
    }

    // Enviar el mensaje de ayuda
    await this.sendHelpMessage(message.author);
    
    // Enviar una respuesta simple en el canal
    await message.channel.send('📩 He enviado la lista de comandos a tus mensajes privados.'); // Cambia aquí para no usar `message.reply`
},

  async sendHelpMessage(user) {
    // Crear un embed con la lista de comandos
    const helpEmbed = new EmbedBuilder()
      .setColor(0x9F12FF)
      .setTitle('Comandos disponibles | Cler')
      .setDescription('¡Holaa~! Estos son algunos de mis comandos, te invito a revisar la [Web para ver todos los disponibles](https://bit.ly/3Jze6DI):')
      .addFields(
        { name: '「:computer:」• Comandos de Administración', value: 'Funcionan con ´c!´ ó con Slash Commands ´/´\u200B', inline: false },
        { name: 'kick', value: 'Expulsa a un miembro del servidor.', inline: true },
        { name: 'ban', value: 'Banea a un miembro del servidor.', inline: true },
        { name: 'softban', value: 'Banea a un miembro por 7 días y borra sus mensajes.', inline: true },
        { name: 'warn', value: 'Advierte a un miembro.', inline: true },
        { name: 'mute', value: 'Silencia a un miembro.', inline: true },
        { name: 'clear', value: 'Elimina un número específico de mensajes.', inline: true },
        { name: '[Ver lista completa](https://bit.ly/3Jze6DI)', value: '\u200B', inline: false },
        { name: '「:cake:」• Comandos Menu Contextual', value: 'Funcionan dando clic derecho en Apps de un miembro\u200B', inline: false },
        { name: 'Ver Avatar', value: 'Muestra el avatar de un miembro.', inline: true },
        { name: '「:cake:」• Comandos Sociales', value: '\u200B', inline: false },
        { name: 'c!cry', value: 'GIF de llanto.', inline: true },
        { name: 'c!kiss {amigo}', value: 'GIF de besar.', inline: true },
        { name: '「:zany_face:」• Comandos Diversión', value: '\u200B', inline: false },
        { name: 'c!8ball {pregunta}', value: 'Te dirá una respuesta con vase a tu pregunta.', inline: true },
        { name: 'c!love {amigo}', value: 'Mide tu amor con algun miembro.', inline: true },
        { name: 'c!meme', value: 'Envía un meme aleatorio.', inline: true },
        { name: '[Ver lista completa](https://bit.ly/3Jze6DI)', value: '\u200B', inline: false },
        { name: '「:cherry_blossom:」• Comandos de Utileria', value: '\u200B', inline: false },
        { name: 'c!ascii {texto}', value: 'Genera un texto en formato ASCII.', inline: true },
        { name: 'c!info', value: 'Información y Uptime de mis sistemas.', inline: true },
        { name: 'c!lyrics {artista} {canción}', value: 'Envía la letra de tu canción favorita.', inline: true },
        { name: '[Ver lista completa](https://bit.ly/3Jze6DI)', value: '\u200B', inline: false },
        { name: '「:lock:」• Comandos Secretos', value: '\u200B', inline: false },
        { name: 'c!capybara', value: 'Hay muchos mas, buscalos...', inline: true },
      )
      .setFooter({ text: 'Utiliza los comandos con cuidado.' })
      .setImage("https://i.ibb.co/JkRvKm8/clerrainbow.gif")
      .setTimestamp();

    // Enviar el embed como mensaje directo al usuario
    await user.send({ embeds: [helpEmbed] }).catch(err => {
      console.error(`[ERROR] No se pudo enviar el mensaje de ayuda a ${user.tag}: ${err}`);
      message.reply('No he podido enviar el mensaje revisa la [Web](https://bit.ly/3Jze6DI).');
    });
  },
};
