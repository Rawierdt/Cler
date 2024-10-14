/**
* SPANISH
* Autor: Alejandro Aguilar (Rawier)
* Sitio Web: https://rawier.vercel.app
* Ultima Modificación: 13/10/2024 : 19:44 PM
* Descripción: Bot Multipropositos para Discord con funciones de moderación y utilidad, Desarrollado con
*              Node.js (Javascript) y PostgreSQL y MegaDB para las base de datos.
* Objetivo: Solucionar la problematica de administración de ususarios para más de 10,000 servidores.
**/

const { Client, GatewayIntentBits, Collection, ActivityType, Events, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const db = require('megadb');
const birthdaysDB = new db.crearDB('birthdays');
const configDB = new db.crearDB('config');
const cron = require('node-cron');
const config = require('./config.json');
const chalk = require('chalk');
const { query } = require('./db');
const fetch = require('node-fetch');
require('dotenv').config();


// Crear el cliente del bot
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.AutoModerationConfiguration,
    GatewayIntentBits.Guilds, 
  ],
});

// Cargar comandos en la colección
client.commands = new Collection();

// Función para cargar comandos
function loadCommands(directory) {
  const commandFiles = fs.readdirSync(directory).filter(file => file.endsWith('.js'));
  for (const file of commandFiles) {
    const command = require(`${directory}/${file}`);
    if (command.data) {
      client.commands.set(command.data.name, command);  // Para slash commands
    } else if (command.name) {
      client.commands.set(command.name, command);  // Para comandos con prefijo
    } else {
      console.warn(`[WARN] El comando en ${file} no tiene ni 'data' ni 'name'. Ignorado.`);
    }
  }
}

// Cargar comandos generales y de admin
loadCommands('./commands');
loadCommands('./commands/admin');
loadCommands('./commands/social');
loadCommands('./commands/contextMenu');
loadCommands('./commands/fun');
loadCommands('./commands/secrets');
loadCommands('./commands/utility');
loadCommands('./commands/extra');

// Función para enviar un evento (Endpoint) a Glitch
async function enviarEventoAGlitch(data) {
  try {
    const response = await fetch('https://endpoint-cler.glitch.me/endpoint-cler', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' },
    });
    const result = await response.text();
    console.log('Endpoint Response:', result);
  } catch (error) {
    console.error('Error al enviar evento a Glitch:', error);
  }
}

