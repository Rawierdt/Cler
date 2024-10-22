const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const commands = require('./commands.json'); // Importamos el JSON con los comandos

module.exports = {
  data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('❓ : Muestra la lista de comandos disponibles.')
    .addStringOption((option) =>
      option
        .setName('comando')
        .setDescription('Nombre del comando para obtener más detalles')
        .setRequired(false)),

  name: 'help',  // Para el comando con prefijo (ejemplo: c!help)
  description: 'Muestra la lista de comandos disponibles.',

  async executeSlash(interaction) {
    const commandName = interaction.options.getString('comando');
    await this.handleHelpRequest(commandName, interaction);
  },

  async executePrefix(client, message, args) {
    const commandName = args[0]; // Primer argumento es el nombre del comando (ejemplo: c!help kick)
    await this.handleHelpRequest(commandName, message);
  },

  async handleHelpRequest(commandName, interactionOrMessage) {
    if (commandName) {
      const embed = getCommandDetailsEmbed(commandName);
      if (embed) {
        await reply(interactionOrMessage, { embeds: [embed], ephemeral: true });
      } else {
        await reply(interactionOrMessage, { content: `El comando **${commandName}** no existe.`, ephemeral: true });
      }
      return;
    }

    // Crear menú de categorías hasta 25f
    const categories = [
      { label: '⚙️ : Administración', value: 'admin' },
      { label: '🛡️ : Moderación', value: 'moderation' },
      { label: '😄 : Social', value: 'social' },
      { label: '🏎️ : Diversión', value: 'fun' },
      { label: '🖊️ : Utilidades', value: 'utilities' },
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-category')
      .setPlaceholder('Selecciona una categoría')
      .addOptions(categories);

    const row = new ActionRowBuilder().addComponents(selectMenu);

    // Botón para ver todos los comandos
    const button = new ButtonBuilder()
      .setLabel('Ver todos los comandos')
      .setStyle(ButtonStyle.Link)
      .setURL('https://rawier.gitbook.io/cler');

    const buttonRow = new ActionRowBuilder().addComponents(button);

    const embed = new EmbedBuilder()
      .setColor(0x9F12FF)
      .setTitle('Comandos disponibles | Cler')
      .setDescription('Selecciona una categoría para ver los comandos disponibles.');

    await reply(interactionOrMessage, {
      embeds: [embed],
      components: [row, buttonRow], // Añadir fila del menú y del botón
      ephemeral: true,
    });

    const filter = (i) =>
      i.customId === 'help-category' &&
      (i.user.id === interactionOrMessage.user?.id || interactionOrMessage.author?.id);

    const collector = interactionOrMessage.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
      time: 60000,
    });

    collector.on('collect', async (i) => {
      const selectedCategory = i.values[0];
      const updatedEmbed = getHelpEmbedForCategory(selectedCategory);
      await i.update({ embeds: [updatedEmbed], components: [row, buttonRow] });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        reply(interactionOrMessage, {
          content: 'El tiempo ha expirado. Vuelve a usar el comando.',
          components: [],
        });
      }
    });
  },
};

// Función para obtener los detalles de un comando específico desde el JSON
function getCommandDetailsEmbed(commandName) {
  const command = commands[commandName.toLowerCase()];
  if (!command) return null;

  return new EmbedBuilder()
    .setTitle(command.title)
    .setDescription(command.description)
    .addFields({ name: 'Uso', value: command.usage })
    .setColor(0x7289DA);
}

