/**
* SPANISH
* Autor: Alejandro Aguilar (Rawier)
* Sitio Web: https://rawier.vercel.app
* Ultima Modificación: 13/10/2024 : 19:44 PM
* Descripción: Bot Multipropositos para Discord con funciones de moderación y utilidad, Desarrollado con
*              Node.js (Javascript) y PostgreSQL y MegaDB para las base de datos.
* Objetivo: Solucionar la problematica de administración de ususarios para más de 10,000 servidores.
**/

const { Client, GatewayIntentBits, Collection, ActivityType, Events, EmbedBuilder, ButtonComponent} = require('discord.js');
const { checkBirthdays, resetAnnouncedBirthdays } = require('./utils.js');
const path = require('path');
const fs = require('fs');
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
    GatewayIntentBits.AutoModerationExecution
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
loadCommands('./commands/owner');

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

// Logs de actividad del bot
client.once(Events.ClientReady, async () => {
  try {
    const shardId = client.shard?.ids?.[0] ?? 0; // Usa nullish para prevenir fallos

    console.log(`${chalk.green.bgBlack.bold(`Shard ${shardId} en línea como`)} ${client.user.tag}`);
    console.log(`[LOG] Shard ${shardId} atendiendo en ${client.guilds.cache.size} servidores`);
    console.log(`[LOG] Hora actual: ${new Date().toLocaleTimeString()}`);
    // console.log('Cliente:', client);
    console.log('Guilds:', client.guilds?.cache?.size);
    console.log(`Bot listo. Ejecutando comprobación inicial de cumpleaños.`);
    await ejecutarCheckCumpleaños('Comprobación inicial de cumpleaños completada.', client);


    try {
      const res = await query('SELECT NOW()');
      console.log(chalk.white.bgBlue.bold('Conexión a DB exitosa:'), res.rows[0]);
      console.log('--------------------------');
    } catch (err) {
      console.error('[ERROR] Error conectando a PostgreSQL:', err);
    }

    await establecerPresencia(shardId);

    // Enviar evento a Glitch
    await enviarEventoAGlitch({ event: `Shard ${shardId} en línea`, guilds: client.guilds.cache.size });

    // // Comprobación inicial de cumpleaños
    // await ejecutarCheckCumpleaños('Comprobación inicial de cumpleaños completada.');

  // Cron job diario (00:00)
  cron.schedule('0 0 * * *', async () => {
    console.log(`[LOG] Ejecutando comprobación diaria de cumpleaños.`);

    await client.shard.broadcastEval(async (c) => {
        if (!c || !c.guilds) {
            console.error('Cliente no disponible durante la evaluación.');
            return;
        }

        const { checkBirthdays } = require('./utils');
        await checkBirthdays(c); // Usar `c` para la comprobación
    }).catch(console.error);

    console.log('[LOG] Comprobación diaria de cumpleaños completada.');
});

  // Cron job cada hora
  cron.schedule('0 * * * *', async () => {
    console.log(`[LOG] Comprobación de cumpleaños cada hora.`);

    try {
      await client.shard.broadcastEval(async (c) => {
        if (!c) {
          console.error('Cliente no disponible durante la evaluación.');
          return;
        }
        // const { checkBirthdays } = require('./utils.js');
        await checkBirthdays(c);
      });
      console.log('[LOG] Comprobación cada hora completada.');
    } catch (error) {
      console.error('[ERROR] Ocurrió un error durante la comprobación:', error);
    }
  });

  // Cron job cada 8 horas
  cron.schedule('0 */8 * * *', async () => {
    console.log(`[LOG] Comprobación de cumpleaños cada 8 horas.`);
  
    await client.shard.broadcastEval(async (c) => {
      if (!c) {
        console.error('Cliente no disponible durante la evaluación.');
        return;
      }
      const { checkBirthdays } = require('./utils.js');  // Importar aquí dentro
      await checkBirthdays(c);
    }).catch(console.error);
  
    console.log('[LOG] Comprobación cada 8 horas completada.');
  });

  // Cron job anual (1 de enero a las 00:00)
  cron.schedule('0 0 1 1 *', async () => {
    console.log('[LOG] Reiniciando cumpleaños anunciados.');

    await client.shard.broadcastEval(async (c) => {
      console.log('Evaluando cliente en shard:', c.shard.id); // Log para verificar el shard
      if (!c || !c.guilds) {
        console.error('Cliente no disponible durante la evaluación.');
        return;
      }

      const { resetAnnouncedBirthdays } = require('./utils');
      await resetAnnouncedBirthdays(c); // Usar la función correcta
    }).catch(console.error);

    console.log('[LOG] Cumpleaños anunciados reiniciados.');
  });


    // Obtener total de servidores en todos los shards
    const totalGuilds = await obtenerTotalServidores();
    console.log(`[LOG] El bot está atendiendo un total de ${totalGuilds} servidores en todos los shards.`);

  } catch (globalError) {
    console.error('[ERROR] Error global en el cliente al iniciar:', globalError);
  }
});

// Función para establecer la presencia del bot
async function establecerPresencia(shardId) {
  await client.user.setPresence({
    status: 'online',
    activities: [{
      type: ActivityType.Custom,
      name: 'customname',
      state: '💜 c!help · /help',
    }],
  });
}

// Función para ejecutar la comprobación de cumpleaños y manejar errores
async function ejecutarCheckCumpleaños(logMessage, client) {
  try {
    await checkBirthdays(client);  // Se pasa el cliente como argumento
    console.log(`${chalk.white.bgGreen.bold(`[LOG] ${logMessage}`)}`);
  } catch (error) {
    console.error('[ERROR] Error en la comprobación de cumpleaños:', error);
  }
}

// Función para obtener el total de servidores en todos los shards
async function obtenerTotalServidores() {
  return client.shard.broadcastEval((c) => c.guilds.cache.size)
    .then(results => results.reduce((acc, count) => acc + count, 0));
}

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