// Función para verificar y anunciar los cumpleaños
async function checkBirthdays() {
  const currentDate = new Date();
  const currentDay = currentDate.getDate();
  const currentMonth = currentDate.getMonth() + 1;

  client.guilds.cache.forEach(async (guild) => {
    try {
      const birthdayChannelId = await configDB.get(`birthdayChannel_${guild.id}`);
      if (!birthdayChannelId) return;

      const birthdayChannel = guild.channels.cache.get(birthdayChannelId);
      if (!birthdayChannel) return;

      const birthdays = await birthdaysDB.get(`${guild.id}`);
      if (!birthdays) return;

      const birthdaysToday = Object.entries(birthdays).filter(([id, data]) => {
        return (
          data.día === currentDay &&
          data.mes === currentMonth &&
          !data.anunciado
        );
      });

      for (const [id, data] of birthdaysToday) {
        let name;

        if (!isNaN(id)) {  // Si es un ID numérico
          const user = guild.members.cache.get(id);
          name = user ? `<@${id}>` : `ID: ${id}`; // Menciona al usuario o usa el ID si no está en cache
        } else {
          name = id; // Usa el nombre personalizado de la base de datos
        }

        const birthdayImages = [
          'https://24.media.tumblr.com/151da26b7f0587a6fb33fba2dcce9ab0/tumblr_mi9p8bMvHJ1s5r6jko1_500.gif',
          'https://www.cumpleanosimagenes.org/wp-content/uploads/2017/11/ara%C3%B1a2.jpg',
          'https://i.pinimg.com/originals/85/89/df/8589df5aab295605598d63396f0c9fed.gif',
          'https://i.gifer.com/QjsD.gif',
          'https://www.funimada.com/assets/images/cards/big/50th-birthday-31.gif',
          'https://i.pinimg.com/736x/6a/85/90/6a8590c7921af912960c9b22e9ebbc2c.jpg',
          'https://cdnb.artstation.com/p/assets/images/images/042/737/371/large/ckn-cuong-retouch2.jpg',
          'https://i.pinimg.com/originals/d8/67/8f/d8678febeb9b6b2d3b44d3756eb01837.jpg',
          'https://i.pinimg.com/originals/17/ef/3f/17ef3fbb030216e6f646a1b3be9139e0.jpg',
          'https://www.psicoactiva.com/wp-content/uploads/2013/12/frase-feliz-aniversario.jpg',
          'https://i.pinimg.com/474x/5c/49/5d/5c495d245df9e592d22de2076759358f.jpg',
          'https://i.pinimg.com/originals/fa/bb/c2/fabbc2667d756977aa8731a9acfea889.gif',
          'https://pm1.aminoapps.com/6953/4d02b4c424147b84c7a61f32ada3ba5331a86c40r1-960-960v2_uhq.jpg',
          'https://m.media-amazon.com/images/I/71KOGcUHLPL.jpg',
          'https://png.pngtree.com/background/20230611/original/pngtree-the-girl-in-anime-with-candles-on-her-hair-and-celebrating-picture-image_3170161.jpg',
          'https://ladiversiva.com/wp-content/uploads/2023/07/mcdonalds_happy_cumple_en_casa.jpg',
          'https://i.ytimg.com/vi/i-KCSp1ZD-Q/hq720.jpg',
          'https://i.ytimg.com/vi/v5mDnxORsXU/mqdefault.jpg',
          'https://i.pinimg.com/originals/75/5c/64/755c64611d7c623c9fb06259c5a32306.jpg',
          'https://i.pinimg.com/736x/0e/1c/dc/0e1cdcccfbc296bd15f7462912ee1dd8.jpg',
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
          data.anunciado = true;
        } catch (sendError) {
          console.error(`Error al enviar el mensaje de cumpleaños en el servidor ${guild.id}:`, sendError);
        }
      }

      await birthdaysDB.set(`${guild.id}`, birthdays);
    } catch (error) {
      console.error(`Error al verificar cumpleaños en el servidor ${guild.id}:`, error);
    }
  });
}

// Función para resetear los cumpleaños anunciados
async function resetAnnouncedBirthdays() {
  client.guilds.cache.forEach(async (guild) => {
    const birthdays = await birthdaysDB.get(`${guild.id}`);
    if (!birthdays) return;

    // Resetear el campo "anunciado" a false para cada cumpleaños
    Object.values(birthdays).forEach((data) => {
      data.anunciado = false; // Resetea el estado de "anunciado"
    });

    await birthdaysDB.set(`${guild.id}`, birthdays); // Actualiza la base de datos
  });
}

// Logs de actividad del bot
client.once('ready', async () => {
  try {
    console.log(`${chalk.green.bgBlack.bold('En línea como')} ${client.user.tag}`);
    console.log(`[LOG] Bot atendiendo en ${client.guilds.cache.size} servidores`);
    console.log(`[LOG] Hora actual: ${new Date().toLocaleTimeString()}`);

  // Prueba de conexión a PostgreSQL
  try {
    const res = await query('SELECT NOW()');
    console.log(chalk.white.bgBlue.bold('Conexión a DB exitosa:'), res.rows[0]);
    console.log('--------------------------');
  } catch (err) {
    console.error('Error conectando a PostgreSQL:', err);
  }

    // client.user.setStatus('online');
    // client.user.setActivity(`c!help | /help`, { type: ActivityType.Listening });

    // Precencia del bot (Status)
    await client.user.setPresence({
      status: 'online',
      activities: [{ 
        type: ActivityType.Custom,
        name: 'customname',
        state: '💜 c!help · /help'
      }],
    });

    // Enviar evento a Glitch al iniciar
    await enviarEventoAGlitch({ event: 'Bot en línea', guilds: client.guilds.cache.size });

    // Comprobación de cumpleaños al iniciar
    try {
      await checkBirthdays();
      console.log(`${chalk.white.bgGreen.bold('[LOG] Comprobación inicial de cumpleaños completada.')}`);
    } catch (error) {
      console.error('[ERROR] Error al comprobar los cumpleaños al iniciar:', error);
    }

    // Cron job que se ejecuta todos los días a las 00:00
    cron.schedule('0 0 * * *', async () => {
      try {
        await checkBirthdays();
        console.log(`${chalk.white.bgRed.bold('[LOG] Comprobación diaria de cumpleaños completada.')}`);
      } catch (error) {
        console.error('[ERROR] Error en el cron job diario de cumpleaños:', error);
      }
    });

    // Cron job que se ejecuta cada 8 horas (00:00, 08:00, 16:00)
    cron.schedule('0 */8 * * *', async () => {
      console.log(`[LOG] Hora actual: ${new Date().toLocaleTimeString()}`);
      try {
        await checkBirthdays();
        console.log(`${chalk.white.bgMagenta.bold('[LOG] Comprobación de cumpleaños cada 8 horas completada.')}`);
      } catch (error) {
        console.error('[ERROR] Error en el cron job de 8 horas para cumpleaños:', error);
      }
    });

    // Cron job que se ejecuta el 1 de enero a las 00:00 para reiniciar cumpleaños anunciados
    cron.schedule('0 0 1 1 *', async () => {
      console.log(`[LOG] Reiniciando los cumpleaños anunciados...`);
      try {
        await resetAnnouncedBirthdays();
        console.log('[LOG] Cumpleaños anunciados reiniciados.');
      } catch (error) {
        console.error('[ERROR] Error al reiniciar cumpleaños anunciados:', error);
      }
    });

  } catch (globalError) {
    console.error('[ERROR] Error global en el cliente al iniciar:', globalError);
  }
});