// Función para obtener el embed de una categoría seleccionada
function getHelpEmbedForCategory(category) {
  const embeds = {
    admin: new EmbedBuilder()
      .setTitle('⚙️ : Comandos de Administración / ó c!')
      .addFields(
        { name: 'set-mute', value: 'Configura el rol de mute para el servidor.', inline: true },
        { name: 'set-fc-channel', value: 'Define el canal donde se anunciarán los cumpleaños.', inline: true },
        { name: 'add-fc', value: 'Agrega una fecha de cumpleaños.', inline: true },
        { name: 'remove-fc', value: 'Elimina un cumpleaños registrado.', inline: true },
        { name: 'deletenote', value: 'Elimina una nota de un usuario.', inline: true }
      )
      .setColor(0x9F12FF),

    moderation: new EmbedBuilder()
      .setTitle('🛡️ : Comandos de Moderación / ó c!')
      .addFields(
        { name: 'kick', value: 'Expulsa a un miembro.', inline: true },
        { name: 'ban', value: 'Banea a un miembro.', inline: true },
        { name: 'softban', value: 'Banea a un miembro por 7 días.', inline: true },
        { name: 'mute', value: 'Silencia a un miembro.', inline: true },
        { name: 'warn', value: 'Advierte a un miembro.', inline: true },
        { name: 'note', value: 'Añade o actualiza una nota a un usuario.', inline: true },
        { name: 'unban', value: 'Desbanea a un miembros.', inline: true },
        { name: 'clear', value: 'Elimina una cantidad de mensajes.', inline: true },
        { name: 'modlogs', value: 'Muestra el historial de un usuario.', inline: true }
      )
      .setColor(0x9614f3),

    social: new EmbedBuilder()
      .setTitle('😄 : Comandos Sociales / ó c!')
      .addFields(
        { name: 'angry', value: 'Expresa que estás enojado.', inline: true },
        { name: 'bored', value: 'Expresa que estás aburridx.', inline: true },
        { name: 'cry', value: 'Expresa que estás llorando.', inline: true },
        { name: 'hug', value: 'Envía un abrazo a otro usuario.', inline: true },
        { name: 'kiss', value: 'Envía un beso a otro usuario.', inline: true },
        { name: 'kill', value: 'Envía un desvivir a otro usuario.', inline: true },
        { name: 'sleep', value: 'Expresa que estás dumiendo.', inline: true },
      )
      .setColor(0x28A745),

      fun: new EmbedBuilder()
      .setTitle('🏎️ : Comandos de Diversión y Extras c!')
      .addFields(
        { name: '8ball', value: 'Responde a una pregunta con 8ball.', inline: true },
        { name: 'about', value: 'Envia la información acerca de Cler.', inline: true },
        { name: 'chiste', value: 'Envia un chiste aleatorio, ¡alerta de cringe!.', inline: true },
        { name: 'info', value: 'Envia la información actual de los sistemas.', inline: true },
        { name: 'jumbo', value: 'Envia un emoji del server pero en grande.', inline: true },
        { name: 'lyrics', value: 'Envia la letra de una canción.', inline: true },
        { name: 'ping', value: 'Muestra la latencia.', inline: true },
        { name: 'meme', value: 'Envia un meme aleatorio.', inline: true },
        { name: 'say', value: 'Repite un mensaje a un canal.', inline: true },
        
      )
      .setColor(0x11da50),

      utilities: new EmbedBuilder()
      .setTitle('🖊️ : Comandos de Utilidad /')
      .addFields(
        { name: 'avatar', value: 'Responde con el avatar de un usuario.', inline: true },
        { name: 'ask', value: 'Preguntale algo a Cler.', inline: true },
        { name: 'act', value: 'Envia la actividad relacionada.', inline: true },
        { name: 'help', value: 'Envia este mensaje o el de ayuda de un comando.', inline: true },
        { name: 'love', value: 'Calcula la afinidad entre dos usuarios.', inline: true },
        { name: 'user', value: 'Envia la información de un usuario.', inline: true },
      )
      .setColor(0x9614f3),
  };

  return embeds[category] || new EmbedBuilder().setTitle('Categoría no encontrada').setColor(0xFF0000);
}

// Función para manejar la respuesta, ya sea a través de interacción o mensaje
async function reply(interactionOrMessage, response) {
  if (interactionOrMessage.reply) {
    await interactionOrMessage.reply(response); // Mensaje
  } else {
    await interactionOrMessage.editReply(response); // Interacción
  }
}
