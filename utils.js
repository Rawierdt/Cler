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
  console.log(`Ejecutando checkBirthdays : ${client}`);
  if (!client) throw new Error('Client no fue proporcionado.');
  if (!client.guilds || !client.guilds.cache || !client.guilds.cache.size) {
    console.error('Cliente no disponible o guilds indefinido.');
    return;
  }

  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  for (const guild of client.guilds.cache.values()) {
    try {
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
        `SELECT user_id, day, month FROM birthdays 
         WHERE guild_id = $1 AND day = $2 AND month = $3 AND announced = FALSE`,
        [guild.id, currentDay, currentMonth]
      );

      for (const { user_id } of birthdaysToday) {
        let displayName;
        if (/^\d+$/.test(user_id)) {
          // Usuario con ID, generar tag
          const user = await client.users.fetch(user_id);
          displayName = user ? user.tag : `ID: ${user_id}`;
        } else {
          // Usuario con nombre
          displayName = user_id;
        }

        const birthdayImages = [
          'https://i.imgur.com/Yt85aeT.jpeg',
          'https://i.imgur.com/8RHYdWy.jpeg',
          'https://i.imgur.com/hH9WF21.jpeg',
          'https://i.imgur.com/8JL5KNk.jpeg',
          'https://i.imgur.com/JopAV22.jpeg',
          'https://i.imgur.com/kgMTUr1.jpeg',
          'https://i.imgur.com/zM3LyrF.jpeg',
          'https://i.imgur.com/pLnpzTB.jpeg',
          'https://i.imgur.com/NtTgGVJ.jpeg',
          'https://i.imgur.com/sYXibRj.jpeg'
        ];
        const randomImage = birthdayImages[Math.floor(Math.random() * birthdayImages.length)];
        const birthdayEmbed = new EmbedBuilder()
          .setTitle(`¡Hoy es el cumpleaños de **${displayName}**!`)
          .setDescription('<a:hb_animated:1287508461462229125> : Asegúrate de desearle un excelente día y darle un fuerte abrazo.')
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