// Manejando eventos de interacción (slash commands)
client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.executeSlash) {
        await command.executeSlash(interaction);  // Ejecuta el método para slash commands
      }

      // Enviar evento a Glitch al ejecutar un comando
      await enviarEventoAGlitch({
        event: 'Comando ejecutado',
        user: interaction.user.tag,
        command: interaction.commandName,
        guild: interaction.guild.name
      });

      console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.rgb(121, 13, 236).bold('[LOG]')} ${chalk.yellow(interaction.user.tag)} ha ejecutado ${chalk.white.bgGreen.bold(interaction.commandName)} en ${chalk.cyan(interaction.guild.name)}`);
      //console.log(`[${new Date().toLocaleTimeString()}] [LOG S] ${interaction.user.tag} ha ejecutado ${interaction.commandName} en ${interaction.guild.name}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      }
    }
  } else if (interaction.isContextMenuCommand()) { // Verifica que es un menú contextual
    const command = client.commands.get(interaction.commandName);
    if (!command) return;

    try {
      if (command.executeContextMenu) {
        await command.executeContextMenu(interaction);  // Ejecuta el método para context menu commands
      }

      await enviarEventoAGlitch({
        event: 'Comando ejecutado',
        user: interaction.user.tag,
        command: interaction.commandName,
        guild: interaction.guild.name
      });

      console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.rgb(13, 236, 229).bold('[LOG]')} ${chalk.yellow(interaction.user.tag)} ha ejecutado ${chalk.white.bgGreen.bold(interaction.commandName)} en ${chalk.cyan(interaction.guild.name)}`);
    } catch (error) {
      console.error(error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Hubo un error al ejecutar este comando.', ephemeral: true });
      }
    }
  }
});

// Manejo de mensajes (comandos con prefijo y DMs)
client.on('messageCreate', message => {
  // Ignorar mensajes del propio bot
  if (message.author.bot) return;

  // Manejo de mensajes en DMs
  if (message.channel.type === 'DM') {
    console.log(`[DM] ${message.author.tag} envió un mensaje: ${message.content}`);
    return; // Salimos aquí para no seguir procesando como un comando
  }

  // Comandos con prefijo
  if (!message.content.startsWith(config.prefix)) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    if (command.executePrefix) {
      command.executePrefix(client, message, args);  // Ejecuta el método para comandos con prefijo
    }
    console.log(`${chalk.blue(`[${new Date().toLocaleTimeString()}]`)} ${chalk.rgb(11, 227, 116).bold('[LOG]')} ${chalk.yellow(message.author.tag)} ha ejecutado ${chalk.white.bgGreen.bold(commandName)} en ${chalk.cyan(message.guild.name)}`);
  } catch (error) {
    console.error(error);
    message.reply('Hubo un error al ejecutar ese comando.');
  }
});


// Iniciar el bot
client.login(process.env.BOT_TOKEN);
