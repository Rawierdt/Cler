require('dotenv').config();
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { query } = require('./db');

// Función para resetear cumpleaños anunciados
async function resetAnnouncedBirthdays(client) {
  try {
    for (const guild of client.guilds.cache.values()) {
      await query('UPDATE birthdays SET announced = FALSE WHERE guild_id = $1', [guild.id]);
      console.log(`Cumpleaños reseteados en el servidor ${guild.id}`);
    }
  } catch (error) {
    console.error('Error al resetear cumpleaños:', error);
  }
}

// Función para verificar cumpleaños
async function checkBirthdays(client) {
  // Depuración: muestra el estado del cliente
  console.log(`Ejecutando checkBirthdays con el cliente: ${client}`);
  console.log('Guilds disponibles:', client.guilds.cache.map(guild => guild.name));
  if (!client) throw new Error('Client no fue proporcionado.');

  // Verificación del cliente y sus guilds
  if (!client || !client.guilds || !client.guilds.cache || !client.guilds.cache.size) {
    console.error('Cliente no disponible o guilds indefinido.');
    return; // Salir si no hay guilds disponibles
  }

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  // Recorrer cada guild disponible
  for (const guild of client.guilds.cache.values()) {
    try {
      // Consulta para obtener el canal de cumpleaños
      const { rows: configRows } = await query(
        'SELECT birthday_channel_id FROM config WHERE guild_id = $1',
        [guild.id]
      );
      if (configRows.length === 0) continue;

      const birthdayChannelId = configRows[0].birthday_channel_id;
      const birthdayChannel = guild.channels.cache.get(birthdayChannelId);
      if (!birthdayChannel) {
        console.warn(`Canal de cumpleaños no encontrado para el guild: ${guild.name}`);
        continue;
      }

      // Consulta para obtener los cumpleaños de hoy
      const { rows: birthdaysToday } = await query(
        'SELECT user_id FROM birthdays WHERE guild_id = $1 AND day = $2 AND month = $3 AND announced = FALSE',
        [guild.id, currentDay, currentMonth]
      );

      // Enviar mensaje para cada cumpleaños encontrado
      for (const { user_id } of birthdaysToday) {
        const user = guild.members.cache.get(user_id);
        const name = user ? `<@${user_id}>` : `ID: ${user_id}`;

        const birthdayImages = [
          // ... imágenes
        ];
        const randomImage = birthdayImages[Math.floor(Math.random() * birthdayImages.length)];

        const birthdayEmbed = new EmbedBuilder()
          .setTitle(`¡Hoy es el cumpleaños de **${name}**!`)
          .setDescription('🎁 Asegúrate de desearle un excelente día y darle un fuerte abrazo.')
          .setColor(0x00FF00)
          .setThumbnail('https://i.ibb.co/XDF8Tqc/cake.gif')
          .setImage(randomImage)
          .setFooter({ text: '¡Felicidades!, Te quiere Cler!' })
          .setTimestamp();

        try {
          await birthdayChannel.send({ embeds: [birthdayEmbed] });
          await query(
            'UPDATE birthdays SET announced = TRUE WHERE guild_id = $1 AND user_id = $2',
            [guild.id, user_id]
          );
        } catch (sendError) {
          console.error(`Error al enviar mensaje en ${guild.id}:`, sendError);
        }
      }
    } catch (error) {
      console.error(`Error al verificar cumpleaños en ${guild.id}:`, error);
    }
  }
}


// Exportar todas las funciones
module.exports = {
  resetAnnouncedBirthdays,
  checkBirthdays,
};